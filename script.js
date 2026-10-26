// Hear Me Out - page scripts
//
// The schedule table is built from data.js (see renderSchedule). The rest grows as issues get worked.
// Keep it dependency-free: plain browser JavaScript, no build step.

// Formats a Date the way a person would say it, e.g. "Wed, Sep 9".
function formatDate(date) {
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return DAYS[date.getDay()] + ', ' + MONTHS[date.getMonth()] + ' ' + date.getDate();
}

// Builds the schedule table rows from HEAR_ME_OUT.weeks (data.js).
// The table in index.html only has the header row; everything else comes from here.
// Dates are shown the way a person would say them ("Wed, Sep 9") and the machine-readable
// MM-DD-YYYY is kept in the cell's data-date attribute for getScheduleRows(). "NA" marks
// weeks before presentations start, and a .no-class row marks a week with no class.
function renderSchedule() {
  var table = document.getElementById('schedule');
  if (!table || !window.HEAR_ME_OUT) return;

  function cell(text, className) {
    var td = document.createElement('td');
    if (className) td.className = className;
    td.textContent = text;
    return td;
  }

  HEAR_ME_OUT.weeks.forEach(function (w) {
    var tr = document.createElement('tr');
    var p = w.date.split('-'); // YYYY-MM-DD
    var dateCell = cell(formatDate(new Date(p[0], p[1] - 1, p[2])));
    dateCell.setAttribute('data-date', p[1] + '-' + p[2] + '-' + p[0]); // MM-DD-YYYY

    tr.appendChild(cell(w.week));
    tr.appendChild(dateCell);

    if (w.note === 'No class') {
      tr.className = 'no-class';
      var td = document.createElement('td');
      var label = document.createElement('span');
      label.className = 'no-class-label';
      label.textContent = 'No class';
      td.appendChild(label);
      tr.appendChild(td);
      tr.appendChild(cell(''));
      tr.appendChild(cell(''));
    } else {
      tr.appendChild(cell(w.book || ''));
      tr.appendChild(cell(w.speaker || 'NA'));
      tr.appendChild(cell(w.speaker ? (w.title || 'TBD') : 'NA'));
    }

    table.appendChild(tr);
  });
}

// Returns the schedule table rows as plain objects, e.g.
// { week: 3, date: "09-09-2026", book: "Perry", presenting: "Maya", title: "TBD", row: <tr> }
function getScheduleRows() {
  var rows = document.querySelectorAll('#schedule tr');
  var out = [];
  for (var i = 1; i < rows.length; i++) { // skip header row
    var cells = rows[i].querySelectorAll('td');
    out.push({
      week: parseInt(cells[0].textContent, 10),
      date: cells[1].getAttribute('data-date'), // MM-DD-YYYY; the cell text is for people
      book: cells[2].textContent.trim(),
      presenting: cells[3].textContent.trim(),
      title: cells[4].textContent.trim(),
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

// Turns "09-09-2026" (MM-DD-YYYY) into a Date at local midnight.
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

// Fills in #up-next with the next person presenting, e.g. "Up next: Madi, Wed Oct 28."
// Skips weeks with nobody presenting (NA, NO CLASS, blank).
function showUpNext() {
  var el = document.getElementById('up-next');
  if (!el) return;

  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var today = getToday();
  var DAY = 24 * 60 * 60 * 1000;
  var rows = getScheduleRows();

  for (var i = 0; i < rows.length; i++) {
    var who = rows[i].presenting;
    if (who === '' || who === 'NA' || who === 'NO CLASS') continue;

    var date = parseScheduleDate(rows[i].date);
    var daysUntil = Math.round((date - today) / DAY);
    if (daysUntil < 0) continue;

    el.textContent = 'Up next: ' + who + ', ' +
      DAYS[date.getDay()] + ' ' + MONTHS[date.getMonth()] + ' ' + date.getDate() + '.';
    return;
  }

  el.textContent = 'All presentations are done for the semester.';
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

// Give every week whose date is before today the "past" class.
// Today's own class still counts as upcoming until the day is over.
function dimPastWeeks() {
  var today = getToday();
  var weeks = getScheduleRows();
  for (var i = 0; i < weeks.length; i++) {
    if (parseScheduleDate(weeks[i].date) < today) {
      weeks[i].row.classList.add('past');
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderSchedule();
  highlightCurrentWeek();
  showUpNext();
  showCountdown();
  dimPastWeeks();
});
