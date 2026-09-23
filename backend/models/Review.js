const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Optional and sparse-unique: a real user can only ever have ONE
    // review (enforced by the sparse unique index below), but this can
    // also be left unset entirely for the original seeded testimonials,
    // which aren't tied to a real account. IMPORTANT: no `default` here
    // - a sparse index only ignores documents where the field is truly
    // absent, not documents where it's present-but-null, so setting a
    // default of null would make every seeded review collide as
    // duplicates of each other.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Denormalized at write time so a card never needs a second lookup,
    // and stays stable even if the user later renames their account.
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Free text shown under the name (e.g. "Switched careers into web
    // development", "Instructor, Web Development") - the author
    // describes their own context, no separate course picker needed.
    role: {
      type: String,
      required: [true, "A short role/title is required"],
      trim: true,
      maxlength: 80,
    },

    quote: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxlength: 300,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Hidden reviews stay in the database (so the author/admin can still
    // see them) but are excluded from the public homepage/reviews page -
    // lets an admin moderate without permanently deleting anything.
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Review", reviewSchema);