import Link from "next/link";

const levelStyle = {
  beginner: "bg-success/10 text-success border border-success/20",
  intermediate: "bg-pink/10 text-pink border border-pink/20",
  advanced: "bg-indigo/10 text-indigo border border-indigo/20",
};

export default function CourseCard({ course }) {
  return (
    <Link
      href={`/courses/${course._id}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div className="h-36 relative flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo/30 via-purple/25 to-pink/20" />
        <div className="absolute inset-0 bg-bg-soft/40" />
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail} alt={course.title} className="relative h-full w-full object-cover" />
        ) : (
          <span className="relative font-serif text-xl text-text text-center line-clamp-3">
            {course.title}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className={`self-start text-xs font-medium px-2 py-0.5 rounded capitalize ${levelStyle[course.level] || "bg-surface-hover text-text-muted"}`}>
          {course.level}
        </span>
        <h3 className="font-serif text-lg leading-snug text-text group-hover:text-transparent group-hover:gradient-text transition">
          {course.title}
        </h3>
        <p className="text-sm text-text-muted line-clamp-2">{course.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="text-text-faint">{course.instructor?.name || "Instructor"}</span>
          <span className="font-medium text-text">{course.enrollmentCount || 0} enrolled</span>
        </div>
      </div>
    </Link>
  );
}