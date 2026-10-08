const contentElement = document.getElementById('course-content');
const navElement = document.getElementById('course-nav');
const pageLayout = document.querySelector('.page-layout');
const sidebarToggle = document.getElementById('sidebar-toggle');

const savedEditorValues = new Map();
const hiddenRunnableCode = new Map();
const savedProjectFiles = new Map();
const projectStates = new WeakMap();
let courseToc = [];
let lessons = [];
let editors = [];
let editorResizeObserver;
let turtleAnimationQueue = Promise.resolve();
let pyodide;
let runtimePromise;
let activeExample;
let pendingInput;
let isRunning = false;
let canvasStates = new WeakMap();
let pythonOutputDecoder;
let pythonOutputBuffer = '';

document.addEventListener('DOMContentLoaded', loadCourse);
window.addEventListener('hashchange', showCurrentPage);

sidebarToggle.addEventListener('click', () => {
    const collapsed = pageLayout.classList.toggle('sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.textContent = collapsed ? 'Show contents' : 'Hide contents';
});

async function loadCourse() {
    try {
        const [courseResponse, tocResponse] = await Promise.all([
            fetch('course.md'),
            fetch('course-toc.json')
        ]);
        if (!courseResponse.ok) throw new Error(`Course file returned ${courseResponse.status}`);
        if (!tocResponse.ok) throw new Error(`Course contents returned ${tocResponse.status}`);

        const [markdown, toc] = await Promise.all([courseResponse.text(), tocResponse.json()]);
        courseToc = validateTableOfContents(toc);
        lessons = splitCourseIntoLessons(renderMarkdown(markdown), courseToc);
        if (lessons.length !== courseToc.length) {
            throw new Error(`Found ${lessons.length} lesson headings for ${courseToc.length} table-of-contents entries.`);
        }

        buildCourseNavigation();
        showCurrentPage();
    } catch (error) {
        contentElement.innerHTML =
            '<p class="load-error">The course could not be loaded. Serve this folder over HTTP and check that course.md and course-toc.json are available.</p>';
        console.error('Unable to load the Python course:', error);
    }
}

function validateTableOfContents(toc) {
    if (!Array.isArray(toc) || toc.length === 0) {
        throw new Error('The table of contents must be a non-empty list.');
    }
    return toc.map((entry, index) => {
        if (typeof entry.title !== 'string' || !entry.title.trim()) {
            throw new Error(`Invalid title in table-of-contents entry ${index + 1}.`);
        }
        if (!Number.isInteger(entry.level) || entry.level < 0) {
            throw new Error(`Invalid nesting level for "${entry.title}".`);
        }
        return {
            title: entry.title,
            level: entry.level,
            id: `${slugify(entry.title)}-${index}`
        };
    });
}

function renderMarkdown(markdown) {
    const blocks = [];
    const runnableBlocks = [];
    const quizBlocks = [];
    let pendingProjectFiles = [];
    let paragraph = [];
    let listType = null;
    let codeLines = [];
    let codeLanguage = '';
    let inFence = false;
    let nextEmbedLabel = null;

    const closeList = () => {
        if (listType) {
            blocks.push(`</${listType}>`);
            listType = null;
        }
    };
    const flushParagraph = () => {
        if (paragraph.length) {
            blocks.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
            paragraph = [];
        }
    };
    const flushTextBlocks = () => {
        flushParagraph();
        closeList();
    };

    for (const line of markdown.replace(/\r/g, '').split('\n')) {
        const trimmed = line.trim();

        if (inFence) {
            if (trimmed === '```') {
                blocks.push(renderCodeBlock(codeLines.join('\n'), codeLanguage, runnableBlocks, pendingProjectFiles, quizBlocks));
                codeLines = [];
                codeLanguage = '';
                inFence = false;
            } else {
                codeLines.push(line);
            }
            continue;
        }

        const embedLabel = trimmed.match(/^<!--\s*embed-label:\s*(.*?)\s*-->$/i);
        if (embedLabel) {
            flushTextBlocks();
            nextEmbedLabel = embedLabel[1].trim() || null;
            continue;
        }

        if (trimmed && !trimmed.startsWith('<iframe')) {
            nextEmbedLabel = null;
        }

        const fence = trimmed.match(/^```(?:\s*([\w.-]+(?::[\w.-]+)?)\s*)?$/);
        if (fence) {
            flushTextBlocks();
            inFence = true;
            codeLanguage = fence[1] || '';
            codeLines = [];
            continue;
        }

        if (trimmed.startsWith('<iframe')) {
            flushTextBlocks();
            const source = trimmed.match(/\bsrc=['"]([^'"]+)['"]/i)?.[1];
            if (source && isSafeUrl(source)) {
                const label = nextEmbedLabel || (source.includes('docs.google.com')
                    ? 'Open the help form in a new tab'
                    : 'Open the original interactive example');
                blocks.push(
                    `<p class="external-embed-link"><a href="${escapeAttribute(source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a></p>`
                );
            }
            nextEmbedLabel = null;
            continue;
        }

        if (!trimmed) {
            flushTextBlocks();
            continue;
        }

        const heading = trimmed.match(/^(#{1,6})\s*(.+)$/);
        if (heading) {
            flushTextBlocks();
            const level = heading[1].length;
            const title = heading[2].trim();
            blocks.push(`<h${level}>${renderInline(title)}</h${level}>`);
            continue;
        }

        if (/^\*{3,}$/.test(trimmed)) {
            flushTextBlocks();
            blocks.push('<hr>');
            continue;
        }

        const unordered = trimmed.match(/^\*\s+(.+)$/);
        const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
        if (unordered || ordered) {
            flushParagraph();
            const desiredType = unordered ? 'ul' : 'ol';
            if (listType !== desiredType) {
                closeList();
                listType = desiredType;
                blocks.push(`<${listType}>`);
            }
            blocks.push(`<li>${renderInline((unordered || ordered)[1])}</li>`);
            continue;
        }

        const htmlHeading = trimmed.match(/^<h([1-6])>(.*?)<\/h\1>$/i);
        if (htmlHeading) {
            flushTextBlocks();
            blocks.push(`<h${htmlHeading[1]}>${renderInline(htmlHeading[2])}</h${htmlHeading[1]}>`);
            continue;
        }

        if (/^<\/?(?:table|tbody|tr|td)\b/i.test(trimmed)) {
            const plainText = trimmed.replace(/<[^>]*>/g, '').trim();
            if (plainText) paragraph.push(plainText);
            continue;
        }

        paragraph.push(trimmed);
    }

    if (inFence) blocks.push(renderCodeBlock(codeLines.join('\n'), codeLanguage, runnableBlocks, pendingProjectFiles, quizBlocks));
    flushTextBlocks();
    return blocks.map((block) => {
        const runnable = block.match(/^<!--RUNNABLE:(\d+)-->$/);
        if (runnable) return createRunnableExample(runnableBlocks[Number(runnable[1])], Number(runnable[1]));
        const quiz = block.match(/^<!--QUIZ:(\d+)-->$/);
        return quiz ? createQuiz(quizBlocks[Number(quiz[1])], Number(quiz[1])) : block;
    }).join('\n');
}

function renderCodeBlock(code, language, runnableBlocks, pendingProjectFiles, quizBlocks) {
    const projectFile = language.match(/^file:([A-Za-z0-9][A-Za-z0-9._-]*\.(?:py|txt))$/i);
    if (projectFile) {
        pendingProjectFiles.push({ name: projectFile[1], content: code });
        return '';
    }
    if (language === 'python.run' || language === 'python.run.hidden') {
        const index = runnableBlocks.push({
            code,
            hidden: language === 'python.run.hidden',
            files: pendingProjectFiles.splice(0)
        }) - 1;
        return `<!--RUNNABLE:${index}-->`;
    }
    if (language === 'quiz.mc' || language === 'quiz.blank' || language === 'quiz.code') {
        const index = quizBlocks.push(parseQuiz(code, language.slice(5))) - 1;
        return `<!--QUIZ:${index}-->`;
    }
    if (language === 'quiz.multi') {
        const index = quizBlocks.push({ type: 'multi', questions: parseQuizSet(code) }) - 1;
        return `<!--QUIZ:${index}-->`;
    }
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
}

function parseQuiz(source, type) {
    if (type === 'code') return parseCodeQuiz(source);

    const question = [];
    const options = [];
    let answers = [];
    const answerGroups = [];
    let feedback = '';
    let section = 'question';

    for (const rawLine of source.split('\n')) {
        const line = rawLine.trim();
        if (!line) continue;
        const answer = line.match(/^Answer:\s*(.+)$/i);
        const feedbackLine = line.match(/^Feedback:\s*(.*)$/i);
        if (answer) {
            const parsedAnswers = answer[1].split('|').map((value) => value.trim()).filter(Boolean);
            if (type === 'blank') {
                answerGroups.push(parsedAnswers);
                answers.push(...parsedAnswers);
            } else {
                if (answers.length) throw new Error('A quiz block can only have one Answer line.');
                answers = parsedAnswers;
            }
            section = 'after-answer';
        } else if (feedbackLine) {
            feedback = feedbackLine[1];
            section = 'after-answer';
        } else if (type === 'mc' && line.startsWith('- ')) {
            options.push(line.slice(2).trim());
            section = 'options';
        } else if (section === 'question') {
            question.push(line);
        } else {
            throw new Error(`Unexpected line in ${type} quiz: "${line}".`);
        }
    }

    const questionText = question.join(' ');
    if (!questionText) throw new Error('Quiz blocks need a question before the Answer line.');
    if (answers.length === 0) throw new Error('Quiz blocks need an Answer line with at least one answer.');
    if (type === 'mc') {
        if (options.length < 2) throw new Error('Multiple-choice quizzes need at least two "- option" lines.');
        if (!answers.some((answer) => options.some((option) => normalizeQuizAnswer(option) === normalizeQuizAnswer(answer)))) {
            throw new Error('A multiple-choice quiz answer must match one of its options.');
        }
    } else {
        const blankCount = (questionText.match(/\{\{blank\}\}/g) || []).length;
        if (blankCount === 0) throw new Error('Fill-in-the-blank questions need at least one {{blank}} placeholder.');
        if (answerGroups.length !== blankCount) {
            throw new Error('Fill-in-the-blank questions need one Answer line per {{blank}} placeholder.');
        }
        if (answerGroups.some((answerGroup) => answerGroup.length === 0)) {
            throw new Error('Each fill-in-the-blank Answer line needs at least one accepted answer.');
        }
    }

    return { type, question: questionText, options, answers, answerGroups, feedback };
}

function parseCodeQuiz(source) {
    let prompt = '';
    let feedback = '';
    let section = 'prompt';
    const codeLines = [];
    const answerSections = [[]];

    for (const line of source.replace(/\r/g, '').split('\n')) {
        const promptLine = line.match(/^Prompt:\s*(.+)$/i);
        const feedbackLine = line.match(/^Feedback:\s*(.*)$/i);
        if (promptLine && section === 'prompt') {
            prompt = promptLine[1];
            continue;
        }
        if (/^Code:\s*$/i.test(line) && section === 'prompt') {
            section = 'code';
            continue;
        }
        if (/^Answer:\s*$/i.test(line) && section === 'code') {
            section = 'answer';
            continue;
        }
        if (feedbackLine && section === 'answer') {
            feedback = feedbackLine[1];
            section = 'after-answer';
            continue;
        }
        if (section === 'code') codeLines.push(line);
        else if (section === 'answer' && line.trim() === '---') answerSections.push([]);
        else if (section === 'answer') answerSections.at(-1).push(line);
        else if (line.trim()) throw new Error(`Unexpected line in code quiz: "${line}".`);
    }

    while (codeLines.length && !codeLines.at(-1).trim()) codeLines.pop();
    const placeholderLines = codeLines
        .map((line, index) => ({ match: line.match(/^([ \t]*)\{\{blank\}\}[ \t]*$/), index }))
        .filter(({ match }) => match);
    if (!prompt) throw new Error('Code quizzes need a Prompt line.');
    if (!codeLines.length || placeholderLines.length === 0) {
        throw new Error('Code quizzes need a Code block with at least one {{blank}} line.');
    }
    if (answerSections.length !== placeholderLines.length) {
        throw new Error('Code quizzes need one Answer section per {{blank}} line, separated by a line containing ---.');
    }

    const answers = answerSections.map((answerLines, index) => {
        while (answerLines.length && !answerLines[0].trim()) answerLines.shift();
        while (answerLines.length && !answerLines.at(-1).trim()) answerLines.pop();
        if (!answerLines.length) throw new Error(`Code quiz answer ${index + 1} cannot be empty.`);
        return answerLines.join('\n');
    });
    return {
        type: 'code',
        prompt,
        codeLines,
        blankIndents: placeholderLines.map(({ match }) => match[1]),
        answers,
        feedback
    };
}

function parseQuizSet(source) {
    const questions = [];
    let current = null;
    let answerSeen = false;
    let section = 'question';

    for (const rawLine of source.split('\n')) {
        const line = rawLine.trim();
        if (!line) {
            if (current?.type === 'code' && section === 'code-answer') {
                current.codeAnswerSections.at(-1).push('');
            }
            continue;
        }
        const question = line.match(/^Question:\s*(.+)$/i);
        const questionType = line.match(/^Type:\s*(.+)$/i);
        const answer = line.match(/^Answer:\s*(.+)$/i);
        const feedback = line.match(/^Feedback:\s*(.*)$/i);

        if (question) {
            current = {
                question: question[1],
                options: [],
                answers: [],
                answerGroups: [],
                feedback: '',
                selectionMode: 'single'
            };
            questions.push(current);
            answerSeen = false;
            section = 'question';
        } else if (!current) {
            throw new Error('A multi-question quiz must start each item with "Question:".');
        } else if (current.type === 'code' && section === 'code') {
            const codeAnswer = line.match(/^Answer:\s*(.*)$/i);
            if (codeAnswer) {
                current.codeAnswerSections = [[]];
                if (codeAnswer[1].trim()) current.codeAnswerSections[0].push(codeAnswer[1]);
                answerSeen = true;
                section = 'code-answer';
            } else {
                current.codeLines.push(rawLine);
            }
        } else if (current.type === 'code' && section === 'code-answer') {
            if (line === '---') {
                current.codeAnswerSections.push([]);
            } else if (feedback) {
                current.feedback = feedback[1];
                section = 'feedback';
            } else {
                current.codeAnswerSections.at(-1).push(rawLine);
            }
        } else if (/^Code:\s*$/i.test(line)) {
            if (answerSeen || current.options.length) {
                throw new Error('A Code: block must appear before the Answer line and cannot have options.');
            }
            current.type = 'code';
            current.codeLines = [];
            section = 'code';
        } else if (questionType) {
            if (!current) throw new Error('A multi-question quiz must start each item with "Question:".');
            if (answerSeen) throw new Error('Question Type must appear before its Answer line.');
            const selectionMode = questionType[1].trim().toLowerCase();
            if (selectionMode !== 'multi-select') {
                throw new Error(`Unknown quiz question type "${questionType[1]}". Use "multi-select".`);
            }
            current.selectionMode = selectionMode;
        } else if (line.startsWith('- ') && !answerSeen) {
            current.options.push(line.slice(2).trim());
        } else if (answer) {
            if (answerSeen && current.options.length) {
                throw new Error('Multiple-choice questions can only have one Answer line.');
            }
            const parsedAnswers = answer[1].split('|').map((value) => value.trim()).filter(Boolean);
            current.answerGroups.push(parsedAnswers);
            if (current.answerGroups.length === 1) current.answers = parsedAnswers;
            answerSeen = true;
        } else if (feedback) {
            current.feedback = feedback[1];
        } else {
            throw new Error(`Unexpected line in multi-question quiz: "${line}".`);
        }
    }

    if (questions.length < 2) throw new Error('A multi-question quiz needs at least two Question blocks.');
    for (const [index, question] of questions.entries()) {
        if (question.type === 'code') {
            while (question.codeLines.length && !question.codeLines.at(-1).trim()) question.codeLines.pop();
            const blankIndents = [];
            question.codeLines.forEach((line) => {
                for (const match of line.matchAll(/\{\{blank\}\}/g)) {
                    const prefix = line.slice(0, match.index);
                    blankIndents.push(prefix.trim() ? '' : prefix);
                }
            });
            if (!blankIndents.length) throw new Error(`Question ${index + 1} needs a Code: block with at least one {{blank}}.`);
            if (!question.codeAnswerSections ||
                question.codeAnswerSections.length !== blankIndents.length) {
                throw new Error(`Question ${index + 1} needs one Answer block per code blank, separated by a line containing ---.`);
            }
            question.codeAnswers = question.codeAnswerSections.map((answerLines, answerIndex) => {
                while (answerLines.length && !answerLines[0].trim()) answerLines.shift();
                while (answerLines.length && !answerLines.at(-1).trim()) answerLines.pop();
                if (!answerLines.length) {
                    throw new Error(`Question ${index + 1}, code blank ${answerIndex + 1} needs an answer.`);
                }
                return answerLines.join('\n');
            });
            question.blankIndents = blankIndents;
            continue;
        }
        if (!question.answers.length) throw new Error(`Question ${index + 1} needs an Answer line.`);
        if (question.answerGroups.some((answerGroup) => answerGroup.length === 0)) {
            throw new Error(`Question ${index + 1} has an Answer line without an accepted answer.`);
        }
        if (question.options.length) {
            if (question.options.length < 2) throw new Error(`Question ${index + 1} needs at least two options.`);
            if (!question.answers.every((answer) =>
                question.options.some((option) => normalizeQuizAnswer(option) === normalizeQuizAnswer(answer)))) {
                throw new Error(`Every answer for question ${index + 1} must match one of its options.`);
            }
            if (new Set(question.answers.map(normalizeQuizAnswer)).size !== question.answers.length) {
                throw new Error(`Question ${index + 1} has duplicate answers.`);
            }
            if (question.selectionMode === 'single' && question.answers.length !== 1) {
                throw new Error(`Question ${index + 1} has multiple answers; set "Type: multi-select".`);
            }
        }
        if (!question.options.length) {
            const blankCount = (question.question.match(/\{\{blank\}\}/g) || []).length;
            if (blankCount === 0) {
                throw new Error(`Question ${index + 1} needs options or at least one {{blank}} placeholder.`);
            }
            if (question.answerGroups.length !== blankCount) {
                throw new Error(`Question ${index + 1} needs one Answer line per {{blank}} placeholder.`);
            }
        }
        if (question.selectionMode === 'multi-select' && !question.options.length) {
            throw new Error(`Question ${index + 1} uses multi-select but has no options.`);
        }
        question.type = question.options.length
            ? question.selectionMode === 'multi-select' ? 'multi-select' : 'mc'
            : 'blank';
    }
    return questions;
}

function createQuiz(quiz, id) {
    if (quiz.type === 'multi') return createMultiQuestionQuiz(quiz.questions, id);
    const question = quiz.type === 'code'
        ? renderInline(quiz.prompt)
        : quiz.type === 'blank'
            ? renderQuizQuestion(quiz.question, id)
            : renderInline(quiz.question);
    const choices = quiz.type === 'mc'
        ? `<fieldset class="quiz-options" aria-label="Answer choices">${quiz.options.map((option, index) => `
            <label class="quiz-option">
                <input type="radio" name="quiz-${id}" value="${escapeAttribute(option)}">
                <span>${renderInline(option)}</span>
            </label>`).join('')}
        </fieldset>`
        : quiz.type === 'code'
        ? `<label class="quiz-blank-label" for="quiz-answer-${id}-0">Your code</label>
           <pre class="quiz-code-block">${quiz.codeLines.map((line, index) => {
                if (/^[ \t]*\{\{blank\}\}[ \t]*$/.test(line)) {
                    const blankIndex = quiz.codeLines.slice(0, index + 1)
                        .filter((codeLine) => /^[ \t]*\{\{blank\}\}[ \t]*$/.test(codeLine)).length - 1;
                    const rows = Math.max(3, Math.min(6, quiz.answers[blankIndex].split('\n').length + 1));
                    const indent = quiz.blankIndents[blankIndex].replace(/\t/g, '    ').length;
                    return `<textarea class="quiz-code-answer" id="quiz-answer-${id}-${blankIndex}" aria-label="Code blank ${blankIndex + 1}" data-answer-index="${blankIndex}" rows="${rows}" spellcheck="false" autocomplete="off" style="padding-left: ${indent}ch"></textarea>`;
                }
                return `<code>${escapeHtml(line)}\n</code>`;
            }).join('')}</pre>`
        : quiz.type === 'blank'
            ? createQuizBlankInputs(id, quiz.answerGroups.length)
        : `<label class="quiz-blank-label" for="quiz-answer-${id}">Your answer</label>
           <input class="quiz-blank-input" id="quiz-answer-${id}" type="text" autocomplete="off">`;
    return `
        <section class="markdown-quiz" data-quiz-id="${id}" data-quiz-type="${quiz.type}" data-quiz-answers="${escapeAttribute(JSON.stringify(quiz.type === 'blank' ? quiz.answerGroups : quiz.answers))}" data-quiz-feedback="${escapeAttribute(quiz.feedback)}">
            <p class="quiz-question">${question}</p>
            ${choices}
            <div class="quiz-actions">
                <button class="quiz-check" type="button">Check answer</button>
            </div>
            <div class="quiz-result" role="status" aria-live="polite" hidden></div>
        </section>`;
}

function createMultiQuestionQuiz(questions, id) {
    return `
        <section class="markdown-quiz markdown-quiz-multi" data-quiz-id="${id}"
                 data-quiz-questions="${escapeAttribute(JSON.stringify(questions))}">
            <p class="quiz-progress" aria-live="polite"></p>
            <div class="quiz-step"></div>
            <div class="quiz-actions">
                <button class="quiz-check" type="button">Check answer</button>
                <button class="quiz-next" type="button" disabled>Next question</button>
            </div>
            <div class="quiz-result" role="status" aria-live="polite" hidden></div>
        </section>`;
}

function normalizeQuizAnswer(value) {
    return value.trim().toLocaleLowerCase();
}

function normalizeQuizCode(value) {
    return value.replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => line.replace(/[ \t]+$/g, ''))
        .join('\n')
        .replace(/^\n+|\n+$/g, '');
}

