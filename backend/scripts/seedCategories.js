require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const User = require("../models/User");

// One-time migration: inserts the original 6 hardcoded categories (same
// names, icons and colors the static CategoryShowcase used to render)
// now that categories live in the database. Safe to re-run - any
// category whose name already exists is skipped, nothing is duplicated.
const DEFAULT_CATEGORIES = [
  { name: "Digital Marketing", icon: "Megaphone", color: "#EC4899", order: 0 },
  { name: "Web Development", icon: "Code2", color: "#6366F1", order: 1 },
  { name: "Art & Humanities", icon: "Brush", color: "#A855F7", order: 2 },
  { name: "Personal Development", icon: "TrendingUp", color: "#F59E0B", order: 3 },
  { name: "IT and Software", icon: "Cpu", color: "#34D399", order: 4 },
  { name: "Graphic Design", icon: "Palette", color: "#F472B6", order: 5 },
];

const run = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected to database.");

  // Category.createdBy is required - attach the seeded rows to whichever
  // admin account exists first, since there's no "system" user.
  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.error("No admin user found - create an admin account first, then re-run this script.");
    process.exit(1);
  }

  for (const cat of DEFAULT_CATEGORIES) {
    const exists = await Category.findOne({ name: cat.name });
    if (exists) {
      console.log(`Skipping "${cat.name}" - already exists.`);
      continue;
    }
    await Category.create({ ...cat, createdBy: admin._id });
    console.log(`Created "${cat.name}".`);
  }

  console.log("Done.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});