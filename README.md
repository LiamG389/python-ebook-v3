# Python Course

This folder contains a small, static online version of the course. Each item in [`course-toc.json`](./course-toc.json), in document order, gets its own lesson page with navigation above and below the lesson. The sidebar and the contents page use only those table-of-contents entries.

Edit [`course.md`](./course.md) to change lesson text and runnable examples. Match its headings to `course-toc.json`; add a table-of-contents entry there when you add a new lesson. Fenced Python code marked `python.run` becomes an editable CodeMirror example with a Run button and console.

## Preview locally

From this folder, start a local web server:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The course uses CodeMirror and Pyodide from their public CDNs, so an internet connection is needed for the editor and Python runtime.

## Add or edit lessons

Edit lesson text in `course.md`. For example:

````markdown
## A new topic
Write the lesson text here. Use `###` for a subsection.

```python.run
print("Try changing this example!")
```
````

Use `python.run.hidden` instead of `python.run` when you want a play-only activity with no visible code editor:

````markdown
```python.run.hidden
name = input("What is your name? ")
print(f"Hello, {name}!")
```
````

Learners can run the activity and respond to `input()` prompts in the console. This hides the code from the lesson interface; because the course runs in the browser, it cannot prevent someone from inspecting the downloaded `course.md` or JavaScript.

To start a project with extra editable files, add `file:filename.txt` or `file:module.py` fences directly before its runnable code block. Each file fence is attached to the next runnable example:

````markdown
```file:words.txt
python
hangman
```
```python.run.hidden
with open("words.txt") as word_file:
    words = word_file.read().splitlines()
print(words)
```
````

Project examples have tabs for `main.py` and the attached files. Use **+ File** to add more `.py` or `.txt` files; programs can read and import them when run. In hidden activities, the source `main.py` remains hidden while attached data files stay editable.

Add auto-graded multiple-choice and fill-in-the-blank quizzes with short fenced blocks:

````markdown
```quiz.mc
Which function displays text in Python?
- input()
- print()
- open()
Answer: print()
Feedback: It writes text to the console.
Reference:
~~~python
print("Hello, world!")
~~~
```

```quiz.blank
The Python function that displays text is {{blank}}.
Answer: print | print()
```

Add another `{{blank}}` and another `Answer:` line for each additional field:

```quiz.blank
The range() function starts at {{blank}} and stops before {{blank}}.
Answer: zero | 0
Answer: the stop value | stop
```

Use `quiz.code` for a multi-line code completion:

```quiz.code
Prompt: Complete the function body.
Code:
def greet(name):
    {{blank}}
    {{blank}}
Answer:
if name:
---
    print("Hello, " + name)
Feedback: Use --- on a line of its own to separate the expected code for each blank.
```
````

Any quiz question can include an optional reference code block by adding `Reference:` followed by a `~~~` fence, optionally with a language name (for example, `~~~python`), and a closing `~~~` fence. Put the reference after the question's answer and feedback. It is displayed with that question but does not affect grading. Multiple choice options start with `- `; the `Answer:` must match an option. Fill-in-the-blank questions can have one or more `{{blank}}` placeholders. Add one `Answer:` line per placeholder, in order; separate acceptable answers for a blank with `|`. Answers are matched case-insensitively after trimming whitespace, and each blank previews its input as the learner types. `Feedback:` is optional and shown after each check. These quizzes are graded in the browser and are not secure assessments.

For `quiz.code`, write a `Prompt:`, a `Code:` section with one or more lines containing `{{blank}}`, and an `Answer:` section with one replacement block per blank. Separate answer blocks with a line containing only `---`. Each blank is editable independently and can contain multiple lines. The blank line's indentation is shown in the editable code area; write answers without that outer indentation. Code answers are case-sensitive, preserve indentation and internal blank lines, and ignore trailing whitespace and extra blank lines at the ends. All blanks must be filled correctly to pass.

For a multi-question quiz with a next button and a final score, use `quiz.multi`:

````markdown
```quiz.multi
Question: Which function displays text?
- input()
- print()
- open()
Answer: print()
Reference:
~~~python
print("Hello, world!")
~~~

Question: The function that reads user input is {{blank}}.
Answer: input | input()

Question: Which are valid built-in functions? (Select all that apply.)
Type: multi-select
- print()
- input()
- definitely_not_a_function()
Answer: print() | input()

Question: Fill in the code to print a message three times.
Code:
for x in range({{blank}}):
    {{blank}}({{blank}})
Answer: 3
---
print
---
"Hello!"
Feedback: The loop repeats three times and print() displays the message.
```
````

Start each item with `Question:`. Add `- ` options for single-choice, include one or more `{{blank}}` placeholders for short fill-ins, or add `Code:` followed by a multi-line code template containing `{{blank}}` placeholders. Inline code blanks have a single-line field; a placeholder on a line by itself provides a multi-line code field. For code completion, provide one answer block per placeholder after `Answer:`; separate subsequent answer blocks with a line containing only `---`. A block can contain multiple lines. For short fill-ins, provide one `Answer:` line per blank in order, separating acceptable answers with `|`. Any quiz question can also include a reference code block using `Reference:` followed by a `~~~` fenced block; this appears with that question but does not affect grading. For checkboxes, add `Type: multi-select` and separate all correct options on the `Answer:` line with `|`. Multi-select is all-or-nothing: all correct options and no incorrect options must be selected. Each item needs the required `Answer:` line(s); optional `Feedback:` appears after each response. Both question order and multiple-choice options are shuffled automatically each time the quiz starts. Learners check each answer, advance with the next button, then see a final `You got x/y correct` score.

Add the lesson to `course-toc.json` in its intended reading order as well:

```json
{ "title": "A new topic", "level": 1 }
```

Use level `0` for a chapter, `1` for a lesson, and higher values for nested sections. Ordinary triple-backtick blocks are displayed as read-only code examples. Runnable blocks execute in the browser; `input()` prompts appear in the console. Turtle examples that import `turtle` use the built-in browser drawing canvas. Drawing and turning animate according to `speed()`; speed `0` draws immediately. Core movement, turns, pen controls, color, screen background, shapes, circles, and text are supported; image assets are not available in the browser preview.

To customize an external iframe link label, put an `embed-label` comment directly above its iframe in `course.md`:

```markdown
<!-- embed-label: Try the calculator in Trinket -->
<iframe src="https://example.com/embed"></iframe>
```

The label applies to that iframe only. Without it, the standard link label is used.

No build step or framework is needed. Existing lessons marked incomplete or unfinished at the end of the source are intentionally left unfinished.
