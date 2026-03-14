import { useState, useEffect, useRef } from "react";

// ─── GOOGLE FONTS ───
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0a0f1e;
      --bg2: #111827;
      --bg3: #1a2235;
      --card: #161d2f;
      --border: #1e2d45;
      --accent: #25d366;
      --accent2: #128c7e;
      --accent3: #075e54;
      --blue: #3b82f6;
      --purple: #8b5cf6;
      --orange: #f97316;
      --red: #ef4444;
      --yellow: #eab308;
      --text: #e2e8f0;
      --text2: #94a3b8;
      --text3: #475569;
      --radius: 12px;
      --shadow: 0 4px 24px rgba(0,0,0,0.4);
    }
    body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
    h1,h2,h3,h4 { font-family: 'Space Grotesk', sans-serif; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
    input, select, textarea { font-family: 'DM Sans', sans-serif; }
    
    @media (max-width: 768px) {
      .desktop-only { display: none !important; }
      .mobile-only { display: block !important; }
      .hide-mobile { display: none !important; }
      .full-mobile { width: 100% !important; max-width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; }
      .stack-mobile { flex-direction: column !important; }
      .grid-mobile-1 { grid-template-columns: 1fr !important; }
      .grid-mobile-2 { grid-template-columns: 1fr 1fr !important; }
    }
    @media (min-width: 769px) {
      .mobile-only { display: none !important; }
    }
    
    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `}</style>
);

// ─── ICONS ───
const Icon = ({ d, size = 18, color = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  dashboard: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  leads: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  pipeline: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  chat: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z",
  menu: "M3 12h18M3 6h18M3 18h18",
  close: "M18 6L6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  edit: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash: ["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
  check: "M20 6L9 17l-5-5",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.93 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l1.06-.89a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  menu: "M3 12h18M3 6h18M3 18h18",
  arrow: "M9 18l6-6-6-6",
  catalog: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
  rupee: "M9 3h6M9 8h6M9 3v18M13 3a5 5 0 0 1 0 10H9",
  drag: "M9 3h6M9 8h6M9 13h6M9 18h6",
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 8v4M12 16h.01"],
};

// ─── INITIAL DATA ───
const defaultPipelineStages = [
  { id: "s1", name: "New Lead", color: "#3b82f6", order: 0 },
  { id: "s2", name: "Contacted", color: "#8b5cf6", order: 1 },
  { id: "s3", name: "Interested", color: "#f97316", order: 2 },
  { id: "s4", name: "Negotiation", color: "#eab308", order: 3 },
  { id: "s5", name: "Won", color: "#25d366", order: 4 },
  { id: "s6", name: "Lost", color: "#ef4444", order: 5 },
];

const defaultLeadFields = [
  { id: "f1", key: "name", label: "Full Name", type: "text", required: true, enabled: true, system: true },
  { id: "f2", key: "phone", label: "WhatsApp Number", type: "tel", required: true, enabled: true, system: true },
  { id: "f3", key: "email", label: "Email Address", type: "email", required: false, enabled: true, system: false },
  { id: "f4", key: "address", label: "Address", type: "textarea", required: false, enabled: true, system: false },
  { id: "f5", key: "amount", label: "Deal Amount (₹)", type: "number", required: false, enabled: true, system: false },
  { id: "f6", key: "source", label: "Lead Source", type: "select", options: ["WhatsApp", "Referral", "Instagram", "Facebook", "Website", "Walk-in", "Cold Call"], required: false, enabled: true, system: false },
  { id: "f7", key: "notes", label: "Notes", type: "textarea", required: false, enabled: true, system: false },
];

const defaultCatalog = [];

const sampleLeads = [];

const sampleMessages = {};

// ─── HELPERS ───
const uid = () => Math.random().toString(36).slice(2, 8);
const fmtRupee = (n) => {
  if (n === 0) return "₹0";
  return n ? `₹${Number(n).toLocaleString("en-IN")}` : "—";
};

const getSaved = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};
const tagColors = { hot: "#ef4444", warm: "#f97316", cold: "#3b82f6", priority: "#8b5cf6", enterprise: "#25d366", closed: "#94a3b8" };

const API_BASE = '/api';

const apiFetch = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem("crm_user") || "null");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (user?.access) {
    headers["Authorization"] = `Bearer ${user.access}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const clone = res.clone();
    const errorData = await clone.json().catch(() => ({}));
    console.error(`API Error [${endpoint}]:`, res.status, errorData);
  }
  if (res.status === 401 && user?.access) {
    // Session expired
    localStorage.removeItem("crm_user");
    window.location.reload();
  }
  return res;
};

// ─── COMPONENTS ───

const Badge = ({ children, color = "#25d366", small }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: small ? "2px 7px" : "3px 10px",
    borderRadius: 20, fontSize: small ? 10 : 11, fontWeight: 600,
    background: color + "22", color, border: `1px solid ${color}44`,
    letterSpacing: "0.02em", textTransform: "uppercase"
  }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", icon, disabled, style }) => {
  const styles = {
    primary: { background: "linear-gradient(135deg, #25d366, #128c7e)", color: "#fff", border: "none" },
    secondary: { background: "transparent", color: "var(--text2)", border: "1px solid var(--border)" },
    danger: { background: "#ef444422", color: "#ef4444", border: "1px solid #ef444444" },
    ghost: { background: "transparent", color: "var(--text2)", border: "none" },
    blue: { background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f633" },
  };
  const sizes = { sm: { padding: "5px 12px", fontSize: 12 }, md: { padding: "8px 16px", fontSize: 13 }, lg: { padding: "11px 22px", fontSize: 14 } };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant], ...sizes[size],
      borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "DM Sans, sans-serif", fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 6,
      transition: "all 0.2s", opacity: disabled ? 0.5 : 1,
      ...style
    }}
      onMouseEnter={e => !disabled && (e.target.style.opacity = "0.85")}
      onMouseLeave={e => !disabled && (e.target.style.opacity = "1")}
    >
      {icon && <Icon d={icons[icon]} size={14} />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, required, options, rows }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>}
    {type === "select" ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8,
        color: "var(--text)", padding: "9px 12px", fontSize: 13
      }}>
        <option value="">Select...</option>
        {options?.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3} style={{
        background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8,
        color: "var(--text)", padding: "9px 12px", fontSize: 13, resize: "vertical"
      }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
        background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8,
        color: "var(--text)", padding: "9px 12px", fontSize: 13
      }} />
    )}
  </div>
);

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
    ...style, cursor: onClick ? "pointer" : "default"
  }}>{children}</div>
);

const Modal = ({ title, onClose, children, width = 520 }) => (
  <div style={{ position: "fixed", inset: 0, background: "#00000090", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={e => e.target === e.currentTarget && onClose()}>
    <Card className="full-mobile" style={{ width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }}><Icon d={icons.close} /></button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </Card>
  </div>
);

// ─── SIDEBAR ───
const Sidebar = ({ active, onNav, collapsed, setCollapsed, currentUser }) => {
  const allItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["admin", "manager", "agent"] },
    { id: "leads", label: "Leads", icon: "leads", roles: ["admin", "manager", "agent"] },
    { id: "pipeline", label: "Pipeline", icon: "pipeline", roles: ["admin", "manager", "agent"] },
    { id: "chat", label: "Chat", icon: "chat", roles: ["admin", "manager", "agent"] },
    { id: "catalog", label: "Catalog", icon: "catalog", roles: ["admin", "manager", "agent"] },
    { id: "settings", label: "Settings", icon: "settings", roles: ["admin", "manager"] },
  ];
  const navItems = allItems.filter(item => item.roles.includes(currentUser?.role));
  return (
    <div style={{
      width: collapsed ? 64 : 220, minHeight: "100vh", background: "var(--bg2)",
      borderRight: "1px solid var(--border)", transition: "width 0.3s",
      display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0
    }}>
      <div style={{ padding: collapsed ? "18px 16px" : "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #25d366, #128c7e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" style={{ display: 'none' }} />
            <path d="M3 11a9 9 0 0 1 18 0m-18 4a9 9 0 0 0 18 0M8 11a4 4 0 0 1 8 0" stroke="#fff" strokeWidth="2.5" />
            <path d="M2 11h20M2 15h20" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
          </svg>
        </div>
        {!collapsed && <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#25d366", letterSpacing: "0.5px" }}>ChatBridge</div>
          <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 500 }}>AI CRM PRO</div>
        </div>}
      </div>
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "10px 14px" : "10px 14px",
            borderRadius: 9, marginBottom: 2, cursor: "pointer",
            background: active === item.id ? "#25d36618" : "transparent",
            border: active === item.id ? "1px solid #25d36630" : "1px solid transparent",
            color: active === item.id ? "#25d366" : "var(--text2)",
            fontFamily: "DM Sans", fontWeight: active === item.id ? 600 : 400, fontSize: 13,
            transition: "all 0.2s", justifyContent: collapsed ? "center" : "flex-start"
          }}>
            <Icon d={icons[item.icon]} size={17} color={active === item.id ? "#25d366" : "var(--text2)"} />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.id === "chat" && <Badge color="#ef4444" small>3</Badge>}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: "100%", padding: "9px 14px", borderRadius: 8, cursor: "pointer",
          background: "transparent", border: "1px solid var(--border)", color: "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12
        }}>
          <Icon d={icons.arrow} size={14} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)" }} />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ───