function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
}

function splitCourseIntoLessons(courseHtml, toc) {
    const source = document.createElement('div');
    source.innerHTML = courseHtml;
    const result = [];
    let nextEntry = 0;
    let currentLesson;

    for (const node of source.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && /^H[1-6]$/.test(node.tagName)) {
            const title = node.textContent.trim();
            const expected = toc[nextEntry];
            if (expected && title === expected.title) {
                if (currentLesson) result.push(currentLesson);
                currentLesson = { toc: expected, html: '' };
                nextEntry++;
                continue;
            }
        }

        if (currentLesson) {
            currentLesson.html += node.nodeType === Node.TEXT_NODE
                ? escapeHtml(node.textContent)
                : node.outerHTML;
        }
    }

    if (currentLesson) result.push(currentLesson);
    if (nextEntry !== toc.length) {
        const nextTitle = toc[nextEntry]?.title || 'unknown';
        throw new Error(`Could not find the next table-of-contents heading: "${nextTitle}".`);
    }
    return result;
}

function createRunnableExample(exampleCode, id) {
    const editorId = `example-${id}`;
    const { code, hidden, files } = exampleCode;
    if (hidden) hiddenRunnableCode.set(editorId, code);
    const initialCode = savedEditorValues.get(editorId) ?? code;
    const savedFiles = savedProjectFiles.get(editorId) || new Map();
    const initialFiles = files.map((file) => ({
        ...file,
        content: savedFiles.get(file.name) ?? file.content
    }));
    const hasProjectFiles = initialFiles.length > 0;
    const editor = hidden ? '' : `
                <div class="run-example-editor">
                    <textarea class="run-example-code" aria-label="Python code example">${escapeHtml(initialCode)}</textarea>
                </div>`;
    const projectEditor = hasProjectFiles
        ? createProjectEditor(editorId, initialCode, initialFiles, hidden)
        : editor;
    return `
        <section class="run-example${hidden ? ' run-example-hidden' : ''}${hasProjectFiles ? ' run-example-project' : ''}" aria-label="${hidden ? 'Interactive Python activity' : 'Runnable Python example'}" data-example-id="${editorId}">
            <div class="run-example-header">
                <span>${hidden ? 'Interactive Python' : 'Python'}</span>
                <span class="run-example-status" role="status">Ready</span>
                <button class="run-example-button" type="button">▶ Run</button>
            </div>
            <div class="run-example-workspace">
                ${projectEditor}
                <section class="run-example-console" aria-label="Program console">
                    <canvas class="turtle-canvas" width="480" height="260" hidden aria-label="Turtle drawing output"></canvas>
                    <h4 class="console-label">Console</h4>
                    <pre class="run-example-output" aria-live="polite">Run the example to see its output.</pre>
                    <form class="run-example-input-form" hidden>
                        <span class="run-example-prompt" aria-hidden="true"></span><input class="run-example-input" autocomplete="off" spellcheck="false" aria-label="Program input">
                    </form>
                </section>
            </div>
        </section>`;
}

