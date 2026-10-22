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

// TODO: figure out which row is "this week" and give it a class so it can be styled.
function highlightCurrentWeek() {
  // not implemented
}

// Turns "09-09-2026" (MM-DD-YYYY) into a Date at local midnight.
function parseScheduleDate(str) {
  var parts = str.split('-');
  return new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
}

// Fills in #countdown with "Next presentation in N days", or says so if it's today.
// Skips weeks with nobody presenting (NA, NO CLASS, blank).
function showCountdown() {
  var el = document.getElementById('countdown');
  if (!el) return;

  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var rows = getScheduleRows();

  for (var i = 0; i < rows.length; i++) {
    var who = rows[i].presenting;
    if (who === '' || who === 'NA' || who === 'NO CLASS') continue;

    var date = parseScheduleDate(rows[i].date);
    // Math.round handles the hour lost or gained at daylight saving changes.
    var days = Math.round((date - today) / (1000 * 60 * 60 * 24));
    if (days < 0) continue;

    if (days === 0) {
      el.textContent = 'Presentation today: ' + who + '.';
    } else if (days === 1) {
      el.textContent = 'Next presentation tomorrow: ' + who + '.';
    } else {
      el.textContent = 'Next presentation in ' + days + ' days: ' + who + '.';
    }
    return;
  }

  el.textContent = 'All presentations are done for the semester.';
}

document.addEventListener('DOMContentLoaded', function () {
  highlightCurrentWeek();
  showCountdown();
});
