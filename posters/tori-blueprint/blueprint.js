// Tori / Blueprint — construction layer.
//
// Draws on one SVG whose coordinates are in cqw (the poster is 100 x 133.33),
// so every line scales with the sheet. Guide lines for the two numerals are
// measured from the rendered glyphs, so they stay right whatever the week
// number is.

(function () {
  var poster = document.querySelector('.poster');
  var svg = poster.querySelector('.construction');
  var NS = 'http://www.w3.org/2000/svg';
  var H = 133.333;

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    svg.appendChild(n);
    return n;
  }
  function line(x1, y1, x2, y2, cls) {
    return el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': cls || 'ln' });
  }
  // open arrowhead at (x, y) pointing in direction (dx, dy)
  function head(x, y, dx, dy, s) {
    s = s || 0.7;
    var len = Math.sqrt(dx * dx + dy * dy); dx /= len; dy /= len;
    var px = -dy, py = dx;
    el('polyline', {
      points: [
        (x - dx * s + px * s * 0.55) + ',' + (y - dy * s + py * s * 0.55),
        x + ',' + y,
        (x - dx * s - px * s * 0.55) + ',' + (y - dy * s - py * s * 0.55)
      ].join(' '),
      'class': 'ln'
    });
  }
  function arrow(x1, y1, x2, y2, both, s) {
    line(x1, y1, x2, y2);
    head(x2, y2, x2 - x1, y2 - y1, s);
    if (both) head(x1, y1, x1 - x2, y1 - y2, s);
  }
  function square(x, y) {
    var s = 0.85;
    el('rect', { x: x - s / 2, y: y - s / 2, width: s, height: s, 'class': 'anchor' });
  }

  // hatched arrow block: a fan of diagonals, then rows of arrows
  function hatch(x0, y0, x1, y1, fan) {
    var gap = 1.25;
    var yStart = y0;
    if (fan) {
      var rise = (x1 - x0) * 0.9;
      for (var i = 0; i * gap < fan; i++) {
        var yb = y0 + rise + i * gap;
        arrow(x0, yb, x1, yb - rise, false, 0.55);
      }
      yStart = y0 + rise + fan;
    }
    for (var y = yStart; y <= y1; y += gap) arrow(x0, y, x1, y, false, 0.55);
  }

  // how far a text element's first letter sits right of its box edge, as a
  // negative cqw shift that puts the ink exactly on a guide
  function inkOffsetCqw(node) {
    node.style.left = '0px';
    var b = inkBox(node);
    return -b.x0;
  }

  // ink box of a text element, in cqw
  var measure = document.createElement('canvas').getContext('2d');
  function inkBox(node) {
    var unit = poster.clientWidth / 100;
    var base = poster.getBoundingClientRect();
    var r = node.getBoundingClientRect();
    var cs = getComputedStyle(node);
    // canvas font shorthand can't take a % width, so set it separately
    measure.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var pct = parseFloat(cs.fontStretch) || 100;
    var names = [[62.5, 'extra-condensed'], [75, 'condensed'], [87.5, 'semi-condensed'], [100, 'normal']];
    var pick = 'normal', best = 999;
    names.forEach(function (n) { if (Math.abs(n[0] - pct) < best) { best = Math.abs(n[0] - pct); pick = n[1]; } });
    if ('fontStretch' in measure) measure.fontStretch = pick;
    measure.letterSpacing = cs.letterSpacing;
    var m = measure.measureText(node.textContent);
    // baseline position inside the line box
    var probe = document.createElement('span');
    probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    node.appendChild(probe);
    var baseline = probe.getBoundingClientRect().top;
    node.removeChild(probe);
    return {
      x0: (r.left - base.left - m.actualBoundingBoxLeft) / unit,
      x1: (r.left - base.left + m.actualBoundingBoxRight) / unit,
      top: (baseline - base.top - m.actualBoundingBoxAscent) / unit,
      base: (baseline - base.top) / unit
    };
  }

  // split the heading into words so each sits on its own line with guides
  var title = poster.querySelector('.title');
  if (title && !title.querySelector('.word')) {
    var words = title.textContent.trim().split(/\s+/);
    title.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'word';
      s.textContent = w;
      title.appendChild(s);
      if (i < words.length - 1) title.appendChild(document.createTextNode(' '));
    });
  }

  // shrink the next presenter's name until it fits its column
  function fitName() {
    var name = poster.querySelector('.next-speaker');
    if (!name) return;
    name.style.fontSize = '';
    var box = name.parentElement.clientWidth;
    var size = parseFloat(getComputedStyle(name).fontSize);
    while (name.scrollWidth > box && size > 10) {
      size -= 1;
      name.style.fontSize = size + 'px';
    }
  }

  // a small section drawing: a circular part in plan, with centre marks,
  // a radius callout, and dimension lines; fits the box (x0,y0)-(x1,y1)
  function drawSection(x0, y0, x1, y1) {
    var w = x1 - x0, h = y1 - y0;
    if (w < 8 || h < 8) return;
    // the drawing's full height: centre-line overshoot on top (1.25r) down to
    // the width dimension's extension lines (r + 3.3). Centre that in the box.
    var r = Math.min((w - 3.5) / 2, (h - 8 - 3.3) / 2.25);
    var total = 2.25 * r + 3.3;
    var cx = x0 + r, cy = y0 + (h - total) / 2 + 1.25 * r;
    el('circle', { cx: cx, cy: cy, r: r, 'class': 'ln' });
    el('circle', { cx: cx, cy: cy, r: r * 0.78, 'class': 'ln faint', 'stroke-dasharray': '0.6 0.6' });
    el('circle', { cx: cx, cy: cy, r: r * 0.5, 'class': 'ln' });
    el('circle', { cx: cx, cy: cy, r: r * 0.16, 'class': 'ln' });
    // centre lines, overshooting the part
    line(cx - r * 1.25, cy, cx + r * 1.25, cy, 'ln faint');
    line(cx, cy - r * 1.25, cx, cy + r * 1.25, 'ln faint');
    // bolt circle: 6 holes
    for (var k = 0; k < 6; k++) {
      var a = k * Math.PI / 3 + Math.PI / 6;
      el('circle', { cx: cx + Math.cos(a) * r * 0.64, cy: cy + Math.sin(a) * r * 0.64, r: r * 0.05, 'class': 'ln' });
    }
    // radius callout at 45deg out to the right
    var ex = cx + r * 0.707, ey = cy - r * 0.707;
    line(cx, cy, ex, ey);
    head(ex, ey, ex - cx, ey - cy, 0.6);
    line(ex, ey, x1, ey, 'ln faint');
    square(x1, ey);
    // overall width dimension below, on the bottom edge of the box
    var dy = cy + r + 2.5;
    arrow(cx - r, dy, cx + r, dy, true, 0.6);
    line(cx - r, cy, cx - r, dy + 0.8, 'ln faint');
    line(cx + r, cy, cx + r, dy + 0.8, 'ln faint');
    // height dimension at the right
    var dx = x1 - 0.5;
    arrow(dx, cy - r, dx, cy + r, true, 0.6);
    line(cx, cy - r, dx + 0.6, cy - r, 'ln faint');
    line(cx, cy + r, dx + 0.6, cy + r, 'ln faint');
    square(cx, cy);
  }

  // a plotted signal: axes, ticks, and a decaying wave; fits the box
  function drawWave(x0, y0, x1, y1) {
    var w = x1 - x0, h = y1 - y0, mid = y0 + h / 2;
    line(x0, y0, x0, y1, 'ln faint');
    arrow(x0, mid, x1, mid, false, 0.6);
    for (var t = 0; t <= 10; t++) {
      var tx = x0 + (w - 1.5) * t / 10;
      line(tx, mid - (t % 5 === 0 ? 0.9 : 0.45), tx, mid + (t % 5 === 0 ? 0.9 : 0.45), 'ln');
    }
    var pts = [];
    for (var i = 0; i <= 160; i++) {
      var u = i / 160;
      var x = x0 + u * (w - 2);
      var y = mid - Math.sin(u * Math.PI * 9) * (h * 0.42) * Math.exp(-u * 2.4);
      pts.push(x.toFixed(2) + ',' + y.toFixed(2));
    }
    el('polyline', { points: pts.join(' '), 'class': 'ln' });
    // envelope
    var env = [], env2 = [];
    for (var j2 = 0; j2 <= 40; j2++) {
      var u2 = j2 / 40, x2 = x0 + u2 * (w - 2), a2 = (h * 0.42) * Math.exp(-u2 * 2.4);
      env.push(x2.toFixed(2) + ',' + (mid - a2).toFixed(2));
      env2.push(x2.toFixed(2) + ',' + (mid + a2).toFixed(2));
    }
    el('polyline', { points: env.join(' '), 'class': 'ln faint', 'stroke-dasharray': '0.6 0.6' });
    el('polyline', { points: env2.join(' '), 'class': 'ln faint', 'stroke-dasharray': '0.6 0.6' });
    square(x0, mid - h * 0.42);
    square(x0, mid + h * 0.42);
  }

  function draw() {
    fitName();
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (getComputedStyle(svg).display === 'none') return;
    svg.setAttribute('viewBox', '0 0 100 ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');

    // --- frame rules ---
    arrow(5, 3, 95, 3);                          // top rule
    for (var tx = 5; tx <= 95; tx += 5) line(tx, 2.2, tx, 3, 'ln faint');
    line(13.2, 3, 13.2, H);                      // left column edge
    line(65.5, 3, 65.5, 64);                     // right column edge, top half
    line(43.5, 68, 43.5, H);                     // lineup column edge, bottom half
    arrow(2.5, 66, 97.5, 66, true);              // mid rule, full width

    // --- left hatching + course label dimension ---
    hatch(5, 5, 12.4, 64, 14);
    hatch(5, 69, 12.4, 128, 9);

    // --- guides on the heading: one baseline per word, cap line on top ---
    var ws = poster.querySelectorAll('.title .word');
    var first = null, last = null, x0 = 100;
    // optically align the words: shift each one so its ink (not its text box)
    // starts on the same vertical guide
    ws.forEach(function (w) { w.style.marginLeft = ''; });
    var target = 100;
    ws.forEach(function (w) { target = Math.min(target, inkBox(w).x0); });
    ws.forEach(function (w) {
      var shift = target - inkBox(w).x0;               // cqw, <= 0
      w.style.marginLeft = shift + 'cqw';
    });

    var bases = [];
    ws.forEach(function (w, i) {
      var b = inkBox(w);
      if (!first) first = b;
      last = b;
      bases.push(b.base);
      x0 = Math.min(x0, b.x0);
      // every baseline but the last carries on across the right column
      line(13.2, b.base, i < ws.length - 1 ? 95 : 65.5, b.base, 'ln faint');
    });
    if (first) {
      arrow(13.2, first.top, 65.5, first.top, true);
      arrow(13.2, last.base, 65.5, last.base, true);
      line(x0, 4, x0, last.base, 'ln faint');
      // course name: on the left guide, centred between OUT's baseline and the mid rule
      var course = poster.querySelector('.v-label');
      if (course) {
        var u = poster.clientWidth / 100;
        var chH = course.getBoundingClientRect().height / u;
        course.style.left = (x0 + inkOffsetCqw(course)) + 'cqw';
        course.style.top = (last.base + (66 - last.base - chH) / 2) + 'cqw';
      }
      square(x0, first.top);
      square(x0, last.base);
      square(65.5, first.top);
      square(65.5, last.base);
    }

    // --- quiet guides in the bottom half ---
    var blurb = poster.querySelector('.blurb');
    if (blurb) {
      var unit = poster.clientWidth / 100;
      var br = blurb.getBoundingClientRect(), pr = poster.getBoundingClientRect();
      var by = (br.bottom - pr.top) / unit + 3;
      arrow(18.5, by, 39.5, by, true, 0.6);
      // the part drawing fills the rest of the column, ending on the lineup's last rule
      var lu = poster.querySelector('.lineup');
      var lb = lu ? (lu.getBoundingClientRect().bottom - pr.top) / unit : H - 5;
      line(13.2, lb, 43.5, lb, 'ln faint');
      drawSection(18.5, by, 39.5, lb);
    }
    // the plotted signal sits between the HEAR and ME baselines, full column width
    if (bases.length >= 2) {
      square(95, bases[0]); square(95, bases[1]);
      drawWave(68, bases[0] + 2.2, 95, bases[1] - 2.2);
    }

    // --- right edge ruler ---
    for (var ty = 6; ty < H - 2; ty += 2) {
      line(98.4, ty, 100, ty, (ty - 6) % 10 === 0 ? 'ln' : 'ln faint');
    }
  }

  var timer;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw); else draw();
  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(draw, 80); });
})();
