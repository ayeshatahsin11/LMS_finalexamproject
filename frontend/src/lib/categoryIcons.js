import {
  Code2,
  Megaphone,
  Palette,
  TrendingUp,
  Cpu,
  Brush,
  BookOpen,
  GraduationCap,
  Camera,
  Music,
  PenTool,
  LineChart,
  Briefcase,
  Globe,
  Layers,
  Database,
  Smartphone,
  Video,
  Mic,
  Calculator,
  FlaskConical,
  Dumbbell,
  Heart,
  Languages,
  Wallet,
  ShoppingBag,
  Rocket,
  Lightbulb,
  Users,
  Star,
} from "lucide-react";

// Curated set of icons an admin can attach to a category - a small,
// on-topic list rather than exposing all ~1500 lucide icons, which would
// make a picker unusable. A category only ever stores the string key
// (e.g. "Code2") since a React component can't be saved to MongoDB.
export const CATEGORY_ICONS = {
  Code2,
  Megaphone,
  Palette,
  TrendingUp,
  Cpu,
  Brush,
  BookOpen,
  GraduationCap,
  Camera,
  Music,
  PenTool,
  LineChart,
  Briefcase,
  Globe,
  Layers,
  Database,
  Smartphone,
  Video,
  Mic,
  Calculator,
  FlaskConical,
  Dumbbell,
  Heart,
  Languages,
  Wallet,
  ShoppingBag,
  Rocket,
  Lightbulb,
  Users,
  Star,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

// Falls back to BookOpen if a category's stored icon name is missing or
// no longer in the curated set above - a bad/old value never crashes
// the page, it just shows a generic book icon instead.
export function getCategoryIcon(name) {
  return CATEGORY_ICONS[name] || BookOpen;
}

// A small palette that matches the app's existing accent colors (the
// same ones used across gradients/glows elsewhere) rather than letting
// an admin pick an arbitrary color that might clash with the dark theme.
export const CATEGORY_COLORS = [
  "#6366F1", // indigo
  "#A855F7", // purple
  "#EC4899", // pink
  "#F59E0B", // amber
  "#34D399", // green
  "#F472B6", // rose
  "#38BDF8", // sky
  "#F87171", // red
];