function createProjectEditor(editorId, code, files, hidden) {
    const displayedFiles = hidden
        ? files.filter((file) => file.name.toLowerCase() !== 'main.py')
        : [{ name: 'main.py', content: code }, ...files];
    const tabs = displayedFiles.map((file, index) => `
        <button class="project-file-tab${index === 0 ? ' active' : ''}" type="button"
                role="tab" aria-selected="${index === 0}" data-file-name="${escapeAttribute(file.name)}">
            ${escapeHtml(file.name)}
        </button>`).join('');
    const panes = displayedFiles.map((file, index) => `
        <div class="project-file-pane${index === 0 ? ' active' : ''}" role="tabpanel" data-file-pane="${escapeAttribute(file.name)}"${index === 0 ? '' : ' hidden'}>
            <textarea class="${file.name.toLowerCase().endsWith('.py') ? 'project-python-file' : 'project-text-file'}"
                      aria-label="${escapeAttribute(file.name)}" data-file-name="${escapeAttribute(file.name)}">${escapeHtml(file.content)}</textarea>
        </div>`).join('');

    return `
        <div class="run-example-editor project-editor" data-project-id="${editorId}">
            <div class="project-file-bar" role="tablist" aria-label="Project files">
                ${tabs}
                <button class="project-add-toggle" type="button" aria-expanded="false">+ File</button>
                <form class="project-add-form" hidden>
                    <input class="project-file-name" type="text" maxlength="64" placeholder="filename" aria-label="New file name">
                    <select class="project-file-extension" aria-label="New file type">
                        <option value=".txt">.txt</option>
                        <option value=".py">.py</option>
                    </select>
                    <button type="submit">Add</button>
                    <button class="project-add-cancel" type="button">Cancel</button>
                </form>
            </div>
            <div class="project-file-panes">${panes}</div>
        </div>`;
}

