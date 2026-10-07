const starterCode = `# Write or paste Python code here
name = input("What is your name? ")
print(f"Hello, {name}!")
`;

const outputElement = document.getElementById('program-output');
const runButton = document.getElementById('run-button');
const statusElement = document.getElementById('runtime-status');
const terminal = document.getElementById('terminal');
const terminalInputForm = document.getElementById('terminal-input-form');
const terminalPrompt = document.getElementById('terminal-prompt');
const terminalInput = document.getElementById('terminal-input');
let editor;
let pyodide;
let pendingInput;

window.addEventListener('DOMContentLoaded', () => {
    editor = CodeMirror(document.getElementById('code-editor'), {
        value: starterCode,
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

    runButton.addEventListener('click', runCode);
    terminalInputForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingInput) return;

        const value = terminalInput.value;
        appendOutput(`${value}\n`);
        terminalInputForm.hidden = true;
        terminalInput.value = '';
        const resolve = pendingInput;
        pendingInput = null;
        resolve(value);
    });

    Promise.resolve()
        .then(() => loadPyodide())
        .then((runtime) => {
            pyodide = runtime;
            pyodide.setStdout({ batched: appendOutput });
            pyodide.setStderr({ batched: appendOutput });
            pyodide.globals.set('__ide_input_js', requestTerminalInput);
            pyodide.runPython(`
async def __ide_input(prompt=""):
    return await __ide_input_js(prompt)
`);
            statusElement.textContent = 'Python is ready';
            runButton.disabled = false;
        })
        .catch((error) => {
            statusElement.textContent = 'Python could not be loaded';
            outputElement.classList.add('error');
            outputElement.textContent = `Unable to load the Python runtime: ${error.message}`;
        });
});

async function runCode() {
    if (!pyodide || !editor) return;

    runButton.disabled = true;
    statusElement.textContent = 'Running…';
    outputElement.classList.remove('error');
    outputElement.textContent = '';

    try {
        await pyodide.runPythonAsync(rewriteInputCalls(editor.getValue()));
        if (!outputElement.textContent) outputElement.textContent = '(No output)';
    } catch (error) {
        outputElement.classList.add('error');
        appendOutput(`${outputElement.textContent ? '\n' : ''}${error}`);
    } finally {
        statusElement.textContent = 'Python is ready';
        runButton.disabled = false;
    }
}

function appendOutput(text) {
    outputElement.textContent += text;
    terminal.scrollTop = terminal.scrollHeight;
}

function requestTerminalInput(prompt) {
    appendOutput(String(prompt));
    terminalPrompt.textContent = '';
    terminalInputForm.hidden = false;
    terminalInput.focus();
    terminal.scrollTop = terminal.scrollHeight;
    return new Promise((resolve) => {
        pendingInput = resolve;
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
            const tripleQuoted = code.slice(index, index + 3) === character.repeat(3);
            const delimiter = character.repeat(tripleQuoted ? 3 : 1);
            let end = index + delimiter.length;

            while (end < code.length) {
                if (code[end] === '\\') {
                    end += 2;
                } else if (code.slice(end, end + delimiter.length) === delimiter) {
                    end += delimiter.length;
                    break;
                } else {
                    end++;
                }
            }

            rewritten += code.slice(index, end);
            index = end;
            continue;
        }

        if (/[A-Za-z_]/.test(character)) {
            const identifierStart = index;
            index++;
            while (index < code.length && /[A-Za-z0-9_]/.test(code[index])) index++;
            const identifier = code.slice(identifierStart, index);
            let next = index;
            while (/\s/.test(code[next] || '') && next < code.length) next++;

            const previous = code[identifierStart - 1] || '';
            if (identifier === 'input' && previous !== '.' && code[next] === '(') {
                rewritten += 'await __ide_input';
            } else {
                rewritten += identifier;
            }
            continue;
        }

        rewritten += character;
        index++;
    }

    return rewritten;
}
