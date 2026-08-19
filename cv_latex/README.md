# Vico Aritonang — CV (LaTeX)

Professional, **ATS-friendly** single-column CV.

## Files
- `vico_aritonang_cv.tex` — the CV source.
- `vico_aritonang_cv.pdf` — the rendered output (generated).

## How to render

### Option A — Locally (MiKTeX, already installed on this machine)
```bash
pdflatex vico_aritonang_cv.tex
```
Run it twice for correct spacing. Requires the packages `geometry`, `lmodern`,
`enumitem`, `titlesec`, `xcolor`, `hyperref` (MiKTeX auto-installs them on first run).

### Option B — Overleaf (no install)
Upload `vico_aritonang_cv.tex` to a new Overleaf project, set the compiler to
**pdfLaTeX**, and click Recompile.

## ATS notes
- Single column, standard fonts, real selectable text, no images or text boxes —
  parses cleanly in applicant-tracking systems.
- Keep it to 1–2 pages. All content is factual and sourced from LinkedIn, GitHub,
  and the live portfolio (vicoworks.com).

## To update content
Edit the section blocks in `vico_aritonang_cv.tex`. Each role/project uses:
```latex
\entry{Title}{Date}{Subtitle}{Location}
\begin{itemize} \item ... \end{itemize}
```