function renderInline(source) {
    const htmlTokens = [];
    const codeTokens = [];
    let text = source.replace(/`([^`]+)`/g, (_match, code) => {
        const token = `INLINECODE${codeTokens.length}TOKEN`;
        codeTokens.push(`<code>${escapeHtml(code)}</code>`);
        return token;
    });

    text = text.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (_match, alt, url) =>
        addHtmlToken(htmlTokens, `<img src="${escapeAttribute(url)}" alt="${escapeAttribute(alt)}" loading="lazy">`)
    );
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g, (_match, label, url) =>
        addHtmlToken(htmlTokens, `<a href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`)
    );
    text = escapeHtml(text);
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/INLINECODE(\d+)TOKEN/g, (_match, index) => codeTokens[Number(index)]);
    return text.replace(/INLINEHTML(\d+)TOKEN/g, (_match, index) => htmlTokens[Number(index)]);
}

function addHtmlToken(tokens, html) {
    const token = `INLINEHTML${tokens.length}TOKEN`;
    tokens.push(html);
    return token;
}

function buildCourseNavigation() {
    const fragment = document.createDocumentFragment();
    for (const lesson of lessons) {
        const link = document.createElement('a');
        link.href = `#${lesson.toc.id}`;
        link.dataset.level = String(lesson.toc.level);
        link.textContent = lesson.toc.title;
        fragment.append(link);
    }
    navElement.replaceChildren(fragment);
}

