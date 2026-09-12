import Link from "next/link";

const levelStyle = {
  beginner: "bg-sage-light text-sage",
  intermediate: "bg-amber/15 text-amber-dark",
  advanced: "bg-ink/10 text-ink",
};

export default function CourseCard({ course }) {
  return (
    <Link
      href={`/courses/${course._id}`}
      className="card group flex flex-col overflow-hidden transition hover:border-ink/40 hover:-translate-y-0.5 duration-200"
    >
      <div className="h-36 bg-gradient-to-br from-ink to-slate flex items-center justify-center px-4">
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        ) : (
          <span className="font-serif text-xl text-paper/80 text-center line-clamp-3">
            {course.title}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className={`self-start text-xs font-medium px-2 py-0.5 rounded capitalize ${levelStyle[course.level] || "bg-line text-slate"}`}>
          {course.level}
        </span>
        <h3 className="font-serif text-lg leading-snug group-hover:underline">{course.title}</h3>
        <p className="text-sm text-slate-light line-clamp-2">{course.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="text-slate-light">{course.instructor?.name || "Instructor"}</span>
          <span className="font-medium text-ink">{course.enrollmentCount || 0} enrolled</span>
        </div>
      </div>
    </Link>
  );
}