const DashboardPage = ({ leads, stages, catalog, currentUser }) => {
  const isAgent = currentUser?.role === "agent";
  const myLeads = isAgent ? leads.filter(l => l.assigned_to_name === currentUser.name || l.assigned_to_name === currentUser.username) : leads;

  const total = myLeads.length;

  // Dynamic calculation based on stage properties (is_won/is_lost)
  const wonStages = stages.filter(s => s.is_won).map(s => s.id);
  const lostStages = stages.filter(s => s.is_lost).map(s => s.id);

  const wonLeads = myLeads.filter(l => wonStages.includes(l.stage));
  const won = wonLeads.length;
  const revenue = wonLeads.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  const pipelineLeads = myLeads.filter(l => !wonStages.includes(l.stage) && !lostStages.includes(l.stage));
  const pipelineValue = pipelineLeads.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  const conv = total ? Math.round((won / total) * 100) : 0;

  const stats = [
    { label: isAgent ? "My Leads" : "Total Leads", value: total, color: "#3b82f6", icon: "leads" },
    { label: "Won Deals", value: won, color: "#25d366", icon: "check" },
    { label: "Pipeline Value", value: fmtRupee(pipelineValue), color: "#8b5cf6", icon: "rupee" },
    { label: "Revenue Won", value: fmtRupee(revenue), color: "#f97316", icon: "star" },
  ];

  const stageData = stages.map(s => ({
    ...s,
    count: myLeads.filter(l => l.stage === s.id).length,
    value: myLeads.filter(l => l.stage === s.id).reduce((sum, l) => sum + (Number(l.amount) || 0), 0)
  }));

  const recent = [...myLeads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: "var(--text2)", fontSize: 12 }}>Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats */}
      <div className="grid-mobile-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={icons[s.icon]} size={18} color={s.color} />
              </div>
              <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>Total</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid-mobile-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Pipeline Funnel */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Sales Pipeline</h3>
          {stageData.map((s, i) => (
            <div key={s.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>{s.name}</span>
                <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{s.count} leads</span>
              </div>
              <div style={{ background: "var(--bg3)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{ width: `${total ? (s.count / total) * 100 : 0}%`, height: "100%", background: s.color, borderRadius: 4, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Recent Leads */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Recent Leads</h3>
          {recent.map(l => {
            const stage = stages.find(s => s.id === l.stage);
            return (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>+91 {l.phone}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {stage && <Badge color={stage.color} small>{stage.name}</Badge>}
                  {l.amount && <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{fmtRupee(l.amount)}</div>}
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Conversion */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Conversion Rate</h3>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#25d366" }}>{conv}%</span>
        </div>
        <div style={{ background: "var(--bg3)", borderRadius: 8, height: 12, overflow: "hidden" }}>
          <div style={{ width: `${conv}%`, height: "100%", background: "linear-gradient(90deg, #25d366, #128c7e)", borderRadius: 8, transition: "width 0.5s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--text3)" }}>
          <span>{total} total leads</span><span>{won} won</span>
        </div>
      </Card>
    </div>
  );
};

// ─── LEADS PAGE ───
const LeadsPage = ({ leads, setLeads, stages, leadFields, catalog = [], currentUser, agents, users, refreshToken }) => {
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterAgent, setFilterAgent] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [form, setForm] = useState({});
  const [selected, setSelected] = useState([]);
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [bulkAgent, setBulkAgent] = useState("");
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [autoAgents, setAutoAgents] = useState([]);
  const [autoRoundIdx, setAutoRoundIdx] = useState(0);
  const [toast, setToast] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const enabledFields = leadFields.filter(f => f.enabled);

  const fetchLeads = async () => {
    setLoading(true);
    let url = `/leads/?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (filterStage) url += `&stage=${filterStage}`;
    if (filterAgent) {
      if (filterAgent === "__unassigned__") url += `&assigned_to=null`;
      else {
        const agentObj = users.find(u => u.name === filterAgent || u.username === filterAgent);
        if (agentObj) url += `&assigned_to=${agentObj.id}`;
      }
    }
    if (filterDateFrom) url += `&date_from=${filterDateFrom}`;
    if (filterDateTo) url += `&date_to=${filterDateTo}`;

    try {
      const res = await apiFetch(url);
      const data = await res.json();
      setPageData(data.results || []);
      setTotalCount(data.count || 0);
    } catch (e) {
      console.error("Fetch error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [page, filterStage, filterAgent, filterDateFrom, filterDateTo]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filterStage, filterAgent, filterDateFrom, filterDateTo]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchLeads();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fix 3+4: Re-fetch when refreshToken changes (triggered by WebSocket or any action)
  useEffect(() => {
    if (refreshToken) fetchLeads();
  }, [refreshToken]);

  const showToast = (msg, color = "#25d366") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const isAgent = currentUser?.role === "agent";

  // Use pageData instead of filtered local leads
  const displayLeads = pageData;
  const filteredCount = totalCount;

  const activeFilters = [filterStage, filterAgent, filterDateFrom, filterDateTo].filter(Boolean).length;
  const allAgents = [...new Set(leads.map(l => l.assigned_to_name).filter(Boolean))];
  const clearFilters = () => { setFilterStage(""); setFilterAgent(""); setFilterDateFrom(""); setFilterDateTo(""); };

  const downloadCSV = () => {
    const cols = ["Name", "Phone", "Email", "Stage", "Agent", "Amount", "Source", "Address", "Date", "Notes", "Tags"];
    const rows = displayLeads.map(l => {
      const stage = stages.find(s => s.id === l.stage);
      return [l.name, l.phone, l.email || "", stage?.name || "", l.assigned_to_name || "",
      l.amount || "", l.source || "", l.address || "", l.created_at || "",
      (l.notes || "").replace(/,/g, ";"), (l.tags || []).join("|")
      ].map(v => `"${v}"`).join(",");
    });
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast(`${displayLeads.length} leads downloaded!`);
  };

  const applyBulkAssign = async () => {
    if (!bulkAgent) return;
    const agentId = users.find(a => a.name === bulkAgent || a.username === bulkAgent)?.id;
    if (!agentId) return alert("Agent ID not found");

    const promises = selected.map(id => apiFetch(`/leads/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ assigned_to: parseInt(agentId) })
    }));

    await Promise.all(promises);

    // Refresh leads to get updated names
    const res = await apiFetch("/leads/");
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : (data.results || []));

    showToast(`${selected.length} leads assigned to ${bulkAgent}`);
    setSelected([]); setShowBulkAssign(false); setBulkAgent("");
  };

  const applyAutoAssign = async () => {
    if (!autoAgents.length) return;
    let idx = autoRoundIdx;

    const unassigned = leads.filter(l => !l.assigned_to_name);
    if (!unassigned.length) {
      showToast("No unassigned leads found");
      return setShowAutoModal(false);
    }

    const promises = unassigned.map(l => {
      const agentName = autoAgents[idx % autoAgents.length];
      idx++;
      const agentId = users.find(a => a.name === agentName || a.username === agentName)?.id;
      return apiFetch(`/leads/${l.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ assigned_to: parseInt(agentId) })
      });
    });

    await Promise.all(promises);

    const res = await apiFetch("/leads/");
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : (data.results || []));

    setAutoRoundIdx(idx);
    showToast(`${unassigned.length} leads auto-assigned (Round Robin)`);
    setShowAutoModal(false);
  };

  const toggleSelect = (id) => {
    const sid = String(id);
    setSelected(p => p.includes(sid) ? p.filter(x => x !== sid) : [...p, sid]);
  };
  // Fix 2: Proper select-all using normalized string IDs + correct all-selected check
  const currentPageIds = displayLeads.map(l => String(l.id));
  const allPageSelected = currentPageIds.length > 0 && currentPageIds.every(id => selected.includes(id));
  const toggleAll = () => {
    if (allPageSelected) {
      // Deselect only current page leads (keep others if any)
      setSelected(p => p.filter(id => !currentPageIds.includes(id)));
    } else {
      // Select all on current page (merge with existing)
      setSelected(p => [...new Set([...p, ...currentPageIds])]);
    }
  };

  const openAdd = () => { setForm({ stage: stages[0]?.id, assigned_to_name: "" }); setEditLead(null); setShowAdd(true); };
  const openEdit = (l) => { setForm({ ...l }); setEditLead(l.id); setShowAdd(true); };

  const saveLead = async () => {
    if (!form.name || !form.phone) return alert("Name aur phone required hain!");

    const method = editLead ? "PATCH" : "POST";
    const url = editLead ? `/leads/${editLead}/` : `/leads/`;

    // Map assigned_to_name (string) to assigned_to (ID)
    const payload = { ...form };
    if (payload.assigned_to_name) {
      const agent = users.find(a => a.name === payload.assigned_to_name || a.username === payload.assigned_to_name);
      if (agent) payload.assigned_to = parseInt(agent.id);
    } else if (payload.assigned_to_name === "") {
      payload.assigned_to = null;
    }
    // API throws error if we send these read-only fields
    delete payload.assigned_to_name;
    delete payload.stage_name;
    delete payload.stage_color;
    delete payload.catalog_name;

    try {
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        if (editLead) {
          setLeads(prev => prev.map(l => l.id === editLead ? saved : l));
          showToast("Lead updated!");
        } else {
          setLeads(prev => [saved, ...prev]);
          showToast("Lead added!");
        }
        setShowAdd(false); setEditLead(null); setForm({});
      } else {
        const err = await res.json();
        alert("Error saving: " + JSON.stringify(err));
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };

  const deleteLead = async (id) => {
    if (confirm("Is lead ko delete karo?")) {
      try {
        const res = await apiFetch(`/leads/${id}/`, { method: "DELETE" });
        if (res.ok) {
          setLeads(prev => prev.filter(l => l.id !== id));
          showToast("Lead deleted", "#ef4444");
        }
      } catch (e) {
        alert("Delete failed");
      }
    }
  };

  const selStyle = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "8px 12px", fontSize: 12, cursor: "pointer", width: "100%" };

  return (
    <div style={{ padding: 24 }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.color + "22", border: `1px solid ${toast.color}55`, borderRadius: 10, padding: "12px 20px", color: toast.color, fontWeight: 600, fontSize: 13 }}>
          ✓ {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Leads</h1>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>{filteredCount} leads found</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Btn variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)} icon="pipeline">
            Filters {activeFilters > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, marginLeft: 2 }}>{activeFilters}</span>}
          </Btn>
          {!isAgent && <Btn size="sm" onClick={openAdd} icon="plus">Add Lead</Btn>}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, phone, email..." style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px 14px", fontSize: 13 }} />
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card style={{ padding: 16, marginBottom: 14 }}>
          <div className="grid-mobile-1" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Stage</div>
              <select value={filterStage} onChange={e => setFilterStage(e.target.value)} style={selStyle}>
                <option value="">All Stages</option>
                {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {!isAgent && (
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Agent</div>
                <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)} style={selStyle}>
                  <option value="">All Agents</option>
                  <option value="__unassigned__">⚠ Unassigned</option>
                  {[...new Set([...allAgents, ...agents])].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Date From</div>
              <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} style={{ ...selStyle, colorScheme: "dark" }} />
            </div>
            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Date To</div>
              <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} style={{ ...selStyle, colorScheme: "dark" }} />
            </div>
            <Btn variant="danger" size="sm" onClick={clearFilters}>Clear All</Btn>
          </div>
          {activeFilters > 0 && (
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {filterStage && <span style={{ background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f633", borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>Stage: {stages.find(s => s.id === filterStage)?.name}</span>}
              {!isAgent && filterAgent && <span style={{ background: "#8b5cf622", color: "#8b5cf6", border: "1px solid #8b5cf633", borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>Agent: {filterAgent === "__unassigned__" ? "Unassigned" : filterAgent}</span>}
              {filterDateFrom && <span style={{ background: "#f9731622", color: "#f97316", border: "1px solid #f9731633", borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>From: {filterDateFrom}</span>}
              {filterDateTo && <span style={{ background: "#f9731622", color: "#f97316", border: "1px solid #f9731633", borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>To: {filterDateTo}</span>}
            </div>
          )}
        </Card>
      )}

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div style={{ background: "#3b82f611", border: "1px solid #3b82f633", borderRadius: 8, padding: "10px 16px", marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>{selected.length} leads selected</span>
          {!isAgent && <Btn size="sm" variant="blue" onClick={() => setShowBulkAssign(true)} icon="leads">Manual Assign</Btn>}
          <Btn size="sm" variant="secondary" onClick={() => setSelected([])}>Deselect All</Btn>
        </div>
      )}

      {/* Select All row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "0 4px" }}>
        <input type="checkbox"
          checked={allPageSelected}
          onChange={toggleAll}
          style={{ width: 15, height: 15, cursor: "pointer", accentColor: "#25d366" }} />
        <span style={{ fontSize: 12, color: "var(--text3)" }}>Select All on this page ({displayLeads.length})</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text3)" }}>Total: {totalCount} leads</span>
      </div>

      {/* Leads List */}
      <div style={{ display: "grid", gap: 8, opacity: loading ? 0.6 : 1, transition: "opacity 0.2s" }}>
        {displayLeads.map(l => {
          const stage = stages.find(s => s.id === l.stage);
          const isSelected = selected.includes(String(l.id));
          return (
            <Card key={l.id} style={{ padding: "12px 16px", border: isSelected ? "1px solid #3b82f655" : "1px solid var(--border)", background: isSelected ? "#3b82f608" : "var(--card)", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(l.id)} style={{ width: 15, height: 15, cursor: "pointer", accentColor: "#25d366", flexShrink: 0 }} />
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#25d36622", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 700, color: "#25d366" }}>
                  {l.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>+91 {l.phone}{l.email ? ` • ${l.email}` : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  {stage && <Badge color={stage.color} small>{stage.name}</Badge>}
                  {l.amount && <span style={{ fontSize: 12, color: "#25d366", fontWeight: 700 }}>{fmtRupee(l.amount)}</span>}
                  {l.source && <Badge color="#3b82f6" small>{l.source}</Badge>}
                </div>
                {!isAgent && (
                  <select value={l.assigned_to_name || ""} onChange={async e => {
                    const newName = e.target.value;
                    const agentObj = users.find(a => a.name === newName || a.username === newName);

                    // Optimistic update
                    setLeads(p => p.map(x => x.id === l.id ? { ...x, assigned_to_name: newName } : x));
                    showToast(newName ? `Assigned to ${newName}` : "Unassigned");

                    // Actual API call
                    await apiFetch(`/leads/${l.id}/`, {
                      method: 'PATCH',
                      body: JSON.stringify({ assigned_to: agentObj ? parseInt(agentObj.id) : null })
                    });
                  }} style={{ background: l.assigned_to_name ? "#8b5cf611" : "var(--bg3)", border: `1px solid ${l.assigned_to_name ? "#8b5cf633" : "var(--border)"}`, borderRadius: 6, color: l.assigned_to_name ? "#8b5cf6" : "var(--text3)", padding: "4px 8px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    <option value="">👤 Unassigned</option>
                    {agents.map(a => <option key={a.id || a} value={a.name || a}>👤 {a.name || a}</option>)}
                  </select>
                )}
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{new Date(l.created_at).toLocaleDateString()}</div>
                <div style={{ display: "flex", gap: 5 }}>
                  <Btn variant="ghost" size="sm" onClick={() => setViewLead(l)} icon="eye" />
                  {!isAgent && <Btn variant="ghost" size="sm" onClick={() => openEdit(l)} icon="edit" />}
                  {!isAgent && <Btn variant="danger" size="sm" onClick={() => deleteLead(l.id)} icon="trash" />}
                </div>
              </div>
              {l.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 5, marginTop: 7, paddingLeft: 61, flexWrap: "wrap" }}>
                  {l.tags.map(t => <Badge key={t} color={tagColors[t] || "#94a3b8"} small>{t}</Badge>)}
                </div>
              )}
            </Card>
          );
        })}
        {!displayLeads.length && !loading && (
          <div style={{ textAlign: "center", color: "var(--text3)", padding: 48, fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            No leads found. Filters change karo ya add karo new lead!
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 15 }}>
        <Btn variant="secondary" size="sm" onClick={() => setPage(1)} disabled={page === 1 || loading}>First</Btn>
        <Btn variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>Prev</Btn>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>Page {page} of {Math.ceil(totalCount / 50) || 1}</span>
        <Btn variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(totalCount / 50) || loading}>Next</Btn>
        <Btn variant="secondary" size="sm" onClick={() => setPage(Math.ceil(totalCount / 50))} disabled={page >= Math.ceil(totalCount / 50) || loading}>Last</Btn>
      </div>

      {/* Bulk Manual Assign Modal */}
      {showBulkAssign && (
        <Modal title={`Manual Assign — ${selected.length} Leads`} onClose={() => setShowBulkAssign(false)} width={400}>
          <div style={{ display: "grid", gap: 14 }}>
            <p style={{ fontSize: 13, color: "var(--text2)" }}>In {selected.length} selected leads ko konse agent ko assign karna hai?</p>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Select Agent</label>
              <select value={bulkAgent} onChange={e => setBulkAgent(e.target.value)} style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px 12px", fontSize: 13 }}>
                <option value="">-- Agent choose karo --</option>
                {agents.map(a => <option key={a.id || a} value={a.name || a}>{a.name || a}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setShowBulkAssign(false)}>Cancel</Btn>
              <Btn onClick={applyBulkAssign} disabled={!bulkAgent}>Assign Karo</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Auto Assign Modal */}
      {showAutoModal && (
        <Modal title="Auto Assign Settings" onClose={() => setShowAutoModal(false)} width={460}>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "#25d36611", border: "1px solid #25d36633", borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: "#25d366", fontWeight: 600, marginBottom: 4 }}>🔄 Round Robin Mode</p>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>Naye leads automatically agents mein barabar distribute honge — ek ke baad ek order mein.</p>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Agents in Rotation</label>
              <div style={{ display: "grid", gap: 6 }}>
                {agents.map(a => {
                  const agentName = a.name || a;
                  return (
                    <label key={agentName} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 12px", background: autoAgents.includes(agentName) ? "#25d36611" : "var(--bg3)", border: `1px solid ${autoAgents.includes(agentName) ? "#25d36633" : "var(--border)"}`, borderRadius: 7 }}>
                      <input type="checkbox" checked={autoAgents.includes(agentName)} onChange={() => setAutoAgents(p => p.includes(agentName) ? p.filter(x => x !== agentName) : [...p, agentName])} style={{ accentColor: "#25d366" }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>👤 {agentName}</span>
                      {autoAgents.includes(agentName) && <span style={{ fontSize: 10, color: "#25d366", marginLeft: "auto" }}>Active</span>}
                    </label>
                  );
                })}
              </div>
            </div>
            <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>Abhi <strong style={{ color: "#f97316" }}>{leads.filter(l => !l.assigned_to_name).length} unassigned leads</strong> hain.</p>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setShowAutoModal(false)}>Cancel</Btn>
              <Btn variant="blue" onClick={applyAutoAssign} disabled={!autoAgents.length}>Unassigned Leads Auto-Assign Karo</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add/Edit Modal */}
      {showAdd && (
        <Modal title={editLead ? "Edit Lead" : "Add New Lead"} onClose={() => { setShowAdd(false); setEditLead(null); }}>
          <div style={{ display: "grid", gap: 14 }}>

            {/* Catalog Selector */}
            {catalog.filter(c => c.active).length > 0 && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                  📦 Catalog se Select Karo <span style={{ color: "var(--text3)", fontWeight: 400, textTransform: "none", fontSize: 11 }}>(optional — amount auto-fill hoga)</span>
                </label>
                <div style={{ display: "grid", gap: 6, maxHeight: 180, overflow: "auto" }}>
                  {catalog.filter(c => c.active).map(item => (
                    <div key={item.id} onClick={() => setForm(p => ({ ...p, catalogId: item.id, catalogName: item.name, amount: String(item.price) }))} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: 8, cursor: "pointer", background: form.catalogId === item.id ? "#25d36618" : "var(--bg3)", border: `1px solid ${form.catalogId === item.id ? "#25d36660" : "var(--border)"}`, transition: "all 0.15s" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: form.catalogId === item.id ? "#25d366" : "var(--text)" }}>{item.name}</div>
                        {item.description && <div style={{ fontSize: 11, color: "var(--text3)" }}>{item.description}</div>}
                        {item.category && <span style={{ fontSize: 10, background: "#8b5cf622", color: "#8b5cf6", borderRadius: 4, padding: "1px 6px" }}>{item.category}</span>}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#25d366" }}>₹{Number(item.price).toLocaleString("en-IN")}</div>
                        {form.catalogId === item.id && <div style={{ fontSize: 10, color: "#25d366" }}>✓ Selected</div>}
                      </div>
                    </div>
                  ))}
                  {form.catalogId && (
                    <div onClick={() => setForm(p => ({ ...p, catalogId: "", catalogName: "", amount: "" }))} style={{ textAlign: "center", padding: "6px", fontSize: 11, color: "#ef4444", cursor: "pointer" }}>✕ Selection clear karo</div>
                  )}
                </div>
              </div>
            )}

            {/* Normal Fields */}
            {enabledFields.map(f => (
              <Input key={f.id} label={f.label} type={f.type} value={form[f.key] || ""} onChange={v => {
                // If amount field changed manually, clear catalog selection
                if (f.key === "amount") setForm(p => ({ ...p, amount: v, catalogId: "", catalogName: "" }));
                else setForm(p => ({ ...p, [f.key]: v }));
              }} required={f.required} placeholder={f.key === "amount" && form.catalogName ? `Auto: ${form.catalogName}` : `Enter ${f.label.toLowerCase()}`} options={f.options} />
            ))}

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Stage</label>
              <select value={form.stage || (stages[0]?.id)} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))} style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 12px", fontSize: 13 }}>
                {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {/* Assign to Agent - only admin can change */}
            {!isAgent && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                  Assign To Agent
                </label>
                <select value={form.assigned_to_name || ""} onChange={e => setForm(p => ({ ...p, assigned_to_name: e.target.value }))} style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 12px", fontSize: 13 }}>
                  <option value="">-- Select Agent --</option>
                  {agents.map(a => <option key={a.id || a} value={a.name || a}>{a.name || a}</option>)}
                </select>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn onClick={saveLead}>{editLead ? "Update Lead" : "Add Lead"}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewLead && (
        <Modal title="Lead Details" onClose={() => setViewLead(null)}>
          <div style={{ display: "grid", gap: 12 }}>
            {enabledFields.map(f => viewLead[f.key] && (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>{f.label}</span>
                <span style={{ fontSize: 13, color: "var(--text)", maxWidth: "55%", textAlign: "right" }}>{f.key === "amount" ? fmtRupee(viewLead[f.key]) : viewLead[f.key]}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn onClick={() => { setViewLead(null); openEdit(viewLead); }} icon="edit" variant="secondary">Edit</Btn>
              {!isAgent && <Btn onClick={() => { window.open(`https://wa.me/91${viewLead.phone}`); }} icon="whatsapp">WhatsApp</Btn>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── PIPELINE PAGE (SALES FUNNEL) ───
const PipelinePage = ({ leads, stages, currentUser }) => {
  const isAgent = currentUser?.role === "agent";
  const visibleLeads = isAgent ? leads.filter(l => l.assigned_to_name === currentUser.name || l.assigned_to_name === currentUser.username) : leads;

  // Calculate cumulative leads for the sales funnel
  // A lead in stage i is implicitly counted in stage 0...i-1
  const funnelData = [];
  let runningTotal = 0;

  for (let i = stages.length - 1; i >= 0; i--) {
    const stage = stages[i];
    const exactCount = visibleLeads.filter(l => l.stage === stage.id).length;
    const stageLeads = visibleLeads.filter(l => l.stage === stage.id);
    const stageValue = stageLeads.reduce((s, l) => s + (Number(l.amount) || 0), 0);

    runningTotal += exactCount;
    funnelData.unshift({
      ...stage,
      exactCount,
      cumulativeCount: runningTotal,
      stageValue
    });
  }

  const maxLeads = funnelData[0]?.cumulativeCount || 1;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Sales Funnel</h1>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Analyze conversion rates at each stage of your pipeline</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, paddingBottom: 40 }}>
        {funnelData.map((stage, i) => {
          const prevCount = i === 0 ? stage.cumulativeCount : funnelData[i - 1].cumulativeCount;
          const conversionRate = prevCount > 0 ? ((stage.cumulativeCount / prevCount) * 100).toFixed(1) : 0;
          const dropoffRate = prevCount > 0 ? (((prevCount - stage.cumulativeCount) / prevCount) * 100).toFixed(1) : 0;

          const widthPercent = prevCount > 0 ? Math.max(25, (stage.cumulativeCount / maxLeads) * 100) : 100;

          return (
            <div key={stage.id} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Conversion Rate Marker Arrow */}
              {i > 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: 70, position: "relative" }}>
                  <div style={{ width: 2, height: "100%", background: "var(--border)", opacity: 0.5 }}></div>
                  <div style={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 20,
                    padding: "6px 16px", display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)", zIndex: 10
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: conversionRate >= 50 ? "#25d366" : "#f59e0b" }}>
                      ↓ {conversionRate}% Converted
                    </span>
                    {dropoffRate > 0 && (
                      <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, background: "#ef444411", padding: "2px 6px", borderRadius: 10 }}>
                        {dropoffRate}% Drop-off
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Stage Funnel Bar */}
              <div style={{
                width: `${widthPercent}%`,
                minWidth: 280,
                background: `linear-gradient(135deg, ${stage.color}15, ${stage.color}05)`,
                border: `1.5px solid ${stage.color}55`,
                borderTop: `4px solid ${stage.color}`,
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                boxShadow: `0 8px 24px ${stage.color}11`
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 6, background: stage.color }} />
                    {stage.name}
                  </h3>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 6, display: "flex", gap: 12 }}>
                    <span>Currently Here: <strong style={{ color: "var(--text)" }}>{stage.exactCount}</strong></span>
                    {stage.stageValue > 0 && (
                      <span>Value: <strong style={{ color: "var(--text)" }}>{fmtRupee(stage.stageValue)}</strong></span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: stage.color, lineHeight: 1 }}>
                    {stage.cumulativeCount}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4, fontWeight: 600 }}>
                    Total Entered
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {funnelData.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text3)", padding: "40px 0" }}>
          No stages or leads found to build funnel.
        </div>
      )}
    </div>
  );
};

