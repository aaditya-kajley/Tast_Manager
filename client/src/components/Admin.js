import { useEffect, useState } from "react";
import axios from 'axios'
import { useLocation } from "react-router-dom";

const NAV = [
  {
    key: "projects",
    label: "Projects",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: "admins",
    label: "Admins",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
        <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
      </svg>
    ),
  },
  {
    key: "employees",
    label: "Employees",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];


const initials = (name) => {
  if (!name || typeof name !== "string") return "??";
  return name.split(" ").filter(Boolean).map((w) => w[0]).join("")
    .toUpperCase().slice(0, 2);
}

const barColor = (pct) => {
  if (pct === 100) return "#16a34a";
  if (pct >= 60) return "#2563eb";
  if (pct >= 30) return "#d97706";
  return "#cbd5e1";
};

// ── MODAL ──
function Modal({ open, onClose, title, children, onSubmit, submitLabel = "Save" }) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,28,46,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 12, padding: "1.75rem",
        width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", margin: "1rem",
        boxShadow: "0 20px 60px rgba(15,28,46,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#0f1c2e" }}>{title}</span>
          <button onClick={onClose} style={{
            width: 28, height: 28, border: "1px solid #e0e0e0", borderRadius: 6,
            background: "transparent", cursor: "pointer", fontSize: 16, color: "#7a7a7a",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        {children}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #e8e8e8" }}>
          <button onClick={onClose} style={{
            height: 36, padding: "0 16px", background: "transparent", color: "#7a7a7a",
            border: "1px solid #e0e0e0", borderRadius: 7, fontFamily: "'DM Sans',sans-serif",
            fontSize: 13, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={onSubmit} style={{
            height: 36, padding: "0 16px", background: "#0f1c2e", color: "#fff",
            border: "none", borderRadius: 7, fontFamily: "'DM Sans',sans-serif",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", height: 40, padding: "0 12px", border: "1px solid #e0e0e0",
  borderRadius: 7, background: "#fff", color: "#0f1c2e",
  fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, outline: "none",
};

// ── PROJECTS SECTION ──
function ProjectsSection({projects,setProjects}) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", employees: "", progress: "", tasks: [{ name: "", pct: "" }] });

  const addProject = () => {
    if (!form.title.trim()) return;
    const emps = form.employees.split(",").map((e) => e.trim()).filter(Boolean);
    setProjects([...projects, {
      id: Date.now(), title: form.title,
      employees: emps.length ? emps : ["Unassigned"],
      progress: Math.min(100, Math.max(0, parseInt(form.progress) || 0)),
      status: "Active",
      tasks: form.tasks.filter((t) => t.name.trim()),
    }]);
    setModal(false);
    setForm({ title: "", employees: "", progress: "", tasks: [{ name: "", pct: "" }] });
  };

  const updateTask = (i, field, val) => {
    const t = [...form.tasks];
    t[i] = { ...t[i], [field]: val };
    setForm({ ...form, tasks: t });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#0f1c2e" }}>Projects</div>
          <div style={{ fontSize: 13, color: "#7a7a7a", marginTop: 2 }}>All ongoing projects from MongoDB</div>
        </div>
        <button onClick={() => setModal(true)} style={{
          height: 36, padding: "0 16px", background: "#0f1c2e", color: "#fff",
          border: "none", borderRadius: 7, fontFamily: "'DM Sans',sans-serif",
          fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Project
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem" }}>
        {projects.map((p) => (
          <div key={p.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: "#0f1c2e" }}>{p.title}</span>
              <span style={{
                fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20,
                background: p.status === "Active" ? "#f0fdf4" : "#fffbeb",
                color: p.status === "Active" ? "#16a34a" : "#92400e",
              }}>{p.status}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7a7a7a", marginBottom: 5 }}>
              <span>Progress</span><span>{p.progress}%</span>
            </div>
            <div style={{ width: "100%", height: 5, background: "#eef0f3", borderRadius: 10, overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ height: "100%", width: `${p.progress}%`, background: barColor(p.progress), borderRadius: 10, transition: "width 0.4s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#7a7a7a" }}>
              <div style={{ display: "flex" }}>
                {p.employees.slice(0, 4).map((e, i) => (
                  <div key={i} style={{
                    width: 24, height: 24, borderRadius: "50%", background: "#0f1c2e",
                    color: "#fff", fontSize: 9, fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #fff", marginLeft: i === 0 ? 0 : -6,
                  }}>{initials(e)}</div>
                ))}
              </div>
              <span>{p.employees.length} employee{p.employees.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="New Project" onSubmit={addProject} submitLabel="Create Project">
        <Field label="Project Title">
          <input style={inputStyle} placeholder="e.g. CRM Redesign" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Assign Employees (comma separated)">
          <input style={inputStyle} placeholder="Alice, Bob, Charlie" value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
        </Field>
        <Field label="Tasks">
          {form.tasks.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Task name" value={t.name} onChange={(e) => updateTask(i, "name", e.target.value)} />
              <input style={{ ...inputStyle, width: 70, flex: "none", textAlign: "center" }} type="number" min="0" max="100" placeholder="%" value={t.pct} onChange={(e) => updateTask(i, "pct", e.target.value)} />
              {form.tasks.length > 1 && (
                <button onClick={() => setForm({ ...form, tasks: form.tasks.filter((_, j) => j !== i) })} style={{
                  width: 28, height: 28, border: "1px solid #e0e0e0", borderRadius: 5,
                  background: "transparent", cursor: "pointer", color: "#7a7a7a", fontSize: 14,
                }}>✕</button>
              )}
            </div>
          ))}
          <button onClick={() => setForm({ ...form, tasks: [...form.tasks, { name: "", pct: "" }] })} style={{
            fontSize: 12.5, color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans',sans-serif",
          }}>+ Add Task</button>
        </Field>
        <Field label="Overall Progress (%)">
          <input style={inputStyle} type="number" min="0" max="100" placeholder="0–100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
        </Field>
      </Modal>
    </div>
  );
}

// ── USER TABLE ──
function UserTable({ users, setUsers, columns, avatarBg = "#0f1c2e", delfunc }) {

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} style={{ background: "#fafafa", fontSize: 11, fontWeight: 500, color: "#7a7a7a", textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.75rem 1.25rem", textAlign: "left", borderBottom: "1px solid #e8e8e8" }}>{c}</th>
            ))}
            <th style={{ background: "#fafafa", fontSize: 11, fontWeight: 500, color: "#7a7a7a", textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.75rem 1.25rem", textAlign: "left", borderBottom: "1px solid #e8e8e8" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? "1px solid #e8e8e8" : "none" }}>
              <td style={{ padding: "0.85rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarBg, color: "#fff", fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{initials(u.name)}</div>
                  <span style={{ fontWeight: 500, fontSize: 13.5 }}>{u.name}</span>
                </div>
              </td>
              {/* <td style={{ padding: "0.85rem 1.25rem" }}><code style={{ fontSize: 12, color: "#7a7a7a" }}>{u.userid}</code></td> */}
              <td style={{ padding: "0.85rem 1.25rem", fontSize: 13, color: "#7a7a7a" }}>{u.email}</td>
              {u.role && <td style={{ padding: "0.85rem 1.25rem" }}><span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: "#f0fdf4", color: "#16a34a" }}>{u.role}</span></td>}
              {u.projects !== undefined && <td style={{ padding: "0.85rem 1.25rem", fontSize: 13 }}>{u.projects} project{u.projects !== 1 ? "s" : ""}</td>}
              <td style={{ padding: "0.85rem 1.25rem" }}>
                <button onClick={() => delfunc(u.email)} style={{
                  padding: "4px 10px", borderRadius: 5, border: "1px solid #e8e8e8",
                  background: "transparent", fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12, color: "#7a7a7a", cursor: "pointer",
                }}
                  onMouseEnter={(e) => { e.target.style.borderColor = "#dc2626"; e.target.style.color = "#dc2626"; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = "#e8e8e8"; e.target.style.color = "#7a7a7a"; }}
                >Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── ADMINS SECTION ──
function AdminsSection({admins,setAdmins}) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });

  useEffect(() => {
    axios.get("${process.env.backend}/admin")
      .then((res) => {
        setAdmins(res.data);
      })
      .catch((err) => console.log(err));
  }, [setAdmins]);

  async function delAdmin(email) {
    try {
      await axios.delete(`${process.env.backend}/admin/${email}`)
        .then(res => {
          if (res.data.status === true) 
            alert(`Admin(${email}) Deleted`)
            setAdmins(prev => prev.filter(u => u.email !== email));
        }).catch(err => {
          console.log(err)
        }
        )
    }
    catch (error) {
      console.log(error)
    }
  }

  const addAdmin = () => {
    if (!form.name || !form.email || !form.password) {
      alert("Enter all details")
      return;
    }
    setModal(false);
    axios.post("${process.env.backend}/admin", { form })
      .then((res) => {
        if (res.data.status) {
          const { password, ...rest } = form;
          setAdmins([...admins, rest ]);
        }
        else {
          alert("Email already exists")
        }
      })
    setForm({ name: "", email: "", password: "", role: "admin"});
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#0f1c2e" }}>Admins</div>
          <div style={{ fontSize: 13, color: "#7a7a7a", marginTop: 2 }}>Manage administrator accounts</div>
        </div>
        <button onClick={() => setModal(true)} style={{ height: 36, padding: "0 16px", background: "#0f1c2e", color: "#fff", border: "none", borderRadius: 7, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>+</span> Add Admin
        </button>
      </div>
      <UserTable users={admins} setUsers={setAdmins} columns={["User", "Email", "Role"]} delfunc={delAdmin} />
      <Modal open={modal} onClose={() => setModal(false)} title="Add Admin" onSubmit={addAdmin} submitLabel="Add Admin">
        {[["Full Name", "name", "text", "John Smith"], ["Email", "email", "email", "admin@gmail.com"], ["Password", "password", "password", "••••••••"]].map(([label, key, type, ph]) => (
          <Field key={key} label={label}>
            <input style={inputStyle} type={type} placeholder={ph} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </Field>
        ))}
      </Modal>
    </div>
  );
};

// ── EMPLOYEES SECTION ──
function EmployeesSection({employees,setEmployees}) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });

  useEffect(() => {
    axios.get("${process.env.backend}/employee")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.log(err));
  }, [setEmployees]);

  async function delEmployee(email) {
    try {
      await axios.delete(`${process.env.backend}/employee/${email}`)
        .then(res => {
          if (res.data.status === true) 
            alert(`Employee(${email}) Deleted`)
            setEmployees(prev => prev.filter(u => u.email !== email));
        }).catch(err => {
          console.log(err)
        }
        )
    }
    catch (error) {
      console.log(error)
    }
  }

  const addEmployee = async() => {
    if (!form.name || !form.email || !form.password) {
      alert("Enter all details")
      return;
    }
    setModal(false);
    await axios.post("${process.env.backend}/employee", { form })
      .then((res) => {
        if (res.data.status === true) {
          const { password, ...rest } = form;
          setEmployees([...employees,  rest ]);
        }
        else {
          alert("Email already exists")
        }
      })
    setForm({ name: "", email: "", password: "", role : "employee"});
  }



  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#0f1c2e" }}>Employees</div>
          <div style={{ fontSize: 13, color: "#7a7a7a", marginTop: 2 }}>Manage employee accounts</div>
        </div>
        <button onClick={() => setModal(true)} style={{ height: 36, padding: "0 16px", background: "#0f1c2e", color: "#fff", border: "none", borderRadius: 7, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>+</span> Add Employee
        </button>
      </div>
      <UserTable users={employees} setUsers={setEmployees} columns={["User", "Email", "Role", "Projects"]} avatarBg="#1a2d45" delfunc={delEmployee}/>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Employee" onSubmit={addEmployee} submitLabel="Add Employee">
        {[["Full Name", "name", "text", "Abc"], ["Email", "email", "email", "employee@gmail.com"], ["Password", "password", "password", "*******"]].map(([label, key, type, ph]) => (
          <Field key={key} label={label}>
            <input style={inputStyle} type={type} placeholder={ph} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </Field>
        ))}
      </Modal>
    </div>
  );
}

// ── MAIN ADMIN DASHBOARD ──
export default function AdminDashboard() {
  const Location = useLocation()
  const {signedUser} = Location.state
  const [active, setActive] = useState("projects");
  const [admins, setAdmins] = useState([
    { name: "", email: "", role: "" }
  ]);
  const [employees, setEmployees] = useState([
    { name: "", userid: "", email: "", role: "" }
  ]);
  const [projects, setProjects] = useState([
    { id: 1, title: "CRM Redesign", employees: ["Alice", "Bob", "Charlie"], progress: 72, status: "Active", tasks: [{ name: "Design mockup", pct: 100 }, { name: "Component library", pct: 60 }] },
    { id: 2, title: "API Gateway", employees: ["Dave", "Eve"], progress: 45, status: "Active", tasks: [{ name: "Auth module", pct: 45 }] },
    { id: 3, title: "Mobile App v2", employees: ["Frank", "Grace", "Henry"], progress: 90, status: "Review", tasks: [{ name: "App Store submit", pct: 90 }] },
  ]);

  const counts = {
    projects: projects.length,
    admins: admins.length,
    employees: employees.length,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f7f8fa", color: "#0f1c2e" }}>

        {/* SIDEBAR */}
        <aside style={{ width: 220, background: "#0f1c2e", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
          <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 28, height: 28, border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 500 }}>A</div>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 500, letterSpacing: "0.04em" }}>Aaditya Corp</span>
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "1.5rem 1.25rem 0.5rem" }}>Menu</div>
          {NAV.map((n) => (
            <div key={n.key} onClick={() => setActive(n.key)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0.6rem 1.25rem", margin: "2px 0.75rem", borderRadius: 7,
              cursor: "pointer", userSelect: "none",
              color: active === n.key ? "#fff" : "rgba(255,255,255,0.55)",
              fontWeight: active === n.key ? 500 : 400, fontSize: 13.5,
              background: active === n.key ? "rgba(255,255,255,0.1)" : "transparent",
              transition: "background 0.15s",
            }}>
              <span style={{ opacity: active === n.key ? 1 : 0.7 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#fff" }}>AD</div>
            <div>
              <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 500 }}>{signedUser}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Admin</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ minWidth: "100%", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 2rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#0f1c2e" }}>
              {NAV.find((n) => n.key === active)?.label}
            </span>
            <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 20 }}>
              {counts[active]}
            </span>
          </div>
          <div style={{ padding: "2rem", flex: 1 }}>
            {active === "projects" && <ProjectsSection projects={projects} setProjects={setProjects}/>}
            {active === "admins" && <AdminsSection admins={admins} setAdmins={setAdmins}/>}
            {active === "employees" && <EmployeesSection employees={employees} setEmployees={setEmployees}/>}
          </div>
        </main>
      </div>
    </>
  );
}
