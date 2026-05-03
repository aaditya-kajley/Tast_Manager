import { useState } from "react";

const initials = (name) => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const barColor = (pct) => {
  if (pct === 100) return "#16a34a";
  if (pct >= 60) return "#2563eb";
  if (pct >= 30) return "#d97706";
  return "#e5e7eb";
};

// ── TOAST ──
function Toast({ msg, show }) {
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem",
      background: "#0f1c2e", color: "#fff", fontSize: 13,
      padding: "10px 18px", borderRadius: 8, zIndex: 9999,
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.2s, transform 0.2s", pointerEvents: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    }}>{msg}</div>
  );
}

// ── STAT CARD ──
function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "1.1rem 1.25rem" }}>
      <div style={{ fontSize: 11, color: "#7a7a7a", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: "#0f1c2e", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#7a7a7a", marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// ── PROJECT BLOCK ──
function ProjectBlock({ project, onMarkDone }) {
  const [open, setOpen] = useState(true);
  const prog = project.tasks.length
    ? Math.round(project.tasks.reduce((s, t) => s + t.progress, 0) / project.tasks.length)
    : 0;

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, marginBottom: "1.25rem", overflow: "hidden" }}>
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "1.1rem 1.4rem", borderBottom: open ? "1px solid #e8e8e8" : "none",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", userSelect: "none", transition: "background 0.12s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, background: "#0f1c2e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
            {initials(project.title)}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#0f1c2e" }}>{project.title}</div>
            <div style={{ fontSize: 12, color: "#7a7a7a", marginTop: 2 }}>
              Due {project.dueDate} &nbsp;·&nbsp; {project.tasks.length} tasks
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 80, height: 4, background: "#eef0f3", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${prog}%`, background: "#0f1c2e", borderRadius: 10, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 12, color: "#7a7a7a", minWidth: 30, textAlign: "right" }}>{prog}%</span>
          </div>
          <svg
            width="18" height="18" fill="none" stroke="#7a7a7a" strokeWidth="2" viewBox="0 0 24 24"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Tasks */}
      {open && (
        <div style={{ padding: "0.5rem 1.4rem 1rem" }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 110px", gap: 12, padding: "0.5rem 0", borderBottom: "1px solid #e8e8e8", marginBottom: "0.5rem" }}>
            {["Task", "Progress", "Action"].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 500, color: "#7a7a7a", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
            ))}
          </div>

          {project.tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: "grid", gridTemplateColumns: "1fr 130px 110px", gap: 12,
                alignItems: "center", padding: "0.7rem 0",
                borderBottom: "1px solid #f3f3f3", opacity: task.done ? 0.65 : 1,
              }}
            >
              {/* Task name + check */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                  border: task.done ? "none" : "1.5px solid #e0e0e0",
                  background: task.done ? "#16a34a" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  {task.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 13.5, color: task.done ? "#7a7a7a" : "#0f1c2e", textDecoration: task.done ? "line-through" : "none", transition: "all 0.15s" }}>
                  {task.name}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ width: "100%", height: 5, background: "#eef0f3", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${task.progress}%`, background: barColor(task.progress), borderRadius: 10, transition: "width 0.4s, background 0.3s" }} />
                </div>
                <div style={{ fontSize: 11, color: "#7a7a7a", marginTop: 3 }}>{task.progress}% complete</div>
              </div>

              {/* Button */}
              <button
                disabled={task.done}
                onClick={() => !task.done && onMarkDone(project.id, task.id)}
                style={{
                  height: 30, padding: "0 12px", borderRadius: 6, cursor: task.done ? "default" : "pointer",
                  border: task.done ? "1px solid #bbf7d0" : "1px solid #e0e0e0",
                  background: task.done ? "#f0fdf4" : "transparent",
                  color: task.done ? "#16a34a" : "#7a7a7a",
                  fontFamily: "'DM Sans',sans-serif", fontSize: 12, whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!task.done) { e.target.style.borderColor = "#16a34a"; e.target.style.color = "#16a34a"; e.target.style.background = "#f0fdf4"; } }}
                onMouseLeave={(e) => { if (!task.done) { e.target.style.borderColor = "#e0e0e0"; e.target.style.color = "#7a7a7a"; e.target.style.background = "transparent"; } }}
              >
                {task.done ? "✓ Done" : "Mark Done"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN EMPLOYEE DASHBOARD ──
export default function EmployeeDashboard() {
  const [toast, setToast] = useState({ show: false, msg: "" });

  const [data, setData] = useState({
    name: "Alice Tran",
    projects: [
      {
        id: 1, title: "CRM Redesign", dueDate: "Jun 30, 2025",
        tasks: [
          { id: 101, name: "Design landing page mockup", progress: 100, done: true },
          { id: 102, name: "Build reusable component library", progress: 60, done: false },
          { id: 103, name: "Integrate auth module", progress: 30, done: false },
          { id: 104, name: "Write unit tests for UI layer", progress: 0, done: false },
        ],
      },
      {
        id: 2, title: "Mobile App v2", dueDate: "Jul 15, 2025",
        tasks: [
          { id: 201, name: "Set up React Native project", progress: 100, done: true },
          { id: 202, name: "Implement push notifications", progress: 45, done: false },
          { id: 203, name: "Submit to App Store", progress: 0, done: false },
        ],
      },
    ],
  });

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  };

  const markDone = (projectId, taskId) => {
    // TODO: PATCH /api/tasks/:taskId/done
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id !== projectId ? p : {
          ...p,
          tasks: p.tasks.map((t) =>
            t.id !== taskId ? t : { ...t, done: true, progress: 100 }
          ),
        }
      ),
    }));
    showToast("Task marked as done!");
  };

  const allTasks = data.projects.flatMap((p) => p.tasks);
  const doneTasks = allTasks.filter((t) => t.done);
  const pct = allTasks.length ? Math.round((doneTasks.length / allTasks.length) * 100) : 0;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1c2e" }}>

        {/* SIDEBAR */}
        <aside style={{ width: 220, background: "#0f1c2e", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
          <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 28, height: 28, border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 500 }}>A</div>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 500, letterSpacing: "0.04em" }}>Acme Corp</span>
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "1.5rem 1.25rem 0.5rem" }}>Menu</div>
          {[
            { label: "My Projects", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, active: true },
            { label: "My Tasks", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, active: false },
          ].map((n) => (
            <div key={n.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0.6rem 1.25rem", margin: "2px 0.75rem", borderRadius: 7,
              cursor: "pointer",
              color: n.active ? "#fff" : "rgba(255,255,255,0.55)",
              fontWeight: n.active ? 500 : 400, fontSize: 13.5,
              background: n.active ? "rgba(255,255,255,0.1)" : "transparent",
            }}>
              <span style={{ opacity: n.active ? 1 : 0.7 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#fff" }}>
              {initials(data.name)}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 500 }}>{data.name}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Employee</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 2rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#0f1c2e" }}>My Dashboard</span>
            <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 20 }}>
              {doneTasks.length} of {allTasks.length} tasks done
            </span>
          </div>

          <div style={{ padding: "2rem", flex: 1 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
              <StatCard label="Assigned Projects" value={data.projects.length} sub="Active this month" />
              <StatCard label="Total Tasks" value={allTasks.length} sub="Across all projects" />
              <StatCard label="Completed" value={doneTasks.length} sub={`${pct}% completion rate`} />
            </div>

            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#0f1c2e", marginBottom: "1.25rem" }}>
              Assigned Projects & Tasks
            </div>

            {data.projects.map((proj) => (
              <ProjectBlock key={proj.id} project={proj} onMarkDone={markDone} />
            ))}
          </div>
        </main>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
