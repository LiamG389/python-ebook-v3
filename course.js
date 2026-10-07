const contentElement = document.getElementById('course-content');
const navElement = document.getElementById('course-nav');
const pageLayout = document.querySelector('.page-layout');
const sidebarToggle = document.getElementById('sidebar-toggle');

const savedEditorValues = new Map();
const hiddenRunnableCode = new Map();
let courseToc = [];
let lessons = [];
let editors = [];
let pyodide;
let runtimePromise;
let activeExample;
let pendingInput;
let isRunning = false;
let canvasStates = new WeakMap();

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
                blocks.push(renderCodeBlock(codeLines.join('\n'), codeLanguage, runnableBlocks));
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

        const fence = trimmed.match(/^```([\w.-]*)/);
        if (fence) {
            flushTextBlocks();
            inFence = true;
            codeLanguage = fence[1];
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

    if (inFence) blocks.push(renderCodeBlock(codeLines.join('\n'), codeLanguage, runnableBlocks));
    flushTextBlocks();
    return blocks.map((block) => {
        const runnable = block.match(/^<!--RUNNABLE:(\d+)-->$/);
        return runnable
            ? createRunnableExample(runnableBlocks[Number(runnable[1])], Number(runnable[1]))
            : block;
    }).join('\n');
}

function renderCodeBlock(code, language, runnableBlocks) {
    if (language === 'python.run' || language === 'python.run.hidden') {
        const index = runnableBlocks.push({
            code,
            hidden: language === 'python.run.hidden'
        }) - 1;
        return `<!--RUNNABLE:${index}-->`;
    }
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
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
    const { code, hidden } = exampleCode;
    if (hidden) hiddenRunnableCode.set(editorId, code);
    const initialCode = savedEditorValues.get(editorId) ?? code;
    const editor = hidden ? '' : `
                <div class="run-example-editor">
                    <textarea class="run-example-code" aria-label="Python code example">${escapeHtml(initialCode)}</textarea>
                </div>`;
    return `
        <section class="run-example${hidden ? ' run-example-hidden' : ''}" aria-label="${hidden ? 'Interactive Python activity' : 'Runnable Python example'}" data-example-id="${editorId}">
            <div class="run-example-header">
                <span>${hidden ? 'Interactive Python' : 'Python'}</span>
                <span class="run-example-status" role="status">Ready</span>
                <button class="run-example-button" type="button">▶ Run</button>
            </div>
            <div class="run-example-workspace">
                ${editor}
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
    window.scrollTo({ top: 0, behavior: 'instant' });
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
    editors = [];
    contentElement.querySelectorAll('.run-example-hidden .run-example-button').forEach((button) => {
        button.addEventListener('click', () => runExample(button.closest('.run-example'), null));
    });

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
    const turtleEnabled = /\b(?:import\s+turtle|from\s+turtle\s+import)\b/.test(code);

    document.querySelectorAll('.run-example-button').forEach((button) => {
        button.disabled = true;
    });
    status.textContent = 'Loading Python…';
    output.classList.remove('error');
    output.textContent = '';
    example.querySelector('.run-example-input-form').hidden = true;
    canvas.hidden = !turtleEnabled;
    resetTurtleCanvas(canvas);

    try {
        pyodide = await getPyodide();
        if (turtleEnabled) installTurtleModule();
        pyodide.setStdout({ batched: appendConsoleOutput });
        pyodide.setStderr({ batched: appendConsoleOutput });
        status.textContent = 'Running…';
        await pyodide.runPythonAsync(rewriteInputCalls(code));
        if (!output.textContent) output.textContent = '(No output)';
    } catch (error) {
        output.classList.add('error');
        appendConsoleOutput(`${output.textContent ? '\n' : ''}${error}`);
    } finally {
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

function requestConsoleInput(prompt) {
    if (!activeExample) return Promise.reject(new Error('No active program console.'));

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
        self._shape = "classic"
        self._emit("cursor")
    def _emit(self, action="cursor", x1=None, y1=None):
        ebook_turtle_bridge(action, self._id, self._x if x1 is None else x1,
                          self._y if y1 is None else y1, self._x, self._y,
                          self._heading, self._color, self._width,
                          self._down, self._visible, self._shape)
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
    def speed(self, *args):
        return None
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
_ebook_default_turtle = _EbookTurtle()
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
                getattr(_ebook_default_turtle, _name)(*args, **kwargs))
_ebook_turtle_module.done = _ebook_screen.mainloop
_ebook_turtle_module.mainloop = _ebook_screen.mainloop
_ebook_sys.modules["turtle"] = _ebook_turtle_module
`);
}

function resetTurtleCanvas(canvas) {
    canvasStates.delete(canvas);
    canvas.width = 480;
    canvas.height = 260;
    const state = { width: 480, height: 260, background: 'white', strokes: [], turtles: new Map() };
    canvasStates.set(canvas, state);
    paintTurtleCanvas(canvas, state);
}

function drawTurtleCommand(action, ...args) {
    if (!activeExample) return;
    const canvas = activeExample.querySelector('.turtle-canvas');
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
        activeExample.querySelector('.run-example-output').textContent += `${args[0]}\n`;
    } else if (action === 'clear') {
        state.strokes = [];
        state.turtles.clear();
    } else if (action === 'move' || action === 'cursor' || action === 'stamp') {
        const [id, x1, y1, x2, y2, heading, color, width, down, visible, shape] = args;
        const turtle = {
            x: Number(x2), y: Number(y2), heading: Number(heading),
            color: normalizeCanvasColor(color), width: Number(width),
            visible: Boolean(visible), shape: String(shape)
        };
        if (action === 'move' && down) {
            state.strokes.push({
                kind: 'line', x1: Number(x1), y1: Number(y1),
                x2: Number(x2), y2: Number(y2),
                color: turtle.color, width: turtle.width
            });
        } else if (action === 'stamp') {
            state.strokes.push({ kind: 'stamp', ...turtle });
        }
        state.turtles.set(Number(id), turtle);
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
