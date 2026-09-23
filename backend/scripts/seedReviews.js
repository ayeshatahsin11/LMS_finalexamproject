require("dotenv").config();
const mongoose = require("mongoose");
const Review = require("../models/Review");

// One-time migration: inserts the original 6 hardcoded testimonials as
// real Review documents (with no linked user - they're not tied to a
// real account) now that the reviews marquee reads from the database.
// Safe to re-run - matches on name+quote, so nothing is duplicated.
const SEED_REVIEWS = [
  {
    name: "Farhana Rahman",
    role: "Switched careers into web development",
    quote:
      "I went from zero coding experience to landing a junior developer role in four months. The progress tracker kept me honest on the days I wanted to quit.",
    rating: 5,
  },
  {
    name: "Tanvir Ahmed",
    role: "Freelance graphic designer",
    quote:
      "The lessons were short enough to fit into a lunch break but detailed enough that I actually built a real portfolio by the end.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Marketing coordinator",
    quote:
      "Free previews let me check the teaching style before committing. Ended up finishing the whole course in two weeks.",
    rating: 4,
  },
  {
    name: "Rafi Islam",
    role: "Computer science student",
    quote:
      "Being able to see exactly how much of the course I'd completed made a huge difference. I finally finished something instead of abandoning it halfway.",
    rating: 5,
  },
  {
    name: "Ayesha Tahsin",
    role: "Self-taught developer",
    quote:
      "Clear lessons, no fluff. The instructor actually responded to questions and updated content based on feedback.",
    rating: 5,
  },
  {
    name: "Sabbir Hossain",
    role: "Small business owner",
    quote: "Not just theory - every lesson had something I could apply to my business the same day.",
    rating: 4,
  },
];

const run = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected to database.");

  // One-time cleanup: an earlier version of the Review model set
  // `user: null` explicitly (instead of leaving it unset), which the
  // sparse unique index treats as a real, colliding value. Strip that
  // stale explicit null so it's truly absent, matching the fixed model.
  const cleaned = await Review.updateMany({ user: null }, { $unset: { user: "" } });
  if (cleaned.modifiedCount > 0) {
    console.log(`Cleaned up ${cleaned.modifiedCount} review(s) with a stale null user field.`);
  }

  for (const r of SEED_REVIEWS) {
    const exists = await Review.findOne({ name: r.name, quote: r.quote });
    if (exists) {
      console.log(`Skipping "${r.name}" - already exists.`);
      continue;
    }
    await Review.create(r);
    console.log(`Created review from "${r.name}".`);
  }

  console.log("Done.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});