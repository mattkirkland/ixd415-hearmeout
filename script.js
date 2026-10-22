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
// Built by hand because browsers don't reliably parse that format.
function parseScheduleDate(text) {
  var parts = text.split('-');
  return new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
}

// Give every week whose date is before today the "past" class.
// Today's own class still counts as upcoming until the day is over.
function dimPastWeeks() {
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var weeks = getScheduleRows();
  for (var i = 0; i < weeks.length; i++) {
    if (parseScheduleDate(weeks[i].date) < today) {
      weeks[i].row.classList.add('past');
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  highlightCurrentWeek();
  dimPastWeeks();
});
