// Hear Me Out - custom cursor
//
// Swaps the mouse cursor for a white circle that inverts the colors under it
// (see .cursor-dot in style.css). Only for a mouse or trackpad; touch screens
// are left alone. The normal cursor is hidden only once this script runs, so
// if it never loads, nothing changes.

(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  function add() {
    document.body.appendChild(dot);
    document.documentElement.classList.add('custom-cursor');
  }

  if (document.body) add();
  else document.addEventListener('DOMContentLoaded', add);

  document.addEventListener('mousemove', function (e) {
    dot.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    dot.classList.add('visible');
  });

  // Hide it when the mouse leaves the window, or goes into the poster iframe
  // (the page can't see the mouse in there, so the circle would get stuck).
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget || e.relatedTarget.tagName === 'IFRAME') {
      dot.classList.remove('visible');
    }
  });
})();