// ─── CHAT PAGE ───
// Fix 1: aiEnabled is now a map per lead (aiEnabledMap), passed from App so it persists across lead selection
const ChatPage = ({ leads, stages, messages, setMessages, currentUser, aiEnabledMap, setAiEnabledMap }) => {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("list"); // 'list' or 'chat' for mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [input, setInput] = useState("");
  const messagesEnd = useRef(null);
  // Fix 1: Get AI enabled state for currently selected lead (default true)
  const aiEnabled = selected != null ? (aiEnabledMap[selected] ?? true) : true;
  const setAiEnabled = (val) => setAiEnabledMap(prev => ({ ...prev, [selected]: val }));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAgent = currentUser?.role === "agent";
  const visibleLeads = isAgent ? leads.filter(l => l.assigned_to_name === currentUser.name || l.assigned_to_name === currentUser.username) : leads;

  useEffect(() => {
    if (visibleLeads.length > 0 && !selected) {
      // Don't auto-select on mobile to stay in list view
      if (!isMobile) setSelected(visibleLeads[0].id);
    } else if (visibleLeads.length === 0) {
      setSelected(null);
    }
  }, [visibleLeads, selected]);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [selected, messages]);

  const selectedLead = leads.find(l => l.id === selected);
  const stage = stages.find(s => s.id === selectedLead?.stage);
  const msgs = messages[selected] || [];

  const sendMsg = () => {
    if (!input.trim() || !selected) return;
    const newMsg = { id: uid(), role: "assistant", content: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(p => ({ ...p, [selected]: [...(p[selected] || []), newMsg] }));
    setInput("");
    if (aiEnabled) {
      setTimeout(() => {
        const replies = ["Theek hai, main dekhta hoon!", "Haan bilkul, mujhe thoda time dijiye.", "Aapki request process ho rahi hai.", "Samajh gaya, abhi batata hoon!"];
        const ai = { id: uid(), role: "user", content: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
        setMessages(p => ({ ...p, [selected]: [...(p[selected] || []), ai] }));
      }, 1200);
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)", overflow: "hidden", position: "relative" }}>
      {/* Lead List */}
      <div style={{
        width: isMobile ? "100%" : 280,
        display: isMobile && view === "chat" ? "none" : "block",
        borderRight: "1px solid var(--border)",
        overflow: "auto",
        flexShrink: 0,
        background: "var(--bg)"
      }}>
        <div style={{ padding: "16px 14px 10px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Conversations</h2>
          <input placeholder="🔍 Search..." style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "8px 12px", fontSize: 12 }} />
        </div>
        {visibleLeads.map(l => {
          const st = stages.find(s => s.id === l.stage);
          const lastMsg = (messages[l.id] || []).slice(-1)[0];
          return (
            <div key={l.id} onClick={() => { setSelected(l.id); if (isMobile) setView("chat"); }} style={{
              padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)",
              background: selected === l.id ? "#25d36610" : "transparent",
              borderLeft: selected === l.id ? "3px solid #25d366" : "3px solid transparent"
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#25d36622", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#25d366", flexShrink: 0 }}>
                  {l.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.name}</span>
                    {st && <Badge color={st.color} small>{st.name}</Badge>}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lastMsg ? lastMsg.content : "+91 " + l.phone}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        display: isMobile && view === "list" ? "none" : "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg)"
      }}>
        {selectedLead ? <>
          {/* Header */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {isMobile && (
                <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: "4px 8px 4px 0" }}>
                  <Icon d={icons.arrow} size={20} style={{ transform: "rotate(180deg)" }} />
                </button>
              )}
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#25d36622", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#25d366" }}>
                {selectedLead.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedLead.name}</div>
                <div style={{ fontSize: 11, color: "var(--text2)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>+91 {selectedLead.phone}</span>
                  {!isMobile && stage && <Badge color={stage.color} small>{stage.name}</Badge>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {!isMobile && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 8, background: "var(--bg3)", padding: "4px 8px", borderRadius: 20 }}>
                  <div onClick={() => setAiEnabled(!aiEnabled)} style={{ width: 30, height: 16, borderRadius: 8, background: aiEnabled ? "#25d366" : "var(--border)", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                    <div style={{ width: 12, height: 12, borderRadius: 6, background: "#fff", position: "absolute", top: 2, left: aiEnabled ? 16 : 2, transition: "left 0.2s" }} />
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600 }}>AI</span>
                </div>
              )}
              <Btn variant="ghost" size="sm" onClick={() => window.open(`tel:+91${selectedLead.phone}`)} style={{ padding: 6 }}><Icon d={icons.phone} size={16} /></Btn>
              <Btn variant="ghost" size="sm" onClick={() => window.open(`https://wa.me/91${selectedLead.phone}`)} style={{ padding: 6 }}><Icon d={icons.whatsapp} size={16} /></Btn>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: m.role === "assistant" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "70%", padding: "9px 14px", borderRadius: m.role === "assistant" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                  background: m.role === "assistant" ? "linear-gradient(135deg, #25d36633, #128c7e33)" : "var(--card)",
                  border: `1px solid ${m.role === "assistant" ? "#25d36640" : "var(--border)"}`,
                  fontSize: 13, lineHeight: 1.5
                }}>
                  {m.content}
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4, textAlign: "right" }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Type a message..." style={{
              flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", padding: "10px 14px", fontSize: 13
            }} />
            <button onClick={sendMsg} style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg, #25d366, #128c7e)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={icons.send} size={16} color="#fff" />
            </button>
          </div>
        </> : <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 14 }}>Select a lead to start chatting</div>}
      </div>
    </div>
  );
};

