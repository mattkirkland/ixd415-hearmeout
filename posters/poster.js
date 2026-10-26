// Hear Me Out - poster render helper
//
// Include this after ../../data.js in your poster's index.html. It fills in
// your markup from the shared data so you can concentrate on the design.
//
// How it works:
//
//   1. Series fields. Any element with data-series="<key>" gets that value
//      from HEAR_ME_OUT.series as its text:
//
//        <h1 data-series="title"></h1>
//        <p data-series="when"></p>
//
//      Keys: title, subtitle, course, term, when, where, blurb
//
//   2. The list of talks. Put a <template> inside an element with
//      data-talks. The template is stamped out once per talk, and inside it
//      any element with data-field="<key>" gets that talk's value:
//
//        <ol data-talks>
//          <template>
//            <li>
//              <span data-field="date"></span>
//              <strong data-field="speaker"></strong>
//              <em data-field="title"></em>
//            </li>
//          </template>
//        </ol>
//
//      Keys: week, date, speaker, title, book
//
//      Dates are formatted with data-format: "long" (Wednesday, September 9),
//      "short" (Sep 9), "numeric" (9/9), or "iso" (2026-09-09). Default is short.
//      Add data-field="month" / data-field="day" / data-field="weekday" if you
//      want the pieces separately.
//
//   3. Each stamped element also gets the talk's number as data-week, and the
//      class "past", "next", or "upcoming" depending on today's date, in case
//      you want to style those differently.
//
// You don't have to use any of this. HEAR_ME_OUT.series and HEAR_ME_OUT.talks
// are plain objects; write your own JS if you'd rather.

(function () {
  var data = window.HEAR_ME_OUT;
  if (!data) {
    console.warn('poster.js: data.js was not loaded first');
    return;
  }

  function parseDate(iso) {
    var p = iso.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function formatDate(iso, format) {
    var d = parseDate(iso);
    switch (format) {
      case 'long':    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      case 'numeric': return (d.getMonth() + 1) + '/' + d.getDate();
      case 'iso':     return iso;
      case 'month':   return d.toLocaleDateString('en-US', { month: 'short' });
      case 'day':     return String(d.getDate());
      case 'weekday': return d.toLocaleDateString('en-US', { weekday: 'long' });
      default:        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  // "past" / "next" / "upcoming" relative to today. Supports ?today=YYYY-MM-DD for testing.
  var todayParam = new URLSearchParams(window.location.search).get('today');
  var now = todayParam ? parseDate(todayParam) : new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var nextIndex = -1;
  data.talks.forEach(function (t, i) {
    if (nextIndex === -1 && parseDate(t.date) >= today) nextIndex = i;
  });

  function statusFor(i) {
    if (nextIndex === -1 || i < nextIndex) return 'past';
    if (i === nextIndex) return 'next';
    return 'upcoming';
  }

  function fillField(el, talk) {
    var key = el.getAttribute('data-field');
    var format = el.getAttribute('data-format');
    if (key === 'date') {
      el.textContent = formatDate(talk.date, format || 'short');
    } else if (key === 'month' || key === 'day' || key === 'weekday') {
      el.textContent = formatDate(talk.date, key);
    } else if (talk[key] !== undefined && talk[key] !== null) {
      el.textContent = talk[key];
    }
  }

  // 1. Series fields
  document.querySelectorAll('[data-series]').forEach(function (el) {
    var value = data.series[el.getAttribute('data-series')];
    if (value !== undefined) el.textContent = value;
  });

  // 2. Talks list
  document.querySelectorAll('[data-talks]').forEach(function (container) {
    var template = container.querySelector('template');
    if (!template) {
      console.warn('poster.js: [data-talks] element has no <template> inside it');
      return;
    }
    data.talks.forEach(function (talk, i) {
      var clone = template.content.cloneNode(true);
      clone.querySelectorAll('[data-field]').forEach(function (el) { fillField(el, talk); });
      var root = clone.firstElementChild;
      if (root) {
        root.setAttribute('data-week', talk.week);
        root.classList.add(statusFor(i));
      }
      container.appendChild(clone);
    });
  });

  // 3. Shorthand for "the next talk": data-next="<key>" fills from the upcoming talk
  if (nextIndex !== -1) {
    var next = data.talks[nextIndex];
    document.querySelectorAll('[data-next]').forEach(function (el) {
      el.setAttribute('data-field', el.getAttribute('data-next'));
      fillField(el, next);
    });
  }
})();
