// Hear Me Out - page scripts
//
// Nothing much here yet. The idea is that this file grows as issues get worked.
// Keep it dependency-free: plain browser JavaScript, no build step.

// Returns the schedule table rows as plain objects, e.g.
// { week: 3, date: "09-09-2026", book: "Perry", presenting: "Maya", row: <tr> }
function getScheduleRows() {
  var rows = document.querySelectorAll('#schedule tr');
  var out = [];
  for (var i = 1; i < rows.length; i++) { // skip header row
    var cells = rows[i].querySelectorAll('td');
    out.push({
      week: parseInt(cells[0].textContent, 10),
      date: cells[1].textContent.trim(),
      book: cells[2].textContent.trim(),
      presenting: cells[3].textContent.trim(),
      row: rows[i]
    });
  }
  return out;
}


// For testing: set to 'YYYY-MM-DD' to pretend it's another day,
// or add ?today=YYYY-MM-DD to the URL. Leave null to use the real date.
var TODAY_OVERRIDE = null;

// Today's date at local midnight, or the override from the URL / TODAY_OVERRIDE.
function getToday() {
  var value = new URLSearchParams(window.location.search).get('today') || TODAY_OVERRIDE;
  if (value) {
    var parts = value.split('-').map(Number); // YYYY-MM-DD
    if (parts[0] && parts[1] && parts[2]) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Table dates are MM-DD-YYYY. Built from parts so it stays in local time.
function parseScheduleDate(str) {
  var parts = str.split('-').map(Number);
  return new Date(parts[2], parts[0] - 1, parts[1]);
}

// Highlights the next class: from the day after one class through the day of
// the next, that next class's row gets the "current" class.
function highlightCurrentWeek() {
  var today = getToday();
  var DAY = 24 * 60 * 60 * 1000;
  var rows = getScheduleRows();

  for (var i = 0; i < rows.length; i++) {
    // Math.round absorbs the extra/missing hour when daylight saving changes
    var daysUntil = Math.round((parseScheduleDate(rows[i].date) - today) / DAY);
    if (daysUntil >= 0 && daysUntil < 7) {
      rows[i].row.classList.add('current');
      rows[i].row.setAttribute('aria-current', 'date');
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  highlightCurrentWeek();
});
