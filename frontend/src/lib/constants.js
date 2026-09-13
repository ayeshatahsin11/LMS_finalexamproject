// Single source of truth for course categories and levels.
// Used by: course listing filters, category showcase, and the
// instructor's "Create/Edit Course" form. Keeping this in one place
// guarantees the dropdown an instructor picks from always matches
// exactly what students can filter by - no free-text mismatches.

export const CATEGORIES = [
  "Digital Marketing",
  "Web Development",
  "Art & Humanities",
  "Personal Development",
  "IT and Software",
  "Graphic Design",
];

export const LEVELS = ["beginner", "intermediate", "advanced"];