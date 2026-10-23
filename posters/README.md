# Posters

Each folder in here is one take on a poster for the Hear Me Out series. Same content, different design. The viewer at `../poster.html` pages through them.

Think of it like CSS Zen Garden, except you own your HTML too. The one rule: the speakers, dates, and titles come from the shared `../data.js`, not typed into your page. That way when a title gets filled in, every poster updates.

## Add yours

1. Copy the `starter` folder and rename the copy. Lowercase, hyphens, no spaces: `posters/maya-neon`, `posters/perry`, whatever.
2. Open your copy's `index.html` and `style.css` and make it yours. Change the markup, the type, the layout, the color, the order. Add images to your folder if you want them.
3. Keep reading the content from the data. The `data-series`, `data-talks`, and `data-field` attributes are how `poster.js` fills things in; `poster.js` explains each one at the top of the file. Or skip the helper and write your own JavaScript against `HEAR_ME_OUT.talks`.
4. Add one line to `manifest.js`, at the end of the list:
   ```
   { slug: "maya-neon", author: "Maya", title: "Neon" }
   ```
   The slug has to match your folder name exactly.
5. Check it: open `../poster.html` in a browser and page to yours. Also open your `index.html` directly to see it full size.
6. Branch, commit, push, PR. Same as any other issue. Paste a screenshot in the PR.

## Things to know

- Your poster loads inside an iframe in the viewer, so your CSS can't leak into anyone else's and theirs can't leak into yours.
- `poster.js` adds the class `past`, `next`, or `upcoming` to each stamped talk, and `data-next="speaker"` (etc.) fills from whichever talk is coming up. Use them or don't.
- Add `?today=2026-11-04` to the URL to pretend it's a different date while you design.
- If two people add to `manifest.js` at the same time, the second PR will have a merge conflict on that file. It's a one-line fix; we'll do it together in class.
- The `starter` folder stays as it is. Copy it, don't edit it.