function showCurrentPage() {
    if (!lessons.length) return;
    const requestedId = window.location.hash.slice(1);
    const lessonIndex = lessons.findIndex((lesson) => lesson.toc.id === requestedId);

    if (lessonIndex < 0) {
        showContentsPage();
        return;
    }

    const lesson = lessons[lessonIndex];
    contentElement.innerHTML = `
        <article class="lesson-page">
            ${createLessonNavigation(lessonIndex, 'top')}
            <h1>${escapeHtml(lesson.toc.title)}</h1>
            <div class="lesson-body">${lesson.html}</div>
            ${createLessonNavigation(lessonIndex, 'bottom')}
        </article>`;

    navElement.querySelectorAll('a').forEach((link) => {
        if (link.hash === `#${lesson.toc.id}`) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
    initializeEditors();
    initializeQuizzes();
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function initializeQuizzes() {
    contentElement.querySelectorAll('.markdown-quiz').forEach((quizElement) => {
        initializeCodeAnswerBoxes(quizElement);
        if (quizElement.classList.contains('markdown-quiz-multi')) {
            initializeMultiQuestionQuiz(quizElement);
            return;
        }
        if (quizElement.dataset.quizType === 'blank') {
            quizElement.querySelectorAll('.quiz-blank-input').forEach((blankInput) => {
                blankInput.addEventListener('input', () => updateQuizBlankPreview(quizElement, blankInput));
            });
        }
        const checkButton = quizElement.querySelector('.quiz-check');
        const result = quizElement.querySelector('.quiz-result');
        checkButton.addEventListener('click', () => {
            const accepted = JSON.parse(quizElement.dataset.quizAnswers);
            const quizType = quizElement.dataset.quizType;
            const submitted = quizType === 'mc'
                ? quizElement.querySelector('input[type="radio"]:checked')?.value
                : quizType === 'code'
                    ? [...quizElement.querySelectorAll('.quiz-code-answer')].map((input) => input.value)
                    : [...quizElement.querySelectorAll('.quiz-blank-input')].map((input) => input.value);
            const unanswered = quizType === 'code' || quizType === 'blank'
                ? submitted.some((answer) => !answer.trim())
                : !submitted?.trim();
            if (unanswered) {
                result.className = 'quiz-result unanswered';
                result.textContent = quizType === 'mc'
                    ? 'Choose an answer first.'
                    : quizType === 'code' || quizType === 'blank'
                        ? `Complete every ${quizType === 'code' ? 'code ' : ''}blank first.`
                        : 'Enter an answer first.';
                result.hidden = false;
                return;
            }

            const correct = quizType === 'code'
                ? accepted.length === submitted.length && accepted.every((answer, index) =>
                    normalizeQuizCode(answer) === normalizeQuizCode(submitted[index]))
                : quizType === 'blank'
                    ? accepted.length === submitted.length && accepted.every((answerGroup, index) =>
                        answerGroup.some((answer) =>
                            normalizeQuizAnswer(answer) === normalizeQuizAnswer(submitted[index])))
                : accepted.some((answer) =>
                    normalizeQuizAnswer(answer) === normalizeQuizAnswer(submitted));
            result.className = `quiz-result ${correct ? 'correct' : 'incorrect'}`;
            result.textContent = correct
                ? `Correct!${quizElement.dataset.quizFeedback ? ` ${quizElement.dataset.quizFeedback}` : ''}`
                : `Not quite. Try again.${quizElement.dataset.quizFeedback ? ` ${quizElement.dataset.quizFeedback}` : ''}`;
            result.hidden = false;
        });
    });
}

function initializeCodeAnswerBoxes(container) {
    container.querySelectorAll('.quiz-code-answer:not(.quiz-code-answer-inline)').forEach((input) => {
        const resize = () => {
            input.style.height = 'auto';
            const style = getComputedStyle(input);
            const borderHeight = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
            input.style.height = `${input.scrollHeight + borderHeight}px`;
        };
        input.addEventListener('input', resize);
        resize();
    });
}

function updateQuizBlankPreview(quizElement, input) {
    const blank = quizElement.querySelector(`.quiz-blank-slot[data-blank-index="${input.dataset.blankIndex}"]`);
    if (blank) blank.textContent = input.value || '________';
}

function renderQuizQuestion(question, id) {
    const tokens = [];
    const source = question.replace(/\{\{blank\}\}/g, () => {
        const index = tokens.length;
        const token = `QUIZBLANK${id}TOKEN${index}END`;
        tokens.push(token);
        return token;
    });
    let html = renderInline(source);
    tokens.forEach((token, index) => {
        html = html.replace(
            token,
            `<span class="quiz-blank-slot" data-blank-index="${index}" aria-hidden="true">________</span>`
        );
    });
    return html;
}

function createQuizBlankInputs(id, count) {
    return Array.from({ length: count }, (_, index) => `
        <label class="quiz-blank-label" for="quiz-answer-${id}-${index}">Your answer${count > 1 ? ` ${index + 1}` : ''}</label>
        <input class="quiz-blank-input" id="quiz-answer-${id}-${index}" data-blank-index="${index}" type="text" autocomplete="off">`
    ).join('');
}

function renderQuizCodeBlock(question, id) {
    let blankIndex = 0;
    const lines = question.codeLines.map((line) => {
        const blankPattern = /\{\{blank\}\}/g;
        let cursor = 0;
        let rendered = '';
        for (const match of line.matchAll(blankPattern)) {
            const index = blankIndex++;
            const prefix = line.slice(cursor, match.index);
            const suffixStart = match.index + match[0].length;
            const suffix = line.slice(suffixStart);
            const isWholeLine = !prefix.trim() && !suffix.trim();
            const rows = isWholeLine
                ? Math.max(3, Math.min(6, question.codeAnswers[index].split('\n').length + 1))
                : 1;
            const indent = isWholeLine ? question.blankIndents[index].replace(/\t/g, '    ').length : 0;
            rendered += `${isWholeLine ? '' : `<code>${escapeHtml(prefix)}</code>`}<textarea class="quiz-code-answer${isWholeLine ? '' : ' quiz-code-answer-inline'}" id="quiz-code-answer-${id}-${index}" aria-label="Code blank ${index + 1}" rows="${rows}" spellcheck="false" autocomplete="off" style="padding-left: ${indent}ch"></textarea>`;
            cursor = suffixStart;
        }
        rendered += `<code>${escapeHtml(line.slice(cursor))}\n</code>`;
        return rendered;
    }).join('');
    return `<label class="quiz-blank-label" for="quiz-code-answer-${id}-0">Complete the code</label>
        <pre class="quiz-code-block">${lines}</pre>`;
}

function initializeMultiQuestionQuiz(quizElement) {
    const questionBank = JSON.parse(quizElement.dataset.quizQuestions);
    let questions = shuffled(questionBank);
    const progress = quizElement.querySelector('.quiz-progress');
    const step = quizElement.querySelector('.quiz-step');
    const checkButton = quizElement.querySelector('.quiz-check');
    const result = quizElement.querySelector('.quiz-result');
    const nextButton = quizElement.querySelector('.quiz-next');
    const state = { index: 0, score: 0, finished: false };

    const showQuestion = () => {
        const question = questions[state.index];
        const questionHtml = question.type === 'blank'
            ? renderQuizQuestion(question.question, `${quizElement.dataset.quizId}-${state.index}`)
            : renderInline(question.question);
        progress.textContent = `Question ${state.index + 1} of ${questions.length}`;
        step.innerHTML = `<p class="quiz-question">${questionHtml}</p>`;
        if (question.type === 'code') {
            step.insertAdjacentHTML('beforeend', renderQuizCodeBlock(question, state.index));
            initializeCodeAnswerBoxes(step);
        }
        step.classList.remove('quiz-step-enter');
        void step.offsetWidth;
        step.classList.add('quiz-step-enter');

        if (question.type === 'mc' || question.type === 'multi-select') {
            const fieldset = document.createElement('fieldset');
            fieldset.className = 'quiz-options';
            fieldset.setAttribute('aria-label', 'Answer choices');
            shuffled(question.options).forEach((option, optionIndex) => {
                const label = document.createElement('label');
                label.className = 'quiz-option';
                const input = document.createElement('input');
                input.type = question.type === 'multi-select' ? 'checkbox' : 'radio';
                input.name = `quiz-${quizElement.dataset.quizId}-${state.index}`;
                input.value = option;
                input.id = `${input.name}-${optionIndex}`;
                const text = document.createElement('span');
                text.textContent = option;
                label.htmlFor = input.id;
                label.append(input, text);
                fieldset.append(label);
            });
            step.append(fieldset);
        } else if (question.type === 'blank') {
            const blankCount = question.answerGroups.length;
            const fields = document.createElement('div');
            fields.className = 'quiz-blank-fields';
            fields.innerHTML = createQuizBlankInputs(`${quizElement.dataset.quizId}-${state.index}`, blankCount);
            fields.querySelectorAll('.quiz-blank-input').forEach((input) => {
                input.addEventListener('input', () => updateQuizBlankPreview(step, input));
            });
            step.append(fields);
        }
        result.textContent = '';
        result.className = 'quiz-result';
        result.hidden = true;
        checkButton.textContent = 'Check answer';
        checkButton.disabled = false;
        nextButton.disabled = true;
        nextButton.textContent = 'Next question';
    };

    nextButton.addEventListener('click', () => {
        if (state.finished) {
            state.index = 0;
            state.score = 0;
            state.finished = false;
            questions = shuffled(questionBank);
            showQuestion();
        } else if (state.index === questions.length - 1) {
            state.finished = true;
            progress.textContent = 'Quiz complete';
            step.replaceChildren();
            result.className = 'quiz-result final-score';
            result.textContent = `You got ${state.score}/${questions.length} correct.`;
            result.hidden = false;
            result.classList.add('quiz-result-enter');
            nextButton.textContent = 'Try again';
            nextButton.disabled = false;
        } else {
            state.index++;
            showQuestion();
        }
    });

    checkButton.addEventListener('click', () => {
        const question = questions[state.index];
        const selectedOptions = question.type === 'multi-select'
            ? [...step.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value)
            : null;
        const submitted = question.type === 'mc'
            ? step.querySelector('input[type="radio"]:checked')?.value
            : question.type === 'multi-select'
                ? selectedOptions
                : question.type === 'code'
                    ? [...step.querySelectorAll('.quiz-code-answer')].map((input) => input.value)
                : [...step.querySelectorAll('.quiz-blank-input')].map((input) => input.value);
        if (question.type === 'multi-select' ? submitted.length === 0
            : question.type === 'blank' || question.type === 'code'
                ? submitted.some((answer) => !answer.trim())
                : !submitted?.trim()) {
            result.className = 'quiz-result unanswered';
            result.textContent = question.type === 'code'
                ? 'Complete every code blank first.'
                : question.type === 'blank' ? 'Complete every blank first.' : 'Choose at least one answer.';
            result.hidden = false;
            return;
        }

        const correct = question.type === 'code'
            ? question.codeAnswers.length === submitted.length && question.codeAnswers.every((answer, index) =>
                normalizeQuizCode(answer) === normalizeQuizCode(submitted[index]))
            : question.type === 'blank'
            ? question.answerGroups.length === submitted.length && question.answerGroups.every((answerGroup, index) =>
                answerGroup.some((answer) =>
                    normalizeQuizAnswer(answer) === normalizeQuizAnswer(submitted[index])))
            : question.type === 'multi-select'
            ? submitted.length === question.answers.length &&
                question.answers.every((answer) => submitted.some((value) =>
                    normalizeQuizAnswer(value) === normalizeQuizAnswer(answer)))
            : question.answers.some((answer) =>
                normalizeQuizAnswer(answer) === normalizeQuizAnswer(submitted));
        if (correct) state.score++;
        step.querySelectorAll('input').forEach((input) => { input.disabled = true; });
        result.className = `quiz-result ${correct ? 'correct' : 'incorrect'}`;
        result.textContent = `${correct ? 'Correct!' : 'Not quite.'}${question.feedback ? ` ${question.feedback}` : ''}`;
        result.hidden = false;
        result.classList.add('quiz-result-enter');
        checkButton.disabled = true;
        nextButton.textContent = state.index === questions.length - 1 ? 'See score' : 'Next question';
        nextButton.disabled = false;
    });

    showQuestion();
}

function showContentsPage() {
    if (window.location.hash !== '#contents') {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}#contents`);
    }
    const entries = lessons.map((lesson) =>
        `<a href="#${lesson.toc.id}" data-level="${lesson.toc.level}">${escapeHtml(lesson.toc.title)}</a>`
    ).join('');
    contentElement.innerHTML = `
        <section class="course-index">
            <p>Choose a chapter or lesson to begin. Use the contents panel to navigate between lessons.</p>
            <nav aria-label="All course lessons">${entries}</nav>
        </section>`;
    navElement.querySelectorAll('a').forEach((link) => link.removeAttribute('aria-current'));
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function createLessonNavigation(index, position) {
    const previous = index > 0
        ? `<a href="#${lessons[index - 1].toc.id}" class="previous-link">← ${escapeHtml(lessons[index - 1].toc.title)}</a>`
        : '<span></span>';
    const nextIndex = index + 1 < lessons.length ? index + 1 : 0;
    const nextLabel = index + 1 < lessons.length ? lessons[nextIndex].toc.title : 'Start of course';
    const next = `<a href="#${lessons[nextIndex].toc.id}" class="next-link">${escapeHtml(nextLabel)} →</a>`;
    const contents = `<a href="#contents" class="contents-link">Course contents</a>`;
    return `<nav class="lesson-navigation ${position}" aria-label="${position} lesson navigation">${previous}${contents}${next}</nav>`;
}

function initializeEditors() {
    editorResizeObserver?.disconnect();
    editors = [];
    contentElement.querySelectorAll('.run-example-hidden:not(.run-example-project) .run-example-button').forEach((button) => {
        button.addEventListener('click', () => runExample(button.closest('.run-example'), null));
    });
    contentElement.querySelectorAll('.run-example-project').forEach(initializeProjectEditor);

    const codeAreas = contentElement.querySelectorAll('.run-example-code');
    for (const textarea of codeAreas) {
        const example = textarea.closest('.run-example');
        const editor = CodeMirror.fromTextArea(textarea, {
            mode: 'python',
            lineNumbers: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            extraKeys: {
                Tab: (codeEditor) => codeEditor.replaceSelection('    ', 'end')
            }
        });
        editor.setSize(null, Math.max(130, Math.min(280, editor.lineCount() * 20 + 26)));
        editor.on('change', () => savedEditorValues.set(example.dataset.exampleId, editor.getValue()));
        example.querySelector('.run-example-button').addEventListener('click', () => runExample(example, editor));
        editors.push(editor);
    }

    const refreshEditors = () => {
        editors.forEach((editor) => {
            if (contentElement.contains(editor.getWrapperElement())) editor.refresh();
        });
    };
    editorResizeObserver = new ResizeObserver(refreshEditors);
    const editorContainers = new Set(
        editors.map((editor) => editor.getWrapperElement().parentElement)
    );
    editorContainers.forEach((container) => {
        if (container) editorResizeObserver.observe(container);
    });
    requestAnimationFrame(refreshEditors);
    document.fonts.ready.then(refreshEditors);
}

function initializeProjectEditor(example) {
    const editorPanel = example.querySelector('.project-editor');
    const exampleId = example.dataset.exampleId;
    const files = new Map(savedProjectFiles.get(exampleId) || []);
    const fileEditors = new Map();
    const panes = [...editorPanel.querySelectorAll('.project-file-pane')];
    const state = { files, fileEditors, mainEditor: null, activeFile: '' };
    projectStates.set(example, state);

    for (const pane of panes) {
        const filename = pane.dataset.filePane;
        const textarea = pane.querySelector('textarea');
        if (textarea.classList.contains('project-python-file')) {
            const editor = CodeMirror.fromTextArea(textarea, {
                mode: 'python',
                lineNumbers: true,
                autoCloseBrackets: true,
                indentUnit: 4,
                tabSize: 4,
                indentWithTabs: false,
                extraKeys: {
                    Tab: (codeEditor) => codeEditor.replaceSelection('    ', 'end')
                }
            });
            editor.setSize(null, '100%');
            editor.on('change', () => {
                const value = editor.getValue();
                if (filename === 'main.py') savedEditorValues.set(exampleId, value);
                else saveProjectFile(exampleId, state, filename, value);
            });
            fileEditors.set(filename, editor);
            if (filename === 'main.py') state.mainEditor = editor;
            editors.push(editor);
        } else {
            state.files.set(filename, textarea.value);
            textarea.addEventListener('input', () => saveProjectFile(exampleId, state, filename, textarea.value));
        }
        if (filename !== 'main.py') state.files.set(filename, files.get(filename) ?? textarea.value);
    }

    const firstTab = editorPanel.querySelector('.project-file-tab');
    if (firstTab) state.activeFile = firstTab.dataset.fileName;
    editorPanel.querySelectorAll('.project-file-tab').forEach((tab) => {
        tab.addEventListener('click', () => activateProjectFile(editorPanel, state, tab.dataset.fileName));
    });
    editorPanel.querySelector('.project-add-toggle').addEventListener('click', (event) => {
        const form = editorPanel.querySelector('.project-add-form');
        form.hidden = !form.hidden;
        event.currentTarget.setAttribute('aria-expanded', String(!form.hidden));
        if (!form.hidden) form.querySelector('.project-file-name').focus();
    });
    editorPanel.querySelector('.project-add-cancel').addEventListener('click', () => {
        editorPanel.querySelector('.project-add-form').hidden = true;
        editorPanel.querySelector('.project-add-toggle').setAttribute('aria-expanded', 'false');
    });
    editorPanel.querySelector('.project-add-form').addEventListener('submit', (event) => {
        event.preventDefault();
        addProjectFile(example, editorPanel, state);
    });
    example.querySelector('.run-example-button').addEventListener('click', () =>
        runExample(example, state.mainEditor));
}

function saveProjectFile(exampleId, state, filename, content) {
    state.files.set(filename, content);
    savedProjectFiles.set(exampleId, new Map(state.files));
}

function activateProjectFile(editorPanel, state, filename) {
    state.activeFile = filename;
    editorPanel.querySelectorAll('.project-file-tab').forEach((tab) => {
        const active = tab.dataset.fileName === filename;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
    });
    editorPanel.querySelectorAll('.project-file-pane').forEach((pane) => {
        const active = pane.dataset.filePane === filename;
        pane.hidden = !active;
        pane.classList.toggle('active', active);
    });
    const editor = state.fileEditors.get(filename);
    if (editor) requestAnimationFrame(() => editor.refresh());
}

function addProjectFile(example, editorPanel, state) {
    const form = editorPanel.querySelector('.project-add-form');
    const nameInput = form.querySelector('.project-file-name');
    const extension = form.querySelector('.project-file-extension').value;
    const baseName = nameInput.value.trim().replace(/\.(?:py|txt)$/i, '');
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,59}$/.test(baseName)) {
        nameInput.setCustomValidity('Use a file name with letters, numbers, dots, hyphens, or underscores.');
        nameInput.reportValidity();
        return;
    }
    nameInput.setCustomValidity('');
    const filename = `${baseName}${extension}`;
    if (filename.toLowerCase() === 'main.py' || state.files.has(filename) ||
        editorPanel.querySelector(`[data-file-pane="${CSS.escape(filename)}"]`)) {
        nameInput.setCustomValidity('A file with that name already exists.');
        nameInput.reportValidity();
        return;
    }

    state.files.set(filename, '');
    saveProjectFile(example.dataset.exampleId, state, filename, '');
    const tab = document.createElement('button');
    tab.className = 'project-file-tab';
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.dataset.fileName = filename;
    tab.textContent = filename;
    editorPanel.querySelector('.project-add-toggle').before(tab);

    const pane = document.createElement('div');
    pane.className = 'project-file-pane';
    pane.setAttribute('role', 'tabpanel');
    pane.dataset.filePane = filename;
    pane.hidden = true;
    const textarea = document.createElement('textarea');
    textarea.className = filename.endsWith('.py') ? 'project-python-file' : 'project-text-file';
    textarea.setAttribute('aria-label', filename);
    textarea.dataset.fileName = filename;
    pane.append(textarea);
    editorPanel.querySelector('.project-file-panes').append(pane);

    if (filename.endsWith('.py')) {
        const editor = CodeMirror.fromTextArea(textarea, {
            mode: 'python',
            lineNumbers: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            extraKeys: {
                Tab: (codeEditor) => codeEditor.replaceSelection('    ', 'end')
            }
        });
        editor.setSize(null, '100%');
        editor.on('change', () => saveProjectFile(example.dataset.exampleId, state, filename, editor.getValue()));
        state.fileEditors.set(filename, editor);
        editors.push(editor);
        editorResizeObserver?.observe(editor.getWrapperElement().parentElement);
    } else {
        textarea.addEventListener('input', () =>
            saveProjectFile(example.dataset.exampleId, state, filename, textarea.value));
    }
    tab.addEventListener('click', () => activateProjectFile(editorPanel, state, filename));
    activateProjectFile(editorPanel, state, filename);
    nameInput.value = '';
    form.hidden = true;
    editorPanel.querySelector('.project-add-toggle').setAttribute('aria-expanded', 'false');
}

async function getPyodide() {
    if (!runtimePromise) {
        runtimePromise = loadPyodide()
            .then((runtime) => {
                runtime.globals.set('__ebook_input_js', requestConsoleInput);
                runtime.globals.set('ebook_turtle_bridge', drawTurtleCommand);
                runtime.runPython(`
async def __ebook_input(prompt=""):
    return await __ebook_input_js(prompt)
`);
                return runtime;
            })
            .catch((error) => {
                runtimePromise = null;
                throw error;
            });
    }
    return runtimePromise;
}

async function runExample(example, editor) {
    if (isRunning) return;

    isRunning = true;
    turtleAnimationQueue = Promise.resolve();
    activeExample = example;
    const status = example.querySelector('.run-example-status');
    const output = example.querySelector('.run-example-output');
    const canvas = example.querySelector('.turtle-canvas');
    const code = editor
        ? editor.getValue()
        : hiddenRunnableCode.get(example.dataset.exampleId);
    if (typeof code !== 'string') {
        isRunning = false;
        activeExample = null;
        status.textContent = 'Code unavailable';
        output.classList.add('error');
        output.textContent = 'This activity could not be loaded. Please reload the lesson and try again.';
        document.querySelectorAll('.run-example-button').forEach((button) => {
            button.disabled = false;
        });
        return;
    }
    const projectState = projectStates.get(example);
    const turtleEnabled = /\b(?:import\s+turtle|from\s+turtle\s+import)\b/.test(code);

    document.querySelectorAll('.run-example-button').forEach((button) => {
        button.disabled = true;
    });
    status.textContent = 'Loading Python…';
    output.classList.remove('error');
    output.textContent = '';
    pythonOutputDecoder = new TextDecoder();
    pythonOutputBuffer = '';
    example.querySelector('.run-example-input-form').hidden = true;
    canvas.hidden = !turtleEnabled;
    resetTurtleCanvas(canvas);

    let projectDirectory = null;
    try {
        pyodide = await getPyodide();
        if (turtleEnabled) installTurtleModule();
        if (projectState) {
            projectDirectory = `/tmp/python-course/${example.dataset.exampleId}`;
            pyodide.FS.mkdirTree(projectDirectory);
            for (const filename of pyodide.FS.readdir(projectDirectory)) {
                if (filename !== '.' && filename !== '..') {
                    pyodide.FS.unlink(`${projectDirectory}/${filename}`);
                }
            }
            const files = new Map(projectState.files);
            files.set('main.py', code);
            for (const [filename, content] of files) {
                pyodide.FS.writeFile(`${projectDirectory}/${filename}`, content);
            }
            pyodide.FS.chdir(projectDirectory);
            const activeProjectDirectory = projectDirectory;
            const moduleNames = [...files.keys()]
                .filter((filename) => filename.endsWith('.py') && filename !== 'main.py')
                .map((filename) => filename.slice(0, -3));
            pyodide.runPython(`
import sys as __ebook_sys
__ebook_project_dir = ${JSON.stringify(activeProjectDirectory)}
__ebook_sys.path.insert(0, __ebook_project_dir)
for __ebook_module in ${JSON.stringify(moduleNames)}:
    __ebook_sys.modules.pop(__ebook_module, None)
`);
        }
        pyodide.setStdout({ raw: writePythonOutput });
        pyodide.setStderr({ raw: writePythonOutput });
        status.textContent = 'Running…';
        await pyodide.runPythonAsync(rewriteInputCalls(code));
        flushPythonOutput();
        if (!output.textContent) output.textContent = '(No output)';
    } catch (error) {
        flushPythonOutput();
        output.classList.add('error');
        appendConsoleOutput(`${output.textContent ? '\n' : ''}${error}`);
    } finally {
        if (pyodide && projectDirectory) {
            pyodide.FS.chdir('/');
            pyodide.runPython(`
import sys as __ebook_sys
__ebook_project_dir = ${JSON.stringify(projectDirectory)}
if __ebook_project_dir in __ebook_sys.path:
    __ebook_sys.path.remove(__ebook_project_dir)
`);
        }
        try {
            await turtleAnimationQueue;
        } catch (animationError) {
            output.classList.add('error');
            appendConsoleOutput(`${output.textContent ? '\n' : ''}${animationError}`);
        }
        if (pendingInput) {
            const resolve = pendingInput;
            pendingInput = null;
            resolve('');
        }
        activeExample = null;
        isRunning = false;
        document.querySelectorAll('.run-example-button').forEach((button) => {
            button.disabled = false;
        });
        status.textContent = pyodide ? 'Ready' : 'Python unavailable';
    }
}

function appendConsoleOutput(text) {
    if (!activeExample) return;
    const output = activeExample.querySelector('.run-example-output');
    output.textContent += text;
    const consolePanel = activeExample.querySelector('.run-example-console');
    consolePanel.scrollTop = consolePanel.scrollHeight;
}

function writePythonOutput(byte) {
    pythonOutputBuffer += pythonOutputDecoder.decode(new Uint8Array([byte]), { stream: true });
    if (pythonOutputBuffer.includes('\n') || pythonOutputBuffer.length >= 512) {
        appendConsoleOutput(pythonOutputBuffer);
        pythonOutputBuffer = '';
    }
    return byte;
}

function flushPythonOutput() {
    if (!pythonOutputDecoder) return;
    pythonOutputBuffer += pythonOutputDecoder.decode();
    if (pythonOutputBuffer) appendConsoleOutput(pythonOutputBuffer);
    pythonOutputBuffer = '';
}

function requestConsoleInput(prompt) {
    if (!activeExample) return Promise.reject(new Error('No active program console.'));

    flushPendingPythonOutput();
    appendConsoleOutput(String(prompt));
    const form = activeExample.querySelector('.run-example-input-form');
    const input = activeExample.querySelector('.run-example-input');
    form.hidden = false;
    input.value = '';
    input.focus();

    return new Promise((resolve) => {
        pendingInput = resolve;
        form.onsubmit = (event) => {
            event.preventDefault();
            if (!pendingInput) return;
            const value = input.value;
            appendConsoleOutput(`${value}\n`);
            form.hidden = true;
            const resolveInput = pendingInput;
            pendingInput = null;
            resolveInput(value);
        };
    });
}

function flushPendingPythonOutput() {
    if (pythonOutputBuffer) {
        appendConsoleOutput(pythonOutputBuffer);
        pythonOutputBuffer = '';
    }
}

function rewriteInputCalls(code) {
    let rewritten = '';
    let index = 0;
    while (index < code.length) {
        const character = code[index];
        if (character === '#') {
            const lineEnd = code.indexOf('\n', index);
            const end = lineEnd === -1 ? code.length : lineEnd;
            rewritten += code.slice(index, end);
            index = end;
            continue;
        }
        if (character === "'" || character === '"') {
            const delimiter = code.slice(index, index + 3) === character.repeat(3)
                ? character.repeat(3)
                : character;
            let end = index + delimiter.length;
            while (end < code.length) {
                if (code[end] === '\\') end += 2;
                else if (code.slice(end, end + delimiter.length) === delimiter) {
                    end += delimiter.length;
                    break;
                } else end++;
            }
            rewritten += code.slice(index, end);
            index = end;
            continue;
        }
        if (/[A-Za-z_]/.test(character)) {
            const start = index++;
            while (index < code.length && /[A-Za-z0-9_]/.test(code[index])) index++;
            const identifier = code.slice(start, index);
            let next = index;
            while (next < code.length && /\s/.test(code[next])) next++;
            const previous = code[start - 1] || '';
            rewritten += identifier === 'input' && previous !== '.' && code[next] === '('
                ? 'await __ebook_input'
                : identifier;
            continue;
        }
        rewritten += character;
        index++;
    }
    return rewritten;
}

function installTurtleModule() {
    pyodide.runPython(`
import math as _ebook_math
import sys as _ebook_sys
import types as _ebook_types

class _EbookScreen:
    def setup(self, width=480, height=260, *args):
        ebook_turtle_bridge("setup", width, height)
    def bgcolor(self, *color):
        ebook_turtle_bridge("background", str(color[0] if len(color) == 1 else color))
    def bgpic(self, filename=None):
        if filename:
            ebook_turtle_bridge("message", "GIF backgrounds need an image asset and are not available in this browser example.")
    def addshape(self, *args, **kwargs):
        return None
    def title(self, *args, **kwargs):
        return None
    def mainloop(self):
        return None
    def bye(self):
        ebook_turtle_bridge("clear")

class _EbookTurtle:
    _next_id = 0
    def __init__(self, *args, **kwargs):
        self._id = _EbookTurtle._next_id
        _EbookTurtle._next_id += 1
        self._x, self._y, self._heading = 0.0, 0.0, 90.0
        self._color, self._width = "black", 1.0
        self._down, self._visible = True, True
        self._shape, self._speed = "classic", 3
    def _emit(self, action="cursor", x1=None, y1=None):
        ebook_turtle_bridge(action, self._id, self._x if x1 is None else x1,
                          self._y if y1 is None else y1, self._x, self._y,
                          self._heading, self._color, self._width,
                          self._down, self._visible, self._shape, self._speed)
    def forward(self, distance):
        x1, y1 = self._x, self._y
        angle = _ebook_math.radians(self._heading)
        self._x += float(distance) * _ebook_math.cos(angle)
        self._y += float(distance) * _ebook_math.sin(angle)
        self._emit("move", x1, y1)
    fd = forward
    def backward(self, distance):
        self.forward(-float(distance))
    back = backward
    bk = backward
    def left(self, angle):
        self._heading = (self._heading + float(angle)) % 360
        self._emit()
    lt = left
    def right(self, angle):
        self.left(-float(angle))
    rt = right
    def penup(self):
        self._down = False
        self._emit()
    up = penup
    def pendown(self):
        self._down = True
        self._emit()
    down = pendown
    def goto(self, x, y=None):
        if y is None:
            x, y = x
        x1, y1 = self._x, self._y
        self._x, self._y = float(x), float(y)
        self._emit("move", x1, y1)
    setpos = goto
    setposition = goto
    def setx(self, x):
        self.goto(x, self._y)
    def sety(self, y):
        self.goto(self._x, y)
    def setheading(self, angle):
        self._heading = float(angle) % 360
        self._emit()
    seth = setheading
    def home(self):
        self.goto(0, 0)
        self.setheading(90)
    def xcor(self):
        return self._x
    def ycor(self):
        return self._y
    def pos(self):
        return (self._x, self._y)
    position = pos
    def heading(self):
        return self._heading
    def color(self, *color):
        if color:
            self._color = str(color[0] if len(color) == 1 else color)
            self._emit()
        return self._color
    def pencolor(self, *color):
        return self.color(*color) if color else self._color
    def fillcolor(self, *color):
        return self.color(*color) if color else self._color
    def width(self, value=None):
        if value is not None:
            self._width = float(value)
            self._emit()
        return self._width
    pensize = width
    def speed(self, value=None):
        if value is not None:
            speeds = {"fastest": 0, "fast": 10, "normal": 6, "slow": 3, "slowest": 1}
            if isinstance(value, str):
                if value not in speeds:
                    raise ValueError("speed must be an integer from 0 to 10 or a named speed")
                self._speed = speeds[value]
            else:
                self._speed = int(value)
                if self._speed < 0 or self._speed > 10:
                    self._speed = 0
            self._emit("speed")
        return self._speed
    def shape(self, name=None):
        if name:
            self._shape = str(name)
            self._emit()
        return self._shape
    def hideturtle(self):
        self._visible = False
        self._emit()
    ht = hideturtle
    def showturtle(self):
        self._visible = True
        self._emit()
    st = showturtle
    def isdown(self):
        return self._down
    def isvisible(self):
        return self._visible
    def circle(self, radius, extent=360, steps=None):
        radius, extent = float(radius), float(extent)
        count = max(1, int(steps or max(12, abs(extent) // 5)))
        step = extent / count
        center_x = self._x - radius * _ebook_math.sin(_ebook_math.radians(self._heading))
        center_y = self._y + radius * _ebook_math.cos(_ebook_math.radians(self._heading))
        start_angle = _ebook_math.atan2(self._y - center_y, self._x - center_x)
        for index in range(1, count + 1):
            angle = start_angle + _ebook_math.radians(step * index)
            self.goto(center_x + abs(radius) * _ebook_math.cos(angle),
                      center_y + abs(radius) * _ebook_math.sin(angle))
            self._heading = (self._heading + step) % 360
    def dot(self, size=5, *color):
        self._color = str(color[0] if color else self._color)
        ebook_turtle_bridge("dot", self._id, self._x, self._y, float(size), self._color)
    def write(self, text, move=False, align="left", font=("Arial", 8, "normal")):
        ebook_turtle_bridge("write", self._id, self._x, self._y, str(text),
                          self._color, str(align), int(font[1]))
    def clear(self):
        ebook_turtle_bridge("clear")
        self._emit()
    def reset(self):
        self.clear()
        self._x, self._y, self._heading = 0.0, 0.0, 90.0
        self._color, self._width = "black", 1.0
        self._down, self._visible = True, True
        self._emit()
    def stamp(self):
        self._emit("stamp")
    def begin_fill(self):
        return None
    def end_fill(self):
        return None

_ebook_screen = _EbookScreen()
_ebook_default_turtle = None
def _ebook_get_default_turtle():
    global _ebook_default_turtle
    if _ebook_default_turtle is None:
        _ebook_default_turtle = _EbookTurtle()
    return _ebook_default_turtle
_ebook_turtle_module = _ebook_types.ModuleType("turtle")
_ebook_turtle_module.Turtle = _EbookTurtle
_ebook_turtle_module.RawTurtle = _EbookTurtle
_ebook_turtle_module.Screen = lambda: _ebook_screen
_ebook_turtle_module.TurtleScreen = _EbookScreen
_ebook_turtle_module.__all__ = ["Turtle", "Screen", "forward", "backward", "back", "left",
    "right", "penup", "pendown", "goto", "color", "speed", "shape", "hideturtle",
    "showturtle", "circle", "write", "done", "mainloop"]
for _ebook_name in _ebook_turtle_module.__all__[2:-2]:
    setattr(_ebook_turtle_module, _ebook_name,
            lambda *args, _name=_ebook_name, **kwargs:
                getattr(_ebook_get_default_turtle(), _name)(*args, **kwargs))
_ebook_turtle_module.done = _ebook_screen.mainloop
_ebook_turtle_module.mainloop = _ebook_screen.mainloop
_ebook_sys.modules["turtle"] = _ebook_turtle_module
`);
}

function resetTurtleCanvas(canvas) {
    canvasStates.delete(canvas);
    canvas.width = 480;
    canvas.height = 260;
    const state = {
        width: 480, height: 260, background: 'white',
        strokes: [], turtles: new Map(), speeds: new Map()
    };
    canvasStates.set(canvas, state);
    paintTurtleCanvas(canvas, state);
}

function drawTurtleCommand(action, ...args) {
    if (!activeExample) return;
    const canvas = activeExample.querySelector('.turtle-canvas');
    turtleAnimationQueue = turtleAnimationQueue.then(() =>
        executeTurtleCommand(canvas, action, args));
}

function executeTurtleCommand(canvas, action, args) {
    let state = canvasStates.get(canvas);
    if (!state) {
        resetTurtleCanvas(canvas);
        state = canvasStates.get(canvas);
    }

    if (action === 'setup') {
        state.width = clampCanvasDimension(args[0], 480);
        state.height = clampCanvasDimension(args[1], 260);
        canvas.width = state.width;
        canvas.height = state.height;
    } else if (action === 'background') {
        state.background = normalizeCanvasColor(args[0]);
    } else if (action === 'message') {
        if (activeExample?.contains(canvas)) {
            activeExample.querySelector('.run-example-output').textContent += `${args[0]}\n`;
        }
    } else if (action === 'clear') {
        state.strokes = [];
        state.turtles.clear();
    } else if (action === 'speed') {
        state.speeds.set(Number(args[0]), Number(args[1]));
    } else if (action === 'move' || action === 'cursor' || action === 'stamp') {
        return animateTurtleCommand(canvas, state, action, args);
    } else if (action === 'dot') {
        const [id, x, y, size, color] = args;
        state.strokes.push({
            kind: 'dot', x: Number(x), y: Number(y),
            size: Number(size), color: normalizeCanvasColor(color)
        });
    } else if (action === 'write') {
        const [id, x, y, text, color, align, size] = args;
        state.strokes.push({
            kind: 'text', x: Number(x), y: Number(y), text: String(text),
            color: normalizeCanvasColor(color), align: String(align), size: Number(size)
        });
    }
    paintTurtleCanvas(canvas, state);
}

async function animateTurtleCommand(canvas, state, action, args) {
    const [id, x1, y1, x2, y2, heading, color, width, down, visible, shape, speed = 3] = args;
    const turtleId = Number(id);
    const previous = state.turtles.get(turtleId);
    const startX = action === 'move' ? Number(x1) : previous?.x ?? Number(x2);
    const startY = action === 'move' ? Number(y1) : previous?.y ?? Number(y2);
    const target = {
        x: Number(x2), y: Number(y2), heading: Number(heading),
        color: normalizeCanvasColor(color), width: Number(width),
        visible: Boolean(visible), shape: String(shape)
    };
    const turn = previous ? ((target.heading - previous.heading + 540) % 360) - 180 : 0;
    const distance = Math.hypot(target.x - startX, target.y - startY);
    const duration = Number(speed) === 0 ? 0 : Math.min(650,
        Math.max(distance ? 20 : 0, distance * (11 - Number(speed)) * 0.6,
            Math.abs(turn) * (11 - Number(speed)) * 0.7));
    let stroke = null;
    if (action === 'move' && down) {
        stroke = {
            kind: 'line', x1: startX, y1: startY,
            x2: startX, y2: startY,
            color: target.color, width: target.width
        };
        state.strokes.push(stroke);
    } else if (action === 'stamp') {
        state.strokes.push({ kind: 'stamp', ...target });
    }

    if (duration === 0) {
        state.turtles.set(turtleId, target);
        paintTurtleCanvas(canvas, state);
        return;
    }

    const started = performance.now();
    await new Promise((resolve) => {
        const frame = (now) => {
            const progress = Math.min(1, (now - started) / duration);
            const current = {
                ...target,
                x: startX + (target.x - startX) * progress,
                y: startY + (target.y - startY) * progress,
                heading: previous
                    ? previous.heading + turn * progress
                    : target.heading
            };
            state.turtles.set(turtleId, current);
            if (stroke) {
                stroke.x2 = current.x;
                stroke.y2 = current.y;
            }
            paintTurtleCanvas(canvas, state);
            if (progress < 1) setTimeout(() => frame(performance.now()), 16);
            else resolve();
        };
        setTimeout(() => frame(performance.now()), 16);
    });
}

function paintTurtleCanvas(canvas, state) {
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = state.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (const stroke of state.strokes) drawTurtleStroke(context, canvas, state, stroke);
    for (const turtle of state.turtles.values()) {
        if (turtle.visible) drawTurtleCursor(context, canvas, state, turtle);
    }
}

function drawTurtleStroke(context, canvas, state, stroke) {
    const point = (x, y) => [
        canvas.width / 2 + x * canvas.width / state.width,
        canvas.height / 2 - y * canvas.height / state.height
    ];
    if (stroke.kind === 'line') {
        const [x1, y1] = point(stroke.x1, stroke.y1);
        const [x2, y2] = point(stroke.x2, stroke.y2);
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = stroke.color;
        context.lineWidth = Math.max(1, stroke.width * canvas.width / state.width);
        context.stroke();
    } else if (stroke.kind === 'dot') {
        const [x, y] = point(stroke.x, stroke.y);
        context.beginPath();
        context.arc(x, y, Math.max(1, stroke.size * canvas.width / state.width / 2), 0, Math.PI * 2);
        context.fillStyle = stroke.color;
        context.fill();
    } else if (stroke.kind === 'text') {
        const [x, y] = point(stroke.x, stroke.y);
        context.fillStyle = stroke.color;
        context.textAlign = stroke.align;
        context.font = `${Math.max(8, stroke.size * canvas.width / state.width)}px sans-serif`;
        context.fillText(stroke.text, x, y);
    } else if (stroke.kind === 'stamp') {
        drawTurtleCursor(context, canvas, state, stroke);
    }
}

function drawTurtleCursor(context, canvas, state, turtle) {
    const x = canvas.width / 2 + turtle.x * canvas.width / state.width;
    const y = canvas.height / 2 - turtle.y * canvas.height / state.height;
    const angle = -turtle.heading * Math.PI / 180;
    const size = 7;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.beginPath();
    if (turtle.shape === 'turtle') {
        context.ellipse(0, 0, size, size * 0.7, 0, 0, Math.PI * 2);
    } else {
        context.moveTo(size, 0);
        context.lineTo(-size, size * 0.7);
        context.lineTo(-size, -size * 0.7);
        context.closePath();
    }
    context.fillStyle = turtle.color;
    context.fill();
    context.restore();
}

function clampCanvasDimension(value, fallback) {
    const dimension = Number(value);
    return Number.isFinite(dimension) ? Math.max(160, Math.min(900, dimension)) : fallback;
}

function normalizeCanvasColor(value) {
    const color = String(value);
    const rgb = color.match(/\(?\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)?/);
    if (!rgb) return color;
    return `rgb(${rgb.slice(1).map((channel) => Math.max(0, Math.min(255, Number(channel)))).join(', ')})`;
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'lesson';
}

function isSafeUrl(value) {
    try {
        return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
        return false;
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function escapeAttribute(value) {
    return escapeHtml(value);
}
