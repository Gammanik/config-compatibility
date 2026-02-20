import { useState, useMemo } from "react";

// ─── Crop Configurations ───
const CROPS = {
  "tomato.v1": {
    name: "tomato.v1",
    label: "Томат v1",
    color: "#2196F3",
    stages: [
      { name: "Проращивание", duration: 5,  temp: { day: [22,25,28], night: [18,20,22] }, humidity: { day: [60,65,70], night: [65,70,75] }, co2: { day: [800,1000,1200],  night: [350,400,450] } },
      { name: "Всходы",       duration: 5,  temp: { day: [20,23,26], night: [16,18,20] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [900,1100,1300],  night: [350,400,450] } },
      { name: "Рост",         duration: 15, temp: { day: [22,25,28], night: [17,19,21] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [1000,1200,1400], night: [350,400,450] } },
      { name: "Цветение",     duration: 10, temp: { day: [24,26,28], night: [18,20,22] }, humidity: { day: [50,55,60], night: [55,60,65] }, co2: { day: [1200,1400,1600], night: [350,400,450] } },
      { name: "Плодоношение", duration: 20, temp: { day: [22,25,28], night: [16,18,20] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [1000,1200,1400], night: [350,400,450] } },
      { name: "Созревание",   duration: 10, temp: { day: [20,23,26], night: [15,17,19] }, humidity: { day: [50,55,60], night: [55,60,65] }, co2: { day: [800,1000,1200],  night: [350,400,450] } },
    ],
  },
  "pepper.v2": {
    name: "pepper.v2",
    label: "Перец v2",
    color: "#E91E63",
    stages: [
      { name: "Проращивание", duration: 5,  temp: { day: [25,27,30], night: [20,22,24] }, humidity: { day: [65,70,75], night: [70,75,80] }, co2: { day: [700,900,1100],  night: [350,400,450] } },
      { name: "Всходы",       duration: 5,  temp: { day: [24,26,28], night: [18,20,22] }, humidity: { day: [60,65,70], night: [65,70,75] }, co2: { day: [900,1100,1300],  night: [350,400,450] } },
      { name: "Рост",         duration: 10, temp: { day: [22,25,28], night: [18,20,22] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [1000,1200,1400], night: [350,400,450] } },
      { name: "Цветение",     duration: 10, temp: { day: [24,27,30], night: [18,20,22] }, humidity: { day: [50,55,60], night: [55,60,65] }, co2: { day: [1200,1400,1600], night: [350,400,450] } },
      { name: "Плодоношение", duration: 15, temp: { day: [24,26,28], night: [18,20,22] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [1000,1200,1400], night: [350,400,450] } },
      { name: "Созревание",   duration: 5,  temp: { day: [22,24,26], night: [16,18,20] }, humidity: { day: [50,55,60], night: [55,60,65] }, co2: { day: [800,1000,1200],  night: [350,400,450] } },
    ],
  },
  "cucumber.v1": {
    name: "cucumber.v1",
    label: "Огурец v1",
    color: "#9C27B0",
    stages: [
      { name: "Проращивание", duration: 3,  temp: { day: [25,27,30], night: [20,22,24] }, humidity: { day: [70,75,80], night: [75,80,85] }, co2: { day: [700,900,1100],  night: [350,400,450] } },
      { name: "Всходы",       duration: 4,  temp: { day: [22,25,28], night: [18,20,22] }, humidity: { day: [65,70,75], night: [70,75,80] }, co2: { day: [900,1100,1300],  night: [350,400,450] } },
      { name: "Рост",         duration: 8,  temp: { day: [24,26,28], night: [18,20,22] }, humidity: { day: [60,65,70], night: [65,70,75] }, co2: { day: [1000,1200,1400], night: [350,400,450] } },
      { name: "Цветение",     duration: 7,  temp: { day: [24,27,30], night: [20,22,24] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [1200,1400,1600], night: [350,400,450] } },
      { name: "Плодоношение", duration: 12, temp: { day: [22,25,28], night: [18,20,22] }, humidity: { day: [60,65,70], night: [65,70,75] }, co2: { day: [1000,1200,1400], night: [350,400,450] } },
      { name: "Созревание",   duration: 6,  temp: { day: [20,23,26], night: [16,18,20] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [800,1000,1200],  night: [350,400,450] } },
    ],
  },
  "arugula.v1": {
    name: "arugula.v1",
    label: "Руккола v1",
    color: "#4CAF50",
    stages: [
      { name: "Проращивание", duration: 5, temp: { day: [23,25,27], night: [20,22,24] }, humidity: { day: [70,75,80], night: [75,80,85] }, co2: { day: [700,800,900],   night: [350,400,450] } },
      { name: "Вегетация",    duration: 2, temp: { day: [22,24,26], night: [16,18,20] }, humidity: { day: [60,65,70], night: [65,70,75] }, co2: { day: [1000,1200,1400], night: [350,400,450] } },
      { name: "Цветение",     duration: 8, temp: { day: [24,26,28], night: [18,20,22] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [1200,1400,1600], night: [350,400,450] } },
      { name: "Плодоношение", duration: 3, temp: { day: [23,25,27], night: [17,19,21] }, humidity: { day: [60,65,70], night: [65,70,75] }, co2: { day: [1000,1200,1400], night: [350,400,450] } },
      { name: "Созревание",   duration: 4, temp: { day: [22,24,26], night: [16,18,20] }, humidity: { day: [55,60,65], night: [60,65,70] }, co2: { day: [900,1000,1200],  night: [350,400,450] } },
    ],
  },
};

