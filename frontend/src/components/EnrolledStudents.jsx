"use client";

import ProgressBar from "@/components/ProgressBar";

export default function EnrolledStudents({ enrollments }) {
  return (
    <div>
      <h2 className="text-2xl mb-4">Enrolled students ({enrollments.length})</h2>
      {enrollments.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-sm">
          No students enrolled yet.
        </div>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {enrollments.map((e) => (
            <div key={e._id} className="flex items-center gap-3 sm:gap-4 px-5 py-4 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <p className="text-sm text-text truncate">{e.student?.name}</p>
                <p className="text-xs text-text-faint truncate">{e.student?.email}</p>
              </div>
              <div className="w-28 sm:w-40 shrink-0">
                <ProgressBar percent={e.progressPercent} />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${
                  e.status === "completed" ? "bg-success/10 text-success" : "bg-purple/10 text-purple"
                }`}
              >
                {e.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}