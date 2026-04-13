import { useState, useEffect } from "react";

const SUBJECTS = ["Geometry", "English", "Life Lab", "Spanish", "Art", "Physics"];
const ACTIONS = [
  { id: "hi", label: "Said hi before class", icon: "👋" },
  { id: "thanks", label: "Said thank you after", icon: "🙏" },
  { id: "comment", label: "Left a comment/thank you", icon: "💬" },
  { id: "visit", label: "Visited at Smart Period", icon: "🏫" },
];

const SUBJECT_COLORS = {
  Geometry:  { accent: "#FF6B8A" },
  English:   { accent: "#6B8AFF" },
  "Life Lab":{ accent: "#4DB86A" },
  Spanish:   { accent: "#FF9C43" },
  Art:       { accent: "#A855F7" },
  Physics:   { accent: "#0EA5E9" },
};

function getDayKey(date) {
  return date.toISOString().split("T")[0];
}

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function App() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("teacherChecks") || "{}"); }
    catch { return {}; }
  });
  const [expanded, setExpanded] = useState(null);

  const weekDates = getWeekDates(weekOffset);

  useEffect(() => {
    localStorage.setItem("teacherChecks", JSON.stringify(checks));
  }, [checks]);

  function toggleCheck(subject, dayKey, actionId) {
    setChecks((prev) => {
      const key = `${subject}|${dayKey}`;
      const current = prev[key] || {};
      return { ...prev, [key]: { ...current, [actionId]: !current[actionId] } };
    });
  }

  function getChecksForCell(subject, dayKey) {
    return checks[`${subject}|${dayKey}`] || {};
  }

  function countChecks(subject, dayKey) {
    return Object.values(getChecksForCell(subject, dayKey)).filter(Boolean).length;
  }

  function totalForSubject(subject) {
    return weekDates.reduce((sum, d) => sum + countChecks(subject, getDayKey(d)), 0);
  }

  function totalForDay(dayKey) {
    return SUBJECTS.reduce((sum, s) => sum + (countChecks(s, dayKey) > 0 ? 1 : 0), 0);
  }

  function weekTotal() {
    return SUBJECTS.reduce((sum, s) => sum + totalForSubject(s), 0);
  }

  const today = getDayKey(new Date());

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0C29 0%, #1a1035 50%, #0F0C29 100%)",
      fontFamily: "'Georgia', serif",
      color: "#fff",
      overflowX: "hidden",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 14px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            fontSize: 10, fontFamily: "'Courier New', monospace",
            letterSpacing: 6, textTransform: "uppercase", marginBottom: 6,
          }}>Build Your Reputation</div>
          <h1 style={{
            fontSize: "clamp(22px, 6vw, 34px)", fontWeight: 700, margin: "0 0 4px",
            background: "linear-gradient(135deg, #fff 0%, #c4b5fd 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: -0.5,
          }}>Teacher Rapport Tracker</h1>
          <p style={{ color: "#7c6fa0", fontSize: 12, fontFamily: "sans-serif" }}>
            Small actions. Big connections.
          </p>
        </div>

        {/* Week Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => { setExpanded(null); setWeekOffset(w => w - 1); }} style={navBtn}>← prev</button>
          <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#c4b5fd", textAlign: "center", minWidth: 160 }}>
            {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
            {weekDates[4].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {weekOffset === 0 && <span style={{ display: "block", color: "#a78bfa", fontSize: 9, letterSpacing: 2 }}>THIS WEEK</span>}
          </div>
          <button onClick={() => { setExpanded(null); setWeekOffset(w => w + 1); }} style={navBtn}>next →</button>
        </div>

        {/* Daily summary bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
          {weekDates.map((d, i) => {
            const dk = getDayKey(d);
            const count = totalForDay(dk);
            const isToday = dk === today;
            return (
              <div key={i} style={{
                flex: 1, maxWidth: 72,
                background: isToday ? "linear-gradient(135deg, #a78bfa22, #f472b622)" : "#ffffff08",
                border: isToday ? "1px solid #a78bfa55" : "1px solid #ffffff0f",
                borderRadius: 10, padding: "8px 4px", textAlign: "center",
                boxShadow: isToday ? "0 0 18px #a78bfa1a" : "none",
              }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 9, color: "#7c6fa0", marginBottom: 3, letterSpacing: 1 }}>
                  {DAY_NAMES[i]}
                </div>
                <div style={{ fontSize: 12, color: "#e2d9f3", fontFamily: "sans-serif", fontWeight: 600 }}>
                  {d.getDate()}
                </div>
                <div style={{ marginTop: 3, fontSize: 16 }}>
                  {count === 0 ? "·" : count >= 5 ? "🔥" : count >= 3 ? "⭐" : "✓"}
                </div>
                <div style={{ fontFamily: "sans-serif", fontSize: 9, color: "#7c6fa0", marginTop: 1 }}>
                  {count}/{SUBJECTS.length}
                </div>
              </div>
            );
          })}
          <div style={{
            flex: 1, maxWidth: 72,
            background: "#ffffff08", border: "1px solid #a78bfa22",
            borderRadius: 10, padding: "8px 4px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 9, color: "#7c6fa0", marginBottom: 3, letterSpacing: 1 }}>WEEK</div>
            <div style={{
              fontSize: 22, fontWeight: 700,
              background: "linear-gradient(135deg,#a78bfa,#f472b6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>{weekTotal()}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 9, color: "#7c6fa0" }}>total</div>
          </div>
        </div>

        {/* Subject rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SUBJECTS.map((subject) => {
            const sc = SUBJECT_COLORS[subject];
            return (
              <div key={subject} style={{
                background: "#ffffff07",
                border: "1px solid #ffffff10",
                borderRadius: 14, overflow: "hidden",
              }}>
                {/* Subject label row */}
                <div style={{
                  display: "flex", alignItems: "center",
                  padding: "11px 14px", borderBottom: "1px solid #ffffff08", gap: 10,
                }}>
                  <div style={{
                    width: 9, height: 9, borderRadius: "50%",
                    background: sc.accent, flexShrink: 0,
                    boxShadow: `0 0 7px ${sc.accent}88`,
                  }} />
                  <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{subject}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#7c6fa0" }}>
                    {totalForSubject(subject)} this week
                  </div>
                </div>

                {/* Day cells */}
                <div style={{ display: "flex" }}>
                  {weekDates.map((date, di) => {
                    const dayKey = getDayKey(date);
                    const cellKey = `${subject}|${dayKey}`;
                    const isExpanded = expanded === cellKey;
                    const cellChecks = getChecksForCell(subject, dayKey);
                    const count = countChecks(subject, dayKey);
                    const isToday = dayKey === today;

                    return (
                      <div key={di} style={{
                        flex: 1,
                        borderRight: di < 4 ? "1px solid #ffffff08" : "none",
                        background: isToday ? "#a78bfa08" : "transparent",
                      }}>
                        <div style={{
                          textAlign: "center", padding: "5px 2px 3px",
                          fontFamily: "sans-serif", fontSize: 9,
                          color: isToday ? "#c4b5fd" : "#3d3555",
                          letterSpacing: 1, borderBottom: "1px solid #ffffff06",
                        }}>
                          {DAY_NAMES[di]}
                        </div>

                        <button
                          onClick={() => setExpanded(isExpanded ? null : cellKey)}
                          style={{
                            width: "100%", border: "none", cursor: "pointer",
                            background: "transparent", padding: "9px 4px",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 4,
                          }}
                        >
                          <div style={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap", minHeight: 18 }}>
                            {ACTIONS.map((a) => (
                              <div key={a.id} style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: cellChecks[a.id] ? sc.accent : "#ffffff12",
                                boxShadow: cellChecks[a.id] ? `0 0 5px ${sc.accent}` : "none",
                                transition: "all 0.2s",
                              }} />
                            ))}
                          </div>
                          <div style={{
                            fontFamily: "sans-serif", fontSize: 10,
                            color: count > 0 ? sc.accent : "#3d3555",
                            fontWeight: count > 0 ? 700 : 400,
                          }}>
                            {count > 0 ? `${count}/${ACTIONS.length}` : "—"}
                          </div>
                        </button>

                        {isExpanded && (
                          <div style={{
                            borderTop: `1px solid ${sc.accent}33`,
                            padding: "8px 8px 10px",
                            background: `${sc.accent}08`,
                          }}>
                            {ACTIONS.map((action) => (
                              <div
                                key={action.id}
                                onClick={() => toggleCheck(subject, dayKey, action.id)}
                                style={{
                                  display: "flex", alignItems: "center", gap: 7,
                                  cursor: "pointer", padding: "5px 0",
                                }}
                              >
                                <div style={{
                                  width: 17, height: 17, borderRadius: 4, flexShrink: 0,
                                  border: `2px solid ${cellChecks[action.id] ? sc.accent : "#ffffff22"}`,
                                  background: cellChecks[action.id] ? sc.accent : "transparent",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  transition: "all 0.15s",
                                  boxShadow: cellChecks[action.id] ? `0 0 8px ${sc.accent}55` : "none",
                                }}>
                                  {cellChecks[action.id] && (
                                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                                <span style={{ fontSize: 10, fontFamily: "sans-serif", color: "#c4b5fd", lineHeight: 1.3 }}>
                                  {action.icon} {action.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer legend */}
        <div style={{
          marginTop: 24, padding: "14px 16px",
          background: "#ffffff04", borderRadius: 12, border: "1px solid #ffffff08",
        }}>
          <div style={{ fontFamily: "sans-serif", fontSize: 9, color: "#4a4060", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
            Actions
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
            {ACTIONS.map((a) => (
              <span key={a.id} style={{ fontFamily: "sans-serif", fontSize: 11, color: "#7c6fa0" }}>
                {a.icon} {a.label}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 8, fontFamily: "sans-serif", fontSize: 10, color: "#4a4060" }}>
            Tap any day cell to log your actions. Your data is saved on your device.
          </div>
        </div>
      </div>
    </div>
  );
}

const navBtn = {
  background: "#ffffff0a",
  border: "1px solid #ffffff15",
  color: "#a78bfa",
  borderRadius: 8,
  padding: "6px 12px",
  cursor: "pointer",
  fontFamily: "'Courier New', monospace",
  fontSize: 10,
  letterSpacing: 1,
};
