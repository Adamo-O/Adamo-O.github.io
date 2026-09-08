# Adamo Orsini CV

This directory contains the editable LaTeX source for the CV published at
`public/files/Adamo_Orsini_CV.pdf`.

## Build

The document uses Awesome CV and XeLaTeX:

```sh
latexmk -xelatex -interaction=nonstopmode -halt-on-error cv.tex
```

With TinyTeX installed outside the shell path on macOS:

```sh
env PATH="/Users/adamo/Library/TinyTeX/bin/universal-darwin:/usr/bin:/bin:/usr/sbin:/sbin" \
  /Users/adamo/Library/TinyTeX/bin/universal-darwin/latexmk \
  -xelatex -interaction=nonstopmode -halt-on-error cv.tex
```

The source was exported from the Overleaf project `Adamo CV 2025` on
September 8, 2026. The included Awesome CV template is licensed under
CC BY-SA 4.0.