const PARAMS = [
  { key: "temp",     label: "Температура", unit: "\u00b0C", yMin: 12,  yMax: 34   },
  { key: "humidity", label: "Влажность",   unit: "%",       yMin: 30,  yMax: 90   },
  { key: "co2",      label: "CO\u2082",    unit: "ppm",     yMin: 200, yMax: 1800 },
];

// ─── Data helpers ───

function expandToDays(config, startDay) {
  const result = [];
  let day = startDay;
  for (const stage of config.stages) {
    for (let i = 0; i < stage.duration; i++) {
      const entry = { day, stageName: stage.name, cropName: config.name };
      for (const p of PARAMS) {
        const src = stage[p.key];
        entry[p.key] = {
          day:   { min: src.day[0],   set: src.day[1],   max: src.day[2]   },
          night: { min: src.night[0], set: src.night[1], max: src.night[2] },
        };
      }
      result.push(entry);
      day++;
    }
  }
  return result;
}

function mergeParam(entries, paramKey) {
  if (!entries.length) return null;
  if (entries.length === 1) return { ...entries[0][paramKey], conflict: false };
  const dMin = Math.max(...entries.map(e => e[paramKey].day.min));
  const dMax = Math.min(...entries.map(e => e[paramKey].day.max));
  const dSet = Math.round(entries.reduce((s, e) => s + e[paramKey].day.set, 0) / entries.length);
  const nMin = Math.max(...entries.map(e => e[paramKey].night.min));
  const nMax = Math.min(...entries.map(e => e[paramKey].night.max));
  const nSet = Math.round(entries.reduce((s, e) => s + e[paramKey].night.set, 0) / entries.length);
  return {
    day:   { min: dMin, set: dSet, max: dMax },
    night: { min: nMin, set: nSet, max: nMax },
    conflict: dMin > dMax || nMin > nMax,
  };
}

