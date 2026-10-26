# Hear Me Out

A small, deliberately unfinished website showing the IXD 415 "Hear Me Out" presentation schedule. It exists so the class can practice the GitHub workflow: pick an issue, make a branch, open a pull request, review it together.

Live site: https://mattkirkland.github.io/ixd415-hearmeout/

## What's in here

- `index.html` - the schedule page
- `howto.html` - how to work an issue (same steps as below, for the class)
- `style.css` - styles (there aren't many yet)
- `script.js` - page scripts (there's almost nothing here yet)
- `data.js` - the schedule as data, shared by all the posters
- `poster.html` - viewer that pages through the poster variants
- `posters/` - one folder per poster variant, plus the helper and the list of variants (see `posters/README.md`)

No build step, no dependencies. Open `index.html` in a browser and it works.

## How to work on an issue

1. Look at the [Issues](../../issues) tab and pick one. Leave a comment saying you're taking it so two people don't do the same one.
2. Clone the repo if you haven't already:
   ```
   git clone https://github.com/mattkirkland/ixd415-hearmeout.git
   cd ixd415-hearmeout
   ```
3. Make a branch named for the issue:
   ```
   git checkout -b issue-16-dark-mode
   ```
4. Make your change. Open `index.html` in a browser to check it.
5. Commit and push your branch:
   ```
   git add .
   git commit -m "Add dark mode (closes #16)"
   git push -u origin issue-16-dark-mode
   ```
6. Open a pull request on GitHub. In the description, say which issue it closes and anything the reviewer should look at.
7. We'll review PRs together in class. Once merged, the live site updates in a minute or two.

## Ground rules

- One issue per branch, one branch per pull request.
- Don't commit directly to `main`.
- Keep it plain JavaScript and CSS. No frameworks, no build tools.
- If you're not sure what an issue means, ask in the issue comments.
