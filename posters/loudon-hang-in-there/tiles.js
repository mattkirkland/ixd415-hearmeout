// Builds the nine letter tiles from HEAR_ME_OUT.series.title and hangs cats on them.
// Runs before poster.js; it only adds decoration, so poster.js fills the rest as usual.

(function () {

  // [tile, letter] colors, one pair per tile. Every pair is 3.4:1 or better.
  var COLORS = [
    ['#2b3bff', '#ffb3d9'], ['#ff5a1f', '#111'],    ['#ffd400', '#111'],
    ['#ff9ccf', '#2b3bff'], ['#111', '#ffd400'],    ['#fff4e0', '#2b3bff'],
    ['#0e7a4f', '#ffd400'], ['#ff9ccf', '#111'],    ['#2b3bff', '#fff4e0']
  ];

  // Cats on letters: [pose, x, y, width], in em of the letter (Urbanist Black),
  // x from its left edge and y down from its cap line.
  var CATS = {
    0: ['peek', .334, .25, .3],   // H: over the crossbar
    6: ['peek', .385, .555, .3],  // O: in the counter
    8: ['hang', .489, .15, .27]   // T: under the arm
  };

  // ---- Cat drawings: 300 x 1000 units, x = 0 the middle, y = 0 the held edge ----

  function head(cx, y, h, flat) {
    var l = cx - 95, r = cx + 95, b = y + h;
    var bottom = flat
      ? ' L' + r + ' ' + b + ' L' + l + ' ' + b
      : ' L' + r + ' ' + (b - 60) + ' Q' + r + ' ' + b + ' ' + (r - 60) + ' ' + b +
        ' L' + (l + 60) + ' ' + b + ' Q' + l + ' ' + b + ' ' + l + ' ' + (b - 60);
    return '<path class="fur" d="M' + l + ' ' + (y + 40) + ' L' + (l + 14) + ' ' + (y - 42) +
      ' L' + (l + 66) + ' ' + y + ' L' + (r - 66) + ' ' + y + ' L' + (r - 14) + ' ' + (y - 42) +
      ' L' + r + ' ' + (y + 40) + bottom + ' Z"/>';
  }

  function face(cx, cy) {
    var s = '<g class="face"><circle cx="' + (cx - 34) + '" cy="' + cy + '" r="12"/>' +
      '<circle cx="' + (cx + 34) + '" cy="' + cy + '" r="12"/>' +
      '<circle cx="' + cx + '" cy="' + (cy + 20) + '" r="6"/></g><g class="lines">';
    [-1, 1].forEach(function (d) {
      var x0 = cx + d * 62, x1 = cx + d * 104;
      s += '<path d="M' + x0 + ' ' + (cy + 6) + ' L' + x1 + ' ' + (cy + 2) + '"/>' +
           '<path d="M' + x0 + ' ' + (cy + 22) + ' L' + x1 + ' ' + (cy + 26) + '"/>';
    });
    return s + '</g>';
  }

  function paw(x, y, w, h) {
    return '<rect class="fur" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (w / 2 - 2) + '"/>' +
      '<path class="lines" d="M' + (x + w * 0.35) + ' ' + (y + h - 20) + ' v14 M' + (x + w * 0.65) + ' ' + (y + h - 20) + ' v14"/>';
  }

  var POSES = {
    // Head and paws over a top edge
    peek: function () {
      return head(0, -150, 150, true) + face(0, -72) +
        paw(-72, -26, 58, 72) + paw(14, -26, 58, 72);
    },
    // Dangling from an edge by its front paws
    hang: function () {
      return '<rect class="fur" x="-75" y="150" width="150" height="240" rx="70"/>' +
        '<rect class="fur" x="-63" y="360" width="46" height="66" rx="22"/>' +
        '<rect class="fur" x="17" y="360" width="46" height="66" rx="22"/>' +
        '<path class="tail" d="M67 342 C 123 358, 139 412, 107 452"/>' +
        '<rect class="fur" x="-53" y="0" width="38" height="90" rx="18"/>' +
        '<rect class="fur" x="15" y="0" width="38" height="90" rx="18"/>' +
        head(0, 56, 150) + face(0, 120) +
        paw(-63, -42, 58, 72) + paw(5, -42, 58, 72);
    }
  };

  function cat(pose, left, top, width) {
    return '<span class="cat" style="left:' + left + ';top:' + top + ';width:' + width + '">' +
      '<svg viewBox="-150 -300 300 1000" aria-hidden="true" focusable="false">' + POSES[pose]() + '</svg></span>';
  }

  // ---- Tiles ----

  var grid = document.querySelector('.tiles');
  var letters = HEAR_ME_OUT.series.title.toUpperCase().replace(/\s+/g, '').split('').slice(0, 9);

  letters.forEach(function (ch, i) {
    var tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.setProperty('--bg', COLORS[i][0]);
    tile.style.setProperty('--fg', COLORS[i][1]);
    var letter = document.createElement('span');
    letter.textContent = ch;
    var c = CATS[i];
    if (c) letter.insertAdjacentHTML('beforeend', cat(c[0], c[1] + 'em', c[2] + 'em', c[3] + 'em'));
    tile.appendChild(letter);
    grid.appendChild(tile);
  });

  // One more hanging off the bottom of the grid, in the gap between the band's columns.
  grid.insertAdjacentHTML('afterend', cat('hang', '43.5cqw', '100cqw', '6.5cqw'));
})();