function computeTimeline(basePlantings, newConfig, newStartDay) {
  const allExpanded = basePlantings.map(p => {
    const map = {};
    expandToDays(p.config, p.startDay).forEach(d => (map[d.day] = d));
    return map;
  });
  const newByDay = {};
  if (newConfig) expandToDays(newConfig, newStartDay).forEach(d => (newByDay[d.day] = d));

  let maxDay = 0;
  basePlantings.forEach(p => {
    const t = p.startDay + p.config.stages.reduce((s, st) => s + st.duration, 0);
    if (t > maxDay) maxDay = t;
  });
  if (newConfig) {
    const t = newStartDay + newConfig.stages.reduce((s, st) => s + st.duration, 0);
    if (t > maxDay) maxDay = t;
  }

  const timeline = [];
  for (let d = 0; d < maxDay; d++) {
    const baseEntries = allExpanded.map(m => m[d]).filter(Boolean);
    const newEntry    = newByDay[d] || null;
    const allEntries  = newEntry ? [...baseEntries, newEntry] : [...baseEntries];

    const entry = {
      day: d, hasBase: baseEntries.length > 0, hasNew: !!newEntry,
      newStage: newEntry?.stageName || null, conflict: false,
    };
    for (const p of PARAMS) {
      entry["base_"     + p.key] = mergeParam(baseEntries, p.key);
      entry["new_"      + p.key] = newEntry ? newEntry[p.key] : null;
      entry["combined_" + p.key] = mergeParam(allEntries, p.key);
      if (entry["combined_" + p.key]?.conflict) entry.conflict = true;
    }
    timeline.push(entry);
  }
  return timeline;
}

function getStageBreaks(config, startDay) {
  if (!config) return [];
  const breaks = [];
  let day = startDay;
  for (const stage of config.stages) {
    breaks.push({ day, name: stage.name, duration: stage.duration });
    day += stage.duration;
  }
  return breaks;
}

// ─── Chart constants ───

const PAD       = { left: 56, right: 12, top: 44, bottom: 28 };
const CHART_H   = 170;
const DAY_W     = 14;
const DAY_BAR   = DAY_W * 0.46;
const NIGHT_BAR = DAY_W * 0.30;
const BAR_GAP   = 1.5;

// ─── ParamChart ───

