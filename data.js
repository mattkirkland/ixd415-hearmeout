// Hear Me Out - shared schedule data
//
// This is the one place the schedule lives. The schedule table on index.html
// and every poster variant read from here, so a change here shows up everywhere.
//
// It's a plain JS file rather than JSON so it works when you open an HTML file
// straight from disk (browsers block fetch() of local JSON files).
//
// To add your talk title: find your row, replace "TBD", open a PR.

window.HEAR_ME_OUT = {

  series: {
    title: "Hear Me Out",
    subtitle: "A lecture series",
    course: "IXD 415: Design for Emerging Technology",
    term: "Fall 2026",
    when: "Wednesdays, 6:00pm",
    where: "Room TBD",
    blurb: "Short talks on conspiracy theories worth believing and boring things that turn out to be fascinating. Five to ten minutes each. Convince us to think differently than we did ten minutes ago."
  },

  // One entry per week. Dates are YYYY-MM-DD.
  // speaker is null for weeks with no talk.
  weeks: [
    { week: 1,  date: "2026-08-26", speaker: null,      title: null,  book: "Matt",    note: "Kickoff" },
    { week: 2,  date: "2026-09-02", speaker: null,      title: null,  book: "Maya" },
    { week: 3,  date: "2026-09-09", speaker: "Maya",    title: "The Kardashians are marketing geniuses", book: "Perry" },
    { week: 4,  date: "2026-09-16", speaker: "Perry",   title: "Yoga is more than stretching", book: "Saj" },
    { week: 5,  date: "2026-09-23", speaker: "Saj",     title: "TBD", book: "Quin" },
    { week: 6,  date: "2026-09-30", speaker: "Quin",    title: "AI is an Art Revolution", book: "Cami" },
    { week: 7,  date: "2026-10-07", speaker: "Cami",    title: "Halloween is the best holiday", book: "Matt" },
    { week: 8,  date: "2026-10-14", speaker: null,      title: null,  book: null,      note: "No class" },
    { week: 9,  date: "2026-10-21", speaker: "Matt",    title: "You should watch more Horror", book: "Madi" },
    { week: 10, date: "2026-10-28", speaker: "Madi",    title: "You're Probably Someone's Worst Customer", book: "Leandra" },
    { week: 11, date: "2026-11-04", speaker: "Leandra", title: "TBD", book: "Alex" },
    { week: 12, date: "2026-11-11", speaker: "Alex",    title: "TBD", book: "Loudon" },
    { week: 13, date: "2026-11-18", speaker: "Loudon",  title: "TBD", book: "Sicily" },
    { week: 14, date: "2026-11-25", speaker: "Sicily",  title: "TBD", book: "Tori" },
    { week: 15, date: "2026-12-02", speaker: "Tori",    title: "TBD", book: "Nathan" },
    { week: 16, date: "2026-12-09", speaker: "Nathan",  title: "TBD", book: "Back to Matt" }
  ]
};

// Just the weeks that have a talk.
window.HEAR_ME_OUT.talks = window.HEAR_ME_OUT.weeks.filter(function (w) {
  return w.speaker !== null;
});
