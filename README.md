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

Add the lesson to `course-toc.json` in its intended reading order as well:

```json
{ "title": "A new topic", "level": 1 }
```

Use level `0` for a chapter, `1` for a lesson, and higher values for nested sections. Ordinary triple-backtick blocks are displayed as read-only code examples. Runnable blocks execute in the browser; `input()` prompts appear in the console. Turtle examples that import `turtle` use the built-in browser drawing canvas. Core movement, turns, pen controls, color, screen background, shapes, circles, and text are supported; image assets are not available in the browser preview.

To customize an external iframe link label, put an `embed-label` comment directly above its iframe in `course.md`:

```markdown
<!-- embed-label: Try the calculator in Trinket -->
<iframe src="https://example.com/embed"></iframe>
```

The label applies to that iframe only. Without it, the standard link label is used.

No build step or framework is needed. Existing lessons marked incomplete or unfinished at the end of the source are intentionally left unfinished.
