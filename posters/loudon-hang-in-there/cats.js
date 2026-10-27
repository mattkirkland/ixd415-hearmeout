// Hang In There - builds the big letters and hangs the cats on them.
//
// The headline comes from HEAR_ME_OUT.series.title: one line per word, one
// span per letter. A cat goes on the first H, O, and T it finds, because those
// are the letters with a place to hang from (the H's crossbar, the bottom of
// the O, the arm of the T).
//
// Cat drawings are in Urbanist Black's own units: 1000 per em, x from the
// letter's left edge, y down from the top of the capitals. That way each cat
// lines up with its letter at any size. Each cat has a back layer (behind the
// letter, so the letter hides part of it) and a front layer (paws over the edge).

(function () {
  var data = window.HEAR_ME_OUT;
  var box = document.querySelector('.headline');
  if (!data || !box) return;

  // Letter widths in Urbanist Black, used for the cat's viewBox.
  var ADVANCE = { H: 668, O: 770, T: 630 };

  var face = function (cx, cy) {
    var eyes = '<circle cx="' + (cx - 34) + '" cy="' + cy + '" r="12"/>' +
               '<circle cx="' + (cx + 34) + '" cy="' + cy + '" r="12"/>' +
               '<circle cx="' + cx + '" cy="' + (cy + 20) + '" r="6"/>';
    var w = '';
    [[-1, 1], [1, 1]].forEach(function (s) {
      var x0 = cx + s[0] * 62, x1 = cx + s[0] * 104;
      w += '<path d="M' + x0 + ' ' + (cy + 6) + ' L' + x1 + ' ' + (cy + 2) + '"/>' +
           '<path d="M' + x0 + ' ' + (cy + 22) + ' L' + x1 + ' ' + (cy + 26) + '"/>';
    });
    return '<g class="face">' + eyes + '</g><g class="whiskers">' + w + '</g>';
  };

  // Two front paws, rounded, with two toe lines each.
  var paws = function (x, y, gap) {
    var out = '';
    [x, x + 58 + gap].forEach(function (px) {
      out += '<rect class="fur" x="' + px + '" y="' + y + '" width="58" height="72" rx="27"/>' +
             '<path class="toes" d="M' + (px + 20) + ' ' + (y + 52) + ' v16 M' + (px + 38) + ' ' + (y + 52) + ' v16"/>';
    });
    return out;
  };

  // Head with ears, centered on cx, top of head at y.
  var head = function (cx, y, h) {
    var l = cx - 95, r = cx + 95;
    return '<path class="fur" d="M' + l + ' ' + (y + 40) +
      ' L' + (l + 14) + ' ' + (y - 42) + ' L' + (l + 66) + ' ' + y +
      ' L' + (r - 66) + ' ' + y + ' L' + (r - 14) + ' ' + (y - 42) + ' L' + r + ' ' + (y + 40) +
      ' L' + r + ' ' + (y + h - 60) + ' Q' + r + ' ' + (y + h) + ' ' + (r - 60) + ' ' + (y + h) +
      ' L' + (l + 60) + ' ' + (y + h) + ' Q' + l + ' ' + (y + h) + ' ' + l + ' ' + (y + h - 60) + ' Z"/>';
  };

  var CATS = {
    // Peeking over the H's crossbar (y 250-400), body in the lower half.
    H: {
      back: '<rect class="fur" x="252" y="300" width="164" height="350" rx="72"/>' +
            '<rect class="fur" x="266" y="612" width="54" height="56" rx="24"/>' +
            '<rect class="fur" x="348" y="612" width="54" height="56" rx="24"/>' +
            '<path class="tail" d="M392 600 C 440 640, 446 700, 420 752"/>' +
            head(334, 110, 230) + face(334, 186),
      front: paws(262, 224, 28)
    },
    // Looking out of the O, paws on the bottom of the opening (about y 555).
    O: {
      back: head(385, 338, 320) + face(385, 420),
      front: paws(318, 526, 18)
    },
    // Hanging from the bottom edge of the T's arm (y 150), to the right of the stem.
    T: {
      back: '',
      // Drawn at 90% around the arm's edge so it clears the stem.
      front: '<g transform="translate(489 150) scale(0.9) translate(-489 -150)">' +
             '<rect class="fur" x="414" y="300" width="150" height="240" rx="70"/>' +
             '<rect class="fur" x="426" y="510" width="46" height="66" rx="22"/>' +
             '<rect class="fur" x="506" y="510" width="46" height="66" rx="22"/>' +
             '<path class="tail" d="M556 492 C 612 508, 628 562, 596 602"/>' +
             '<rect class="fur" x="436" y="150" width="38" height="90" rx="18"/>' +
             '<rect class="fur" x="504" y="150" width="38" height="90" rx="18"/>' +
             head(489, 206, 150) + face(489, 270) +
             paws(426, 108, 14) + '</g>'
    }
  };

  function svg(letter, layer, content) {
    return '<svg class="cat cat-' + layer + '" viewBox="0 0 ' + ADVANCE[letter] + ' 800" ' +
      'style="width:' + ADVANCE[letter] / 1000 + 'em" aria-hidden="true">' + content + '</svg>';
  }

  var used = {};
  data.series.title.toUpperCase().split(/\s+/).forEach(function (word) {
    var line = document.createElement('span');
    line.className = 'line';
    word.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'letter';
      span.textContent = ch;
      var cat = CATS[ch];
      if (cat && !used[ch]) {
        used[ch] = true;
        span.classList.add('has-cat');
        if (cat.back) span.insertAdjacentHTML('beforeend', svg(ch, 'back', cat.back));
        span.insertAdjacentHTML('beforeend', svg(ch, 'front', cat.front));
      }
      line.appendChild(span);
    });
    box.appendChild(line);
  });
})();
