# Repository security controls

The repository checks tracked files for obvious credential patterns in `ai-check.yml`, runs CodeQL for JavaScript/TypeScript, and uses Dependabot for npm and GitHub Actions updates. The repository owner should enable GitHub secret scanning and push protection in repository **Settings → Code security and analysis** when those features are available for this repository. The relay never stores provider credentials in Git.