function ParamChart({ timeline, paramCfg, newConfig, stageBreaks, newStartDay, hoveredDay, setHoveredDay }) {
  const { key, label, unit, yMin, yMax } = paramCfg;
  const totalDays = timeline.length;
  const svgW = PAD.left + totalDays * DAY_W + PAD.right;
  const svgH = PAD.top + CHART_H + PAD.bottom;

  // Higher value = higher on screen = smaller y pixel
  const yScale = v => PAD.top + CHART_H * (1 - (v - yMin) / (yMax - yMin));

  const yStep  = key === "co2" ? 200 : key === "humidity" ? 10 : 2;
  const yTicks = [];
  for (let v = yMin; v <= yMax; v += yStep) yTicks.push(v);

  const hd = hoveredDay !== null ? timeline[hoveredDay] : null;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "0 0 4px", marginLeft: PAD.left }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#8892a4" }}>({unit})</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <svg width={svgW} height={svgH} style={{ display: "block" }} onMouseLeave={() => setHoveredDay(null)}>
          <defs>
            <pattern id={"hatch-" + key} patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke={newConfig?.color || "#999"} strokeWidth="1.2" opacity="0.5" />
            </pattern>
          </defs>

          {/* Grid */}
          {yTicks.map(v => (
            <g key={v}>
              <line x1={PAD.left} x2={PAD.left + totalDays * DAY_W} y1={yScale(v)} y2={yScale(v)} stroke="#eaecf0" strokeWidth={0.8} />
              <text x={PAD.left - 6} y={yScale(v) + 3} textAnchor="end" fill="#8892a4" fontSize={9} fontFamily="inherit">{v}</text>
            </g>
          ))}

          {/* Stage dividers for new config */}
          {stageBreaks.map((sb, i) => {
            const x1 = PAD.left + sb.day * DAY_W;
            const x2 = PAD.left + (sb.day + sb.duration) * DAY_W;
            return (
              <g key={i}>
                <line x1={x1} y1={PAD.top - 4} x2={x1} y2={PAD.top + CHART_H}
                  stroke={newConfig?.color || "#999"} strokeWidth={0.8} strokeDasharray="4,3" opacity={0.35} />
                <text x={(x1 + x2) / 2} y={PAD.top - 10} textAnchor="middle"
                  fill={newConfig?.color || "#999"} fontSize={9} fontFamily="inherit" fontWeight={600} opacity={0.7}>
                  {sb.name}
                </text>
              </g>
            );
          })}

          {/* Start line for new config */}
          {newConfig && (
            <line x1={PAD.left + newStartDay * DAY_W} y1={PAD.top - 20}
              x2={PAD.left + newStartDay * DAY_W} y2={PAD.top + CHART_H}
              stroke={newConfig.color} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.55} />
          )}

          {/* ── Day columns ── */}
          {timeline.map(td => {
            const x        = PAD.left + td.day * DAY_W;
            const combined = td["combined_" + key];
            const baseData = td["base_"     + key];
            const newData  = td["new_"      + key];

            const dayX   = x + 1;
            const nightX = x + DAY_BAR + BAR_GAP + 1;

            // Per-period conflict: independent — one period can conflict while the other doesn't
            const dayConflict   = !!combined && combined.day.min   > combined.day.max;
            const nightConflict = !!combined && combined.night.min  > combined.night.max;

            return (
              <g key={td.day}>
                {/* Subtle background tint for any conflict in this day */}
                {td.conflict && (
                  <rect x={x} y={PAD.top} width={DAY_W} height={CHART_H} fill="#FEF2F2" opacity={0.5} />
                )}

                {/* ── Base bars — always visible ── */}
                {baseData && (
                  <>
                    <rect x={dayX}   y={yScale(baseData.day.max)}
                      width={DAY_BAR}   height={Math.max(1, yScale(baseData.day.min)   - yScale(baseData.day.max))}
                      fill="#FFF8E1" stroke="#FFB74D" strokeWidth={0.6} rx={1.5} />
                    <rect x={nightX} y={yScale(baseData.night.max)}
                      width={NIGHT_BAR} height={Math.max(1, yScale(baseData.night.min) - yScale(baseData.night.max))}
                      fill="#E8EAF6" stroke="#7986CB" strokeWidth={0.6} rx={1} />
                  </>
                )}

                {/* ── New-config bars — always visible ── */}
                {newData && (
                  <>
                    <rect x={dayX}   y={yScale(newData.day.max)}
                      width={DAY_BAR}   height={Math.max(1, yScale(newData.day.min)   - yScale(newData.day.max))}
                      fill={"url(#hatch-" + key + ")"} stroke={newConfig.color}
                      strokeWidth={0.8} strokeDasharray="3,2" rx={1.5} opacity={0.65} />
                    <rect x={nightX} y={yScale(newData.night.max)}
                      width={NIGHT_BAR} height={Math.max(1, yScale(newData.night.min) - yScale(newData.night.max))}
                      fill={"url(#hatch-" + key + ")"} stroke={newConfig.color}
                      strokeWidth={0.8} strokeDasharray="3,2" rx={1} opacity={0.45} />
                  </>
                )}

                {/* ── Set-point circles — only when that period has no conflict ── */}
                {combined && !dayConflict && (
                  <circle cx={dayX + DAY_BAR / 2} cy={yScale(combined.day.set)} r={2.5}
                    fill={td.hasNew && td.hasBase ? "#FF9800" : td.hasNew ? newConfig.color : "#FF9800"}
                    stroke="#fff" strokeWidth={0.8} />
                )}
                {combined && !nightConflict && (
                  <circle cx={nightX + NIGHT_BAR / 2} cy={yScale(combined.night.set)} r={1.8}
                    fill={td.hasNew && td.hasBase ? "#5C6BC0" : td.hasNew ? newConfig.color : "#5C6BC0"}
                    stroke="#fff" strokeWidth={0.6} opacity={0.9} />
                )}

                {/* ── Conflict gap rects ──
                    When conflict, combined.day.min > combined.day.max:
                      combined.day.min = max-of-all-mins  (higher value, higher on screen)
                      combined.day.max = min-of-all-maxes (lower value, lower on screen)
                    The gap runs from combined.day.max (ceiling of lower range)
                    to combined.day.min (floor of upper range).
                    On y-axis: yScale(combined.day.min) < yScale(combined.day.max)
                    so rect y = yScale(combined.day.min), height = yScale(combined.day.max) - yScale(combined.day.min) */}
                {dayConflict && (
                  <rect
                    x={dayX}
                    y={yScale(combined.day.min)}
                    width={DAY_BAR}
                    height={Math.max(2, yScale(combined.day.max) - yScale(combined.day.min))}
                    fill="rgba(239,68,68,0.22)"
                    stroke="#EF4444"
                    strokeWidth={0.9}
                    rx={1.5}
                  />
                )}
                {nightConflict && (
                  <rect
                    x={nightX}
                    y={yScale(combined.night.min)}
                    width={NIGHT_BAR}
                    height={Math.max(2, yScale(combined.night.max) - yScale(combined.night.min))}
                    fill="rgba(239,68,68,0.16)"
                    stroke="#EF4444"
                    strokeWidth={0.9}
                    rx={1}
                  />
                )}

                {/* Hover target — transparent, always on top */}
                <rect x={x} y={PAD.top} width={DAY_W} height={CHART_H} fill="transparent"
                  onMouseEnter={() => setHoveredDay(td.day)} style={{ cursor: "crosshair" }} />
              </g>
            );
          })}

          {/* Day labels every 5 */}
          {timeline.map(td =>
            td.day % 5 !== 0 ? null : (
              <text key={td.day} x={PAD.left + td.day * DAY_W + DAY_W / 2} y={PAD.top + CHART_H + 14}
                textAnchor="middle" fill="#8892a4" fontSize={9} fontFamily="inherit">{td.day}</text>
            )
          )}

          {/* Hover tooltip */}
          {hd && (() => {
            const x        = PAD.left + hd.day * DAY_W + DAY_W / 2;
            const combined = hd["combined_" + key];
            const dayC     = combined && combined.day.min   > combined.day.max;
            const nightC   = combined && combined.night.min > combined.night.max;
            const anyC     = dayC || nightC;
            const tw = 240;
            const lines = anyC ? (dayC && nightC ? 2 : 1) : 2;
            const th = 22 + lines * 16;
            let tx = x - tw / 2;
            if (tx < 2) tx = 2;
            if (tx + tw > svgW - 2) tx = svgW - tw - 2;
            const ty = PAD.top + 8;
            return (
              <g>
                <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + CHART_H} stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3,2" />
                <rect x={tx} y={ty} width={tw} height={th} rx={6}
                  fill="#fff" stroke="#dde3eb" strokeWidth={1}
                  filter="drop-shadow(0 2px 6px rgba(0,0,0,0.08))" />
                <text x={tx + 10} y={ty + 14} fill="#1a1a2e" fontSize={11} fontWeight={700} fontFamily="inherit">
                  {"День " + hd.day + (hd.newStage ? " \u00b7 " + hd.newStage : "")}
                </text>
                {anyC ? (
                  <>
                    {dayC && (
                      <text x={tx + 10} y={ty + 30} fill="#EF4444" fontSize={10} fontFamily="inherit">
                        {"\u2600 Конфликт день: зазор " + combined.day.max + "\u2013" + combined.day.min + " " + unit}
                      </text>
                    )}
                    {nightC && (
                      <text x={tx + 10} y={ty + (dayC ? 46 : 30)} fill="#EF4444" fontSize={10} fontFamily="inherit">
                        {"\u263e Конфликт ночь: зазор " + combined.night.max + "\u2013" + combined.night.min + " " + unit}
                      </text>
                    )}
                  </>
                ) : combined ? (
                  <>
                    <text x={tx + 10} y={ty + 30} fill="#E65100" fontSize={10} fontFamily="inherit">
                      {"\u2600 День: " + combined.day.min + "\u2013" + combined.day.max + " (set " + combined.day.set + ") " + unit}
                    </text>
                    <text x={tx + 10} y={ty + 46} fill="#303F9F" fontSize={10} fontFamily="inherit">
                      {"\u263e Ночь: " + combined.night.min + "\u2013" + combined.night.max + " (set " + combined.night.set + ") " + unit}
                    </text>
                  </>
                ) : null}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

// ─── App ───

export default function App() {
  const [basePlantings, setBasePlantings] = useState([
    { config: CROPS["tomato.v1"], startDay: 0  },
    { config: CROPS["pepper.v2"], startDay: 10 },
  ]);
  const [newCropKey,   setNewCropKey]   = useState("cucumber.v1");
  const [newStartDay,  setNewStartDay]  = useState(5);
  const [hoveredDay,   setHoveredDay]   = useState(null);
  const [activeParams, setActiveParams] = useState(["temp", "humidity", "co2"]);

  const newConfig = CROPS[newCropKey];

  const availableCrops = useMemo(
    () => Object.entries(CROPS).filter(([k]) => !basePlantings.some(p => p.config.name === k)),
    [basePlantings]
  );
  const allApplied = availableCrops.length === 0;

  const timeline      = useMemo(() => computeTimeline(basePlantings, allApplied ? null : newConfig, newStartDay), [basePlantings, newConfig, newStartDay, allApplied]);
  const stageBreaks   = useMemo(() => getStageBreaks(allApplied ? null : newConfig, newStartDay),                 [newConfig, newStartDay, allApplied]);
  const conflictCount = useMemo(() => timeline.filter(d => d.conflict).length,                                    [timeline]);
  const totalDays     = timeline.length;
  const maxSlider     = Math.max(0, totalDays - 5);

  // ── Apply: merge new config into base ──
  const handleApply = () => {
    const updated = [...basePlantings, { config: newConfig, startDay: newStartDay }];
    setBasePlantings(updated);
    const usedNames = updated.map(p => p.config.name);
    const next = Object.keys(CROPS).find(k => !usedNames.includes(k));
    if (next) { setNewCropKey(next); setNewStartDay(5); }
  };

  // ── Remove: drop one config from base (inverse of apply) ──
  const handleRemove = (configName) => {
    const updated = basePlantings.filter(p => p.config.name !== configName);
    setBasePlantings(updated);
    // If removed crop was the current overlay target, pick any still-available crop
    if (configName === newCropKey) {
      const usedNames = updated.map(p => p.config.name);
      const next = Object.keys(CROPS).find(k => !usedNames.includes(k) && k !== configName);
      if (next) setNewCropKey(next);
    }
  };

  const toggleParam = (k) =>
    setActiveParams(prev =>
      prev.includes(k) ? (prev.length > 1 ? prev.filter(p => p !== k) : prev) : [...prev, k]
    );

  const canApply = !allApplied && !conflictCount;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "#f7f8fa", color: "#1a1a2e", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf1", padding: "20px 28px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>Планирование посадки</h1>
          {conflictCount > 0 ? (
            <span style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
              {"\u26a0 " + conflictCount + " конфликт" + (conflictCount > 4 ? "ов" : conflictCount > 1 ? "а" : "")}
            </span>
          ) : (
            <span style={{ background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
              \u2713 Совместимо
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#8892a4" }}>
          Наложение конфигов на таймлайн · Существующие культуры + новая добавляемая
        </p>
      </div>

      {/* ── Controls ── */}
      <div style={{ background: "#fff", padding: "14px 28px", borderBottom: "1px solid #e8ecf1", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        {allApplied ? (
          <span style={{ fontSize: 12, color: "#8892a4", fontStyle: "italic" }}>Все культуры уже в базе</span>
        ) : (
          <>
            {/* Crop selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#8892a4", fontWeight: 500 }}>Добавить:</span>
              <select value={newCropKey}
                onChange={e => { setNewCropKey(e.target.value); setNewStartDay(5); }}
                style={{ background: "#f7f8fa", border: "1px solid #dde3eb", borderRadius: 8, color: newConfig?.color, padding: "6px 12px", fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
                {availableCrops.map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>

            {/* Start-day slider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 280 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: newConfig?.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#8892a4", whiteSpace: "nowrap", fontWeight: 500 }}>
                {"Начало (день " + newStartDay + "):"}
              </span>
              <input type="range" min={0} max={maxSlider} value={newStartDay}
                onChange={e => setNewStartDay(Number(e.target.value))}
                style={{ flex: 1, accentColor: newConfig?.color, cursor: "pointer" }} />
              <button onClick={() => setNewStartDay(Math.max(0, newStartDay - 1))}
                style={{ background: "#f7f8fa", border: "1px solid #dde3eb", borderRadius: 6, color: "#4a5568", width: 32, height: 32, cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>
                −
              </button>
              <button onClick={() => setNewStartDay(Math.min(maxSlider, newStartDay + 1))}
                style={{ background: "#f7f8fa", border: "1px solid #dde3eb", borderRadius: 6, color: "#4a5568", width: 32, height: 32, cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>
                +
              </button>
            </div>

            {/* Apply button */}
            <button
              onClick={handleApply}
              disabled={!canApply}
              title={conflictCount > 0 ? "Есть конфликты — посадка невозможна" : "Добавить в базовый конфиг"}
              style={{
                background: canApply ? "#16A34A" : "#e8ecf1",
                color: canApply ? "#fff" : "#aab0bb",
                border: "none", borderRadius: 8,
                padding: "7px 18px", fontSize: 13, fontWeight: 600,
                fontFamily: "inherit", cursor: canApply ? "pointer" : "not-allowed",
                transition: "background 0.15s", whiteSpace: "nowrap",
              }}>
              \u2713 Наложить
            </button>
          </>
        )}

        {/* Param toggles */}
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {PARAMS.map(p => (
            <button key={p.key} onClick={() => toggleParam(p.key)}
              style={{
                background: activeParams.includes(p.key) ? "#1a1a2e" : "#f7f8fa",
                color:      activeParams.includes(p.key) ? "#fff"     : "#8892a4",
                border: "1px solid " + (activeParams.includes(p.key) ? "#1a1a2e" : "#dde3eb"),
                borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Charts ── */}
      <div style={{ padding: "16px 28px 8px" }}>
        {PARAMS.filter(p => activeParams.includes(p.key)).map(p => (
          <ParamChart key={p.key} timeline={timeline} paramCfg={p}
            newConfig={allApplied ? null : newConfig}
            stageBreaks={allApplied ? [] : stageBreaks}
            newStartDay={newStartDay}
            hoveredDay={hoveredDay} setHoveredDay={setHoveredDay} />
        ))}
      </div>

      {/* ── Legend ── */}
      <div style={{ padding: "4px 28px 12px", display: "flex", gap: 20, fontSize: 11, color: "#8892a4", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 16, height: 12, background: "#FFF8E1", border: "1px solid #FFB74D", borderRadius: 2 }} />
          База — день
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 10, height: 12, background: "#E8EAF6", border: "1px solid #7986CB", borderRadius: 2 }} />
          База — ночь
        </span>
        {!allApplied && newConfig && (
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-block", width: 16, height: 12, border: "1.5px dashed " + newConfig.color, borderRadius: 2, opacity: 0.8 }} />
            {newConfig.label + " (штриховка)"}
          </span>
        )}
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 14, height: 10, background: "rgba(239,68,68,0.2)", border: "1px solid #EF4444", borderRadius: 2 }} />
          Конфликт (зазор)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 7, height: 7, background: "#FF9800", borderRadius: "50%", border: "1px solid #fff", boxShadow: "0 0 0 0.5px #FF9800" }} />
          set (день)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 6, height: 6, background: "#5C6BC0", borderRadius: "50%", border: "1px solid #fff", boxShadow: "0 0 0 0.5px #5C6BC0" }} />
          set (ночь)
        </span>
      </div>

      {/* ── Planting cards ── */}
      <div style={{ padding: "4px 28px 20px", display: "flex", gap: 12, flexWrap: "wrap" }}>

        {/* Base cards with remove button */}
        {basePlantings.map(p => (
          <div key={p.config.name} style={{
            flex: "1 1 180px", background: "#fff", border: "1px solid #e8ecf1", borderRadius: 10,
            padding: "14px 16px 12px", borderLeft: "4px solid " + p.config.color, position: "relative",
          }}>
            {basePlantings.length > 1 && (
              <button
                onClick={() => handleRemove(p.config.name)}
                title={"Удалить " + p.config.label + " из базы"}
                style={{
                  position: "absolute", top: 8, right: 8,
                  background: "transparent", border: "1px solid #e8ecf1",
                  borderRadius: "50%", width: 22, height: 22,
                  cursor: "pointer", fontSize: 14, lineHeight: "18px",
                  color: "#94a3b8", padding: 0, textAlign: "center",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { e.target.style.borderColor = "#EF4444"; e.target.style.color = "#EF4444"; }}
                onMouseLeave={e => { e.target.style.borderColor = "#e8ecf1"; e.target.style.color = "#94a3b8"; }}
              >×</button>
            )}
            <div style={{ fontSize: 13, fontWeight: 700, color: p.config.color, marginBottom: 6, paddingRight: basePlantings.length > 1 ? 24 : 0 }}>
              {p.config.label}
            </div>
            <div style={{ fontSize: 12, color: "#8892a4", lineHeight: 1.8 }}>
              {"Старт: день " + p.startDay + " \u00b7 " + p.config.stages.reduce((s, st) => s + st.duration, 0) + " дней"}<br />
              {"Стадий: " + p.config.stages.length}
            </div>
          </div>
        ))}

        {/* New config preview card */}
        {!allApplied && newConfig && (
          <div style={{ flex: "1 1 180px", background: "#fff", border: "1px solid " + newConfig.color + "30", borderRadius: 10, padding: "14px 16px", borderLeft: "4px solid " + newConfig.color }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: newConfig.color, marginBottom: 6 }}>
              {newConfig.label}
              <span style={{ fontWeight: 400, color: "#8892a4" }}> (добавляемый)</span>
            </div>
            <div style={{ fontSize: 12, color: "#8892a4", lineHeight: 1.8 }}>
              {"Старт: день " + newStartDay + " \u00b7 " + newConfig.stages.reduce((s, st) => s + st.duration, 0) + " дней"}<br />
              {"Стадий: " + newConfig.stages.length + " \u00b7 Перемещайте слайдером"}
            </div>
          </div>
        )}

        {/* Conflict summary card */}
        {conflictCount > 0 && (
          <div style={{ flex: "1 1 180px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "14px 16px", borderLeft: "4px solid #EF4444" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", marginBottom: 6 }}>Конфликт</div>
            <div style={{ fontSize: 12, color: "#8892a4", lineHeight: 1.8 }}>
              {conflictCount + " дн. — диапазоны не пересекаются."}<br />
              Посадка невозможна.
            </div>
          </div>
        )}
      </div>

      {/* ── How-to ── */}
      <div style={{ margin: "0 28px 24px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "14px 18px", fontSize: 12, color: "#92400E", lineHeight: 1.8 }}>
        <span style={{ fontWeight: 700 }}>Как читать график:</span><br />
        Левый столбик (широкий, оранжевый) — день (14ч). Правый столбик (узкий, синий) — ночь (10ч). Расположены рядом.<br />
        <span style={{ color: "#FF9800" }}>●</span> set-точка — целевое значение. Столбик — допустимый диапазон (min–max).<br />
        <span style={{ color: "#DC2626" }}>Красный прямоугольник</span> — конфликт: показывает <em>только зазор</em> между диапазонами. Оба диапазона остаются видны рядом.<br />
        <span style={{ fontWeight: 600 }}>✓ Наложить</span> — добавляет выбранную культуру в базу (активно только без конфликтов).<br />
        <span style={{ fontWeight: 600 }}>× на карточке</span> — удаляет культуру из базы; конфиг пересчитывается без неё.
      </div>
    </div>
  );
}
