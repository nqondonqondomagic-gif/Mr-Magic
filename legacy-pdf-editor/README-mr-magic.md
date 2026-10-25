# Mr Magic

*A non-destructive PDF editor you run from your own browser.*

Mr Magic is a non-destructive PDF mark-up tool that runs entirely in your browser, from a folder
on your own computer. Open a PDF, place a floating layer of corrections over it, and export a **new**
file with those corrections applied. The document you open is only ever read into memory —
it is never written to.

Built for the practical case where a PDF refuses to cooperate: fee statements, judgment
annexures, credit-bureau listings, paid-up letters and scanned attachments where the text
is not selectable and there is nothing to click on.

---

## Two ways to start it

**1. Double-click `index.html`** (Chrome, Edge or Safari).
Everything works. The one exception: the first time you run OCR in a browser session it
downloads the English language model, so that single step needs an internet connection.

**2. Double-click `Start PDF Editor.command`** (macOS) — fully offline.
This starts a tiny web server bound to `127.0.0.1` only and opens the tool in your browser.
Nothing is uploaded or reachable from outside your machine; keep the Terminal window open
while working and press <kbd>Ctrl</kbd>-C when finished. In this mode the OCR engine and its
model are loaded from the `libs/` folder, so no internet is needed at all.

If macOS blocks the launcher with a security warning, right-click it → **Open** → **Open**,
once. If you would rather type one line, from inside this folder run
`python3 -m http.server 8642 --bind 127.0.0.1` and visit `http://127.0.0.1:8642/index.html`.

---

## How the editing model works

| Step | What it does |
|---|---|
| **Open PDF** | Reads bytes into memory. Computes a SHA-256 fingerprint of the file. |
| **Edit** | Every change is an object in a layer above the page — visible, selectable, movable, hideable. |
| **Save project** | Downloads `<name>.pdflayer.json`: your edits plus a record of the source file (name, size, real creation date, hash). Reopen the same PDF, load the project, and continue. |
| **Export copy** | Writes `<name>-edited.pdf` — a new file with the layer applied. Your original is unchanged. |

Because the layer is separate, the same edits can be re-exported after further changes,
and you can always press the **Show/Hide** eye in the tool rail to see the untouched
original underneath.

## Tools

- **Text** — click anywhere, or click a recognised word, and type. Placed at the word's
  baseline and size.
- **Strike** — the workhorse for scans. With OCR on, click a printed word: it is crossed out
  exactly, and a replacement box appears already matched to the word's width and line height.
  Without OCR, drag a box over anything to cross it out.
- **Cover** — an opaque block for ID numbers, account numbers, amounts.
- **Highlight**, **Box** — mark without hiding.
- **Pen**, **Line**, **Arrow** — freehand marking and pointers to a correction.
- **Pan** — scroll without accidentally moving anything.

Shortcuts: <kbd>V</kbd> select · <kbd>H</kbd> pan · <kbd>T</kbd> text · <kbd>K</kbd> strike ·
<kbd>C</kbd> cover · <kbd>Y</kbd> highlight · <kbd>P</kbd> pen · <kbd>L</kbd> line ·
<kbd>A</kbd> arrow · <kbd>B</kbd> box · <kbd>D</kbd> show/hide layer · <kbd>F</kbd> fit width ·
<kbd>Del</kbd> delete · arrows nudge 1 pt (<kbd>Shift</kbd> = 10) ·
<kbd>Ctrl/⌘ S</kbd> save project · <kbd>Ctrl/⌘ E</kbd> export · <kbd>Esc</kbd> deselect.

## Working on scans where text is not exposed

1. Open the document, go to the page, press **OCR this page** (or **OCR all** for a batch).
2. Pick **Strike** or **Text**. Words now outline in blue as you hover.
3. Click a word. The editor uses the recognised bounding box: position, line baseline, height
   and (for replacements) the exact printed width, so your text lands on the line instead of
   looking pasted on.
4. Type. Press <kbd>Esc</kbd> to commit, or keep editing in the Properties panel.

Recognition is done by Tesseract inside your browser at 2.4× the page size. Printed text
reads well; handwriting and bad photocopies do not, and it will make mistakes on
figures. Always proofread — the edit list on the left is your checklist of what changed.

## What the exported file says about itself

The export is a new document, so it is dated when it was actually made, and it records
where it came from:

- `Title` — `<file> — edited`
- `Creator` — `Mr Magic 1.0 — derived from <source name> (SHA-256 <hash>)`
- `Subject` — page count and how many layer objects were applied
- `Keywords` — `mr-magic derived-copy source-sha256:<hash>`
- `Producer` — `pdf-lib`, the library that wrote the file (it stamps this itself)

The **Provenance** button shows everything read from your original: its recorded creation
and modification dates, producer, size, and fingerprint.

This tool deliberately does not copy, inherit or backdate the original's timestamps, and it
does not hide the fact that a copy was produced. An edited document that pretends to be an
untouched original is the one outcome that turns a legitimate correction into a forgery, and
that applies most to the documents you handle — judgments, credit listings, finance
agreements. For those, the correction that actually holds up is an amended original from the
issuer; use this editor to mark precisely what is wrong, to annotate statements, or to fix
your own templates and outgoing letters.

## Troubleshooting

- **"Could not open this PDF"** — it is probably password/permissions protected. Clear the
  password in a PDF reader first.
- **OCR alert about the network** — you opened `index.html` directly and have no connection,
  or the model is still downloading. Use the launcher for offline OCR.
- **Slow page rendering when zooming** — under `file://` the browser cannot use a background
  worker, so pages render on the main thread. The launcher mode is faster on long documents.
- **Edits exported as `?`** — the built-in PDF fonts cover Latin-1 only. Curly quotes and
  dashes are converted automatically; other scripts (emoji, Arabic, Chinese) are not.
- **Edits in the wrong place after loading a project** — the project was saved against a
  different file. The editor warns you by comparing size and SHA-256; check you opened the
  right document.

## Verifying your install

Open `selftest.html` next to `index.html` in the same way (it checks Mr Magic end to end). It builds a two-page sample
document, drives the real editor, and checks opening, every tool, project round-trip, export
and offline OCR. When it works you will see `PASS` in the tab title and a list of checks at
the bottom of the page.

## Contents

    index.html                     the editor
    app.js                         logic (no framework, no build step)
    Start PDF Editor.command       optional offline launcher (macOS)
    selftest.html                  optional end-to-end self check
    libs/                          pdf.js, pdf-lib, Tesseract.js, OCR model — all local

Everything is open-source licensed (Apache 2.0 / MIT), bundled locally. No document, image or
text ever leaves your machine: there is no network call in the app other than the optional
CDN fetch of the OCR model when running under `file://`.
