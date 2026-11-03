// Targeting reticle over the talks list.
//
// While the mouse is over the schedule, the normal cursor is swapped for a
// set of corner brackets that trail the pointer, with a small readout of the
// row underneath (week, speaker, status). Mouse/trackpad only; touch screens
// and reduced-motion users get the plain row hover from style.css.

(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.querySelector('.talks');
  if (!list) return;

  var reticle = document.createElement('div');
  reticle.className = 'reticle';
  reticle.setAttribute('aria-hidden', 'true');
  reticle.innerHTML = '<span class="reticle-box"></span><span class="reticle-read"></span>';
  document.body.appendChild(reticle);
  var readout = reticle.querySelector('.reticle-read');

  var STATUS = { past: 'Archived', next: 'Live', upcoming: 'Queued' };
  var x = 0, y = 0, tx = 0, ty = 0, running = false, row = null;

  function tick() {
    // Ease toward the pointer so the brackets trail slightly behind it
    x += (tx - x) * (still ? 1 : 0.25);
    y += (ty - y) * (still ? 1 : 0.25);
    reticle.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  function describe(li) {
    var wk = li.querySelector('.wk').textContent;
    var who = li.querySelector('.speaker').textContent;
    var status = STATUS[li.classList[0]] || '';
    return 'Wk ' + wk + ' / ' + who + ' / ' + status;
  }

  list.addEventListener('mouseenter', function (e) {
    x = tx = e.clientX;
    y = ty = e.clientY;
    reticle.classList.add('on');
    document.documentElement.classList.add('aiming');
  });

  list.addEventListener('mouseleave', function () {
    reticle.classList.remove('on', 'locked');
    document.documentElement.classList.remove('aiming');
    row = null;
  });

  list.addEventListener('mousemove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
    if (!running) { running = true; requestAnimationFrame(tick); }

    var li = e.target.closest('li');
    if (li !== row) {
      row = li;
      if (li) {
        readout.textContent = describe(li);
        reticle.classList.toggle('live', li.classList.contains('next'));
        // Brief "lock on" pulse each time the reticle crosses into a new row
        reticle.classList.remove('locked');
        void reticle.offsetWidth;
        reticle.classList.add('locked');
      }
    }
  });
})();
