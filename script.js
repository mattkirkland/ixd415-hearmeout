// Hear Me Out - page scripts
//
// Nothing much here yet. The idea is that this file grows as issues get worked.
// Keep it dependency-free: plain browser JavaScript, no build step.

// Returns the schedule table rows as plain objects, e.g.
// { week: 3, date: "09-09-2026", book: "Perry", presenting: "Maya", title: "TBD", row: <tr> }
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
      title: cells[4].textContent.trim(),
      row: rows[i]
    });
  }
  return out;
}

// TODO: figure out which row is "this week" and give it a class so it can be styled.
function highlightCurrentWeek() {
  // not implemented
}

document.addEventListener('DOMContentLoaded', function () {
  highlightCurrentWeek();
});