// ─── CATALOG PAGE ───
const CatalogPage = ({ catalog, setCatalog, currentUser }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});

  const openAdd = () => { setForm({ active: true }); setEditItem(null); setShowAdd(true); };
  const openEdit = (item) => { setForm({ ...item }); setEditItem(item.id); setShowAdd(true); };

  const save = async () => {
    if (!form.name || !form.price) return alert("Name and price required!");
    try {
      if (editItem) {
        const res = await apiFetch(`/catalog/${editItem}/`, {
          method: "PATCH",
          body: JSON.stringify(form)
        });
        if (res.ok) {
          const updated = await res.json();
          setCatalog(p => p.map(c => c.id === editItem ? updated : c));
        }
      } else {
        const res = await apiFetch("/catalog/", {
          method: "POST",
          body: JSON.stringify(form)
        });
        if (res.ok) {
          const created = await res.json();
          setCatalog(p => [...p, created]);
        }
      }
    } catch (e) {
      console.error("Save failed:", e);
    }
    setShowAdd(false);
  };

  const toggleActive = async (id) => {
    const item = catalog.find(c => c.id === id);
    if (!item) return;
    try {
      const res = await apiFetch(`/catalog/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ active: !item.active })
      });
      if (res.ok) {
        setCatalog(p => p.map(c => c.id === id ? { ...c, active: !c.active } : c));
      }
    } catch (e) {
      console.error("Toggle failed:", e);
    }
  };

  const deleteItem = async (id) => {
    if (confirm("Delete?")) {
      try {
        const res = await apiFetch(`/catalog/${id}/`, { method: "DELETE" });
        if (res.ok) {
          setCatalog(p => p.filter(c => c.id !== id));
        }
      } catch (e) {
        console.error("Delete failed:", e);
      }
    }
  };

  const categories = [...new Set(catalog.map(c => c.category).filter(Boolean))];

  const isAgent = currentUser?.role === "agent";

  return (
    <div style={{ padding: "16px" }}>
      <div className="stack-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Product Catalog</h1>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>{catalog.length} items in catalog</p>
        </div>
        {!isAgent && <Btn onClick={openAdd} icon="plus">Add Item</Btn>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {catalog.map(item => (
          <Card key={item.id} style={{ padding: 18, opacity: item.active ? 1 : 0.55 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "#8b5cf622", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={icons.catalog} size={20} color="#8b5cf6" />
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {item.category && <Badge color="#8b5cf6" small>{item.category}</Badge>}
                <div onClick={() => toggleActive(item.id)} style={{ width: 32, height: 18, borderRadius: 9, background: item.active ? "#25d366" : "var(--border)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", position: "absolute", top: 2, left: item.active ? 16 : 2, transition: "left 0.2s" }} />
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10, minHeight: 32 }}>{item.description}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#25d366" }}>{fmtRupee(item.price)}</span>
              {!isAgent && (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="ghost" size="sm" onClick={() => openEdit(item)} icon="edit" />
                  <Btn variant="danger" size="sm" onClick={() => deleteItem(item.id)} icon="trash" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal title={editItem ? "Edit Item" : "Add Catalog Item"} onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gap: 14 }}>
            <Input label="Product / Service Name" value={form.name || ""} onChange={v => setForm(p => ({ ...p, name: v }))} required placeholder="e.g. Premium Plan" />
            <Input label="Price (₹)" type="number" value={form.price || ""} onChange={v => setForm(p => ({ ...p, price: v }))} required placeholder="0" />
            <Input label="Category" value={form.category || ""} onChange={v => setForm(p => ({ ...p, category: v }))} placeholder="e.g. Service, Product" />
            <Input label="Description" type="textarea" value={form.description || ""} onChange={v => setForm(p => ({ ...p, description: v }))} placeholder="Brief description..." />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn onClick={save}>{editItem ? "Update" : "Add Item"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── SETTINGS PAGE ───
const SettingsPage = ({ stages, setStages, leadFields, setLeadFields, currentUser, openAIKey, setOpenAIKey, systemPrompt, setSystemPrompt, users, setUsers, bizInfo, setBizInfo, waStatus, fetchStatus, qr, onDisconnect, onReset, waMode, setWaMode, metaPhoneId, setMetaPhoneId, metaToken, setMetaToken, metaAppId, setMetaAppId }) => {
  const [tab, setTab] = useState("pipeline");
  const [showAddStage, setShowAddStage] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [stageForm, setStageForm] = useState({});
  const [fieldForm, setFieldForm] = useState({});
  const [userForm, setUserForm] = useState({ role: "agent" });
  const [editStage, setEditStage] = useState(null);

  const stageColors = ["#25d366", "#3b82f6", "#8b5cf6", "#f97316", "#ef4444", "#eab308", "#06b6d4", "#ec4899"];

  const saveStage = () => {
    if (!stageForm.name) return;
    if (editStage) setStages(p => p.map(s => s.id === editStage ? { ...s, ...stageForm } : s));
    else setStages(p => [...p, { ...stageForm, id: "s" + uid(), order: p.length }]);
    setShowAddStage(false); setEditStage(null); setStageForm({});
  };

  const deleteStage = (id) => { if (!["s1"].includes(id) && confirm("Delete stage?")) setStages(p => p.filter(s => s.id !== id)); };

  const saveField = async () => {
    if (!fieldForm.label || !fieldForm.key) return;
    if (leadFields.some(f => f.key === fieldForm.key)) return alert("Key already exists!");
    const finalType = fieldForm.type || "text";

    try {
      const res = await apiFetch("/lead-fields/", {
        method: "POST",
        body: JSON.stringify({
          key: fieldForm.key,
          label: fieldForm.label,
          field_type: finalType,
          required: false,
          enabled: true,
          is_system: false
        })
      });
      if (res.ok) {
        const saved = await res.json();
        setLeadFields(p => [...p, { ...saved, type: saved.field_type, system: saved.is_system }]);
        setShowAddField(false); setFieldForm({});
      } else {
        alert("Failed to save field to backend.");
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  };

  const deleteField = async (id) => {
    const field = leadFields.find(f => f.id === id);
    if (field?.system || field?.key === "phone" || field?.key === "catalog") return alert("Cannot delete essential system fields!");

    if (confirm("Delete custom field?")) {
      try {
        const res = await apiFetch(`/lead-fields/${id}/`, { method: "DELETE" });
        if (res.ok) {
          setLeadFields(p => p.filter(f => f.id !== id));
        } else {
          alert("Delete failed in backend.");
        }
      } catch (e) {
        alert("Network error: " + e.message);
      }
    }
  };

  const toggleField = async (id) => {
    const field = leadFields.find(f => f.id === id);
    if (!field) return;

    try {
      const res = await apiFetch(`/lead-fields/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ enabled: !field.enabled })
      });
      if (res.ok) {
        setLeadFields(p => p.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveUser = async () => {
    if (!userForm.name || !userForm.password) return alert("All fields required!");
    try {
      const res = await apiFetch("/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          username: userForm.name,
          password: userForm.password,
          role: userForm.role,
        })
      });
      if (res.ok) {
        const saved = await res.json();
        setUsers(p => [...p, { id: String(saved.id), name: saved.username, role: saved.role }]);
        setShowAddUser(false); setUserForm({ role: "agent" });
      } else {
        const err = await res.json();
        alert("Pura data backend me fail hua: " + JSON.stringify(err));
      }
    } catch (e) {
      alert("Network error saving user: " + e.message);
    }
  };

  const deleteUser = async (id) => {
    if (id === "admin") return alert("Cannot delete admin!");
    if (confirm("Delete team member?")) {
      try {
        const res = await apiFetch(`/auth/users/${id}/`, { method: "DELETE" });
        if (res.ok) {
          setUsers(p => p.filter(u => u.id !== id));
        } else {
          const err = await res.json();
          alert("Delete fail hua: " + JSON.stringify(err));
        }
      } catch (e) {
        alert("Network error: " + e.message);
      }
    }
  };

  const visibleTabs = [
    { id: "pipeline", label: "Pipeline", icon: "pipeline", roles: ["admin"] },
    { id: "fields", label: "Fields", icon: "tag", roles: ["admin"] },
    { id: "general", label: "General", icon: "settings", roles: ["admin", "manager"] },
    { id: "team", label: "Team", icon: "leads", roles: ["admin"] },
    { id: "whatsapp", label: "WhatsApp", icon: "whatsapp", roles: ["admin"] },
  ].filter(t => t.roles.includes(currentUser?.role));

  useEffect(() => {
    if (!visibleTabs.find(t => t.id === tab)) setTab(visibleTabs[0]?.id || "general");
  }, [currentUser]);

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: "var(--text2)", fontSize: 13 }}>Configure your CRM to match your business</p>
      </div>

      <div className="stack-mobile" style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 0, flexWrap: "wrap" }}>
        {visibleTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 16px", cursor: "pointer", fontFamily: "DM Sans", fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            background: "transparent", border: "none", color: tab === t.id ? "#25d366" : "var(--text2)",
            borderBottom: `2px solid ${tab === t.id ? "#25d366" : "transparent"}`,
            display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s"
          }}>
            <Icon d={icons[t.icon]} size={16} color={tab === t.id ? "#25d366" : "var(--text2)"} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pipeline" && (
        <div style={{ animation: "fadeIn 0.3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>Manage your CRM pipeline stages.</p>
            <Btn onClick={() => { setStageForm({ color: stageColors[stages.length % stageColors.length] }); setEditStage(null); setShowAddStage(true); }} icon="plus" size="sm">Add Stage</Btn>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {stages.map((s, i) => (
              <Card key={s.id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Order: {i + 1}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="ghost" size="sm" icon="edit" onClick={() => { setStageForm({ ...s }); setEditStage(s.id); setShowAddStage(true); }} />
                  {!["s1"].includes(s.id) && <Btn variant="danger" size="sm" icon="trash" onClick={() => deleteStage(s.id)} />}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "fields" && (
        <div style={{ animation: "fadeIn 0.3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>Customize lead data structure.</p>
            <Btn onClick={() => setShowAddField(true)} icon="plus" size="sm">Add Field</Btn>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {leadFields.map(f => (
              <Card key={f.id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{(f.type || "text").toUpperCase()} · Key: {f.key}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div onClick={() => !f.system && toggleField(f.id)} style={{ width: 34, height: 18, borderRadius: 9, background: f.enabled ? "#25d366" : "var(--border)", cursor: f.system ? "not-allowed" : "pointer", position: "relative", transition: "all 0.2s" }}>
                    <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", position: "absolute", top: 2, left: f.enabled ? 18 : 2, transition: "left 0.2s" }} />
                  </div>
                  {!f.system && <Btn variant="danger" size="sm" icon="trash" onClick={() => deleteField(f.id)} />}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "general" && (
        <div style={{ animation: "fadeIn 0.3s", display: "grid", gap: 16, maxWidth: 600 }}>
          <Card style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Business Profile</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <Input label="Business Name" value={bizInfo.name} onChange={v => setBizInfo(p => ({ ...p, name: v }))} />
              <Input label="Owner Details" value={bizInfo.owner} onChange={v => setBizInfo(p => ({ ...p, owner: v }))} />
              <Input label="Phone Number" type="tel" value={bizInfo.phone} onChange={v => setBizInfo(p => ({ ...p, phone: v }))} />
              <Input label="Address" type="textarea" value={bizInfo.address} onChange={v => setBizInfo(p => ({ ...p, address: v }))} />
            </div>
          </Card>
        </div>
      )}

      {tab === "team" && (
        <div style={{ animation: "fadeIn 0.3s", display: "grid", gap: 16, maxWidth: 600 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Team Management</h3>
              <Btn size="sm" onClick={() => setShowAddUser(true)} icon="plus">Add Member</Btn>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {users.map(u => (
                <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>{u.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "capitalize" }}>{u.role}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {u.id !== "admin" && <Btn variant="ghost" size="sm" icon="trash" onClick={() => deleteUser(u.id)} />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "whatsapp" && <WhatsAppSettings openAIKey={openAIKey} setOpenAIKey={setOpenAIKey} systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} waStatus={waStatus} fetchStatus={fetchStatus} qr={qr} onDisconnect={onDisconnect} onReset={onReset} waMode={waMode} setWaMode={setWaMode} metaPhoneId={metaPhoneId} setMetaPhoneId={setMetaPhoneId} metaToken={metaToken} setMetaToken={setMetaToken} metaAppId={metaAppId} setMetaAppId={setMetaAppId} />}

      {/* Modals */}
      {showAddStage && (
        <Modal title={editStage ? "Edit Stage" : "Add Stage"} onClose={() => setShowAddStage(false)}>
          <div style={{ display: "grid", gap: 14 }}>
            <Input label="Stage Name" value={stageForm.name || ""} onChange={v => setStageForm(p => ({ ...p, name: v }))} required />
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Color</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {stageColors.map(c => <div key={c} onClick={() => setStageForm(p => ({ ...p, color: c }))} style={{ width: 28, height: 28, borderRadius: 6, background: c, cursor: "pointer", border: stageForm.color === c ? "3px solid #fff" : "3px solid transparent" }} />)}
              </div>
            </div>
            <Btn onClick={saveStage}>Save Stage</Btn>
          </div>
        </Modal>
      )}

      {showAddField && (
        <Modal title="Add Custom Field" onClose={() => setShowAddField(false)}>
          <div style={{ display: "grid", gap: 14 }}>
            <Input label="Field Label" value={fieldForm.label || ""} onChange={v => setFieldForm(p => ({ ...p, label: v, key: v.toLowerCase().replace(/\s+/g, "_") }))} required />
            <Input label="Field Key" value={fieldForm.key || ""} onChange={v => setFieldForm(p => ({ ...p, key: v }))} required />
            <select value={fieldForm.type || "text"} onChange={e => setFieldForm(p => ({ ...p, type: e.target.value }))} style={{ padding: 10, borderRadius: 8, background: "var(--bg3)", color: "#fff", border: "1px solid var(--border)" }}>
              {["text", "number", "tel", "email", "textarea", "select"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Btn onClick={saveField}>Add Field</Btn>
          </div>
        </Modal>
      )}

      {showAddUser && (
        <Modal title="Add Team Member" onClose={() => setShowAddUser(false)}>
          <div style={{ display: "grid", gap: 14 }}>
            <Input label="Name" value={userForm.name || ""} onChange={v => setUserForm(p => ({ ...p, name: v }))} required />
            <Input label="Password" type="password" value={userForm.password || ""} onChange={v => setUserForm(p => ({ ...p, password: v }))} required />
            <select value={userForm.role} onChange={e => setUserForm(p => ({ ...p, role: e.target.value }))} style={{ padding: 10, borderRadius: 8, background: "var(--bg3)", color: "#fff", border: "1px solid var(--border)" }}>
              <option value="agent">Agent</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <Btn onClick={saveUser}>Add Member</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

const saveAISetting = async (key, value) => {
  try {
    await apiFetch("/settings/", {
      method: "POST",
      body: JSON.stringify({ key, value })
    });
  } catch (e) {
    console.error("Save failed", e);
  }
};

const WhatsAppSettings = ({ openAIKey, setOpenAIKey, systemPrompt, setSystemPrompt, waStatus, fetchStatus, qr, onDisconnect, onReset, waMode, setWaMode, metaPhoneId, setMetaPhoneId, metaToken, setMetaToken, metaAppId, setMetaAppId }) => {
  const status = waStatus; 
  const [loading, setLoading] = useState(false);
  const WA_URL = `http://${window.location.hostname}:3001`;
  const [pairingPhone, setPairingPhone] = useState("");
  const [pairingCode, setPairingCode] = useState(null);
  const [pairCodeInput, setPairCodeInput] = useState("");

  const handleModeChange = (m) => {
    const newMode = m === "Meta Cloud API (Official)" ? "api" : "webjs";
    setWaMode(newMode);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await apiFetch("/settings/bulk_update/", {
        method: "POST",
        body: JSON.stringify({
          settings: [
            { key: "wa_mode", value: waMode },
            { key: "meta_phone_id", value: metaPhoneId },
            { key: "meta_access_token", value: metaToken },
            { key: "meta_app_id", value: metaAppId },
          ]
        })
      });
      showToast("WhatsApp settings saved!");
    } catch (e) {
      console.error("Save failed", e);
      alert("Save failed");
    }
    setLoading(false);
  };

  const handleResetMeta = async () => {
    if (!confirm("Meta credentials clear karein?")) return;
    setLoading(true);
    try {
      await Promise.all([
        apiFetch("/settings/meta_phone_id/", { method: "DELETE" }),
        apiFetch("/settings/meta_access_token/", { method: "DELETE" }),
        apiFetch("/settings/meta_app_id/", { method: "DELETE" }),
      ]);
      setMetaPhoneId("");
      setMetaToken("");
      setMetaAppId("");
      showToast("Meta credentials cleared", "#ef4444");
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleRequestCode = async () => {
    if (!pairingPhone) return alert("Pehle phone number daalo!");
    setLoading(true);
    let sanitizedPhone = pairingPhone.replace(/\D/g, '').trim();
    if (sanitizedPhone.length === 10) sanitizedPhone = "91" + sanitizedPhone;
    try {
      const res = await fetch(`${WA_URL}/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: sanitizedPhone })
      });

      const data = await res.json();
      if (data.code) {
        setPairingCode(data.code);
        fetchStatus();
      } else {
        alert(data.error || "Failed to get code");
      }
    } catch (e) {
      alert("Request failed: " + e.message);
    }
    setLoading(false);
  };

  const currentModeLabel = waMode === "api" ? "Meta Cloud API (Official)" : "WhatsApp Web (Free)";

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 600 }}>
      {/* Toast Helper (inside component for scoped alerts) */}
      <Card style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon d={icons.whatsapp} size={18} color="#25d366" fill="#25d366" strokeWidth={0} /> WhatsApp Connection
        </h3>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Mode</label>
          <div style={{ display: "flex", gap: 10 }}>
            {["WhatsApp Web (Free)", "Meta Cloud API (Official)"].map(m => (
              <div key={m}
                onClick={() => handleModeChange(m)}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8,
                  border: `1px solid ${currentModeLabel === m ? "#25d366" : "var(--border)"}`,
                  background: currentModeLabel === m ? "#25d36611" : "transparent",
                  cursor: "pointer", textAlign: "center", fontSize: 12, transition: "all 0.2s"
                }}>
                {m}
              </div>
            ))}
          </div>
        </div>

        {waMode === "webjs" ? (
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid var(--border)", marginBottom: 16, backdropFilter: "blur(10px)" }}>
            {status.connected ? (
              <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: "linear-gradient(135deg, #25d36633, #128c7e33)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "2px solid #25d36644" }}>
                  <Icon d={icons.check} size={32} color="#25d366" />
                </div>
                <h4 style={{ color: "#25d366", marginBottom: 8, fontSize: 18 }}>Connected & Ready</h4>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20 }}>Aapka account linked hai. Messages auto-reply ke liye active hain.</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <Btn variant="danger" onClick={onDisconnect} disabled={loading} icon="close">Disconnect</Btn>
                  <Btn variant="secondary" onClick={onReset} disabled={loading}>Reset Session</Btn>
                </div>
              </div>
            ) : (status.status === 'qr_pending' || status.status === 'code_ready' || pairingCode) ? (
              <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                {(!pairingCode && status.status !== 'code_ready') ? (
                  <>
                    <h4 style={{ marginBottom: 16, fontSize: 16 }}>Scan QR Code</h4>
                    <div style={{ background: "#fff", padding: 16, borderRadius: 16, display: "inline-block", marginBottom: 20, boxShadow: "0 0 20px rgba(37, 211, 102, 0.2)" }}>
                      {qr ? <img src={qr} alt="WA QR" style={{ width: 220, height: 220 }} /> : <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>Loading QR...</div>}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20 }}>
                      <span style={{ display: "block", marginBottom: 4 }}>1. Open <strong>WhatsApp</strong> on your phone</span>
                      <span style={{ display: "block", marginBottom: 4 }}>2. Tap <strong>Menu</strong> or <strong>Settings</strong></span>
                      <span style={{ display: "block" }}>3. Select <strong>Linked Devices</strong> and scan</span>
                    </p>
                  </>
                ) : (
                  <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                    <h4 style={{ marginBottom: 16, fontSize: 16 }}>Pairing Code Ready</h4>
                    <div style={{ background: "rgba(37, 211, 102, 0.05)", border: "1px dashed #25d36666", padding: 24, borderRadius: 12, display: "inline-block", marginBottom: 20 }}>
                      <div style={{ fontSize: 42, fontWeight: 800, color: "#25d366", letterSpacing: 8, fontFamily: "Space Grotesk" }}>{pairingCode || status.pairing_code}</div>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20 }}>
                      1. Open <strong>WhatsApp</strong> &gt; <strong>Linked Devices</strong><br />
                      2. <strong>"Link with phone number instead"</strong> chunein<br />
                      3. Ye code enter karein: <strong style={{ color: "#25d366" }}>{pairingCode || status.pairing_code}</strong>
                    </p>
                    <Btn variant="secondary" onClick={() => { setPairingCode(null); fetchStatus(); }}>Cancel</Btn>
                  </div>
                )}

                {!pairingCode && status.status !== 'code_ready' && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 14 }}>Alternately: Login with Phone Number</p>
                    <div style={{ display: "flex", gap: 8, maxWidth: 350, margin: "0 auto" }}>
                      <Input placeholder="91XXXXXXXXXX" value={pairingPhone} onChange={setPairingPhone} />
                      <Btn size="sm" onClick={handleRequestCode} disabled={loading}>Get Code</Btn>
                    </div>
                  </div>
                )}
              </div>
            ) : (status.status === 'initializing') ? (
              <div style={{ animation: "fadeIn 0.5s ease-out", textAlign: "center", padding: "40px" }}>
                <div style={{ width: 40, height: 40, border: "3px solid #25d366", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <h4 style={{ color: "#25d366" }}>Initializing...</h4>
                <p style={{ fontSize: 12, color: "var(--text3)" }}>WhatsApp service start ho rahi hai...</p>
              </div>
            ) : (
              <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                  <Icon d={icons.close} size={32} color="#ef4444" />
                </div>
                <h4 style={{ color: "#ef4444", marginBottom: 8 }}>{status.error === 'Service not running' ? 'Service Offline' : 'Not Connected'}</h4>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20 }}>{status.error || "WhatsApp login session ready nahi hai."}</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <Btn onClick={() => { onReset(); }} icon="plus">Start Session</Btn>
                  <Btn variant="secondary" onClick={fetchStatus}>Refresh Status</Btn>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16, marginBottom: 20, animation: "fadeIn 0.5s ease-out" }}>
            <div style={{ background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 12, padding: 16, marginBottom: 10 }}>
              <p style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>Official Meta API Mode</p>
              <p style={{ fontSize: 11, color: "var(--text3)" }}>High-volume business messaging ke liye iska use karein.</p>
            </div>
            <Input label="App ID" placeholder="Meta App ID" value={metaAppId} onChange={setMetaAppId} />
            <Input label="Phone Number ID" placeholder="Phone Number ID" value={metaPhoneId} onChange={setMetaPhoneId} />
            <Input label="Access Token" type="password" placeholder="EAAB..." value={metaToken} onChange={setMetaToken} />

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <Btn onClick={handleSaveSettings} disabled={loading} icon="check">Save Meta Settings</Btn>
              <Btn variant="danger" onClick={handleResetMeta} disabled={loading} icon="trash">Clear Credentials</Btn>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          <Input label="Business Name" value="My Business" onChange={() => { }} placeholder="Your business name" />
          <Input label="WA Service URL" value={WA_URL} onChange={() => { }} />
        </div>
      </Card>

      <Card style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🤖 AI Settings</h3>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <Input
              label="OpenAI API Key"
              type="password"
              value={openAIKey}
              onChange={v => { setOpenAIKey(v); saveAISetting("openai_api_key", v); }}
              placeholder="sk-..."
            />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <Input
              label="AI System Prompt (Hinglish)"
              type="textarea"
              value={systemPrompt}
              onChange={v => { setSystemPrompt(v); saveAISetting("ai_system_prompt", v); }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─── MAIN APP ───
export default function App() {
  console.log("DEBUG: App component starting...");
  // Fix 1: AI toggle state per lead (persists when switching leads)
  const [aiEnabledMap, setAiEnabledMap] = useState({});
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [leads, setLeads] = useState(() => {
    console.log("DEBUG: Initializing leads...");
    return getSaved("crm_leads", sampleLeads);
  });
  const [stages, setStages] = useState(() => getSaved("crm_stages", defaultPipelineStages));
  const [leadFields, setLeadFields] = useState(() => getSaved("crm_fields", defaultLeadFields));
  const [catalog, setCatalog] = useState(() => getSaved("crm_catalog", defaultCatalog));
  const [messages, setMessages] = useState(() => getSaved("crm_messages", sampleMessages));
  const [openAIKey, setOpenAIKey] = useState(() => getSaved("crm_openai_key", ""));
  const [systemPrompt, setSystemPrompt] = useState(() => getSaved("crm_system_prompt", "Tum ek helpful business assistant ho. Hinglish mein baat karo. Short aur helpful replies do."));
  const [users, setUsers] = useState(() => getSaved("crm_users", [
    { id: "admin", name: "Admin", role: "admin", password: "admin123" }
  ]));
  const [bizInfo, setBizInfo] = useState(() => getSaved("crm_biz_info", { name: "My CRM Business", owner: "Admin", phone: "", address: "" }));
  
  const [waMode, setWaMode] = useState("webjs");
  const [metaPhoneId, setMetaPhoneId] = useState("");
  const [metaToken, setMetaToken] = useState("");
  const [metaAppId, setMetaAppId] = useState("");

  // ── currentUser state (moved up before useEffects that reference it) ──
  const [currentUser, setCurrentUser] = useState(() => {
    const user = getSaved("crm_user", null);
    if (user && !user.name) {
      user.name = user.username || user.first_name || "User";
    }
    return user;
  });
  const [loginForm, setLoginForm] = useState({ name: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // ── Global WhatsApp Status (Moved from Settings for global display) ──
  const [waStatusGlobal, setWaStatusGlobal] = useState({ status: 'loading', connected: false });
  const [waQRGlobal, setWaQRGlobal] = useState(null);
  const WA_URL = `http://${window.location.hostname}:3001`;
  const [pairingPhone, setPairingPhone] = useState("");
  const [pairingCode, setPairingCode] = useState(null);
  const [pairCodeInput, setPairCodeInput] = useState("");

  const fetchWAStatus = async () => {
    try {
      const res = await fetch(`${WA_URL}/status`);
      const data = await res.json();
      setWaStatusGlobal(data);
      if (data.status === 'qr_pending') {
        const qrRes = await fetch(`${WA_URL}/qr`);
        const qrData = await qrRes.json();
        if (qrData.qr) setWaQRGlobal(qrData.qr);
      } else {
        setWaQRGlobal(null);
      }
    } catch (e) {
      if (waStatusGlobal.status !== 'disconnected') {
        setWaStatusGlobal({ status: 'disconnected', error: 'Service not running' });
      }
    }
  };

  const handleWADisconnect = async () => {
    if (!confirm("WhatsApp disconnect karein?")) return;
    try {
      await fetch(`${WA_URL}/disconnect`, { method: 'POST' });
      fetchWAStatus();
    } catch (e) { alert("Disconnect failed"); }
  };

  const handleWAReset = async () => {
    if (!confirm("Pura session clear karke reset karein? (Login issue fix karne ke liye)")) return;
    try {
      await fetch(`${WA_URL}/reset`, { method: 'POST' });
      fetchWAStatus();
    } catch (e) { alert("Reset failed"); }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchWAStatus();
    const isQuickPoll = ['initializing', 'qr_pending'].includes(waStatusGlobal.status);
    const inv = setInterval(fetchWAStatus, isQuickPoll ? 3000 : 10000);
    return () => clearInterval(inv);
  }, [currentUser, waStatusGlobal.status]);

  useEffect(() => { localStorage.setItem("crm_user", JSON.stringify(currentUser)); }, [currentUser]);

  // ── Persistence Effects ──
  useEffect(() => {
    if (!currentUser?.access) return;

    const fetchData = async () => {
      try {
        const [leadsRes, stagesRes, fieldsRes, settingsRes, agentsRes, catalogRes] = await Promise.all([
          apiFetch("/leads/?no_page=1"),
          apiFetch("/pipeline-stages/"),
          apiFetch("/lead-fields/"),
          apiFetch("/settings/"),
          currentUser?.role === "admin" ? apiFetch("/auth/agents/") : Promise.resolve(null),
          apiFetch("/catalog/")
        ]);

        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          const leadsArray = Array.isArray(leadsData) ? leadsData : (leadsData.results || []);
          console.log("DEBUG: Leads fetched:", leadsArray.length);
          setLeads(leadsArray);
        }
        if (stagesRes.ok) {
          const stagesData = await stagesRes.json();
          const stagesArray = Array.isArray(stagesData) ? stagesData : (stagesData.results || []);
          setStages(stagesArray);
        }
        if (fieldsRes.ok) {
          const fieldsData = await fieldsRes.json();
          const arr = Array.isArray(fieldsData) ? fieldsData : (fieldsData.results || []);
          const mappedFields = arr.map(f => ({
            ...f,
            type: f.field_type,
            system: f.is_system
          }));

          setLeadFields(mappedFields);
        }

        if (settingsRes.ok) {
          const s = await settingsRes.json();
          setOpenAIKey(s.find(x => x.key === "openai_api_key")?.value || "");
          setSystemPrompt(s.find(x => x.key === "ai_system_prompt")?.value || "");
          setWaMode(s.find(x => x.key === "wa_mode")?.value || "webjs");
          setMetaPhoneId(s.find(x => x.key === "meta_phone_id")?.value || "");
          setMetaToken(s.find(x => x.key === "meta_access_token")?.value || "");
          setMetaAppId(s.find(x => x.key === "meta_app_id")?.value || "");
        }
        if (agentsRes && agentsRes.ok) {
          const fetchedAgents = await agentsRes.json();
          // Merge fetched agents with existing users state (preserve admin, add agents)
          const mappedAgents = fetchedAgents.map(a => ({
            id: String(a.id),
            name: a.username || a.first_name || "Agent",
            role: a.role || "agent"
          }));

          setUsers(prevUsers => {
            const adminUser = prevUsers.find(u => u.id === "admin") || { id: "admin", name: "Admin", role: "admin", password: "admin123" };
            return [adminUser, ...mappedAgents];
          });
        }
        if (catalogRes && catalogRes.ok) {
          const catalogData = await catalogRes.json();
          setCatalog(Array.isArray(catalogData) ? catalogData : (catalogData.results || []));
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    fetchData();
    const inv = setInterval(fetchData, 10000); // Fix 5: Poll every 10s for near-real-time dashboard updates
    return () => clearInterval(inv);
  }, [currentUser]);

  // Fix 3+4+5: refreshToken triggers LeadsPage to re-fetch its paginated data
  const [refreshToken, setRefreshToken] = useState(null);

  const triggerRefresh = () => {
    // Refresh global leads state (for Dashboard + Pipeline)
    apiFetch("/leads/?no_page=1").then(res => res.json()).then(data => {
      const arr = Array.isArray(data) ? data : (data.results || []);
      setLeads(arr);
    }).catch(() => {});
    // Signal LeadsPage to re-fetch its paginated view
    setRefreshToken(Date.now());
  };

  // ── WebSocket Effects ──
  useEffect(() => {
    if (!currentUser?.access) return;

    const wsUrl = `ws://${window.location.hostname}:8000/ws/dashboard/?token=${currentUser.access}`;
    let ws;
    let reconnectTimer;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          // Fix 3+4: Handle all lead_update events (assignment, stage change, new messages, etc.)
          if (data.type === "lead_update" || data.type === "stage_change" ||
              data.type === "assignment" || data.type === "new_lead") {
            triggerRefresh();
          }
        } catch (err) {
          console.error("WS parse error:", err);
        }
      };

      ws.onerror = (e) => console.error("WS Error:", e);
      ws.onclose = () => {
        // Auto-reconnect after 5s if connection drops
        reconnectTimer = setTimeout(connect, 5000);
      };
    };

    connect();
    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [currentUser]);


  const doLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginForm.name, password: loginForm.password }),
      });
      const data = await res.json();
      if (res.ok) {
        const userObj = {
          ...data.user,
          access: data.access,
          refresh: data.refresh,
          name: data.user.username || data.user.first_name || "User"
        };
        localStorage.setItem("crm_user", JSON.stringify(userObj));
        setCurrentUser(userObj);
        setLoginError("");
        window.location.reload(); // Refresh to trigger initial fetches
      } else {
        setLoginError(data.detail || data.error || "Login fail ho gaya.");
      }
    } catch (e) {
      setLoginError("Backend server se connect nahi ho paa raha.");
    }
  };

  const AGENTS = (users || []).filter(u => u && u.role === "agent").map(u => u.name || u.username);

  if (!currentUser) return (
    <>
      <FontLink />
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #25d366, #128c7e)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "Space Grotesk", fontSize: 26, fontWeight: 700, color: "#25d366", marginBottom: 4 }}>SimpleWA CRM</h1>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>Apna account mein login karein</p>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 28 }}>
            <div style={{ display: "grid", gap: 14, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Name / Username</label>
                <input value={loginForm.name} onChange={e => setLoginForm(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="Apna username daalein..." style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "11px 14px", fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Password</label>
                <input type="password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="Password daalo" style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "11px 14px", fontSize: 14 }} />
              </div>
              {loginError && <div style={{ background: "#ef444411", border: "1px solid #ef444433", borderRadius: 8, padding: "10px 14px", color: "#ef4444", fontSize: 12 }}>{loginError}</div>}
              <button onClick={doLogin} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #25d366, #128c7e)", border: "none", borderRadius: 9, color: "#fff", fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Login Karo →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage leads={leads} stages={stages} catalog={catalog} currentUser={currentUser} />;
      case "leads": return <LeadsPage leads={leads} setLeads={setLeads} stages={stages} leadFields={leadFields} catalog={catalog} currentUser={currentUser} agents={users.filter(u => u.role === 'agent')} users={users} refreshToken={refreshToken} />;
      case "pipeline": return <PipelinePage leads={leads} setLeads={setLeads} stages={stages} currentUser={currentUser} />;
      // Fix 1: Pass aiEnabledMap to ChatPage so AI toggle persists per lead
      case "chat": return <ChatPage leads={leads} stages={stages} messages={messages} setMessages={setMessages} currentUser={currentUser} aiEnabledMap={aiEnabledMap} setAiEnabledMap={setAiEnabledMap} />;
      case "catalog": return <CatalogPage catalog={catalog} setCatalog={setCatalog} currentUser={currentUser} />;
      case "settings": return <SettingsPage stages={stages} setStages={setStages} leadFields={leadFields} setLeadFields={setLeadFields} currentUser={currentUser} openAIKey={openAIKey} setOpenAIKey={setOpenAIKey} systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} users={users} setUsers={setUsers} bizInfo={bizInfo} setBizInfo={setBizInfo} waStatus={waStatusGlobal} fetchStatus={fetchWAStatus} qr={waQRGlobal} onDisconnect={handleWADisconnect} onReset={handleWAReset} waMode={waMode} setWaMode={setWaMode} metaPhoneId={metaPhoneId} setMetaPhoneId={setMetaPhoneId} metaToken={metaToken} setMetaToken={setMetaToken} metaAppId={metaAppId} setMetaAppId={setMetaAppId} />;
      default: return null;
    }
  };

  return (
    <>
      <FontLink />
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        {/* Mobile menu overlay */}
        {mobileMenu && (
          <div style={{ position: "fixed", inset: 0, background: "#00000080", zIndex: 100 }} onClick={() => setMobileMenu(false)}>
            <div onClick={e => e.stopPropagation()} style={{ width: 240, height: "100%", background: "var(--bg2)" }}>
              <Sidebar active={page} onNav={p => { setPage(p); setMobileMenu(false); }} collapsed={false} setCollapsed={() => { }} currentUser={currentUser} />
            </div>
          </div>
        )}

        {/* Sidebar — desktop only */}
        <div className="desktop-only">
          <Sidebar active={page} onNav={setPage} collapsed={collapsed} setCollapsed={setCollapsed} currentUser={currentUser} />
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          {/* Top Header */}
          <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="mobile-only" onClick={() => setMobileMenu(true)} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                <Icon d={icons.menu} size={22} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #25d366, #128c7e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={icons.whatsapp} size={15} color="#fff" fill="#fff" strokeWidth={0} />
                </div>
                <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 16, color: "#25d366" }}>SimpleWA</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {currentUser && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 12px" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: currentUser?.role === "admin" ? "#25d36622" : "#8b5cf622", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: currentUser?.role === "admin" ? "#25d366" : "#8b5cf6" }}>
                      {(currentUser?.name || currentUser?.username || "U")[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{currentUser?.name || currentUser?.username}</div>
                      <div style={{ fontSize: 10, color: currentUser?.role === "admin" ? "#25d366" : "#8b5cf6", textTransform: "uppercase", fontWeight: 600 }}>{currentUser?.role}</div>
                    </div>
                  </div>
                  <button onClick={() => setCurrentUser(null)} style={{ background: "#ef444411", border: "1px solid #ef444433", borderRadius: 7, color: "#ef4444", padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Logout</button>
                </>
              )}
            </div>
          </div>

          {/* Global Pairing Notification Toast (Modern & Premium) */}
          {(waStatusGlobal.pairing_code || waStatusGlobal.status === 'code_ready') && (
            <div style={{ padding: "12px 20px", background: "linear-gradient(135deg, rgba(37, 211, 102, 0.15), rgba(18, 140, 126, 0.15))", borderBottom: "1px solid rgba(37, 211, 102, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(20px)", animation: "slideDown 0.4s ease-out" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)" }}>
                  <Icon d={icons.whatsapp} size={18} color="#fff" fill="#fff" strokeWidth={0} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#25d366", textTransform: "uppercase", letterSpacing: "0.02em" }}>WhatsApp Pairing Active</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>Enter this code on your phone in "Linked Devices" section</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#25d366", letterSpacing: 4, fontFamily: "Space Grotesk", background: "rgba(0,0,0,0.2)", padding: "4px 16px", borderRadius: 8, border: "1px solid rgba(37, 211, 102, 0.3)" }}>
                  {waStatusGlobal.pairing_code}
                </div>
                <button onClick={() => setWaStatusGlobal(p => ({ ...p, pairing_code: null, status: 'disconnected' }))} style={{ background: "transparent", border: "none", color: "var(--text3)", cursor: "pointer", padding: 4 }}>
                  <Icon d={icons.close} size={20} />
                </button>
              </div>
            </div>
          )}

          {renderPage()}
        </div>
      </div>
    </>
  );
}
