import { useState, useEffect, useCallback, useRef, createContext, useContext, memo } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  estudio: {
    id:"estudio", label:"Estudio", icon:"◆",
    // Editorial Cream — papel bitácora, tinta oscura, neón solo donde importa
    bg:"#EFEBE3", bgReal:"#EFEBE3", bgPanel:"#E5E0D5", bgCard:"#FFFFFF", bgHover:"#E5E0D5",
    border:"rgba(58,50,38,0.08)", border2:"#D8D2C5",
    ink:"#1a1814", ink2:"#3a352d", ink3:"#6a6258", ink4:"#9a9286",
    accent:"#1a1814", accentBg:"rgba(26,24,20,0.07)", accentHover:"#2a2620",
    neon:"#E8F062",   neonSoft:"#F2F4C8",
    green:"#7A8A4F",  greenBg:"#DCE2C8",
    amber:"#C97D5C",  amberBg:"#F0DDD2",
    rose:"#C97D5C",   roseBg:"#F0DDD2",
    blue:"#6B91B3",   blueBg:"#D5DFE8",
    orange:"#C97D5C", orangeBg:"#F0DDD2",
    cyan:"#6B91B3",   cyanBg:"#D5DFE8",
  },
  dark: {
    id:"dark", label:"Noche", icon:"◈", isDark:true,
    // Studio night — refined editorial dark, orange pulse on near-black
    bg:"#141210", bgReal:"#141210", bgPanel:"#1C1A18", bgCard:"#242220", bgHover:"#2E2B27",
    border:"rgba(255,255,255,0.07)", border2:"rgba(255,255,255,0.12)",
    ink:"#F0EDE8", ink2:"#9C9488", ink3:"#60584E", ink4:"#38342E",
    accent:"#E85200", accentBg:"rgba(232,82,0,0.12)", accentHover:"#FF6010",
    green:"#3DAA6C",  greenBg:"rgba(61,170,108,0.10)",
    amber:"#C49030",  amberBg:"rgba(196,144,48,0.10)",
    rose:"#D04060",   roseBg:"rgba(208,64,96,0.10)",
    blue:"#4878C0",   blueBg:"rgba(72,120,192,0.10)",
    orange:"#E85200", orangeBg:"rgba(232,82,0,0.10)",
    cyan:"#2898A8",   cyanBg:"rgba(40,152,168,0.10)",
  },
  // ── Índigo — Concentración profunda ───────────────────────────────────────
  // Azul frío activa el córtex prefrontal → foco analítico, calma cognitiva.
  indigo: {
    id:"indigo", label:"Índigo", icon:"◈",
    bg:"#F7F8FE", bgReal:"#F7F8FE", bgPanel:"#ECEEF9", bgCard:"#FFFFFF", bgHover:"#E0E3F5",
    border:"rgba(67,56,202,0.11)", border2:"rgba(67,56,202,0.22)",
    ink:"#1E1B4B", ink2:"#3730A3", ink3:"#6366F1", ink4:"#A5B4FC",
    accent:"#4338CA", accentBg:"rgba(67,56,202,0.09)", accentHover:"#3730A3",
    green:"#059669",  greenBg:"rgba(5,150,105,0.09)",
    amber:"#D97706",  amberBg:"rgba(217,119,6,0.09)",
    rose:"#DC2626",   roseBg:"rgba(220,38,38,0.09)",
    blue:"#2563EB",   blueBg:"rgba(37,99,235,0.09)",
    orange:"#EA580C", orangeBg:"rgba(234,88,12,0.09)",
    cyan:"#0891B2",   cyanBg:"rgba(8,145,178,0.09)",
  },
  // ── Bosque — Flujo creativo ───────────────────────────────────────────────
  // Verde restaura la atención (ART) y estimula la ideación. Como pensar en la naturaleza.
  bosque: {
    id:"bosque", label:"Bosque", icon:"◎",
    bg:"#F3FAF4", bgReal:"#F3FAF4", bgPanel:"#E4F4E6", bgCard:"#FFFFFF", bgHover:"#CEE9D1",
    border:"rgba(21,128,61,0.12)", border2:"rgba(21,128,61,0.23)",
    ink:"#052E16", ink2:"#166534", ink3:"#16A34A", ink4:"#86EFAC",
    accent:"#15803D", accentBg:"rgba(21,128,61,0.09)", accentHover:"#166534",
    green:"#059669",  greenBg:"rgba(5,150,105,0.09)",
    amber:"#B45309",  amberBg:"rgba(180,83,9,0.09)",
    rose:"#BE185D",   roseBg:"rgba(190,24,93,0.09)",
    blue:"#1D4ED8",   blueBg:"rgba(29,78,216,0.09)",
    orange:"#C2410C", orangeBg:"rgba(194,65,12,0.09)",
    cyan:"#0E7490",   cyanBg:"rgba(14,116,144,0.09)",
  },
  // ── Aurora — Imaginación y síntesis ──────────────────────────────────────
  // Violeta activa la imaginación, el pensamiento divergente y la síntesis creativa.
  aurora: {
    id:"aurora", label:"Aurora", icon:"◇",
    bg:"#FAF9FF", bgReal:"#FAF9FF", bgPanel:"#EDE9FF", bgCard:"#FFFFFF", bgHover:"#DDD6FE",
    border:"rgba(109,40,217,0.11)", border2:"rgba(109,40,217,0.22)",
    ink:"#2E1065", ink2:"#4C1D95", ink3:"#7C3AED", ink4:"#C4B5FD",
    accent:"#7C3AED", accentBg:"rgba(124,58,237,0.09)", accentHover:"#6D28D9",
    green:"#059669",  greenBg:"rgba(5,150,105,0.09)",
    amber:"#D97706",  amberBg:"rgba(217,119,6,0.09)",
    rose:"#DB2777",   roseBg:"rgba(219,39,119,0.09)",
    blue:"#2563EB",   blueBg:"rgba(37,99,235,0.09)",
    orange:"#EA580C", orangeBg:"rgba(234,88,12,0.09)",
    cyan:"#0891B2",   cyanBg:"rgba(8,145,178,0.09)",
  },
};

// T is mutable — updated when theme changes
let T = { ...THEMES.estudio };

// Theme context
const ThemeCtx = createContext({ themeId:"estudio", setThemeId:()=>{} });
const useTheme = () => useContext(ThemeCtx);

const CATEGORIES = [
  { id:"app",      label:"📱 App / Software",   color:T.accent, colorBg:T.accentBg, subcategories:["App móvil","Web app","SaaS","Herramienta interna","API / Backend"], expert:"Eres un líder senior de producto digital con 15 años de experiencia. Analizas ideas con criterio brutal y honesto. No eres complaciente." },
  { id:"libro",    label:"📚 Libro / Literatura", color:T.amber,  colorBg:T.amberBg,
    subcategories:["Novela","Cuento","Worldbuilding","Fantasía","Ciencia ficción","Romance","Thriller","Histórico","Infantil","Poesía","Guión","Cómic"],
    expert:"Eres editor literario senior y consultor de worldbuilding con 20 años de experiencia. Sabes qué tiene potencial real de publicación. Eres directo y exigente.",
    worldbuilding: true },
  { id:"startup",  label:"🚀 Startup / Negocio", color:T.green,  colorBg:T.greenBg,  subcategories:["B2C","B2B","Marketplace","Fintech","Edtech","Healthtech","E-commerce"], expert:"Eres consultor estratégico con experiencia en startups y venture capital. Criterio de inversión real." },
  { id:"diseño",   label:"🎨 Diseño / Branding", color:T.rose,   colorBg:T.roseBg,   subcategories:["Identidad visual","Packaging","Diseño editorial","Motion","Ilustración"], expert:"Eres director creativo senior con experiencia en branding y diseño estratégico." },
  { id:"contenido",label:"🎬 Contenido / Media", color:T.orange, colorBg:T.orangeBg, subcategories:["YouTube","Podcast","Newsletter","Curso online","Serie","Documental"], expert:"Eres productor y estratega de contenido digital. Sabes qué funciona en cada plataforma." },
  { id:"musica",   label:"🎵 Música / Audio",    color:T.cyan,   colorBg:T.cyanBg,   subcategories:["Álbum","Single","Proyecto musical","Sello","Tech musical"], expert:"Eres productor musical y estratega de la industria discográfica." },
  { id:"otro",     label:"✦ Otro",               color:"#7C6F5E", colorBg:"#F5F0E8", subcategories:["Evento","Producto físico","Servicio","ONG / Causa","Educación","Otro"], expert:"Eres consultor estratégico generalista con criterio crítico y honesto." },
];

const COLUMNS = [
  { id:"concepto",   label:"Concepto",   icon:"◈", color:"#6090C0", desc:"Ideas nuevas sin desarrollar" },
  { id:"desarrollo", label:"Desarrollo", icon:"◉", color:"#C4963C", desc:"En proceso activo de trabajo" },
  { id:"revision",   label:"Revisión",   icon:"◎", color:"#C07848", desc:"Listo, esperando revisión" },
  { id:"listo",      label:"Listo",      icon:"◆", color:"#4AAA70", desc:"Completado y aprobado" },
];

const CARD_TYPES = ["tarea","idea","pregunta","referencia","bloqueo"];
const TYPE_COLOR = { get tarea(){return T.accent}, get idea(){return T.amber}, get pregunta(){return T.blue}, get referencia(){return T.green}, get bloqueo(){return T.rose} };
const TYPE_BG    = { get tarea(){return T.accentBg}, get idea(){return T.amberBg}, get pregunta(){return T.blueBg}, get referencia(){return T.greenBg}, get bloqueo(){return T.roseBg} };
const REC_COLOR  = { get seguir(){return T.green}, get "rediseñar"(){return T.amber}, get simplificar(){return T.blue}, get pivotar(){return T.accent}, get pausar(){return T.orange}, get descartar(){return T.rose} };
const ACCEPTED   = "image/*,.pdf,.doc,.docx,.txt,.md,.xls,.xlsx,.ppt,.pptx,.zip,.csv";

const SECURITY_QUESTIONS = [
  "¿Cuál es el segundo nombre de tu madre?",
  "¿Cómo se llama o se llamaba tu primera mascota?",
  "¿En qué ciudad naciste?",
  "¿Cuál es el apellido de soltera de tu abuela materna?",
  "¿Cómo se llamaba tu escuela primaria?",
  "¿Cuál es el nombre de tu mejor amigo/a de infancia?",
  "¿Cuál fue tu primer trabajo?",
  "¿Cuál es tu película favorita de la infancia?",
];

const STICKER_TYPES = ["opinión","complemento","pregunta","objeción","referencia"];
const STICKER_ICON  = { "opinión":"💬", "complemento":"➕", "pregunta":"❓", "objeción":"⚡", "referencia":"🔗" };
const STICKER_COLOR = { get "opinión"(){return T.blue}, get "complemento"(){return T.green}, get "pregunta"(){return T.amber}, get "objeción"(){return T.rose}, get "referencia"(){return T.accent} };

function genId()    { return Math.random().toString(36).substr(2, 9); }
function nowTs()    { return Date.now(); }
// Returns ms until next midnight UTC (when Gemini free quota resets)
function msUntilMidnightUTC() {
  const now = new Date();
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return midnight.getTime() - now.getTime();
}
function fmtCountdownHM(ms) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
function fmtDate(t) { return new Date(t).toLocaleDateString("es", { day:"numeric", month:"short" }); }
function fmtTime(t) { return new Date(t).toLocaleTimeString("es", { hour:"2-digit", minute:"2-digit" }); }
function fmtSize(b) { return b < 1024 ? b+"B" : b < 1048576 ? Math.round(b/1024)+"KB" : (b/1048576).toFixed(1)+"MB"; }
function fileIcon(name) {
  const ext = (name||"").split(".").pop().toLowerCase();
  if (["jpg","jpeg","png","gif","webp","svg"].includes(ext)) return "🖼";
  if (ext==="pdf") return "📄";
  if (["doc","docx"].includes(ext)) return "📝";
  if (["xls","xlsx","csv"].includes(ext)) return "📊";
  if (["ppt","pptx"].includes(ext)) return "📑";
  if (["zip","rar"].includes(ext)) return "🗜";
  return "📎";
}

// ─── CRYPTO HELPERS ───────────────────────────────────────────────────────────
// sha256: used to hash security-question answers before storing/comparing.
// Board passwords are kept readable so owners can share them with collaborators.
async function sha256(str) {
  if (!str) return "";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str.toLowerCase().trim()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
// Detect whether a stored value is already a SHA-256 hex (64-char) hash.
function isHashed(s) { return typeof s === "string" && /^[0-9a-f]{64}$/.test(s); }

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://hpagoemelxgernhustlj.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z78iX8OB7WDNOPbQNaw3NQ_oRVwNVoM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── STORAGE (localStorage only — session & recents) ─────────────────────────
function getL(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function setL(k, v)  { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ─── DB HELPERS ───────────────────────────────────────────────────────────────
function dbToBoard(r) {
  const secQ1 = r.security_q1 || "", secA1 = r.security_a1 || "";
  const secQ2 = r.security_q2 || "", secA2 = r.security_a2 || "";
  return {
    id: r.id, name: r.name, categoryId: r.category_id,
    subcategories: r.subcategories || [],
    conceptTitle: r.concept_title || "", conceptDesc: r.concept_desc || "",
    password: r.password || "",
    secQ1, secA1, secQ2, secA2,
    // Reconstruct nested security object so PasswordModal can access board.security.q1
    security: (secQ1 || secQ2) ? { q1: secQ1, a1: secA1, q2: secQ2, a2: secA2 } : null,
    createdBy: r.created_by, createdAt: r.created_at,
  };
}
function boardToDb(b) {
  // Support both flat (secQ1) and nested (security.q1) formats from CreateBoardModal
  const secQ1 = b.security?.q1 || b.secQ1 || "";
  const secA1 = b.security?.a1 || b.secA1 || "";
  const secQ2 = b.security?.q2 || b.secQ2 || "";
  const secA2 = b.security?.a2 || b.secA2 || "";
  return {
    id: b.id, name: b.name, category_id: b.categoryId,
    subcategories: b.subcategories || [],
    concept_title: b.conceptTitle || "", concept_desc: b.conceptDesc || "",
    password: b.password || "",
    security_q1: secQ1, security_a1: secA1,
    security_q2: secQ2, security_a2: secA2,
    created_by: b.createdBy, created_at: b.createdAt,
  };
}
function dbToData(r) {
  return {
    cards: r.cards || [], comments: r.comments || {}, connections: r.connections || [],
    canvasPositions: r.canvas_positions || { cards:{}, stickers:{} },
    lastUpdated: r.last_updated || Date.now(),
  };
}

async function dbGetBoards() {
  const { data, error } = await supabase.from("boards").select("*").order("created_at", { ascending: false });
  if (error) { console.error("dbGetBoards:", error.message); return []; }
  return (data || []).map(dbToBoard);
}
async function dbCreateBoard(board, initialData) {
  const { error: e1 } = await supabase.from("boards").insert(boardToDb(board));
  if (e1) throw e1;
  const { error: e2 } = await supabase.from("board_data").insert({
    board_id: board.id,
    cards: initialData.cards || [], comments: initialData.comments || {},
    connections: initialData.connections || [],
    canvas_positions: initialData.canvasPositions || { cards:{}, stickers:{} },
    last_updated: Date.now(),
  });
  if (e2) throw e2;
}
async function dbDeleteBoard(boardId) {
  await supabase.from("boards").delete().eq("id", boardId);
}
async function dbGetBoardData(boardId) {
  const { data, error } = await supabase.from("board_data").select("*").eq("board_id", boardId).single();
  if (error || !data) return null;
  return dbToData(data);
}
async function dbSaveBoardData(boardId, data) {
  const now = Date.now();
  const { error } = await supabase.from("board_data").upsert({
    board_id: boardId,
    cards: data.cards || [], comments: data.comments || {},
    connections: data.connections || [],
    canvas_positions: data.canvasPositions || { cards:{}, stickers:{} },
    last_updated: now,
  });
  if (error) throw error;
  return { ...data, lastUpdated: now };
}

// ─── AI HELPER ────────────────────────────────────────────────────────────────
// Provider 1: Google Gemini (gratis, sin tarjeta)
// Provider 2: Groq (gratis, 14 400 req/día, llama-3.3-70b)
const GEMINI_MODEL = "gemini-2.0-flash";
function getAIKey()     { return getL("mindstorm-apikey", ""); }
function saveAIKey(k)   { setL("mindstorm-apikey", k.trim()); }
function getGroqKey()   { return getL("mindstorm-groqkey", ""); }
function saveGroqKey(k) { setL("mindstorm-groqkey", k.trim()); }

// Classify a Gemini 429 error.
// BUG HISTORY: "/quota|day|daily/i" matched the generic RPM message
// "Resource has been exhausted (e.g. check quota)." — classifying RPM limits
// as daily quota and showing a 6-hour countdown when 65s was enough.
// Fix: daily quota requires explicit "daily" or "per.?day" in the message.
function geminiErrType(msg) {
  if (/\bdaily\b|per.?day|free.?tier|billing|plan/i.test(msg)) return "daily_quota";
  return "rate_limit"; // includes generic "Resource has been exhausted"
}

async function callGemini(system, prompt, maxTokens) {
  const key = getAIKey();
  if (!key) return null; // no key → skip
  const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
  let lastErr = null;
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    let res;
    try { res = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ system_instruction:{parts:[{text:system}]},
        contents:[{role:"user",parts:[{text:prompt}]}],
        generationConfig:{maxOutputTokens:maxTokens,temperature:0.7} }) });
    } catch { throw Object.assign(new Error("NET"), { code:"API_ERROR", detail:"Sin conexión." }); }
    if (res.ok) {
      const d = await res.json();
      return d.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("") || "";
    }
    const errBody = await res.json().catch(()=>({}));
    const msg = errBody?.error?.message || "";
    if (res.status===403 || (res.status===400 && /api.key|invalid.key/i.test(msg)))
      throw Object.assign(new Error("INVALID_KEY"), { code:"INVALID_KEY" });
    if (res.status===429) { lastErr = geminiErrType(msg); continue; }
    lastErr = msg || `error_${res.status}`;
  }
  return { _err: lastErr }; // signal caller with error type
}

async function callGroq(system, prompt, maxTokens) {
  const key = getGroqKey();
  if (!key) return null; // no key → skip
  let res;
  try { res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
    body: JSON.stringify({ model:"llama-3.3-70b-versatile",
      messages:[{role:"system",content:system},{role:"user",content:prompt}],
      max_tokens:maxTokens, temperature:0.7 }) });
  } catch { return null; } // network error → fall through
  if (res.ok) {
    const d = await res.json();
    return d.choices?.[0]?.message?.content || "";
  }
  if (res.status===401) throw Object.assign(new Error("INVALID_KEY"), { code:"INVALID_KEY", detail:"Clave Groq inválida." });
  return null; // other error → fall through
}

async function callAI(system, userMessages, maxTokens = 1200) {
  const hasGemini = !!getAIKey(), hasGroq = !!getGroqKey();
  if (!hasGemini && !hasGroq)
    throw Object.assign(new Error("NO_KEY"), { code:"NO_KEY" });

  const prompt = Array.isArray(userMessages)
    ? (userMessages[userMessages.length-1]?.content || "") : userMessages;

  // Try Gemini first, then Groq as fallback
  if (hasGemini) {
    const result = await callGemini(system, prompt, maxTokens);
    if (typeof result === "string") return result; // success
    if (result?._err === "daily_quota") {
      // Try Groq before giving up on daily quota
      if (hasGroq) {
        const gr = await callGroq(system, prompt, maxTokens);
        if (typeof gr === "string") return gr;
      }
      throw Object.assign(new Error("DAILY_QUOTA"), { code:"DAILY_QUOTA",
        detail: "Cupo diario de Gemini agotado. El reinicio es a medianoche (hora del Pacífico, UTC-7/8), no UTC." +
          (hasGroq ? "" : " Configura una clave Groq gratuita para evitar este límite.") });
    }
    // rate_limit or generic error → try Groq immediately
    if (hasGroq) {
      const gr = await callGroq(system, prompt, maxTokens);
      if (typeof gr === "string") return gr;
    }
    // Both failed
    if (result?._err === "rate_limit")
      throw Object.assign(new Error("RATE_LIMIT"), { code:"RATE_LIMIT",
        detail:"Límite por minuto de Gemini alcanzado. Espera 65s o configura una clave Groq." });
    throw Object.assign(new Error("API_ERROR"), { code:"API_ERROR",
      detail: result?._err || "Modelo no disponible." });
  }

  // Only Groq configured
  const gr = await callGroq(system, prompt, maxTokens);
  if (typeof gr === "string") return gr;
  throw Object.assign(new Error("RATE_LIMIT"), { code:"RATE_LIMIT",
    detail:"Límite de Groq alcanzado. Intenta de nuevo en un momento." });
}

// Key-setup widget — supports Gemini (primary) + Groq (fallback, no daily limit)
function AIKeySetup({ onSaved }) {
  const [tab, setTab]         = useState("gemini"); // "gemini" | "groq"
  const [val, setVal]         = useState("");
  const [err, setErr]         = useState("");
  const hasGemini = !!getAIKey(), hasGroq = !!getGroqKey();

  function save() {
    const k = val.trim();
    if (k.length < 20) { setErr("Clave inválida — debe tener más de 20 caracteres"); return; }
    if (tab === "groq") { saveGroqKey(k); } else { saveAIKey(k); }
    onSaved();
  }

  const isGroq = tab === "groq";
  const color  = isGroq ? T.blue : T.green;
  const prefix = isGroq ? "gsk_…" : "AIzaSy…";

  return (
    <div style={{ background:"var(--card)", border:`1px solid ${color}33`, borderRadius:12, padding:20 }}>
      {/* Tab switcher */}
      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {[["gemini","Gemini",T.green],["groq","Groq",T.blue]].map(([id,label,c])=>(
          <button key={id} onClick={()=>{setTab(id);setVal("");setErr("");}}
            style={{ flex:1, padding:"6px 0", borderRadius:7, border:`1px solid ${tab===id?c:T.border}`,
              background:tab===id?c+"18":"transparent", color:tab===id?c:T.ink4,
              fontFamily:"var(--mono)", fontSize:11, fontWeight:700, cursor:"pointer",
              textTransform:"uppercase", letterSpacing:"0.06em" }}>
            {label}{tab===id && (id==="gemini"?hasGemini:hasGroq) ? " ✓" : ""}
          </button>
        ))}
      </div>

      {isGroq ? (
        <p style={{ color:T.ink3, fontSize:11, lineHeight:1.6, marginBottom:12 }}>
          <strong style={{color:T.blue}}>Groq</strong> — gratis, sin límite diario relevante (14 400 req/día).<br/>
          Sin tarjeta. Usa <strong>Llama 3.3 70B</strong> — calidad comparable a GPT-4.<br/>
          1. Ve a <strong style={{color:T.blue}}>console.groq.com/keys</strong><br/>
          2. Crea una clave → cópiala aquí.
        </p>
      ) : (
        <p style={{ color:T.ink3, fontSize:11, lineHeight:1.6, marginBottom:12 }}>
          <strong style={{color:T.green}}>Google Gemini</strong> — gratis, sin tarjeta.<br/>
          Límite: ~15 req/min · se reinicia medianoche Pacífico (UTC-7/8).<br/>
          1. Ve a <strong style={{color:T.green}}>aistudio.google.com/apikey</strong><br/>
          2. Crea una clave → cópiala aquí.
        </p>
      )}

      <input
        key={tab}
        placeholder={prefix}
        value={val}
        onChange={e=>{ setVal(e.target.value); setErr(""); }}
        onKeyDown={e=>e.key==="Enter"&&save()}
        autoFocus
        style={{ background:"var(--paper)", border:`1.5px solid ${err?T.rose:color+"55"}`,
          color:"var(--noir)", padding:"9px 12px", borderRadius:8, fontFamily:"var(--mono)",
          fontSize:12, width:"100%", outline:"none", marginBottom:err?4:10, boxSizing:"border-box" }}
      />
      {err && <div style={{ color:T.rose, fontSize:11, marginBottom:8 }}>{err}</div>}
      <button onClick={save}
        style={{ background:color, color:"#fff", border:"none", borderRadius:8, padding:"9px 0",
          fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"var(--sans)", width:"100%" }}>
        Guardar clave {isGroq?"Groq":"Gemini"} →
      </button>

      {(hasGemini||hasGroq) && (
        <div style={{ marginTop:10, color:T.ink4, fontSize:10, fontFamily:"var(--mono)",
          textAlign:"center", letterSpacing:"0.05em" }}>
          {[hasGemini&&"Gemini ✓", hasGroq&&"Groq ✓"].filter(Boolean).join(" · ")} configuradas
        </div>
      )}
    </div>
  );
}

// ─── IMAGE RESIZE ─────────────────────────────────────────────────────────────
function resizeImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        const max = 900;
        if (w > max || h > max) { const r = Math.min(max/w, max/h); w = Math.round(w*r); h = Math.round(h*r); }
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve({ data: c.toDataURL("image/jpeg", 0.78) });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── THEME OVERRIDE CSS ───────────────────────────────────────────────────────
function getThemeCSS(id) {
  const t = THEMES[id];
  if (!t || t.isDark) return "";
  // All non-dark themes are light
  return `
    html,body { background:${t.bg} !important; color:${t.ink} !important; }
    ::selection { background:${t.accentBg}; color:${t.ink}; }
    ::-webkit-scrollbar-thumb { background:${t.accent}55; border-radius:4px; }
    ::-webkit-scrollbar-thumb:hover { background:${t.accent}88; }

    /* Focus visible: follow theme accent */
    :focus-visible { outline-color:${t.accent}cc !important; }
    button:focus-visible,[role="button"]:focus-visible { outline-color:${t.accent}cc !important; box-shadow:0 0 0 4px ${t.accentBg} !important; }

    /* Scrollbar track */
    ::-webkit-scrollbar-track { background:${t.bgPanel} !important; }

    /* HUD buttons outside the canvas (toolbar, modals) — adapt to light theme */
    .hud-btn {
      background:${t.bgCard} !important;
      border-color:${t.border2} !important;
      color:${t.ink2} !important;
      backdrop-filter:none !important;
    }
    .hud-btn:hover {
      border-color:${t.accent}66 !important;
      color:${t.accent} !important;
      box-shadow:none !important;
    }
    .hud-btn-active {
      border-color:${t.accent} !important;
      color:${t.accent} !important;
      background:${t.accentBg} !important;
    }
    /* BoardTile in light themes */
    .tile { background:${t.bgCard} !important; }
    .tile:hover {
      box-shadow:0 12px 32px ${t.accent}18, 0 0 0 1px ${t.accent}33 !important;
      border-color:${t.accent}33 !important;
    }
    .glass {
      background:rgba(255,255,255,0.82) !important;
      border-color:${t.border} !important;
    }
    .glass-light {
      background:rgba(255,255,255,0.65) !important;
      border-color:${t.border} !important;
    }
    /* .grad-text removed */
    .ai-glow {
      animation:none !important;
      border-color:${t.accent}55 !important;
      box-shadow:0 0 12px ${t.accent}22 !important;
    }
    .orb-bg::before {
      background:radial-gradient(ellipse at 30% 20%,${t.accent}14 0%,transparent 60%) !important;
    }
    .orb-bg::after {
      background:radial-gradient(ellipse at 70% 80%,${t.blue}10 0%,transparent 60%) !important;
    }
    .wcard {
      background:rgba(255,255,255,0.88) !important;
      border-color:${t.border} !important;
    }
    .wcard:hover {
      box-shadow:0 6px 24px ${t.accent}18, 0 0 0 1px ${t.accent}22 !important;
      transform:translateY(-2px) !important;
    }
    .tile:hover {
      box-shadow:0 12px 32px ${t.accent}18, 0 0 0 1px ${t.accent}33 !important;
      border-color:${t.accent}33 !important;
    }
    .toast {
      background:rgba(255,255,255,0.97) !important;
      color:${t.ink} !important;
      border-color:${t.border2} !important;
    }
    .add-btn {
      background:${t.accentBg} !important;
      border-color:${t.accent}44 !important;
      color:${t.accent} !important;
    }
    .add-btn:hover {
      background:${t.accentBg} !important;
      border-color:${t.accent}88 !important;
    }
    /* Board area dot grid for light themes */
    .board-area {
      background-image: radial-gradient(circle, rgba(50,40,30,0.10) 1px, transparent 1px) !important;
    }
    /* Add-btn in light themes */
    .add-btn { border-color:${t.accent}33 !important; }
    ${id === "estudio" ? `
    /* Editorial Cream — full token override */
    html,body { background:var(--paper) !important; color:var(--ink-0) !important; }
    .tile { background:var(--card) !important; border-color:var(--card-border) !important; box-shadow:var(--shadow-1) !important; }
    .tile:hover { box-shadow:var(--shadow-2) !important; transform:translateY(-2px) !important; }
    .board-area { background-image:radial-gradient(circle, var(--line-dot) 1px, transparent 1px) !important; background-size:22px 22px !important; }
    .hud-btn { background:var(--card) !important; border-color:var(--card-border) !important; color:var(--ink-2) !important; box-shadow:var(--shadow-1) !important; }
    .hud-btn:hover { box-shadow:var(--shadow-2) !important; transform:translateY(-1px) !important; color:var(--ink-0) !important; }
    .hud-btn-active { background:var(--noir) !important; border-color:var(--noir) !important; color:var(--paper) !important; box-shadow:none !important; transform:none !important; }
    .add-btn { background:transparent !important; border-color:var(--paper-3) !important; color:var(--ink-3) !important; }
    .add-btn:hover { background:rgba(26,24,20,0.04) !important; border-color:var(--ink-3) !important; color:var(--ink-1) !important; }
    .ai-glow { box-shadow:var(--shadow-1) !important; }
    .ai-glow::after { box-shadow:none !important; animation:none !important; }
    .orb-bg::before, .orb-bg::after { opacity:0 !important; }
    .glass { background:rgba(255,255,255,0.88) !important; border-color:var(--card-border) !important; box-shadow:var(--shadow-2) !important; }
    .wcard { background:var(--card) !important; border-color:var(--card-border) !important; box-shadow:var(--shadow-1) !important; }
    .wcard:hover { box-shadow:var(--shadow-2) !important; transform:translateY(-1px) !important; }
    ` : ""}
  `;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300..900;1,300..900&family=Quicksand:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --serif: 'Fraunces', Georgia, serif;
    /* Editorial Cream tokens */
    --paper:      #EFEBE3;
    --paper-2:    #E5E0D5;
    --paper-3:    #D8D2C5;
    --ink-0:      #1a1814;
    --ink-1:      #3a352d;
    --ink-2:      #6a6258;
    --ink-3:      #9a9286;
    --ink-4:      #c8c1b3;
    --card:       #ffffff;
    --card-soft:  #faf7f0;
    --card-border: rgba(58,50,38,0.08);
    --noir:       #1a1814;
    --noir-2:     #2a2620;
    --neon:       #E8F062;
    --neon-soft:  #F2F4C8;
    --neon-glow:  rgba(232,240,98,0.5);
    --terra:      #C97D5C;
    --terra-soft: #F0DDD2;
    --olive:      #7A8A4F;
    --olive-soft: #DCE2C8;
    --sky:        #6B91B3;
    --sky-soft:   #D5DFE8;
    --line:       #2a2620;
    --line-soft:  rgba(42,38,32,0.18);
    --line-dot:   rgba(42,38,32,0.10);
    --shadow-1: 0 1px 0 rgba(58,50,38,0.06), 0 2px 8px rgba(58,50,38,0.06);
    --shadow-2: 0 1px 0 rgba(58,50,38,0.08), 0 8px 24px rgba(58,50,38,0.08);
    --shadow-3: 0 2px 0 rgba(58,50,38,0.10), 0 16px 40px rgba(58,50,38,0.12);
    --r-sm:  10px;
    --r-md:  16px;
    --r-lg:  22px;
    --r-pill: 999px;
    /* Legacy dark vars — still used by dark theme components */
    --raj: 'Quicksand', system-ui, sans-serif;
    --mc: #E85200;
    --ma: #E85200;
    --mg: #3DAA6C;
    --mr: #D04060;
    --mb0: #141210;
    --mb1: #1C1A18;
    --mb2: #242220;
    --ink0: #F0EDE8;
    --ink1: #9C9488;
    --ink2: #60584E;
    --ink3: #38342E;
  }

  /* ── Autofill override — Chrome replaces bg+text color on saved inputs ── */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: var(--ink-0) !important;
    -webkit-box-shadow: 0 0 0 1000px var(--card) inset !important;
    caret-color: var(--ink-0) !important;
    transition: background-color 9999s ease-in-out 0s;
  }

  /* ── Mycelium card — Editorial Cream: papel blanco, tinta, Fraunces italic ── */
  .mcard { position:absolute; width:250px; background:var(--card); border:1px solid var(--card-border); border-radius:var(--r-md); box-shadow:var(--shadow-1); font-family:var(--sans); user-select:none; z-index:5; transition:box-shadow .18s, transform .18s, width .2s; cursor:grab; }
  .mcard:hover { box-shadow:var(--shadow-2); transform:translateY(-1px); }
  .mcard-exp { width:300px !important; z-index:8 !important; box-shadow:var(--shadow-3) !important; }
  .mcard-head { display:flex; align-items:center; gap:8px; padding:10px 13px; border-bottom:1px solid var(--card-border); cursor:grab; }
  .mcard-glyph { flex:none; color:var(--ink-3); font-size:10px; width:12px; }
  .mcard-title { flex:1; font-family:var(--serif); font-style:italic; font-size:14px; font-weight:500; letter-spacing:-0.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--ink-0); }
  .mcard-dot { width:7px; height:7px; border-radius:50%; flex:none; opacity:0.85; }
  .mcard-body { padding:10px 13px; font-size:12px; line-height:1.6; color:var(--ink-1); font-family:var(--sans); }
  .mcard-body p { margin-bottom:8px; }
  .mcard-tags { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px; }
  .mtag { font-size:10px; font-weight:600; padding:2px 8px; border-radius:var(--r-pill); border:1px solid var(--paper-3); color:var(--ink-2); font-family:var(--sans); letter-spacing:0.04em; }
  .mmuted { color:var(--ink-3); font-size:10px; font-family:var(--mono); letter-spacing:0.06em; margin-bottom:8px; }
  .mcard-btns { display:flex; gap:6px; flex-wrap:wrap; }
  .mcard-btns button { font-family:var(--sans); background:var(--card); border:1px solid var(--card-border); color:var(--ink-1); padding:5px 12px; border-radius:var(--r-pill); font-size:11px; font-weight:500; cursor:pointer; transition:.13s; box-shadow:var(--shadow-1); }
  .mcard-btns button:hover { box-shadow:var(--shadow-2); transform:translateY(-1px); }

  /* ── HUD corner brackets — invisible in Cardiology tone ── */
  .hud-c { position:relative; }
  .hud-c::before, .hud-c::after { content:''; position:absolute; width:8px; height:8px; border:1px solid rgba(0,0,0,0.14); pointer-events:none; z-index:1; opacity:0; transition:opacity .15s; }
  .hud-c::before { top:-1px; left:-1px; border-right:none; border-bottom:none; }
  .hud-c::after  { bottom:-1px; right:-1px; border-left:none; border-top:none; }
  .mcard:hover .hud-c::before, .mcard:hover .hud-c::after,
  .mcard-exp .hud-c::before, .mcard-exp .hud-c::after { opacity:0; }

  /* ── HUD toolbar buttons — pill blanca + sombra ── */
  .hud-btn { font-family:var(--sans); background:var(--card); border:1px solid var(--card-border); color:var(--ink-2); padding:6px 14px; text-transform:none; letter-spacing:0; font-size:12px; font-weight:500; cursor:pointer; transition:.15s; border-radius:var(--r-pill); box-shadow:var(--shadow-1); display:inline-flex; align-items:center; gap:5px; }
  .hud-btn:hover { box-shadow:var(--shadow-2); transform:translateY(-1px); color:var(--ink-0); }
  .hud-btn-active { background:var(--noir) !important; border-color:var(--noir) !important; color:var(--paper) !important; box-shadow:none !important; transform:none !important; }
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root { --sans:'Quicksand',sans-serif; --mono:'JetBrains Mono',monospace; }
  html, body { background:var(--paper); color:var(--ink-0); font-family:var(--sans); min-height:100vh; }

  /* ── Dot grid — referencia n8n, tenue como papel punteado ── */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, var(--line-dot) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
    z-index: 0;
    opacity: 0.7;
  }

  /* ── Board canvas — dot grid, same token as body::before ── */
  .board-area {
    background-image: radial-gradient(circle, var(--line-dot) 1px, transparent 1px);
    background-size: 22px 22px;
  }

  /* Dark-theme base — overridden per-theme by getThemeCSS() */
  :root { --accent-sel: rgba(232,82,0,0.25); --accent-sel-fg: #FFFFFF; --sb-thumb: rgba(0,0,0,0.15); --sb-thumb-h: rgba(0,0,0,0.28); }
  ::selection { background:var(--accent-sel); color:var(--accent-sel-fg); }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--sb-thumb); border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:var(--sb-thumb-h); }

  /* ── Focus visible — keyboard navigation ── */
  :focus { outline:none; }
  :focus-visible {
    outline: 2px solid rgba(44,40,38,0.7);
    outline-offset: 2px;
    border-radius: 4px;
  }
  button:focus-visible, [role="button"]:focus-visible {
    outline: 2px solid rgba(44,40,38,0.7);
    outline-offset: 3px;
    box-shadow: 0 0 0 4px rgba(44,40,38,0.10);
  }
  input:focus-visible, textarea:focus-visible, select:focus-visible {
    outline: none; /* Box-shadow focus handled inline */
  }

  /* ── Reduced motion — respect user OS preference ── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  @keyframes spin      { to { transform:rotate(360deg); } }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(26px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn   { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
  /* glowPulse: animate opacity on a pseudo-element instead of box-shadow (compositor-only) */
  @keyframes glowPulse { 0%,100%{opacity:.45} 50%{opacity:1} }
  @keyframes borderGlow{ 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes orb1      { 0%,100%{transform:translate(0,0) scale(1)}
                         40%{transform:translate(80px,-60px) scale(1.15)}
                         70%{transform:translate(-40px,50px) scale(.88)} }
  @keyframes orb2      { 0%,100%{transform:translate(0,0) scale(1)}
                         35%{transform:translate(-70px,80px) scale(.92)}
                         70%{transform:translate(90px,-30px) scale(1.1)} }
  @keyframes orb3      { 0%,100%{transform:translate(0,0) scale(1)}
                         50%{transform:translate(-50px,-70px) scale(1.08)} }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes popIn     { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }

  .tile {
    background: var(--card);
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow-1);
    transition: transform .2s cubic-bezier(.25,.46,.45,.94), box-shadow .2s;
    cursor:pointer;
    position: relative;
  }
  .tile:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-2) !important;
  }
  .wcard {
    transition: transform .16s cubic-bezier(.25,.46,.45,.94), box-shadow .16s, border-color .16s;
  }
  .wcard:hover {
    transform:translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.08) !important;
    border-left-color: inherit !important;
    background: #FFFFFF !important;
  }
  .wcard:hover .edit-ico { color:#9A9080 !important; }
  .wcard:active { transform:translateY(-1px) scale(.99); }

  .add-btn {
    background: rgba(0,0,0,0.02);
    border: 1.5px dashed rgba(0,0,0,0.14);
    color: rgba(0,0,0,0.30);
    padding: 9px;
    border-radius: 10px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    transition: all .2s;
  }
  .add-btn:hover { border-color:rgba(0,0,0,0.28); color:rgba(0,0,0,0.55); background:rgba(0,0,0,0.04); }
  .att-btn:hover { border-color:rgba(232,82,0,.45) !important; color:#E85200 !important; background:rgba(232,82,0,.08) !important; }
  .mv-btn:hover  { background:rgba(255,255,255,.07) !important; color:#EDE8DC !important; }
  .ai-trigger:hover { background:rgba(232,82,0,.15) !important; }
  /* ai-glow: use a pseudo-element with box-shadow + opacity animation (compositor-only, no repaint) */
  .ai-glow { position:relative; box-shadow:0 0 0 1px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.12); }
  .ai-glow::after { content:''; position:absolute; inset:-1px; border-radius:inherit; box-shadow:0 0 0 1px rgba(0,0,0,0.12); animation:none; pointer-events:none; }

  .spinner { animation:spin .7s linear infinite; }
  .toast   { animation:slideIn .32s cubic-bezier(.16,1,.3,1); }
  .conn-card { animation:fadeUp .28s ease; }

  /* Gradient orb background */
  .orb-bg { position:relative; overflow:hidden; }
  .orb-bg::before, .orb-bg::after, .orb-bg .orb3 { content:''; position:absolute; border-radius:50%; pointer-events:none; }
  .orb-bg::before {
    width:700px; height:700px; top:-120px; left:-180px;
    background: radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 65%);
    animation: orb1 22s ease-in-out infinite;
  }
  .orb-bg::after {
    width:500px; height:500px; bottom:-80px; right:-100px;
    background: radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 65%);
    animation: orb2 26s ease-in-out infinite;
  }

  .glass {
    background: rgba(255,255,255,0.90);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 4px 24px rgba(0,0,0,.08);
  }
  .glass-light {
    background: rgba(12,10,14,0.72);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(232,82,0,0.08);
  }

  /* .grad-text and .grad-accent removed — gradient text anti-pattern */

  /* ── Tablet (768–1023px): 2-col grid, condensed sidebar ── */
  @media (max-width:1023px) and (min-width:681px) {
    .hide-tablet { display:none !important; }
    .stack-tablet { flex-direction:column !important; }
    .full-tablet  { width:100% !important; }
  }

  /* ── Mobile (≤680px) ── */
  @media (max-width:680px) {
    .hide-mobile { display:none !important; }
    .stack-mobile { flex-direction:column !important; }
    .full-mobile  { width:100% !important; min-width:0 !important; flex-shrink:1 !important; }
    .pad-mobile   { padding:14px !important; }
    .gap-mobile   { gap:10px !important; }
  }

  /* ── Touch targets: ensure minimum 44px tap area on touch devices ── */
  @media (hover:none) and (pointer:coarse) {
    button, [role="button"] { min-height:44px; min-width:44px; }
    /* Exception: icon-only tiny buttons get padding boost instead */
    .hud-btn { min-height:36px; padding-top:8px !important; padding-bottom:8px !important; }
    .mcard-btns button { min-height:36px; padding:6px 12px !important; }
  }
`;

// ─── MOBILE HOOK ──────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 680);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 680);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function useIsTablet() {
  const [tablet, setTablet] = useState(() => typeof window !== "undefined" && window.innerWidth > 680 && window.innerWidth <= 1023);
  useEffect(() => {
    const fn = () => setTablet(window.innerWidth > 680 && window.innerWidth <= 1023);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return tablet;
}

// ─── PASSWORD INPUT WITH SHOW/HIDE ───────────────────────────────────────────
function PwdInput({ value, onChange, onKeyDown, placeholder, style, autoFocus, id }) {
  const [show, setShow] = useState(false);
  const inputId = id || "pwd-input";
  return (
    <div style={{ position:"relative" }}>
      <input
        id={inputId}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder || "Contraseña…"}
        aria-label={placeholder || "Contraseña"}
        autoFocus={autoFocus}
        style={{ background:T.bgCard, border:`1.5px solid ${T.border2}`, color:T.ink, padding:"11px 44px 11px 14px", borderRadius:10, fontFamily:"var(--sans)", fontSize:14, width:"100%", outline:"none", transition:"border-color .2s, box-shadow .2s", ...style }}
        onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accentBg}`; }}
        onBlur={e => { e.target.style.borderColor = T.border2; e.target.style.boxShadow = "none"; }}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-controls={inputId}
        style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.ink4, fontSize:16, lineHeight:1, padding:"6px", transition:"color .15s" }}
        onMouseEnter={e => e.currentTarget.style.color = T.ink2}
        onMouseLeave={e => e.currentTarget.style.color = T.ink4}
      >
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
// localStorage keys (session + recents only — data lives in Supabase)
const SK = {
  user:     "creativeboard-user",
  myboards: "creativeboard-myboards",
};

export default function App() {
  const [user, setUser]               = useState(() => getL(SK.user, null));
  const [screen, setScreen]           = useState("lobby");
  const [boards, setBoards]           = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [boardData, setBoardData]     = useState(null);
  const [themeId, setThemeIdRaw]      = useState(() => {
    const stored = getL("mindstorm-theme", "estudio");
    // Reject dark themes — estudio is the only active theme
    const valid = THEMES[stored] && !THEMES[stored].isDark ? stored : "estudio";
    if (valid !== stored) setL("mindstorm-theme", "estudio"); // overwrite stale dark pref
    return valid;
  });

  const setThemeId = (id) => {
    if (!THEMES[id]) return;
    Object.assign(T, THEMES[id]);
    setL("mindstorm-theme", id);
    setThemeIdRaw(id);
  };

  // Apply theme on first load
  useEffect(() => { Object.assign(T, THEMES[themeId]); }, []);

  const loadBoards = useCallback(async () => {
    const list = await dbGetBoards();
    setBoards(list);
    return list;
  }, []);

  // Initial load
  useEffect(() => { loadBoards(); }, [loadBoards]);

  // Real-time subscription for active board
  useEffect(() => {
    if (!activeBoard) return;
    const channel = supabase
      .channel("board-" + activeBoard.id)
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "board_data",
        filter: `board_id=eq.${activeBoard.id}`,
      }, (payload) => {
        const d = dbToData(payload.new);
        setBoardData(prev => (!prev || d.lastUpdated > prev.lastUpdated) ? d : prev);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [activeBoard]);

  async function openBoard(board, pwd) {
    if (board.password && board.password !== pwd) return "wrong";
    setActiveBoard(board);
    const d = await dbGetBoardData(board.id)
      || { cards:[], comments:{}, connections:[], canvasPositions:{cards:{},stickers:{}}, lastUpdated:nowTs() };
    setBoardData(d); setScreen("board");
    const mb = getL(SK.myboards, []);
    if (!mb.includes(board.id)) setL(SK.myboards, [board.id, ...mb].slice(0, 30));
    return "ok";
  }

  async function createBoard(draft) {
    const board = { ...draft, id:genId(), createdAt:nowTs(), createdBy:user.name };
    await dbCreateBoard(board, { cards:[], comments:{}, connections:[], canvasPositions:{cards:{},stickers:{}} });
    await loadBoards();
    await openBoard(board, draft.password);
  }

  async function deleteBoard(boardId) {
    await dbDeleteBoard(boardId);
    const mb = getL(SK.myboards, []).filter(id => id !== boardId);
    setL(SK.myboards, mb);
    await loadBoards();
  }

  async function importBoard(pkg) {
    let imported = 0, skipped = 0;
    const current = await dbGetBoards();
    const existingIds = new Set(current.map(b => b.id));
    if (pkg.type === "single") {
      const board = pkg.board;
      if (!existingIds.has(board.id)) {
        await dbCreateBoard(board, pkg.data || {});
        imported = 1;
      } else {
        await dbSaveBoardData(board.id, pkg.data || {});
        skipped = 1;
      }
    } else if (pkg.type === "all") {
      for (const board of (pkg.boards || [])) {
        if (existingIds.has(board.id)) {
          await dbSaveBoardData(board.id, pkg.data?.[board.id] || {});
          skipped++;
        } else {
          await dbCreateBoard(board, pkg.data?.[board.id] || {});
          imported++;
        }
      }
    }
    await loadBoards();
    return { imported, skipped };
  }

  const saveBoardData = useCallback(async (newData) => {
    const updated = await dbSaveBoardData(activeBoard.id, newData);
    setBoardData(updated);
  }, [activeBoard]);

  const themeCtxVal = { themeId, setThemeId };
  return (
    <ThemeCtx.Provider value={themeCtxVal}>
      {!user && <JoinScreen onJoin={u => { setL(SK.user, u); setUser(u); }} />}
      {user && screen === "lobby" && <LobbyScreen user={user} boards={boards} myIds={getL(SK.myboards,[])} onOpen={openBoard} onCreate={createBoard} onDelete={deleteBoard} onImport={importBoard} onRefresh={loadBoards} onSignOut={() => { setL(SK.user,null); setUser(null); }} />}
      {user && screen === "board" && activeBoard && boardData && <BoardScreen user={user} board={activeBoard} data={boardData} onSave={saveBoardData} onBack={() => { setScreen("lobby"); setActiveBoard(null); loadBoards(); }} />}
    </ThemeCtx.Provider>
  );
}

// ─── THEME SWITCHER ──────────────────────────────────────────────────────────
function ThemeSwitcher() {
  const { themeId, setThemeId } = useTheme();
  const swatches = { estudio:"#E85200", dark:"#F0EDE8", indigo:"#4338CA", bosque:"#15803D", aurora:"#7C3AED" };
  const labels   = { estudio:"Estudio — luz editorial", dark:"Noche — oscuro refinado", indigo:"Índigo — concentración profunda", bosque:"Bosque — flujo creativo", aurora:"Aurora — imaginación y síntesis" };
  return (
    <div style={{ display:"flex", gap:7, alignItems:"center" }}>
      {Object.entries(THEMES).map(([id, th]) => (
        <button key={id} aria-label={labels[id] || th.label} aria-pressed={themeId===id} onClick={() => setThemeId(id)}
          style={{ width:22, height:22, borderRadius:"50%",
            border:`2.5px solid ${themeId===id ? swatches[id] : "transparent"}`,
            background:swatches[id], cursor:"pointer", padding:0, flexShrink:0,
            boxShadow: themeId===id
              ? `0 0 0 2px ${T.bgCard}, 0 0 0 4px ${swatches[id]}`
              : `0 1px 3px rgba(0,0,0,.18)`,
            transform: themeId===id ? "scale(1.18)" : "scale(1)",
            transition:"all .18s cubic-bezier(.16,1,.3,1)" }} />
      ))}
    </div>
  );
}

// ─── MINDSTORM LOGO ──────────────────────────────────────────────────────────
function MindStormLogo({ size = "md", light = true }) {
  // light=true  → cream background (board topbar, lobby)
  // light=false → dark background (future dark mode)
  const configs = {
    sm: { iconW:32, iconH:32, fontSize:16, tagSize:0,  gap:9  },
    md: { iconW:68, iconH:68, fontSize:36, tagSize:10, gap:14 },
  };
  const c = configs[size] || configs.md;

  // Three nodes in a loose organic triangle — not equilateral, slightly asymmetric
  const W = c.iconW, H = c.iconH;
  const nodes = [
    { x: W * 0.50, y: H * 0.13 },  // top — slightly left of center
    { x: W * 0.88, y: H * 0.80 },  // bottom-right
    { x: W * 0.12, y: H * 0.80 },  // bottom-left
  ];

  // Organic bezier between each pair: control points curve outward
  function organicEdge(a, b, bow = 0.28) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y;
    const nx = -dy * bow, ny = dx * bow;
    return `M${a.x},${a.y} C${mx + nx * 0.6 + dx * 0.1},${my + ny * 0.6 + dy * 0.1} ${mx + nx * 0.4 - dx * 0.1},${my + ny * 0.4 - dy * 0.1} ${b.x},${b.y}`;
  }

  const edges = [[0,1,0.22],[1,2,-0.18],[2,0,0.20]];
  const nr  = W * 0.082;
  const sw  = W * 0.062;
  const inkColor    = light ? "var(--noir)"   : "rgba(255,255,255,0.90)";
  const edgeColor   = light ? "var(--ink-3)"  : "rgba(255,255,255,0.35)";
  const dotAccent   = "var(--neon)";
  const bgDot       = light ? "var(--paper)"  : "rgba(30,25,20,0.9)";

  return (
    <div style={{ display:"flex", alignItems:"center", gap:c.gap }}>
      {/* Icon SVG — organic node graph */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink:0, overflow:"visible" }}>
        {/* Organic edges */}
        {edges.map(([a,b,bow],i) => (
          <path key={i} d={organicEdge(nodes[a], nodes[b], bow)}
            fill="none" stroke={edgeColor} strokeWidth={sw * 0.65} strokeLinecap="round" opacity="0.7"/>
        ))}
        {/* Node rings — cream fill, noir border */}
        {nodes.map((n,i) => (
          <circle key={i} cx={n.x} cy={n.y} r={nr}
            fill={bgDot} stroke={inkColor} strokeWidth={sw * 0.55} opacity="0.9"/>
        ))}
        {/* Top node gets neon accent fill — the "spark" */}
        <circle cx={nodes[0].x} cy={nodes[0].y} r={nr * 0.55} fill={dotAccent} opacity="0.95"/>
        {/* Other nodes get noir dot */}
        {nodes.slice(1).map((n,i) => (
          <circle key={i} cx={n.x} cy={n.y} r={nr * 0.42} fill={inkColor} opacity="0.8"/>
        ))}
      </svg>

      {/* Wordmark — Fraunces italic (display font from DESIGN.md) */}
      {size !== "xs" && (
        <div>
          <div style={{ lineHeight:1 }}>
            <span style={{
              fontFamily:"'Fraunces', Georgia, serif",
              fontStyle:"italic",
              fontWeight:300,
              fontSize:c.fontSize,
              letterSpacing:"-0.01em",
              color: light ? "var(--ink-3)" : "rgba(255,255,255,0.45)"
            }}>mind</span><span style={{
              fontFamily:"'Fraunces', Georgia, serif",
              fontStyle:"italic",
              fontWeight:700,
              fontSize:c.fontSize,
              letterSpacing:"-0.02em",
              color: light ? "var(--noir)" : "rgba(255,255,255,0.92)"
            }}>storm</span>
          </div>
          {c.tagSize > 0 && (
            <div style={{ fontFamily:"var(--mono)", fontSize:c.tagSize,
              color: light ? "var(--ink-4)" : "rgba(255,255,255,0.25)",
              letterSpacing:"0.24em", marginTop:4, textTransform:"uppercase" }}>
              think together
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── JOIN ─────────────────────────────────────────────────────────────────────
function JoinScreen({ onJoin }) {
  const [name, setName] = useState("");
  const { themeId } = useTheme();
  return (
    <div className="orb-bg" style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--sans)", position:"relative" }}>
      <style>{GLOBAL_CSS}</style>
      <style>{getThemeCSS(themeId)}</style>
      {/* Extra orb */}
      <div style={{ position:"absolute", width:400, height:400, top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        background:"radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)",
        borderRadius:"50%", pointerEvents:"none", animation:"orb3 15s ease-in-out infinite" }} />
      <div style={{ textAlign:"center", maxWidth:400, width:"100%", padding:"0 24px", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:36 }}>
          <MindStormLogo size="md" />
        </div>
        <div style={{ background:"rgba(20,18,16,0.94)", border:`1px solid rgba(255,255,255,0.08)`,
          borderRadius:22, padding:"34px 30px", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
          boxShadow:"0 40px 100px rgba(0,0,0,.50), 0 0 0 1px rgba(255,255,255,0.05)" }}>
          <p style={{ color:T.ink3, fontSize:14, marginBottom:20, lineHeight:1.5 }}>
            Elige tu nombre para comenzar
          </p>
          <OInput placeholder="Tu nombre…" aria-label="Tu nombre de usuario" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter" && name.trim() && onJoin({name:name.trim()})} autoFocus style={{ marginBottom:12, textAlign:"center", fontSize:16 }} />
          <OBtn full onClick={() => name.trim() && onJoin({name:name.trim()})}>Entrar al espacio →</OBtn>
        </div>
        <p style={{ color:T.ink4, fontSize:10, marginTop:16, fontFamily:"var(--mono)", letterSpacing:"0.05em" }}>Tu nombre se guarda en este dispositivo</p>
      </div>
    </div>
  );
}

// ─── LOBBY ────────────────────────────────────────────────────────────────────
function LobbyScreen({ user, boards, myIds, onOpen, onCreate, onDelete, onRefresh, onSignOut, onImport }) {
  const [creating, setCreating]       = useState(false);
  const [search, setSearch]           = useState("");
  const [pwdModal, setPwdModal]       = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [importing, setImporting]     = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [exporting, setExporting]     = useState(null); // board being exported
  const [exportAll, setExportAll]     = useState(false);
  const importRef = useRef();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const seen = new Set(); const allBoards = boards.filter(b => { if (seen.has(b.id)) return false; seen.add(b.id); return true; });
  function filtered(list) { if (!search) return list; const q = search.toLowerCase(); return list.filter(b => (b.name+" "+(b.conceptTitle||"")+" "+b.categoryId).toLowerCase().includes(q)); }
  async function handleOpen(board) { if (!board.password || myIds.includes(board.id)) { await onOpen(board, board.password); } else { setPwdModal(board); } }

  // Export single board
  async function exportBoard(board) {
    setExporting(board.id);
    try {
      const boardData = await dbGetBoardData(board.id) || { cards:[], comments:{}, connections:[], lastUpdated: nowTs() };
      const pkg = {
        _mindstorm: true,
        _version: "1.0",
        _exported: new Date().toISOString(),
        _exportedBy: user.name,
        type: "single",
        board: { ...board },
        data: boardData,
      };
      const json = JSON.stringify(pkg, null, 2);
      const blob = new Blob([json], { type:"application/json" });
      const url  = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = board.name.replace(/[^a-z0-9áéíóúüñ ]/gi,"_").trim() + ".mindstorm.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      console.error(e);
    }
    setExporting(null);
  }

  // Export all boards
  async function exportAllBoards() {
    setExportAll(true);
    try {
      const allData = {};
      for (const board of allBoards) {
        allData[board.id] = await dbGetBoardData(board.id) || { cards:[], comments:{}, connections:[], lastUpdated: nowTs() };
      }
      const pkg = {
        _mindstorm: true,
        _version: "1.0",
        _exported: new Date().toISOString(),
        _exportedBy: user.name,
        type: "all",
        boards: allBoards,
        data: allData,
      };
      const json = JSON.stringify(pkg, null, 2);
      const sizeMB = (json.length / 1024 / 1024).toFixed(1);
      const blob = new Blob([json], { type:"application/json" });
      const url  = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MindStorm_backup_${new Date().toISOString().slice(0,10)}.mindstorm.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      console.error(e);
    }
    setExportAll(false);
  }

  // Import from file
  async function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true); setImportError(""); setImportSuccess("");
    try {
      const text = await file.text();
      const pkg  = JSON.parse(text);
      if (!pkg._mindstorm) throw new Error("Archivo no válido. Debe ser un archivo .mindstorm.json exportado desde MindStorm.");

      const result = await onImport(pkg);
      setImportSuccess(`✓ ${result.imported} proyecto${result.imported!==1?"s":""} importado${result.imported!==1?"s":""}. ${result.skipped ? result.skipped+" ya existía"+( result.skipped!==1?"n":"")+"." : ""}`);
      await onRefresh();
    } catch(err) {
      setImportError(err.message || "Error al leer el archivo. Verifica que sea un .mindstorm.json válido.");
    }
    setImporting(false);
    e.target.value = "";
  }

  const { themeId } = useTheme();
  return (
    <div className="orb-bg" style={{ minHeight:"100vh", background:T.bg, display:"flex", fontFamily:"var(--sans)", position:"relative" }}>
      <style>{GLOBAL_CSS}</style>
      <style>{getThemeCSS(themeId)}</style>
      {!isMobile && <Sidebar user={user} boards={allBoards} onOpen={handleOpen} onSignOut={onSignOut} />}
      <div className="board-area" style={{ flex:1, padding: isMobile ? "16px 14px" : isTablet ? "24px 20px" : "32px 36px", overflowY:"auto", position:"relative", zIndex:1 }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, paddingBottom:14, borderBottom:"1px solid var(--card-border)" }}>
            <MindStormLogo size="sm" light />
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>@{user.name}</span>
              <button onClick={onSignOut} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:T.ink4, fontSize:11, cursor:"pointer", padding:"5px 10px", borderRadius:7, fontFamily:"var(--sans)", transition:"all .15s" }}>Salir</button>
            </div>
          </div>
        )}
        <div style={{ maxWidth: isMobile ? "100%" : 860 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
            <div>
              <h2 style={{ fontFamily:"var(--raj)", fontWeight:700, fontSize:isMobile?22:26, marginBottom:3, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--ink0)" }}>Proyectos</h2>
              <p style={{ color:T.ink4, fontSize:13, fontFamily:"var(--mono)" }}>{allBoards.length} proyecto{allBoards.length!==1?"s":""}</p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              {/* Import button */}
              <input ref={importRef} type="file" accept=".json,.mindstorm.json" onChange={handleImportFile} style={{ display:"none" }} />
              <button onClick={() => { setImportError(""); setImportSuccess(""); importRef.current?.click(); }}
                disabled={importing}
                style={{ background:T.bgPanel, border:"1px solid "+T.border2, color:T.ink3, padding:"7px 12px", borderRadius:8, fontSize:12, cursor:"pointer", fontFamily:"var(--sans)", fontWeight:600, display:"flex", alignItems:"center", gap:5, transition:"all .15s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=T.bgHover;e.currentTarget.style.color=T.ink;}}
                onMouseLeave={e=>{e.currentTarget.style.background=T.bgPanel;e.currentTarget.style.color=T.ink3;}}>
                {importing ? "⏳ Importando…" : "↑ Importar"}
              </button>
              {/* Export all */}
              {allBoards.length > 0 && (
                <button onClick={exportAllBoards} disabled={exportAll}
                  style={{ background:T.bgPanel, border:"1px solid "+T.border2, color:T.ink3, padding:"7px 12px", borderRadius:8, fontSize:12, cursor:"pointer", fontFamily:"var(--sans)", fontWeight:600, display:"flex", alignItems:"center", gap:5, transition:"all .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.bgHover;e.currentTarget.style.color=T.ink;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=T.bgPanel;e.currentTarget.style.color=T.ink3;}}>
                  {exportAll ? "⏳ Exportando…" : "↓ Exportar todo"}
                </button>
              )}
              {!isMobile && <OGhostBtn small onClick={onRefresh}>↻ Actualizar</OGhostBtn>}
              <OBtn onClick={() => setCreating(true)}>+ Nuevo proyecto</OBtn>
            </div>
          </div>

          {/* Import feedback */}
          {importSuccess && (
            <div style={{ background:T.greenBg, border:"1px solid "+T.green+"44", borderRadius:8, padding:"10px 16px", marginBottom:14, display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ color:T.green, fontSize:14 }}>✓</span>
              <span style={{ color:T.green, fontSize:13 }}>{importSuccess}</span>
              <button onClick={()=>setImportSuccess("")} style={{ background:"none", border:"none", color:T.green, cursor:"pointer", marginLeft:"auto", fontSize:16 }}>×</button>
            </div>
          )}
          {importError && (
            <div style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", borderRadius:8, padding:"10px 16px", marginBottom:14, display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ color:T.rose, fontSize:14 }}>⚠</span>
              <span style={{ color:T.rose, fontSize:13 }}>{importError}</span>
              <button onClick={()=>setImportError("")} style={{ background:"none", border:"none", color:T.rose, cursor:"pointer", marginLeft:"auto", fontSize:16 }}>×</button>
            </div>
          )}

          <div style={{ position:"relative", marginBottom:20 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.ink4, fontSize:14, pointerEvents:"none" }}>🔍</span>
            <OInput placeholder="Buscar proyectos…" aria-label="Buscar proyectos" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:36 }} />
          </div>
          {creating && <CreateBoardModal onClose={() => setCreating(false)} onCreate={onCreate} />}
          {pwdModal && <PasswordModal board={pwdModal} onClose={() => setPwdModal(null)} onSubmit={async pwd => { const r = await onOpen(pwdModal, pwd); if (r==="wrong") return false; setPwdModal(null); return true; }} />}
          {deleteModal && <MonkeyDeleteModal board={deleteModal} onClose={() => setDeleteModal(null)} onConfirm={() => { onDelete(deleteModal.id); setDeleteModal(null); }} />}
          {allBoards.length === 0
            ? <EmptyMsg>Aún no hay proyectos. Crea el primero → o importa un archivo .mindstorm.json</EmptyMsg>
            : <BoardGrid boards={filtered(allBoards)} onOpen={handleOpen} isMobile={isMobile} onDeleteRequest={setDeleteModal} onExport={exportBoard} exporting={exporting} />
          }
        </div>
      </div>
    </div>
  );
}

function Sidebar({ user, boards, onOpen, onSignOut }) {
  return (
    <div style={{ width:230, background:"#1C1A18", borderRight:"1px solid rgba(255,255,255,0.06)",
      padding:"20px 12px", display:"flex", flexDirection:"column", flexShrink:0,
      backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
      boxShadow:"2px 0 24px rgba(0,0,0,.35)" }}>
      <div style={{ padding:"8px 8px 4px", marginBottom:18 }}>
        <MindStormLogo size="sm" light={false} />
      </div>
      <SideItem icon="🏠" label="Inicio" active />
      <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"10px 0" }} />
      <div style={{ color:"rgba(255,255,255,0.25)", fontFamily:"var(--mono)", fontSize:9, letterSpacing:"0.18em", padding:"4px 10px", marginBottom:4, textTransform:"uppercase" }}>// Proyectos</div>
      {boards.slice(0,10).map(b => {
        const cat = CATEGORIES.find(c => c.id===b.categoryId) || CATEGORIES[6];
        return (
          <button key={b.id} onClick={() => onOpen(b)}
            style={{ background:"transparent", border:"none", borderRadius:5,
              textAlign:"left", padding:"6px 10px 6px 8px", cursor:"pointer",
              color:"var(--ink2)", fontFamily:"var(--raj)", fontSize:12, fontWeight:500,
              letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:8, width:"100%", transition:"all .13s" }}
            onMouseEnter={e => { e.currentTarget.style.background=cat.color+"18"; e.currentTarget.style.color="var(--ink0)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--ink2)"; }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:cat.color, flexShrink:0, boxShadow:`0 0 6px ${cat.color}88` }} />
            <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{b.name}</span>
            {b.password && <span style={{ color:"var(--ink3)", fontFamily:"var(--mono)", fontSize:9 }}>⚿</span>}
          </button>
        );
      })}
      <div style={{ flex:1 }} />
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, padding:"4px 10px 10px" }}>
          <div style={{ width:26, height:26, borderRadius:4,
            background:`rgba(255,255,255,0.08)`,
            border:"1px solid rgba(255,255,255,0.14)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--raj)", fontSize:13, fontWeight:700, color:"var(--mc)", flexShrink:0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <span style={{ fontFamily:"var(--raj)", color:"var(--ink2)", fontSize:12, fontWeight:500, letterSpacing:".06em" }}>@{user.name}</span>
        </div>
        <button onClick={onSignOut}
          className="hud-btn"
          style={{ width:"100%", textAlign:"left", fontSize:10, padding:"5px 10px",
            borderColor:"transparent", background:"transparent", letterSpacing:".1em" }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(232,106,92,0.08)"; e.currentTarget.style.color=T.rose; e.currentTarget.style.borderColor=T.rose+"33"; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--ink2)"; e.currentTarget.style.borderColor="transparent"; }}>
          ⎋ CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
}

function BoardGrid({ boards, onOpen, isMobile, onDeleteRequest, onExport, exporting }) {
  const isTablet = useIsTablet();
  if (!boards.length) return <EmptyMsg>Sin proyectos</EmptyMsg>;
  const cols = isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(230px,1fr))";
  return (
    <div style={{ display:"grid", gridTemplateColumns:cols, gap:16 }}>
      {boards.map(b => <BoardTile key={b.id} board={b} onOpen={onOpen} onDeleteRequest={onDeleteRequest} onExport={onExport} exporting={exporting} />)}
    </div>
  );
}

function BoardTile({ board, onOpen, onDeleteRequest, onExport, exporting }) {
  const cat = CATEGORIES.find(c => c.id===board.categoryId) || CATEGORIES[6];
  return (
    <div className="tile hud-c" onClick={() => onOpen(board)}
      role="button" tabIndex={0}
      aria-label={`Abrir proyecto: ${board.name}`}
      onKeyDown={e => (e.key==="Enter"||e.key===" ") && onOpen(board)}
      style={{ background:"rgba(20,18,16,0.90)", border:`1px solid ${cat.color}38`,
        borderRadius:10, padding:"16px 18px 14px",
        position:"relative", overflow:"hidden",
        boxShadow:`0 2px 16px rgba(0,0,0,.4), 0 0 0 1px ${cat.color}10`,
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)" }}>
      {/* Ambient top-right glow */}
      <div style={{ position:"absolute", top:-40, right:-40, width:120, height:120, borderRadius:"50%",
        background:`radial-gradient(circle, ${cat.color}18 0%, transparent 70%)`, pointerEvents:"none" }} />
      {/* Category line */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontFamily:"var(--mono)", fontSize:9, color:cat.color, letterSpacing:"0.16em",
          textTransform:"uppercase", opacity:.8 }}>
          {cat.label.replace(/^.{2}/,"").trim()}
        </div>
        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
          {board.password && <span style={{ color:"var(--ink3)", fontFamily:"var(--mono)", fontSize:9 }}>⚿</span>}
          <button
            onClick={e => { e.stopPropagation(); onExport && onExport(board); }}
            title="Exportar"
            className="hud-btn"
            style={{ padding:"2px 7px", fontSize:10, letterSpacing:".08em" }}
            onMouseEnter={e => { e.currentTarget.style.color=T.green; e.currentTarget.style.borderColor=T.green+"55"; }}
            onMouseLeave={e => { e.currentTarget.style.color="var(--ink1)"; e.currentTarget.style.borderColor="rgba(232,82,0,0.18)"; }}
          >{exporting === board.id ? "…" : "↓"}</button>
          <button
            onClick={e => { e.stopPropagation(); onDeleteRequest(board); }}
            title="Eliminar"
            className="hud-btn"
            style={{ padding:"2px 7px", fontSize:10, letterSpacing:".08em" }}
            onMouseEnter={e => { e.currentTarget.style.color=T.rose; e.currentTarget.style.borderColor=T.rose+"55"; }}
            onMouseLeave={e => { e.currentTarget.style.color="var(--ink1)"; e.currentTarget.style.borderColor="rgba(232,82,0,0.18)"; }}
          >✕</button>
        </div>
      </div>
      {/* Title */}
      <div style={{ fontFamily:"var(--raj)", fontWeight:700, fontSize:17, marginBottom:6,
        lineHeight:1.2, letterSpacing:"0.02em", color:"var(--ink0)",
        textShadow:`0 0 20px ${cat.color}22` }}>
        {board.name}
      </div>
      <div style={{ color:"var(--ink2)", fontSize:12, marginBottom:12, lineHeight:1.55,
        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", fontFamily:"var(--sans)" }}>
        {board.conceptTitle || <span style={{ opacity:0.45, fontStyle:"italic" }}>Sin concepto base</span>}
      </div>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
        {(board.subcategories||[]).slice(0,2).map(s => (
          <span key={s} style={{ fontFamily:"var(--mono)", fontSize:9, padding:"2px 6px",
            border:`1px solid ${cat.color}28`, color:"var(--ink2)", textTransform:"uppercase", letterSpacing:".08em" }}>{s}</span>
        ))}
      </div>
      <div style={{ color:"var(--ink3)", fontFamily:"var(--mono)", fontSize:9, letterSpacing:".08em",
        display:"flex", justifyContent:"space-between", borderTop:`1px dashed ${cat.color}18`, paddingTop:8 }}>
        <span>@{board.createdBy}</span>
        <span>{fmtDate(board.createdAt)}</span>
      </div>
    </div>
  );
}

function SideItem({ icon, label, active }) {
  return (
    <button style={{
      background: active
        ? "rgba(255,255,255,0.10)"
        : "transparent",
      border: active ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
      textAlign:"left", padding:"8px 12px", borderRadius:6, cursor:"pointer",
      color: active ? "var(--ink0)" : "var(--ink2)", fontFamily:"var(--raj)",
      fontSize:13, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase",
      display:"flex", alignItems:"center", gap:10, width:"100%", transition:"all .15s",
      boxShadow: active ? "inset 3px 0 0 rgba(255,255,255,0.35)" : "none" }}
      onMouseEnter={e => { if(!active){ e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="var(--ink0)"; } }}
      onMouseLeave={e => { if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--ink2)"; } }}>
      <span style={{ fontFamily:"var(--mono)", fontSize:11, opacity:.7, width:14, textAlign:"center" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─── MONKEY ISLAND DELETE MODAL ───────────────────────────────────────────────
const MONKEY_STEPS = [
  {
    emoji: "🗑",
    title: (name) => `¿Eliminar "${name}"?`,
    body:  "Esta acción borrará el proyecto y todas sus tarjetas, conexiones y comentarios. No hay vuelta atrás.",
    yes:   "Sí, eliminar",
    no:    "No, cancelar",
    color: T.rose,
  },
  {
    emoji: "💀",
    title: () => "Última oportunidad.",
    body:  "Que conste en actas que se te advirtió. Ahora pulsa el botón y que la fuerza te acompañe.",
    yes:   "⚡ DESTRUIR PARA SIEMPRE",
    no:    "Me salvé por los pelos",
    color: T.rose,
  },
];

function MonkeyDeleteModal({ board, onClose, onConfirm }) {
  const [step, setStep] = useState(0);
  const s = MONKEY_STEPS[step];
  const isLast = step === MONKEY_STEPS.length - 1;

  function handleYes() {
    if (isLast) { onConfirm(); }
    else { setStep(p => p + 1); }
  }

  return (
    <OOverlay onClose={onClose}>
      <div style={{ background:"rgba(14,14,32,0.95)", border:`2px solid ${s.color}55`, borderRadius:18,
        padding:"34px 30px", width:"100%", maxWidth:410,
        boxShadow:`0 30px 80px rgba(0,0,0,.65), 0 0 30px ${s.color}15`,
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        textAlign:"center", transition:"border-color .3s", animation:"scaleIn .22s ease" }}>
        {/* Progress dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:22 }}>
          {MONKEY_STEPS.map((_, i) => (
            <div key={i} style={{ width: i===step?20:7, height:7, borderRadius:99, background: i<=step?s.color:T.border, transition:"all .3s" }} />
          ))}
        </div>

        {/* Emoji */}
        <div style={{ fontSize:52, marginBottom:16, lineHeight:1 }}>{s.emoji}</div>

        {/* Title */}
        <h2 style={{ color:s.color, fontSize:20, fontWeight:800, marginBottom:12, lineHeight:1.3, letterSpacing:"-.3px" }}>
          {s.title(board.name)}
        </h2>

        {/* Body */}
        <p style={{ color:T.ink3, fontSize:14, lineHeight:1.65, marginBottom:28 }}>
          {s.body}
        </p>

        {/* Buttons */}
        <div style={{ display:"flex", gap:10, flexDirection: isLast?"column":"row" }}>
          <button onClick={onClose}
            style={{ flex:1, background:T.bgPanel, border:"1px solid "+T.border2, color:T.ink3, padding:"11px 16px", borderRadius:9, cursor:"pointer", fontSize:14, fontFamily:"var(--sans)", fontWeight:600, transition:"all .15s" }}
            onMouseEnter={e => e.currentTarget.style.background=T.bgHover}
            onMouseLeave={e => e.currentTarget.style.background=T.bgPanel}>
            {s.no}
          </button>
          <button onClick={handleYes}
            style={{ flex:1, background: isLast?s.color:T.bgPanel, border:"2px solid "+s.color, color: isLast?"#fff":s.color, padding:"11px 16px", borderRadius:9, cursor:"pointer", fontSize:14, fontFamily:"var(--sans)", fontWeight:800, transition:"all .2s", letterSpacing: isLast?".5px":undefined }}
            onMouseEnter={e => { e.currentTarget.style.background=s.color; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background=isLast?s.color:T.bgPanel; e.currentTarget.style.color=isLast?"#fff":s.color; }}>
            {s.yes}
          </button>
        </div>

        {/* Step counter */}
        <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginTop:18, letterSpacing:1 }}>
          ADVERTENCIA {step+1} DE {MONKEY_STEPS.length}
        </div>
      </div>
    </OOverlay>
  );
}

// ─── PASSWORD MODAL ───────────────────────────────────────────────────────────
function PasswordModal({ board, onClose, onSubmit }) {
  const [pwd, setPwd]           = useState("");
  const [error, setError]       = useState(false);
  const [mode, setMode]         = useState("login"); // login | recover | recovered
  const [step, setRecStep]      = useState(1);        // recovery step 1 or 2
  const [ans1, setAns1]         = useState("");
  const [ans2, setAns2]         = useState("");
  const [ansError, setAnsError] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasSecurity = board.security && board.security.q1;

  async function submit() {
    const ok = await onSubmit(pwd);
    if (!ok) { setError(true); setPwd(""); }
  }

  async function checkAnswer1() {
    const stored = board.security?.a1 || "";
    const match = isHashed(stored)
      ? (await sha256(ans1)) === stored
      : ans1.trim().toLowerCase() === stored;
    if (match) { setAnsError(false); setRecStep(2); }
    else        { setAnsError(true); }
  }

  async function checkAnswer2() {
    const stored = board.security?.a2 || "";
    const match = isHashed(stored)
      ? (await sha256(ans2)) === stored
      : ans2.trim().toLowerCase() === stored;
    if (match) { setAnsError(false); setRevealed(true); }
    else        { setAnsError(true); }
  }

  return (
    <OOverlay onClose={onClose}><OModalBox>
      {mode === "login" && (
        <div>
          <div style={{ textAlign:"center", marginBottom:22 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔒</div>
            <h2 style={{ color:T.ink, fontSize:20, fontWeight:800, marginBottom:6 }}>Tablero protegido</h2>
            <p style={{ color:T.ink3, fontSize:13 }}>"{board.name}" requiere contraseña</p>
          </div>
          <PwdInput value={pwd} onChange={e => { setPwd(e.target.value); setError(false); }} onKeyDown={e => e.key==="Enter" && submit()} autoFocus style={{ marginBottom:8 }} />
          {error && <p style={{ color:T.rose, fontSize:12, fontFamily:"var(--mono)", marginBottom:6 }}>Contraseña incorrecta</p>}
          <div style={{ marginBottom:16, marginTop:6 }}>
            {hasSecurity ? (
              <button onClick={() => { setMode("recover"); setRecStep(1); setAnsError(false); }}
                style={{ background:"none", border:"none", color:T.accent, fontSize:12, cursor:"pointer", fontFamily:"var(--sans)", textDecoration:"underline", padding:0 }}>
                ¿Olvidaste la contraseña? Responde tus preguntas de seguridad
              </button>
            ) : (
              <div>
                <button onClick={() => setError(e => !e)}
                  style={{ background:"none", border:"none", color:T.ink4, fontSize:12, cursor:"pointer", fontFamily:"var(--sans)", textDecoration:"underline", padding:0 }}
                  onMouseEnter={e => e.currentTarget.style.color=T.ink2}
                  onMouseLeave={e => e.currentTarget.style.color=T.ink4}
                  onClick={() => setMode("hint")}
                >
                  ¿Olvidaste la contraseña?
                </button>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <OGhostBtn onClick={onClose}>Cancelar</OGhostBtn>
            <OBtn full onClick={submit}>Entrar →</OBtn>
          </div>
        </div>
      )}

      {mode === "hint" && (
        <div>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔑</div>
            <h2 style={{ color:T.ink, fontSize:18, fontWeight:800, marginBottom:6 }}>Recuperar acceso</h2>
          </div>
          <div style={{ background:T.amberBg, border:"1px solid "+T.amber+"44", borderRadius:8, padding:"14px", marginBottom:16 }}>
            <div style={{ color:T.amber, fontWeight:700, fontSize:13, marginBottom:4 }}>Sin preguntas de seguridad configuradas</div>
            <p style={{ color:T.amber, fontSize:13, lineHeight:1.5 }}>
              Este tablero fue creado por <strong>@{board.createdBy}</strong>.<br/>
              Contáctalo para que te comparta la contraseña — puede verla haciendo clic en 🔒 dentro del tablero.
            </p>
          </div>
          <OGhostBtn full onClick={() => setMode("login")}>← Volver</OGhostBtn>
        </div>
      )}

      {mode === "recover" && !revealed && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
            <span style={{ fontSize:22 }}>🛡</span>
            <div>
              <h2 style={{ color:T.ink, fontSize:18, fontWeight:800 }}>Verificación de identidad</h2>
              <p style={{ color:T.ink3, fontSize:12 }}>Pregunta {step} de 2</p>
            </div>
          </div>
          <div style={{ height:3, background:T.border, borderRadius:2, marginBottom:20 }}>
            <div style={{ height:"100%", width:step===1?"50%":"100%", background:T.accent, borderRadius:2, transition:"width .4s" }} />
          </div>

          {step === 1 && (
            <div>
              <div style={{ background:T.accentBg, border:"1px solid "+T.accent+"33", borderRadius:10, padding:"14px", marginBottom:14 }}>
                <div style={{ color:T.accent, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:6 }}>PREGUNTA DE SEGURIDAD</div>
                <div style={{ color:T.ink, fontWeight:600, fontSize:14, lineHeight:1.4 }}>{board.security.q1}</div>
              </div>
              <OInput placeholder="Tu respuesta…" value={ans1} onChange={e => { setAns1(e.target.value); setAnsError(false); }} onKeyDown={e => e.key==="Enter" && checkAnswer1()} autoFocus style={{ marginBottom:ansError?8:14 }} />
              {ansError && <p style={{ color:T.rose, fontSize:12, fontFamily:"var(--mono)", marginBottom:14 }}>Respuesta incorrecta. Intenta nuevamente.</p>}
              <div style={{ display:"flex", gap:8 }}>
                <OGhostBtn onClick={() => setMode("login")}>← Volver</OGhostBtn>
                <OBtn full onClick={checkAnswer1} disabled={!ans1.trim()}>Verificar →</OBtn>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ background:T.greenBg, border:"1px solid "+T.green+"44", borderRadius:8, padding:"8px 12px", marginBottom:14, display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ color:T.green }}>✓</span>
                <span style={{ color:T.green, fontSize:12 }}>Primera pregunta correcta</span>
              </div>
              <div style={{ background:T.accentBg, border:"1px solid "+T.accent+"33", borderRadius:10, padding:"14px", marginBottom:14 }}>
                <div style={{ color:T.accent, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:6 }}>SEGUNDA PREGUNTA</div>
                <div style={{ color:T.ink, fontWeight:600, fontSize:14, lineHeight:1.4 }}>{board.security.q2}</div>
              </div>
              <OInput placeholder="Tu respuesta…" value={ans2} onChange={e => { setAns2(e.target.value); setAnsError(false); }} onKeyDown={e => e.key==="Enter" && checkAnswer2()} autoFocus style={{ marginBottom:ansError?8:14 }} />
              {ansError && <p style={{ color:T.rose, fontSize:12, fontFamily:"var(--mono)", marginBottom:14 }}>Respuesta incorrecta. Intenta nuevamente.</p>}
              <div style={{ display:"flex", gap:8 }}>
                <OGhostBtn onClick={() => { setRecStep(1); setAns2(""); setAnsError(false); }}>← Atrás</OGhostBtn>
                <OBtn full onClick={checkAnswer2} disabled={!ans2.trim()}>Verificar →</OBtn>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "recover" && revealed && (
        <div>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:36, marginBottom:10 }}>✓</div>
            <h2 style={{ color:T.green, fontSize:18, fontWeight:800, marginBottom:4 }}>Identidad verificada</h2>
            <p style={{ color:T.ink3, fontSize:13 }}>Esta es la contraseña del tablero:</p>
          </div>
          <div style={{ background:T.amberBg, border:"1px solid "+T.amber+"44", borderRadius:10, padding:"18px", textAlign:"center", marginBottom:18 }}>
            <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:8 }}>CONTRASEÑA</div>
            <div style={{ color:T.amber, fontWeight:800, fontSize:22, fontFamily:"var(--mono)", letterSpacing:2, userSelect:"all" }}>{board.password}</div>
            <p style={{ color:T.ink4, fontSize:11, marginTop:8, fontFamily:"var(--mono)" }}>Toca para seleccionar y copiar</p>
          </div>
          <OBtn full onClick={() => { setMode("login"); setPwd(board.password); setRevealed(false); }}>
            Usar esta contraseña →
          </OBtn>
        </div>
      )}
    </OModalBox></OOverlay>
  );
}

// ─── CREATE BOARD ─────────────────────────────────────────────────────────────
function CreateBoardModal({ onClose, onCreate }) {
  const [name, setName]                 = useState("");
  const [categoryId, setCategoryId]     = useState("");
  const [subcategories, setSubcats]     = useState([]);
  const [conceptTitle, setConceptTitle] = useState("");
  const [conceptDesc, setConceptDesc]   = useState("");
  const [password, setPassword]         = useState("");
  const [showPwd, setShowPwd]           = useState(false);
  const [secQ1, setSecQ1]               = useState(SECURITY_QUESTIONS[0]);
  const [secA1, setSecA1]               = useState("");
  const [secQ2, setSecQ2]               = useState(SECURITY_QUESTIONS[2]);
  const [secA2, setSecA2]               = useState("");
  const cat = CATEGORIES.find(c => c.id===categoryId);

  function toggleSubcat(s) { setSubcats(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]); }

  const needsSecurity = password.trim().length > 0;
  const canCreate = name.trim() && categoryId && conceptTitle.trim() &&
    (!needsSecurity || (secA1.trim() && secA2.trim()));

  async function handleCreate() {
    if (!canCreate) return;
    const security = needsSecurity
      ? { q1:secQ1, a1:await sha256(secA1), q2:secQ2, a2:await sha256(secA2) }
      : null;
    onCreate({ name, categoryId, subcategories, conceptTitle, conceptDesc, password: password.trim(), security });
  }

  const selectStyle = {
    background:T.bgCard, border:`1.5px solid ${T.border2}`,
    color:T.ink, padding:"10px 13px", borderRadius:10, fontFamily:"var(--sans)",
    fontSize:13, width:"100%", outline:"none", cursor:"pointer",
  };

  return (
    <OOverlay onClose={onClose}>
      <div style={{ background:T.bgPanel, border:`1px solid ${T.border2}`,
        borderRadius:18, width:"100%", maxWidth:560, maxHeight:"92vh", overflowY:"auto",
        boxShadow:`0 30px 80px rgba(0,0,0,.5), 0 0 0 1px ${T.accent}08`,
        backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
        animation:"scaleIn .22s ease" }}>

        {/* Header */}
        <div style={{ padding:"22px 26px 18px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:"var(--raj)", fontWeight:700, fontSize:22, letterSpacing:"0.06em", textTransform:"uppercase", color:T.ink, marginBottom:2 }}>Nuevo proyecto</h2>
            <p style={{ color:T.ink4, fontSize:12, fontFamily:"var(--mono)" }}>Completa los campos y lanza</p>
          </div>
          <button onClick={onClose} style={{ background:T.bgHover, border:`1px solid ${T.border}`, color:T.ink3, width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}
            onMouseEnter={e=>e.currentTarget.style.color=T.rose}
            onMouseLeave={e=>e.currentTarget.style.color=T.ink3}>×</button>
        </div>

        <div style={{ padding:"22px 26px" }}>
          {/* Name */}
          <OLabel>Nombre del proyecto</OLabel>
          <OInput placeholder="¿Cómo se llama?" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom:20 }} autoFocus />

          {/* Categories — compact pills */}
          <OLabel>Categoría</OLabel>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom: cat ? 12 : 20 }}>
            {CATEGORIES.map(c => {
              const sel = categoryId === c.id;
              return (
                <button key={c.id} onClick={() => { setCategoryId(c.id); setSubcats([]); }}
                  style={{ background:sel?`${c.color}22`:"rgba(255,255,255,0.04)",
                    border:`1.5px solid ${sel?c.color:"rgba(255,255,255,0.1)"}`,
                    color:sel?c.color:T.ink3, padding:"7px 14px", borderRadius:99,
                    cursor:"pointer", fontSize:12, fontWeight:sel?700:400,
                    fontFamily:"var(--sans)", transition:"all .15s",
                    display:"flex", alignItems:"center", gap:5,
                    boxShadow:sel?`0 0 12px ${c.color}33`:"none" }}>
                  <span>{c.label.split(" ")[0]}</span>
                  <span>{c.label.replace(/^.{2}/,"").trim()}</span>
                </button>
              );
            })}
          </div>

          {/* Subcategories */}
          {cat && (
            <div style={{ marginBottom:20 }}>
              <OLabel>Subcategorías <span style={{ color:T.ink4, textTransform:"none", letterSpacing:0, fontFamily:"var(--sans)", fontWeight:400 }}>(opcional)</span></OLabel>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {cat.subcategories.map(s => {
                  const sel = subcategories.includes(s);
                  return (
                    <button key={s} onClick={() => toggleSubcat(s)}
                      style={{ padding:"5px 12px", borderRadius:99,
                        border:`1.5px solid ${sel?cat.color:"rgba(255,255,255,0.1)"}`,
                        color:sel?cat.color:T.ink3, fontSize:12, cursor:"pointer",
                        background:sel?`${cat.color}15`:"transparent",
                        fontFamily:"var(--sans)", transition:"all .15s",
                        display:"flex", alignItems:"center", gap:4 }}>
                      {sel && <span style={{ fontSize:9 }}>✓</span>}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"4px 0 20px" }} />

          {/* Concept */}
          <OLabel>Idea central <span style={{ color:T.rose, fontFamily:"var(--sans)", textTransform:"none", letterSpacing:0 }}>*</span></OLabel>
          <OInput placeholder="En una frase: ¿qué es este proyecto?" value={conceptTitle} onChange={e => setConceptTitle(e.target.value)} style={{ marginBottom:12 }} />
          <OTextarea placeholder="¿Qué problema resuelve? ¿Para quién? ¿Qué lo diferencia?…" value={conceptDesc} onChange={e => setConceptDesc(e.target.value)} rows={2} style={{ marginBottom:20 }} />

          {/* Password — collapsible */}
          <button onClick={() => setShowPwd(p=>!p)}
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
              color:showPwd||password?T.amber:T.ink4, padding:"9px 14px", borderRadius:10,
              cursor:"pointer", fontSize:12, fontFamily:"var(--sans)", width:"100%",
              textAlign:"left", display:"flex", alignItems:"center", gap:8,
              transition:"all .15s", marginBottom:showPwd?12:20 }}>
            <span>🔒</span>
            <span>{password ? `Contraseña: ${password.replace(/./g,"•")}` : "Agregar contraseña (opcional)"}</span>
            <span style={{ marginLeft:"auto", opacity:.5 }}>{showPwd?"▲":"▼"}</span>
          </button>

          {showPwd && (
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:12, padding:"16px", marginBottom:20 }}>
              <OLabel>Contraseña</OLabel>
              <PwdInput value={password} onChange={e => setPassword(e.target.value)} placeholder="Dejar vacío = tablero abierto" />
              {needsSecurity && (
                <div style={{ marginTop:14 }}>
                  <div style={{ background:`${T.amber}10`, border:`1px solid ${T.amber}33`, borderRadius:8, padding:"9px 12px", marginBottom:14, display:"flex", gap:7 }}>
                    <span style={{ color:T.amber, flexShrink:0 }}>🛡</span>
                    <p style={{ color:T.amber, fontSize:11, lineHeight:1.5 }}>Elige 2 preguntas de seguridad para poder recuperar la contraseña si la olvidas.</p>
                  </div>
                  <OLabel>Pregunta 1</OLabel>
                  <select value={secQ1} onChange={e => setSecQ1(e.target.value)} style={{...selectStyle, marginBottom:8}}>
                    {SECURITY_QUESTIONS.filter(q => q !== secQ2).map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <OInput placeholder="Tu respuesta…" value={secA1} onChange={e => setSecA1(e.target.value)} style={{ marginBottom:14 }} />
                  <OLabel>Pregunta 2</OLabel>
                  <select value={secQ2} onChange={e => setSecQ2(e.target.value)} style={{...selectStyle, marginBottom:8}}>
                    {SECURITY_QUESTIONS.filter(q => q !== secQ1).map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <OInput placeholder="Tu respuesta…" value={secA2} onChange={e => setSecA2(e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <OGhostBtn onClick={onClose}>Cancelar</OGhostBtn>
            <OBtn full onClick={handleCreate} disabled={!canCreate}>
              {canCreate ? "Crear proyecto ✦" : `Faltan: ${!name.trim()?"nombre · ":""}${!categoryId?"categoría · ":""}${!conceptTitle.trim()?"idea central":""}`.replace(/ · $/, "")}
            </OBtn>
          </div>
        </div>
      </div>
    </OOverlay>
  );
}

// ─── BOARD SCREEN ─────────────────────────────────────────────────────────────
function BoardScreen({ user, board, data, onSave, onBack }) {
  const [cards, setCards]               = useState(data.cards || []);
  const [comments, setComments]         = useState(data.comments || {});
  const [connections, setConnections]   = useState(data.connections || []);
  const [addingTo, setAddingTo]         = useState(null);
  const [editCard, setEditCard]         = useState(null);
  const [dragCard, setDragCard]         = useState(null);
  const [dragOver, setDragOver]         = useState(null);
  const [aiPanel, setAiPanel]           = useState(false);
  const [connPanel, setConnPanel]       = useState(false);
  const [trashOpen, setTrashOpen]       = useState(false);
  const [editConcept, setEditConcept]   = useState(false);
  const [showPwd, setShowPwd]           = useState(false);
  const [showShare, setShowShare]       = useState(false);
  const [copied, setCopied]             = useState(false);
  const [taskPanelOpen, setTaskPanelOpen] = useState(true);
  const [docPanel, setDocPanel]         = useState(false);
  const [viewMode, setViewMode]         = useState("kanban");
  const [wbPanel, setWbPanel]           = useState(false);
  const [toast, setToast]               = useState(null);
  const [saveStatus, setSaveStatus]     = useState(""); // "" | "saving" | "saved" | "error"
  const saveTimerRef                    = useRef(null);
  const [keyModal, setKeyModal]         = useState(false);
  const [readCard, setReadCard]         = useState(null);
  const [filterQuery, setFilterQuery]   = useState("");
  const [filterType, setFilterType]     = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [concept, setConcept]           = useState({ title:board.conceptTitle||"", desc:board.conceptDesc||"" });
  const cat = CATEGORIES.find(c => c.id===board.categoryId) || CATEGORIES[6];
  const isMobile = useIsMobile();

  useEffect(() => { setCards(data.cards||[]); setComments(data.comments||{}); setConnections(data.connections||[]); }, [data]);

  const searchInputRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName;
      const typing = tag==="INPUT" || tag==="TEXTAREA" || document.activeElement?.isContentEditable;

      // Esc — close any open panel/modal
      if (e.key==="Escape") {
        if (editCard) { setEditCard(null); return; }
        if (aiPanel) { setAiPanel(false); return; }
        if (connPanel) { setConnPanel(false); return; }
        if (docPanel) { setDocPanel(false); return; }
        if (wbPanel) { setWbPanel(false); return; }
        if (trashOpen) { setTrashOpen(false); return; }
        if (addingTo) { setAddingTo(null); return; }
        if (filterQuery || filterType || filterAuthor) {
          setFilterQuery(""); setFilterType(""); setFilterAuthor(""); return;
        }
      }

      // Skip the rest when user is typing in an input
      if (typing) return;

      // C — toggle canvas/kanban view
      if (e.key==="c" || e.key==="C") {
        if (!e.metaKey && !e.ctrlKey) {
          setViewMode(v => v==="kanban" ? "canvas" : "kanban");
          return;
        }
      }

      // Cmd+K / Ctrl+K — focus search
      if ((e.metaKey || e.ctrlKey) && e.key==="k") {
        e.preventDefault();
        if (viewMode==="kanban") {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }
        return;
      }

      // N — new card in first column (concepto)
      if (e.key==="n" || e.key==="N") {
        if (!e.metaKey && !e.ctrlKey && viewMode==="kanban") {
          setAddingTo("concepto");
          return;
        }
      }

      // 1–4 — focus / scroll to column
      if (e.key>="1" && e.key<="4" && viewMode==="kanban") {
        const idx = parseInt(e.key) - 1;
        const colId = COLUMNS[idx]?.id;
        if (colId) {
          const el = document.querySelector(`[data-col="${colId}"]`);
          el?.scrollIntoView({ behavior:"smooth", inline:"center", block:"nearest" });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editCard, aiPanel, connPanel, docPanel, wbPanel, trashOpen, addingTo, filterQuery, filterType, filterAuthor, viewMode]);

  function showToast(msg, undoFn) {
    setToast({ msg, undoFn });
    setTimeout(() => setToast(null), 5000);
  }

  const save = useCallback(async (newCards, newComments, newConns) => {
    const nc = newCards !== undefined ? newCards : cards;
    const ncm = newComments !== undefined ? newComments : comments;
    const nco = newConns !== undefined ? newConns : connections;
    setCards(nc); setComments(ncm); setConnections(nco);
    setSaveStatus("saving");
    clearTimeout(saveTimerRef.current);
    try {
      await onSave({ ...data, cards:nc, comments:ncm, connections:nco });
      setSaveStatus("saved");
      saveTimerRef.current = setTimeout(() => setSaveStatus(""), 2200);
    } catch(e) {
      console.error("Save failed:", e);
      setSaveStatus("error");
      showToast("⚠️ Error al guardar — revisa tu conexión");
    }
  }, [data, onSave, cards, comments, connections]);

  async function addCard(col, cardData) {
    const card = { id:genId(), col, author:user.name, ts:nowTs(), type:"tarea", attachments:[], deleted:false, ...cardData };
    await save([...cards, card]);
    setAddingTo(null);
  }

  async function softDeleteCard(id) {
    const card = cards.find(c => c.id===id);
    const updated = cards.map(c => c.id===id ? {...c, deleted:true, deletedAt:nowTs()} : c);
    await save(updated);
    setEditCard(null);
    showToast(`"${card?.title}" movida a la papelera`, async () => {
      const restored = updated.map(c => c.id===id ? {...c, deleted:false, deletedAt:null} : c);
      await save(restored);
    });
  }

  async function restoreCard(id) {
    await save(cards.map(c => c.id===id ? {...c, deleted:false, deletedAt:null} : c));
    showToast("Tarjeta restaurada ✓");
  }

  async function permanentDelete(id) {
    await save(cards.filter(c => c.id!==id));
    showToast("Eliminada permanentemente");
  }

  async function updateCard(id, updates) {
    await save(cards.map(c => c.id===id ? {...c, ...updates} : c));
    setEditCard(null);
  }

  async function moveCard(id, col) { await save(cards.map(c => c.id===id ? {...c, col} : c)); }

  async function addComment(cardId, text) {
    const comment = { id:genId(), cardId, author:user.name, text, ts:nowTs() };
    const updated = { ...comments, [cardId]: [...(comments[cardId]||[]), comment] };
    await save(undefined, updated);
  }

  async function addSticker(cardId, parentId, stickerData) {
    const sticker = { id:genId(), parentId: parentId || null, author:user.name, ts:nowTs(), status:"pending", ...stickerData };
    const updated = cards.map(c => c.id===cardId ? { ...c, stickers:[...(c.stickers||[]), sticker] } : c);
    await save(updated);
  }

  async function updateStickerStatus(cardId, stickerId, status) {
    const updated = cards.map(c =>
      c.id===cardId
        ? { ...c, stickers:(c.stickers||[]).map(s => s.id===stickerId ? {...s, status} : s) }
        : c
    );
    await save(updated);
  }

  async function updateConnections(newConns) {
    await save(undefined, undefined, newConns);
    setConnections(newConns);
  }

  async function saveCanvasPositions(newPos) {
    await onSave({ ...data, cards, comments, connections, canvasPositions: newPos });
  }

  async function addConnectionAsTask(conn) {
    const ca = cards.find(c => c.id===conn.cardA);
    const cb = cards.find(c => c.id===conn.cardB);
    if (!ca || !cb) return;
    const task = {
      id:genId(), col:"concepto", author:user.name, ts:nowTs(),
      type:"tarea", attachments:[], deleted:false,
      title:`Integrar: "${ca.title}" + "${cb.title}"`,
      body:`Conexión (${conn.type}): ${conn.reason}`,
    };
    await save([...cards, task]);
    showToast("Tarea creada desde conexión ✓");
  }

  function copyShareLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const activeCards = cards.filter(c => !c.deleted);
  const deletedCards = cards.filter(c => c.deleted);
  const pendingConns = connections.filter(c => c.status==="pending");
  const taskCards = activeCards.filter(c => c.type==="tarea");
  const allAuthors = [...new Set(activeCards.map(c => c.author).filter(Boolean))];
  const filteredActiveCards = activeCards.filter(c => {
    const q = filterQuery.toLowerCase();
    if (q && !((c.title||"").toLowerCase().includes(q) || (c.body||"").toLowerCase().includes(q) || (c.author||"").toLowerCase().includes(q))) return false;
    if (filterType && c.type !== filterType) return false;
    if (filterAuthor && c.author !== filterAuthor) return false;
    return true;
  });
  const hasFilter = filterQuery || filterType || filterAuthor;

  const { themeId } = useTheme();
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column", fontFamily:"var(--sans)" }}>
      <style>{GLOBAL_CSS}</style>
      <style>{getThemeCSS(themeId)}</style>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
          background:"var(--card)", color:"var(--ink-0)", padding:"14px 22px", borderRadius:"var(--r-md)", display:"flex",
          gap:14, alignItems:"center", zIndex:999,
          boxShadow:"var(--shadow-3)", border:"1px solid var(--card-border)", fontSize:13,
          fontFamily:"var(--sans)" }}>
          <span>{toast.msg}</span>
          {toast.undoFn && (
            <button onClick={() => { toast.undoFn(); setToast(null); }}
              style={{ background:"var(--noir)", border:"none", color:"var(--paper)",
                padding:"5px 14px", borderRadius:"var(--r-pill)", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"var(--sans)" }}>
              Deshacer
            </button>
          )}
          <button onClick={() => setToast(null)} style={{ background:"none", border:"none", color:"var(--ink-3)", cursor:"pointer", fontSize:17, padding:"0 2px", lineHeight:1 }}>×</button>
        </div>
      )}

      {/* ── NEW TOP BAR (simplified) ── */}
      <div style={{ display:"flex", alignItems:"center", gap:isMobile?8:12,
        padding:isMobile?"9px 12px":"10px 20px",
        background:"var(--paper)", borderBottom:"1px solid var(--card-border)",
        boxShadow:"var(--shadow-1)",
        position:"sticky", top:0, zIndex:50, flexShrink:0 }}>
        {!isMobile && <MindStormLogo size="sm" />}
        {!isMobile && <div style={{ width:1, height:18, background:"var(--card-border)", flexShrink:0 }} />}
        <div style={{ width:26, height:26, background:`${cat.color}22`, borderRadius:7,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
          border:`1px solid ${cat.color}44`, flexShrink:0 }}>{cat.label.split(" ")[0]}</div>
        <span style={{ color:T.ink, fontWeight:700, fontSize:isMobile?13:15,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:isMobile?160:280 }}>
          {board.name}
        </span>
        {board.password && <button onClick={() => setShowPwd(p=>!p)}
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:T.ink4, transition:"color .15s", flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.color=T.amber}
          onMouseLeave={e=>e.currentTarget.style.color=T.ink4}>🔒</button>}
        {showPwd && board.password && <span style={{ background:T.amberBg, color:T.amber, fontFamily:"var(--mono)", fontSize:12, padding:"4px 11px", borderRadius:7, userSelect:"all", border:`1px solid ${T.amber}33` }}>{board.password}</span>}
        <div style={{ flex:1 }} />
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:12 }}>@{user.name}</span>
          <div style={{ position:"relative" }}>
            <button onClick={() => setShowShare(s => !s)}
              style={{ background:T.bgPanel, border:"1px solid "+T.border, color:T.ink3, padding:"7px 10px", borderRadius:8, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontFamily:"var(--sans)", transition:"all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background=T.bgHover; e.currentTarget.style.color=T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.background=T.bgPanel; e.currentTarget.style.color=T.ink3; }}>
              🔗{!isMobile && " Compartir"}
            </button>
            {showShare && (
              <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:T.bgCard, border:"1px solid "+T.border, borderRadius:10, padding:"16px", width:280, boxShadow:"0 8px 30px rgba(0,0,0,.5)", zIndex:50 }}>
                <div style={{ color:T.ink, fontWeight:700, fontSize:13, marginBottom:6 }}>Compartir tablero</div>
                <p style={{ color:T.ink3, fontSize:12, lineHeight:1.5, marginBottom:10 }}>{board.password ? "Comparte esta URL y la contraseña con tus colaboradores." : "Comparte esta URL — el tablero es abierto."}</p>
                <div style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:7, padding:"8px 10px", fontFamily:"var(--mono)", fontSize:10, color:T.ink3, wordBreak:"break-all", marginBottom:10 }}>{window.location.href}</div>
                {board.password && (
                  <div style={{ background:T.amberBg, border:"1px solid "+T.amber+"44", borderRadius:7, padding:"8px 10px", marginBottom:10 }}>
                    <div style={{ color:T.amber, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:3 }}>CONTRASEÑA</div>
                    <div style={{ color:T.amber, fontWeight:700, fontSize:15, userSelect:"all" }}>{board.password}</div>
                  </div>
                )}
                <OBtn full onClick={() => { copyShareLink(); setShowShare(false); }}>{copied ? "✓ Link copiado" : "Copiar link"}</OBtn>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── THREE-COLUMN BODY ── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>

        {/* ── LEFT SIDEBAR (52px) — hidden on mobile ── */}
        {!isMobile && (
          <div style={{ width:52, flexShrink:0, background:T.bgPanel,
            borderRight:"1px solid var(--card-border)",
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"10px 0", gap:4, zIndex:10 }}>

            <button onClick={onBack} title="Volver a Proyectos"
              style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer",
                background:"transparent", color:T.ink4,
                fontSize:15, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color=T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.ink4; }}>
              ←
            </button>

            <div style={{ width:24, height:1, background:"rgba(232,82,0,0.10)", margin:"4px 0" }} />

            <button onClick={() => setViewMode("kanban")} title="Vista Kanban"
              style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer",
                background: viewMode==="kanban" ? T.accentBg : "transparent",
                color: viewMode==="kanban" ? T.accent : T.ink4,
                fontSize:15, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s" }}
              onMouseEnter={e => { if (viewMode!=="kanban") { e.currentTarget.style.background="var(--paper-2)"; e.currentTarget.style.color=T.ink; } }}
              onMouseLeave={e => { e.currentTarget.style.background=viewMode==="kanban"?T.accentBg:"transparent"; e.currentTarget.style.color=viewMode==="kanban"?T.accent:T.ink4; }}>
              ▦
            </button>

            <button onClick={() => setViewMode("canvas")} title="Vista Canvas"
              style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer",
                background: viewMode==="canvas" ? T.accentBg : "transparent",
                color: viewMode==="canvas" ? T.accent : T.ink4,
                fontSize:15, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s" }}
              onMouseEnter={e => { if (viewMode!=="canvas") { e.currentTarget.style.background="var(--paper-2)"; e.currentTarget.style.color=T.ink; } }}
              onMouseLeave={e => { e.currentTarget.style.background=viewMode==="canvas"?T.accentBg:"transparent"; e.currentTarget.style.color=viewMode==="canvas"?T.accent:T.ink4; }}>
              ◯
            </button>

            <div style={{ width:24, height:1, background:"var(--paper-3)", margin:"4px 0" }} />

            <button onClick={() => setConnPanel(true)} title={`Conexiones${pendingConns.length>0?" ("+pendingConns.length+" pendientes)":""}`}
              style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer", position:"relative",
                background: pendingConns.length>0 ? T.amberBg : "transparent",
                color: pendingConns.length>0 ? T.amber : T.ink4,
                fontSize:15, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background=pendingConns.length>0?T.amberBg:"var(--paper-2)"; e.currentTarget.style.color=pendingConns.length>0?T.amber:T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.background=pendingConns.length>0?T.amberBg:"transparent"; e.currentTarget.style.color=pendingConns.length>0?T.amber:T.ink4; }}>
              💡
              {pendingConns.length > 0 && (
                <span style={{ position:"absolute", top:3, right:3, background:T.amber, color:"#1a0e00",
                  fontSize:8, fontWeight:800, width:14, height:14, borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>
                  {pendingConns.length}
                </span>
              )}
            </button>

            <button onClick={() => setAiPanel(true)} title="Análisis IA"
              className="ai-glow"
              style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer",
                background:"var(--paper-2)",
                color:T.accent,
                fontSize:15, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="var(--paper-3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="var(--paper-2)"; }}>
              ✦
            </button>

            <div style={{ width:24, height:1, background:"var(--paper-3)", margin:"4px 0" }} />

            <button onClick={() => setDocPanel(true)} title="Documento"
              style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer",
                background:"transparent", color:T.ink4,
                fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="var(--paper-2)"; e.currentTarget.style.color=T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.ink4; }}>
              📄
            </button>

            {deletedCards.length > 0 && (
              <button onClick={() => setTrashOpen(true)} title={`Papelera (${deletedCards.length})`}
                style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer", position:"relative",
                  background:"transparent", color:T.ink4,
                  fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.background="var(--paper-2)"; e.currentTarget.style.color=T.ink; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.ink4; }}>
                🗑
                <span style={{ position:"absolute", top:3, right:3, background:T.rose, color:"#fff",
                  fontSize:8, fontWeight:800, width:14, height:14, borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>
                  {deletedCards.length}
                </span>
              </button>
            )}

            {cat.worldbuilding && (
              <button onClick={() => setWbPanel(true)} title="Worldbuilding"
                style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer",
                  background:T.amberBg, color:T.amber,
                  fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .15s" }}>
                📖
              </button>
            )}

            <div style={{ flex:1 }} />
            <div style={{ width:24, height:1, background:"var(--paper-3)", margin:"4px 0" }} />

            <button onClick={() => setKeyModal(true)} title={getAIKey() ? "IA conectada — cambiar clave" : "Conectar IA"}
              style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer",
                background: getAIKey() ? T.greenBg : "transparent",
                color: getAIKey() ? T.green : T.ink4,
                fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background=getAIKey()?T.greenBg:"var(--paper-2)"; e.currentTarget.style.color=getAIKey()?T.green:T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.background=getAIKey()?T.greenBg:"transparent"; e.currentTarget.style.color=getAIKey()?T.green:T.ink4; }}>
              🔑
            </button>
          </div>
        )}

        {/* ── CENTER CONTENT ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

          {/* Concept bar */}
          <div onClick={() => setEditConcept(true)}
            style={{ background:T.bgPanel, borderBottom:"1px solid var(--card-border)",
              padding:"11px 18px", cursor:"pointer", transition:"background .15s, border-color .15s",
              flexShrink:0 }}
            onMouseEnter={e=>{ e.currentTarget.style.background=T.bgHover; e.currentTarget.style.borderBottomColor=`${cat.color}28`; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=T.bgPanel; e.currentTarget.style.borderBottomColor="var(--card-border)"; }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ width:3, minHeight:32, borderRadius:2,
                background:`linear-gradient(180deg,${cat.color},${cat.color}44)`,
                flexShrink:0, boxShadow:`0 0 8px ${cat.color}66` }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:9, letterSpacing:"0.12em", marginBottom:2, textTransform:"uppercase" }}>Concepto base · clic para editar</div>
                <div style={{ color:T.ink, fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {concept.title || <span style={{ color:T.ink4, fontStyle:"italic" }}>Sin concepto — haz clic para agregar</span>}
                </div>
                {concept.desc && <div style={{ color:T.ink3, fontSize:12, marginTop:2, lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{concept.desc}</div>}
              </div>
            </div>
          </div>

          {/* Filter bar — pill style, only in kanban mode */}
          {viewMode === "kanban" && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 18px",
              background:T.bgPanel, borderBottom:"1px solid var(--card-border)",
              overflowX:"auto", flexShrink:0 }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
                  color:T.ink4, fontSize:13, pointerEvents:"none" }}>⌕</span>
                <input
                  ref={searchInputRef}
                  value={filterQuery}
                  onChange={e => setFilterQuery(e.target.value)}
                  placeholder="Buscar…"
                  aria-label="Buscar tarjetas en el tablero"
                  style={{ background:"var(--card)", border:"1px solid var(--card-border)",
                    color:T.ink, borderRadius:99, padding:"5px 10px 5px 28px", fontSize:12,
                    fontFamily:"var(--sans)", outline:"none", width:160,
                    transition:"border-color .15s", caretColor:T.accent }}
                  onFocus={e => e.target.style.borderColor="var(--ink-2)"}
                  onBlur={e => e.target.style.borderColor="var(--card-border)"}
                />
                {filterQuery && (
                  <button onClick={() => setFilterQuery("")}
                    style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                      background:"none", border:"none", color:T.ink4, cursor:"pointer",
                      fontSize:13, lineHeight:1, padding:0 }}>×</button>
                )}
              </div>
              <div style={{ width:1, height:16, background:"var(--paper-3)", flexShrink:0 }} />
              {["", ...CARD_TYPES].map(t => {
                const isAll = t === "";
                const active = filterType === t;
                const color = isAll ? T.ink3 : TYPE_COLOR[t];
                const bg = isAll ? "var(--paper-2)" : TYPE_BG[t];
                return (
                  <button key={t} onClick={() => setFilterType(t)}
                    style={{ background: active ? (isAll ? "var(--paper-3)" : bg) : "transparent",
                      border:`1px solid ${active ? (isAll ? "var(--ink-4)" : color+"55") : "var(--card-border)"}`,
                      color: active ? (isAll ? T.ink : color) : T.ink4,
                      borderRadius:99, padding:"4px 12px", fontSize:11, cursor:"pointer",
                      fontFamily:"var(--sans)", fontWeight:active?700:400, whiteSpace:"nowrap",
                      transition:"all .15s", flexShrink:0 }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor="var(--ink-4)"; e.currentTarget.style.color=T.ink3; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor="var(--card-border)"; e.currentTarget.style.color=T.ink4; } }}>
                    {isAll ? "Todos" : t}
                  </button>
                );
              })}
              {allAuthors.length > 1 && <>
                <div style={{ width:1, height:16, background:"var(--paper-3)", flexShrink:0 }} />
                {["", ...allAuthors].map(a => {
                  const isAll = a === "";
                  const active = filterAuthor === a;
                  return (
                    <button key={a} onClick={() => setFilterAuthor(a)}
                      style={{ background: active ? T.accentBg : "transparent",
                        border:`1px solid ${active ? T.accent+"55" : "var(--card-border)"}`,
                        color: active ? T.accent : T.ink4,
                        borderRadius:99, padding:"4px 12px", fontSize:11, cursor:"pointer",
                        fontFamily:"var(--sans)", fontWeight:active?700:400, whiteSpace:"nowrap",
                        transition:"all .15s", flexShrink:0 }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor="var(--ink-4)"; e.currentTarget.style.color=T.ink3; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor="var(--card-border)"; e.currentTarget.style.color=T.ink4; } }}>
                      {isAll ? "Autores" : `@${a}`}
                    </button>
                  );
                })}
              </>}
              {hasFilter && (
                <>
                  <div style={{ flex:1 }} />
                  <span style={{ color:T.ink4, fontSize:11, fontFamily:"var(--mono)", flexShrink:0 }}>
                    {filteredActiveCards.length} resultado{filteredActiveCards.length!==1?"s":""}
                  </span>
                  <button onClick={() => { setFilterQuery(""); setFilterType(""); setFilterAuthor(""); }}
                    style={{ background:"rgba(192,80,96,0.10)", border:"1px solid rgba(192,80,96,0.28)",
                      color:T.rose, borderRadius:99, padding:"4px 12px", fontSize:11,
                      cursor:"pointer", fontFamily:"var(--sans)", fontWeight:600, transition:"all .15s", flexShrink:0 }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(192,80,96,0.20)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(192,80,96,0.10)"}>
                    ✕ Limpiar
                  </button>
                </>
              )}
            </div>
          )}

          {/* Board area */}
          {viewMode === "canvas"
            ? <CanvasView
                cards={activeCards}
                connections={connections}
                comments={comments}
                user={user}
                onEditCard={setEditCard}
                onReadCard={setReadCard}
                canvasPositions={data.canvasPositions || { cards:{}, stickers:{} }}
                onSavePositions={saveCanvasPositions}
                cat={cat}
                onAddCard={() => setAddingTo("concepto")}
              />
            : <div style={{ display:"flex", flex:1, overflow:"hidden", position:"relative" }}>
              <div style={{ display:"flex", flexDirection:isMobile?"column":"row", gap:isMobile?12:14,
                padding:isMobile?"12px":"18px 16px", overflowX:isMobile?"visible":"auto",
                overflowY:isMobile?"auto":"visible", flex:1, alignItems:"flex-start", background:"transparent" }}>
                {COLUMNS.map(col => {
                  const colCards = filteredActiveCards.filter(c => c.col===col.id);
                  const isOver = dragOver===col.id;
                  return (
                    <div key={col.id} data-col={col.id}
                      onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={async e => { e.preventDefault(); if (dragCard) await moveCard(dragCard, col.id); setDragOver(null); setDragCard(null); }}
                      style={{ width:isMobile?"100%":258, flexShrink:0,
                        background:isOver?T.accentBg:T.bgPanel,
                        borderRadius:12,
                        border:`1px solid ${isOver?col.color+"55":col.color+"20"}`,
                        boxShadow:isOver?"var(--shadow-2)":"var(--shadow-1)",
                        transition:"all .18s", padding:"14px 12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        paddingBottom:12, marginBottom:12,
                        borderBottom:`1px solid ${col.color}28` }}>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <div style={{ width:10, height:10, borderRadius:"50%", background:col.color,
                            boxShadow:`0 0 8px ${col.color}cc, 0 0 16px ${col.color}44`, flexShrink:0 }} />
                          <div>
                            <div style={{ color:T.ink, fontWeight:700, fontSize:13, letterSpacing:"-0.01em" }}>{col.label}</div>
                            <div style={{ color:T.ink4, fontSize:10, fontFamily:"var(--mono)", marginTop:1 }}>{col.desc}</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                          <span style={{ background:`${col.color}20`, color:col.color,
                            fontFamily:"var(--mono)", fontSize:11, padding:"3px 10px",
                            borderRadius:99, border:`1px solid ${col.color}44`, fontWeight:700 }}>{colCards.length}</span>
                          {addingTo !== col.id && (
                            <button onClick={() => setAddingTo(col.id)} title="Añadir tarjeta"
                              style={{ background:`${col.color}18`, border:`1px solid ${col.color}44`,
                                color:col.color, width:26, height:26, borderRadius:8, cursor:"pointer",
                                fontSize:16, fontWeight:700, display:"flex", alignItems:"center",
                                justifyContent:"center", lineHeight:1, flexShrink:0, transition:"all .15s" }}
                              onMouseEnter={e => { e.currentTarget.style.background=`${col.color}33`; e.currentTarget.style.boxShadow=`0 0 8px ${col.color}44`; }}
                              onMouseLeave={e => { e.currentTarget.style.background=`${col.color}18`; e.currentTarget.style.boxShadow="none"; }}>
                              +
                            </button>
                          )}
                        </div>
                      </div>
                      {addingTo===col.id && (
                        <div style={{ marginBottom:9 }}>
                          <AddForm col={col.id} onAdd={addCard} onCancel={() => setAddingTo(null)} />
                        </div>
                      )}
                      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                        {colCards.map(card => (
                          <WorkCard key={card.id} card={card}
                            commentCount={(comments[card.id]||[]).length}
                            connCount={connections.filter(c=>(c.cardA===card.id||c.cardB===card.id)&&c.status==="approved").length}
                            isOwner={card.author === user.name}
                            onOpen={() => setReadCard(card)}
                            onEdit={() => setEditCard(card)}
                            onMove={c => moveCard(card.id, c)}
                            onDragStart={() => setDragCard(card.id)}
                            currentCol={col.id} />
                        ))}
                        {hasFilter && colCards.length === 0 && (
                          <div style={{ textAlign:"center", padding:"22px 0", color:T.ink4, fontSize:12,
                            fontFamily:"var(--mono)", border:"1px dashed var(--paper-3)",
                            borderRadius:10, marginTop:4 }}>sin resultados</div>
                        )}
                        {addingTo !== col.id && (
                          <button onClick={() => setAddingTo(col.id)}
                            style={{ width:"100%", marginTop:colCards.length?8:0,
                              background:"transparent", border:"1px dashed var(--paper-3)",
                              borderRadius:9, padding:"9px 0", cursor:"pointer", color:T.ink4,
                              fontSize:12, fontFamily:"var(--sans)", transition:"all .15s",
                              display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor=`${col.color}55`; e.currentTarget.style.color=col.color; e.currentTarget.style.background=`${col.color}08`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--paper-3)"; e.currentTarget.style.color=T.ink4; e.currentTarget.style.background="transparent"; }}>
                            <span style={{ fontSize:14, fontWeight:300, lineHeight:1 }}>+</span>
                            <span>Nueva tarjeta</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          }
        </div>{/* end center */}

        {/* ── RIGHT STATS PANEL (200px) — hidden on mobile ── */}
        {!isMobile && (
          <div style={{ width:200, flexShrink:0, background:T.bgPanel,
            borderLeft:"1px solid var(--card-border)",
            display:"flex", flexDirection:"column", overflowY:"auto" }}>

            <div style={{ padding:"13px 14px 10px", borderBottom:"1px solid var(--card-border)" }}>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>TABLERO</div>
              <div style={{ color:T.ink, fontWeight:700, fontSize:13, lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{board.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4 }}>
                <div style={{ fontSize:12 }}>{cat.label.split(" ")[0]}</div>
                <div style={{ color:cat.color, fontSize:11, fontWeight:600 }}>{cat.label.replace(/^.{2}/,"").trim()}</div>
              </div>
            </div>

            <div style={{ padding:"12px 14px 8px", borderBottom:"1px solid var(--card-border)" }}>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>TARJETAS</div>
              {COLUMNS.map(col => {
                const count = activeCards.filter(c => c.col===col.id).length;
                return (
                  <div key={col.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:col.color,
                      boxShadow:`0 0 5px ${col.color}88`, flexShrink:0 }} />
                    <span style={{ color:T.ink3, fontSize:11, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{col.label}</span>
                    <span style={{ color:col.color, fontFamily:"var(--mono)", fontSize:12, fontWeight:700, flexShrink:0 }}>{count}</span>
                  </div>
                );
              })}
              {(() => {
                const total = activeCards.length;
                const done = activeCards.filter(c => c.col==="listo").length;
                const pct = total ? Math.round(done/total*100) : 0;
                return (
                  <div style={{ marginTop:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ color:T.ink4, fontSize:10, fontFamily:"var(--mono)" }}>completado</span>
                      <span style={{ color:pct>=75?T.green:pct>=40?T.amber:T.ink3, fontFamily:"var(--mono)", fontSize:10, fontWeight:700 }}>{pct}%</span>
                    </div>
                    <div style={{ height:4, background:"var(--paper-2)", borderRadius:2 }}>
                      <div style={{ height:"100%", width:pct+"%",
                        background:pct>=75?T.green:pct>=40?T.amber:T.accent,
                        borderRadius:2, transition:"width .6s ease" }} />
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ padding:"12px 14px 10px", borderBottom:"1px solid var(--card-border)" }}>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>ESTADO IA</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                <div style={{ width:7, height:7, borderRadius:"50%",
                  background: getAIKey() ? T.green : T.ink4,
                  boxShadow: getAIKey() ? `0 0 5px ${T.green}88` : "none",
                  flexShrink:0 }} />
                <span style={{ color: getAIKey() ? T.green : T.ink4, fontSize:11, fontWeight:600 }}>
                  {getAIKey() ? "IA conectada" : "IA desconectada"}
                </span>
              </div>
              <button onClick={() => setAiPanel(true)}
                style={{ display:"flex", alignItems:"center", gap:6, background:T.accentBg,
                  border:`1px solid ${T.accent}44`, color:T.accent, borderRadius:8,
                  padding:"6px 10px", fontSize:11, fontWeight:700, cursor:"pointer",
                  fontFamily:"var(--sans)", width:"100%", marginBottom:6, transition:"all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.accent+"88"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=T.accent+"44"; }}>
                <span>✦</span><span>Analizar</span>
              </button>
              <button onClick={() => setConnPanel(true)}
                style={{ display:"flex", alignItems:"center", gap:6,
                  background: pendingConns.length>0 ? T.amberBg : "var(--paper-2)",
                  border:`1px solid ${pendingConns.length>0 ? T.amber+"55" : "var(--card-border)"}`,
                  color: pendingConns.length>0 ? T.amber : T.ink4,
                  borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, cursor:"pointer",
                  fontFamily:"var(--sans)", width:"100%", transition:"all .15s", position:"relative" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=pendingConns.length>0?T.amber+"88":"var(--ink-4)"; e.currentTarget.style.color=pendingConns.length>0?T.amber:T.ink3; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=pendingConns.length>0?T.amber+"55":"var(--card-border)"; e.currentTarget.style.color=pendingConns.length>0?T.amber:T.ink4; }}>
                <span>💡</span>
                <span>Conexiones</span>
                {pendingConns.length > 0 && (
                  <span style={{ marginLeft:"auto", background:T.amber, color:"#1a0e00",
                    fontSize:9, fontWeight:800, padding:"1px 6px", borderRadius:99 }}>
                    {pendingConns.length}
                  </span>
                )}
              </button>
            </div>

            <div style={{ padding:"10px 14px", borderBottom:"1px solid var(--card-border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {saveStatus === "saving" && <>
                  <span className="spinner" style={{ display:"inline-block", width:8, height:8, border:"1.5px solid "+T.border, borderTop:"1.5px solid "+T.ink4, borderRadius:"50%" }} />
                  <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>Guardando…</span>
                </>}
                {saveStatus === "saved" && <>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:T.green }} />
                  <span style={{ color:T.green, fontFamily:"var(--mono)", fontSize:10 }}>Guardado</span>
                </>}
                {saveStatus === "error" && <>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:T.rose }} />
                  <span style={{ color:T.rose, fontFamily:"var(--mono)", fontSize:10 }}>Error al guardar</span>
                </>}
                {!saveStatus && <>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:T.ink4 }} />
                  <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>Sincronizado</span>
                </>}
              </div>
            </div>

            <div style={{ flex:1, overflowY:"auto" }}>
              <button
                onClick={() => setTaskPanelOpen(p => !p)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px 9px", background:"transparent", border:"none", borderBottom:"1px solid "+T.border, cursor:"pointer", width:"100%", transition:"background .15s", flexShrink:0 }}
                onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:T.accent, fontSize:12 }}>✓</span>
                  <span style={{ color:T.ink, fontWeight:700, fontSize:12 }}>Tareas</span>
                  <span style={{ background:T.accentBg, color:T.accent, fontFamily:"var(--mono)", fontSize:9, padding:"1px 6px", borderRadius:99 }}>{taskCards.length}</span>
                </div>
                <span style={{ color:T.ink4, fontSize:10 }}>{taskPanelOpen ? "▲" : "▼"}</span>
              </button>
              {taskPanelOpen && (
                <div style={{ padding:"8px 12px 4px" }}>
                  {taskCards.length === 0 && (
                    <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, padding:"6px 2px 8px" }}>
                      Sin tareas aún.
                    </div>
                  )}
                  {COLUMNS.map(col => {
                    const colTasks = taskCards.filter(c => c.col===col.id);
                    if (!colTasks.length) return null;
                    return (
                      <div key={col.id} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:4 }}>
                          <span style={{ color:col.color, fontSize:9 }}>{col.icon}</span>
                          <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:9, letterSpacing:0.5 }}>{col.label.toUpperCase()}</span>
                        </div>
                        {colTasks.map(task => (
                          <div key={task.id} onClick={() => setEditCard(task)}
                            style={{ background:T.bgCard, border:"1px solid "+col.color+"30", borderRadius:6, padding:"6px 8px", marginBottom:4, cursor:"pointer", transition:"box-shadow .15s" }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.12)"}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                          >
                            <div style={{ color:T.ink, fontSize:11, fontWeight:600, lineHeight:1.3, marginBottom:2 }}>{task.title}</div>
                            <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:9 }}>@{task.author}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}{/* end right stats panel */}

      </div>{/* end three-column body */}

      {/* Mobile save indicator */}
      {isMobile && saveStatus === "saving" && (
        <div style={{ position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)", background:"var(--card)", color:"var(--ink-2)", padding:"6px 14px", borderRadius:99, fontSize:11, fontFamily:"var(--mono)", zIndex:99, boxShadow:"var(--shadow-2)", border:"1px solid var(--card-border)" }}>
          Guardando…
        </div>
      )}

{readCard && (() => {
        const live = activeCards.find(c => c.id === readCard.id) || readCard;
        return <CardReaderModal
          card={live}
          cardComments={comments[live.id]||[]}
          connections={connections}
          allCards={activeCards}
          user={user}
          onEdit={() => setEditCard(live)}
          onClose={() => setReadCard(null)} />;
      })()}
      {editCard && (() => { const liveCard = activeCards.find(c => c.id === editCard.id) || editCard; return <EditCardModal card={liveCard} cardComments={comments[liveCard.id]||[]} user={user} onSave={updateCard} onDelete={softDeleteCard} onClose={() => setEditCard(null)} onAddComment={addComment} allCards={activeCards} onAddSticker={(parentId, data) => addSticker(liveCard.id, parentId, data)} onUpdateSticker={(stickerId, status) => updateStickerStatus(liveCard.id, stickerId, status)} />; })()}
      {editConcept && <EditConceptModal concept={concept} onSave={c => { setConcept(c); setEditConcept(false); }} onClose={() => setEditConcept(false)} cat={cat} />}
      {aiPanel && <AIPanel board={board} concept={concept} cards={activeCards} cat={cat} onClose={() => setAiPanel(false)} />}
      {connPanel && <ConnectionsPanel cards={activeCards} connections={connections} onUpdate={updateConnections} onClose={() => setConnPanel(false)} cat={cat} concept={concept} onAddAsTask={addConnectionAsTask} />}
      {trashOpen && <TrashPanel cards={deletedCards} onRestore={restoreCard} onDelete={permanentDelete} onClose={() => setTrashOpen(false)} />}
      {docPanel && <DocPanel board={board} concept={concept} cards={activeCards} comments={comments} connections={connections} cat={cat} onClose={() => setDocPanel(false)} />}
      {wbPanel && <WorldbuildingPanel board={board} concept={concept} cards={activeCards} cat={cat} onClose={() => setWbPanel(false)} />}
      {keyModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,5,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(8px)"}}>
          <div style={{background:T.bgPanel,border:"1px solid "+T.border2,borderRadius:16,padding:28,maxWidth:420,width:"100%",boxShadow:"0 30px 80px rgba(0,0,0,.6)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{color:T.ink,fontWeight:800,fontSize:16}}>✦ Conectar IA — Google Gemini</div>
              <button onClick={()=>setKeyModal(false)} style={{background:"none",border:"none",color:T.ink4,cursor:"pointer",fontSize:20}}>&times;</button>
            </div>
            <AIKeySetup onSaved={() => { setKeyModal(false); showToast("✓ Clave guardada"); }} />
            {getAIKey() && (
              <div style={{marginTop:14,display:"flex",justifyContent:"space-between",alignItems:"center",
                background:T.greenBg,border:"1px solid "+T.green+"44",borderRadius:8,padding:"10px 14px"}}>
                <span style={{color:T.green,fontSize:12}}>✓ Clave configurada</span>
                <button onClick={()=>{saveAIKey("");showToast("Clave eliminada");setKeyModal(false);}}
                  style={{background:"none",border:"none",color:T.rose,cursor:"pointer",fontSize:12,fontFamily:"var(--sans)"}}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WORK CARD ────────────────────────────────────────────────────────────────
function WorkCard({ card, commentCount, connCount, onOpen, onEdit, onMove, onDragStart, currentCol, isOwner }) {
  const [expanded, setExpanded] = useState(false);
  const tc  = TYPE_COLOR[card.type] || T.accent;
  const tbg = TYPE_BG[card.type]    || T.accentBg;
  const imgs  = (card.attachments||[]).filter(a => a.type==="image");
  const files = (card.attachments||[]).filter(a => a.type!=="image");
  const sc = (card.stickers||[]).filter(s => s.status!=="discarded").length;

  return (
    <div className="wcard" draggable onDragStart={onDragStart}
      style={{ background:T.bgCard,
        border:`1px solid var(--card-border)`,
        borderLeft:`3px solid ${tc}`,
        borderRadius:10, overflow:"hidden", cursor:"grab",
        boxShadow:"var(--shadow-1)" }}>

      {/* Card header — always visible, click to expand */}
      <div
        onClick={e => { e.stopPropagation(); setExpanded(p => !p); }}
        style={{ padding:"9px 10px 9px 11px", display:"flex", alignItems:"flex-start", gap:8, cursor:"pointer" }}>

        {/* Type badge */}
        <span style={{ background:tc+"15", color:tc, fontFamily:"var(--mono)", fontSize:8,
          padding:"2px 5px", borderRadius:3, border:`1px solid ${tc}28`,
          letterSpacing:"0.1em", textTransform:"uppercase", flexShrink:0, marginTop:2, lineHeight:1.4 }}>
          {card.type || "idea"}
        </span>

        {/* Title */}
        <div
          onClick={e => { e.stopPropagation(); onOpen(); }}
          title="Leer tarjeta completa"
          style={{ color:T.ink, fontWeight:600, fontSize:13, lineHeight:1.4, flex:1,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:expanded?"normal":"nowrap",
            cursor:"pointer" }}
          onMouseEnter={e => e.currentTarget.style.color = tc}
          onMouseLeave={e => e.currentTarget.style.color = T.ink}
        >{card.title}</div>

        {/* Indicators + edit */}
        <div style={{ display:"flex", gap:4, alignItems:"center", flexShrink:0 }}>
          {commentCount > 0 && (
            <span style={{ color:T.ink3, fontFamily:"var(--mono)", fontSize:9,
              background:"var(--paper-2)", borderRadius:4, padding:"1px 4px" }}>
              💬{commentCount}
            </span>
          )}
          {connCount > 0 && (
            <span style={{ color:T.accent, fontFamily:"var(--mono)", fontSize:9,
              background:T.accentBg, border:`1px solid ${T.accent}28`, borderRadius:4, padding:"1px 4px" }}>
              ◈{connCount}
            </span>
          )}
          {sc > 0 && (
            <span style={{ color:T.blue, fontFamily:"var(--mono)", fontSize:9,
              background:T.blueBg, borderRadius:4, padding:"1px 4px" }}>
              ◎{sc}
            </span>
          )}
          <button onClick={e => { e.stopPropagation(); onEdit(); }} className="edit-ico"
            title={isOwner ? "Editar" : "Ver · Comentar · Sticker"}
            style={{ background:"transparent", border:"none", color:T.ink4, cursor:"pointer",
              fontSize:12, padding:"1px 4px", borderRadius:4, flexShrink:0, transition:"all .12s",
              lineHeight:1 }}
            onMouseEnter={e => { e.currentTarget.style.color = T.ink; e.currentTarget.style.background = "var(--paper-2)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.ink4; e.currentTarget.style.background = "transparent"; }}>
            {isOwner ? "✎" : "👁"}
          </button>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding:"0 11px 10px 14px", borderTop:"1px solid var(--card-border)" }}>
          {/* Images */}
          {imgs.length > 0 && (
            <div style={{ display:"flex", gap:4, marginTop:8, marginBottom:6 }}>
              {imgs.slice(0,3).map((img,i) => (
                <div key={i} style={{ flex:1, height:52, borderRadius:5, overflow:"hidden", background:T.bgPanel }}>
                  {img.data && <img src={img.data} alt="" loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }} />}
                </div>
              ))}
              {imgs.length>3 && <div style={{ width:32, height:52, borderRadius:5, background:T.bgPanel, display:"flex", alignItems:"center", justifyContent:"center", color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>+{imgs.length-3}</div>}
            </div>
          )}
          {/* Body text */}
          {card.body && (
            <div style={{ color:T.ink2, fontSize:12, marginTop:6, lineHeight:1.6, fontFamily:"var(--sans)" }}>
              {card.body}
            </div>
          )}
          {/* Files */}
          {files.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
              {files.map((f,i) => (
                <div key={i} style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:4, padding:"2px 7px", display:"flex", gap:4, alignItems:"center" }}>
                  <span style={{ fontSize:10 }}>{fileIcon(f.name)}</span>
                  <span style={{ color:T.ink3, fontFamily:"var(--mono)", fontSize:10 }}>{f.name.length>16?f.name.slice(0,14)+"…":f.name}</span>
                </div>
              ))}
            </div>
          )}
          {/* Footer */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10, flexWrap:"wrap", gap:4 }}>
            <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>@{card.author}</span>
            <div style={{ display:"flex", gap:3 }}>
              {COLUMNS.filter(c => c.id!==currentCol).map(c => (
                <button key={c.id} onClick={e => { e.stopPropagation(); onMove(c.id); }} title={c.label} className="mv-btn"
                  style={{ background:"var(--paper-2)", border:`1px solid ${c.color}30`,
                    color:c.color, cursor:"pointer", fontSize:10, padding:"2px 7px", borderRadius:4,
                    transition:"all .15s", fontFamily:"var(--mono)", letterSpacing:"0.04em" }}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CARD READER MODAL ────────────────────────────────────────────────────────
// Abre la tarjeta como documento de lectura. NO edita — solo muestra.
function CardReaderModal({ card, cardComments, connections, allCards, user, onEdit, onClose }) {
  const isOwner = card.author === user.name;
  const tc  = TYPE_COLOR[card.type] || T.accent;
  const tbg = TYPE_BG[card.type]    || T.accentBg;
  const imgs  = (card.attachments || []).filter(a => a.type === "image");
  const files = (card.attachments || []).filter(a => a.type !== "image");
  const stickers = (card.stickers || []).filter(s => s.status !== "discarded");
  const col = COLUMNS.find(c => c.id === card.col);
  const connectedCards = (connections || [])
    .filter(c => c.status === "approved" && (c.cardA === card.id || c.cardB === card.id))
    .map(c => {
      const otherId = c.cardA === card.id ? c.cardB : c.cardA;
      const other = (allCards || []).find(x => x.id === otherId);
      return other ? { conn: c, other } : null;
    }).filter(Boolean);

  // Close on Escape
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.48)", display:"flex",
        alignItems:"center", justifyContent:"center", zIndex:300,
        backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)", padding:"20px 16px" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:T.bgCard, borderRadius:20, width:"100%", maxWidth:700,
          maxHeight:"92vh", display:"flex", flexDirection:"column",
          boxShadow:"0 32px 80px rgba(0,0,0,.35), 0 0 0 1px "+T.border,
          overflow:"hidden", animation:"scaleIn .22s cubic-bezier(.16,1,.3,1)" }}>

        {/* ── Barra superior ── */}
        <div style={{ padding:"14px 20px", borderBottom:"1px solid "+T.border,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:T.bgPanel, flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ background:tbg, color:tc, fontFamily:"var(--mono)", fontSize:10,
              padding:"3px 10px", borderRadius:99, fontWeight:700, letterSpacing:"0.04em" }}>
              {NODE_ICONS[card.type] || ""} {card.type}
            </span>
            {col && (
              <span style={{ color:T.ink4, fontSize:11, fontFamily:"var(--mono)",
                display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ color:col.color }}>{col.icon}</span>{col.label}
              </span>
            )}
            {connectedCards.length > 0 && (
              <span style={{ color:T.accent, fontSize:11, fontFamily:"var(--mono)" }}>
                🔗 {connectedCards.length}
              </span>
            )}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={onClose}
              style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer",
                fontSize:24, lineHeight:1, padding:"0 4px", transition:"color .12s" }}
              onMouseEnter={e => e.currentTarget.style.color = T.ink}
              onMouseLeave={e => e.currentTarget.style.color = T.ink4}>
              ×
            </button>
          </div>
        </div>

        {/* ── Cuerpo del documento ── */}
        <div style={{ flex:1, overflow:"auto", padding:"32px 36px" }}>

          {/* Título */}
          <h1 style={{ color:T.ink, fontSize:28, fontWeight:800, lineHeight:1.2,
            fontFamily:"var(--sans)", letterSpacing:"-0.025em", marginBottom:14 }}>
            {card.title}
          </h1>

          {/* Meta */}
          <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:28,
            paddingBottom:22, borderBottom:"2px solid "+T.border,
            flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:tc+"22",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:tc, fontSize:13, fontWeight:700 }}>
                {card.author[0]?.toUpperCase()}
              </div>
              <span style={{ color:T.ink3, fontSize:13, fontWeight:600 }}>@{card.author}</span>
            </div>
            <span style={{ color:T.ink4, fontSize:12 }}>{fmtDate(card.createdAt)}</span>
            {(cardComments||[]).length > 0 && (
              <span style={{ color:T.ink4, fontSize:12 }}>💬 {cardComments.length} comentarios</span>
            )}
            {stickers.length > 0 && (
              <span style={{ color:T.ink4, fontSize:12 }}>🗂 {stickers.length} stickers</span>
            )}
          </div>

          {/* Imágenes */}
          {imgs.length > 0 && (
            <div style={{ display:"grid",
              gridTemplateColumns: imgs.length === 1 ? "1fr" : "repeat(auto-fill, minmax(200px,1fr))",
              gap:10, marginBottom:28 }}>
              {imgs.map((img, i) => (
                <div key={i} style={{ borderRadius:12, overflow:"hidden",
                  background:T.bgPanel,
                  maxHeight: imgs.length === 1 ? 340 : 180 }}>
                  {img.data && <img src={img.data} alt="" loading="lazy"
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />}
                </div>
              ))}
            </div>
          )}

          {/* Cuerpo / descripción */}
          {card.body ? (
            <div style={{ color:T.ink2, fontSize:15, lineHeight:1.8,
              fontFamily:"var(--sans)", whiteSpace:"pre-wrap", marginBottom:28,
              background:tc+"0d", border:"1px solid "+tc+"22", borderRadius:8, padding:"14px 18px" }}>
              {card.body}
            </div>
          ) : (
            <div style={{ color:T.ink4, fontSize:14, fontStyle:"italic",
              marginBottom:28, opacity:.7 }}>
              Sin descripción.
            </div>
          )}

          {/* Archivos adjuntos */}
          {files.length > 0 && (
            <div style={{ marginBottom:28 }}>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10,
                letterSpacing:"0.1em", marginBottom:10, textTransform:"uppercase" }}>
                Archivos adjuntos
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ background:T.bgPanel, border:"1px solid "+T.border,
                    borderRadius:9, padding:"8px 14px", display:"flex", gap:7, alignItems:"center" }}>
                    <span style={{ fontSize:16 }}>{fileIcon(f.name)}</span>
                    <div>
                      <div style={{ color:T.ink2, fontSize:12, fontWeight:600 }}>{f.name}</div>
                      {f.size && <div style={{ color:T.ink4, fontSize:10 }}>{fmtSize(f.size)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tarjetas conectadas */}
          {connectedCards.length > 0 && (
            <div style={{ marginBottom:28 }}>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10,
                letterSpacing:"0.1em", marginBottom:10, textTransform:"uppercase" }}>
                Conectado con
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {connectedCards.map(({ conn, other }) => (
                  <div key={conn.id} style={{ background:T.accentBg,
                    border:"1px solid "+T.accent+"33", borderRadius:9,
                    padding:"7px 13px", display:"flex", gap:7, alignItems:"center" }}>
                    <span style={{ color:T.accent, fontSize:12 }}>🔗</span>
                    <div>
                      <div style={{ color:T.ink, fontSize:12, fontWeight:700 }}>{other.title}</div>
                      <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>
                        {CONN_LABELS[conn.type] || conn.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comentarios */}
          {(cardComments||[]).length > 0 && (
            <div>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10,
                letterSpacing:"0.1em", marginBottom:14, textTransform:"uppercase" }}>
                Comentarios · {cardComments.length}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {cardComments.map((c, i) => (
                  <div key={i} style={{ background:T.bgPanel, border:"1px solid "+T.border,
                    borderRadius:11, padding:"13px 16px" }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:7 }}>
                      <span style={{ color:T.accent, fontWeight:700, fontSize:13 }}>
                        @{c.author}
                      </span>
                      <span style={{ color:T.ink4, fontSize:11 }}>{fmtDate(c.createdAt)}</span>
                    </div>
                    <div style={{ color:T.ink2, fontSize:14, lineHeight:1.6 }}>{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Si está vacía */}
          {!card.body && imgs.length === 0 && files.length === 0 && (cardComments||[]).length === 0 && (
            <div style={{ textAlign:"center", padding:"30px 0", color:T.ink4 }}>
              <div style={{ fontSize:36, marginBottom:12, opacity:.3 }}>◎</div>
              <p style={{ fontSize:13, fontFamily:"var(--mono)" }}>
                Tarjeta vacía — abre ✎ para agregar contenido.
              </p>
            </div>
          )}
        </div>

        {/* ── Pie ── */}
        <div style={{ padding:"12px 20px", borderTop:"1px solid "+T.border,
          background:T.bgPanel, display:"flex", justifyContent:"flex-end",
          gap:8, flexShrink:0 }}>
          <button onClick={onClose}
            style={{ background:"none", border:"1px solid "+T.border2, color:T.ink3,
              borderRadius:8, padding:"7px 18px", fontSize:13, cursor:"pointer",
              fontFamily:"var(--sans)", transition:"all .15s" }}>
            Cerrar
          </button>
          {isOwner && (
            <button onClick={() => { onClose(); onEdit(); }}
              style={{ background:T.accent, color:"#fff", border:"none",
                borderRadius:8, padding:"7px 18px", fontSize:13, fontWeight:700,
                cursor:"pointer", fontFamily:"var(--sans)", transition:"all .15s" }}>
              ✎ Editar tarjeta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADD FORM ─────────────────────────────────────────────────────────────────
function AddForm({ col, onAdd, onCancel }) {
  const [title, setTitle]   = useState("");
  const [body, setBody]     = useState("");
  const [type, setType]     = useState("tarea");
  const [atts, setAtts]     = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  async function handleFile(e) {
    const files = Array.from(e.target.files); setLoading(true);
    const na = [];
    for (const f of files) {
      if (f.type.startsWith("image/")) { try { const {data} = await resizeImage(f); na.push({id:genId(),name:f.name,type:"image",data}); } catch { na.push({id:genId(),name:f.name,type:"image",data:null}); } }
      else { na.push({id:genId(),name:f.name,type:"file",size:f.size}); }
    }
    setAtts(p => [...p,...na]); setLoading(false); e.target.value="";
  }

  return (
    <div style={{ background:T.bgPanel, border:`1.5px solid ${T.accent}30`,
      borderRadius:12, padding:"14px", boxShadow:`0 8px 32px rgba(0,0,0,.3), 0 0 0 1px ${T.accent}08`,
      backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)" }}>
      <OInput placeholder="Título *" value={title} onChange={e=>setTitle(e.target.value)} style={{ marginBottom:9 }} autoFocus />
      <OTextarea placeholder="Descripción…" value={body} onChange={e=>setBody(e.target.value)} rows={2} style={{ marginBottom:9 }} />
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
        {CARD_TYPES.map(t => (
          <button key={t} onClick={() => setType(t)}
            style={{ background:type===t?TYPE_BG[t]:"transparent", border:"1.5px solid "+(type===t?TYPE_COLOR[t]:T.border), color:type===t?TYPE_COLOR[t]:T.ink3, fontSize:11, padding:"3px 9px", borderRadius:99, cursor:"pointer", fontFamily:"var(--mono)", transition:"all .15s" }}>
            {t}
          </button>
        ))}
      </div>
      <AttachZone atts={atts} onRemove={id=>setAtts(p=>p.filter(a=>a.id!==id))} onAdd={() => fileRef.current?.click()} loading={loading} />
      <input ref={fileRef} type="file" accept={ACCEPTED} multiple onChange={handleFile} style={{ display:"none" }} />
      <div style={{ display:"flex", gap:7, marginTop:10 }}>
        <OBtn small onClick={() => title.trim() && onAdd(col,{title,body,type,attachments:atts})}>Añadir</OBtn>
        <OGhostBtn small onClick={onCancel}>×</OGhostBtn>
      </div>
    </div>
  );
}

// ─── EDIT CARD MODAL ─────────────────────────────────────────────────────────
function EditCardModal({ card, cardComments, user, onSave, onDelete, onClose, onAddComment, allCards, onAddSticker, onUpdateSticker }) {
  const isOwner = card.author === user.name;
  const [title, setTitle]     = useState(card.title||"");
  const [body, setBody]       = useState(card.body||"");
  const [type, setType]       = useState(card.type||"tarea");
  const [atts, setAtts]       = useState(card.attachments||[]);
  const [loading, setLoading] = useState(false);
  // Non-owners start on comments tab, owners start on edit tab
  const [tab, setTab]         = useState(isOwner ? "edit" : "comments");
  const [comment, setComment] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const fileRef = useRef();

  const safeStickers = Array.isArray(card.stickers) ? card.stickers : [];
  const stickerCount = safeStickers.filter(s => s.status !== "discarded").length;

  async function handleFile(e) {
    const files = Array.from(e.target.files); setLoading(true);
    const na = [];
    for (const f of files) {
      if (f.type.startsWith("image/")) { try { const {data} = await resizeImage(f); na.push({id:genId(),name:f.name,type:"image",data}); } catch { na.push({id:genId(),name:f.name,type:"image",data:null}); } }
      else { na.push({id:genId(),name:f.name,type:"file",size:f.size}); }
    }
    setAtts(p => [...p,...na]); setLoading(false); e.target.value="";
  }

  async function submitComment() {
    if (!comment.trim()) return;
    await onAddComment(card.id, comment.trim());
    setComment("");
  }

  return (
    <OOverlay onClose={onClose}><OModalBox wide>

      {/* Header shows owner badge or read-only notice */}
      {!isOwner && (
        <div style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:8, padding:"10px 14px", marginBottom:16, display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:14 }}>👁</span>
          <div>
            <span style={{ color:T.ink2, fontSize:13, fontWeight:600 }}>Tarjeta de @{card.author}</span>
            <span style={{ color:T.ink4, fontSize:12 }}> · Puedes comentar y agregar stickers</span>
          </div>
        </div>
      )}

      {/* Tabs — Edit only visible to owner */}
      <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:"1px solid "+T.border }}>
        {[
          isOwner ? ["edit", "✎ Editar"] : null,
          ["comments", "💬 Comentarios" + (cardComments.length ? ` (${cardComments.length})` : "")],
          ["stickers", "🗂 Stickers" + (stickerCount > 0 ? ` (${stickerCount})` : "")],
        ].filter(Boolean).map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ background:"none", border:"none", borderBottom:"2px solid "+(tab===id?T.accent:"transparent"), color:tab===id?T.accent:T.ink3, padding:"8px 14px", cursor:"pointer", fontSize:13, fontWeight:tab===id?700:400, fontFamily:"var(--sans)", marginBottom:-1, transition:"all .15s" }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* READ-ONLY view of card content for non-owners */}
      {!isOwner && (
        <div style={{ background:TYPE_BG[card.type], border:"1px solid "+TYPE_COLOR[card.type]+"30", borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
          <div style={{ color:T.ink, fontWeight:700, fontSize:15, marginBottom:card.body?8:0 }}>{card.title}</div>
          {card.body && <div style={{ color:T.ink3, fontSize:13, lineHeight:1.6, fontFamily:"var(--sans)" }}>{card.body}</div>}
        </div>
      )}

      {tab==="edit" && isOwner && (
        <div>
          <OLabel>Título</OLabel>
          <OInput value={title} onChange={e=>setTitle(e.target.value)} style={{ marginBottom:12 }} autoFocus />
          <OLabel>Descripción</OLabel>
          <OTextarea value={body} onChange={e=>setBody(e.target.value)} rows={4} style={{ marginBottom:14 }} />
          <OLabel>Tipo</OLabel>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
            {CARD_TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                style={{ background:type===t?TYPE_BG[t]:"transparent", border:"1.5px solid "+(type===t?TYPE_COLOR[t]:T.border), color:type===t?TYPE_COLOR[t]:T.ink3, fontSize:12, padding:"4px 12px", borderRadius:99, cursor:"pointer", fontFamily:"var(--mono)", transition:"all .15s" }}>
                {t}
              </button>
            ))}
          </div>
          <OLabel>Adjuntos</OLabel>
          <AttachZone atts={atts} onRemove={id=>setAtts(p=>p.filter(a=>a.id!==id))} onAdd={() => fileRef.current?.click()} loading={loading} />
          <input ref={fileRef} type="file" accept={ACCEPTED} multiple onChange={handleFile} style={{ display:"none" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:18, gap:8 }}>
            {!confirmDel ? (
              <button onClick={() => setConfirmDel(true)}
                style={{ background:T.roseBg, border:"1px solid "+T.rose+"33", color:T.rose, padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontFamily:"var(--sans)" }}>
                🗑 Mover a papelera
              </button>
            ) : (
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ color:T.ink3, fontSize:12 }}>¿Confirmas?</span>
                <button onClick={() => onDelete(card.id)} style={{ background:T.rose, border:"none", color:"#fff", padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"var(--sans)" }}>Sí, mover</button>
                <button onClick={() => setConfirmDel(false)} style={{ background:T.bgPanel, border:"1px solid "+T.border, color:T.ink3, padding:"6px 10px", borderRadius:6, cursor:"pointer", fontSize:12 }}>No</button>
              </div>
            )}
            <div style={{ display:"flex", gap:8 }}>
              <OGhostBtn onClick={onClose}>Cancelar</OGhostBtn>
              <OBtn onClick={() => onSave(card.id,{title,body,type,attachments:atts})}>Guardar</OBtn>
            </div>
          </div>
        </div>
      )}

      {tab==="comments" && (
        <div>
          <div style={{ minHeight:160, maxHeight:300, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            {cardComments.length===0 && <EmptyMsg>Sin comentarios aún. Sé el primero.</EmptyMsg>}
            {cardComments.map(cm => (
              <div key={cm.id} style={{ background:cm.author===user.name?T.accentBg:T.bgPanel, border:"1px solid "+(cm.author===user.name?T.accent+"33":T.border), borderRadius:8, padding:"10px 12px" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                  <span style={{ color:cm.author===user.name?T.accent:T.ink3, fontWeight:600, fontSize:12 }}>@{cm.author}</span>
                  <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>{fmtDate(cm.ts)} {fmtTime(cm.ts)}</span>
                  {cm.author===user.name && <span style={{ marginLeft:"auto", background:T.accentBg, color:T.accent, fontSize:9, padding:"1px 6px", borderRadius:99, fontFamily:"var(--mono)" }}>tú</span>}
                </div>
                <div style={{ color:T.ink2, fontSize:13, lineHeight:1.5 }}>{cm.text}</div>
              </div>
            ))}
          </div>
          <OTextarea placeholder="Escribe un comentario…" value={comment} onChange={e=>setComment(e.target.value)} rows={3} style={{ marginBottom:10 }}
            onKeyDown={e => e.key==="Enter" && e.metaKey && submitComment()} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>⌘+Enter para enviar</span>
            <OBtn onClick={submitComment} disabled={!comment.trim()}>Comentar</OBtn>
          </div>
        </div>
      )}

      {tab==="stickers" && (
        <StickerTree
          card={{ ...card, stickers: safeStickers }}
          user={user}
          onAdd={onAddSticker}
          onUpdate={onUpdateSticker}
        />
      )}
    </OModalBox></OOverlay>
  );
}

// ─── STICKER TREE ─────────────────────────────────────────────────────────────
function StickerTree({ card, user, onAdd, onUpdate }) {
  const stickers = card.stickers || [];
  const roots = stickers.filter(s => !s.parentId).sort((a, b) => a.ts - b.ts);

  return (
    <div>
      {/* Explanation */}
      <div style={{ background:T.accentBg, border:"1px solid "+T.accent+"33", borderRadius:8, padding:"10px 14px", marginBottom:16, display:"flex", gap:8 }}>
        <span style={{ color:T.accent, fontSize:14, flexShrink:0 }}>🗂</span>
        <p style={{ color:T.accent, fontSize:12, lineHeight:1.5 }}>
          Los stickers son anotaciones de otros usuarios conectadas a esta tarjeta. Se organizan en árbol — cada sticker puede recibir respuestas.
        </p>
      </div>

      {/* Card summary (what this is attached to) */}
      <div style={{ background:TYPE_BG[card.type], border:"1px solid "+TYPE_COLOR[card.type]+"30", borderRadius:8, padding:"10px 14px", marginBottom:16 }}>
        <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginBottom:3 }}>TARJETA ORIGINAL · @{card.author}</div>
        <div style={{ color:T.ink, fontWeight:700, fontSize:14 }}>{card.title}</div>
        {card.body && <div style={{ color:T.ink3, fontSize:12, marginTop:3, lineHeight:1.4 }}>{card.body}</div>}
      </div>

      {/* Add root sticker */}
      <AddStickerForm parentId={null} onAdd={onAdd} user={user} autoOpen={stickers.length === 0} />

      {/* Tree */}
      {roots.length > 0 && (
        <div style={{ marginTop:12 }}>
          {roots.map(s => (
            <StickerNode key={s.id} sticker={s} allStickers={stickers} user={user} onAdd={onAdd} onUpdate={onUpdate} depth={0} />
          ))}
        </div>
      )}

      {stickers.length === 0 && (
        <div style={{ textAlign:"center", padding:"16px 0", color:T.ink4, fontFamily:"var(--mono)", fontSize:12 }}>
          Sin stickers aún. Sé el primero en agregar una opinión, complemento o pregunta.
        </div>
      )}
    </div>
  );
}

function StickerNode({ sticker, allStickers, user, onAdd, onUpdate, depth }) {
  const [replying, setReplying] = useState(false);
  const children = allStickers.filter(s => s.parentId === sticker.id).sort((a, b) => a.ts - b.ts);
  const color = STICKER_COLOR[sticker.type] || T.blue;
  const icon  = STICKER_ICON[sticker.type]  || "💬";
  const isDiscarded = sticker.status === "discarded";

  const bgColor = isDiscarded ? "#F9F9F9" : color + "0A";
  const borderColor = isDiscarded ? T.border : color + "44";

  return (
    <div style={{ marginLeft: depth > 0 ? 20 : 0, marginTop: 8, position:"relative" }}>
      {/* Connector line from parent */}
      {depth > 0 && (
        <div style={{ position:"absolute", left:-13, top:0, bottom:0, width:1, background:T.border }} />
      )}
      {depth > 0 && (
        <div style={{ position:"absolute", left:-13, top:18, width:10, height:1, background:T.border }} />
      )}

      {/* Sticker card */}
      <div style={{
        border:"1px solid "+borderColor,
        background:bgColor,
        borderRadius:8,
        padding:"10px 12px",
        opacity: isDiscarded ? 0.5 : 1,
      }}>
        {/* Header row */}
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7, flexWrap:"wrap" }}>
          <span style={{ fontSize:14 }}>{icon}</span>
          <span style={{ background:color+"22", color, fontFamily:"var(--mono)", fontSize:10, padding:"1px 7px", borderRadius:99, fontWeight:600 }}>{sticker.type}</span>
          <span style={{ color:color, fontWeight:700, fontSize:12 }}>@{sticker.author}</span>
          {sticker.author === user.name && (
            <span style={{ background:T.accentBg, color:T.accent, fontSize:9, padding:"1px 5px", borderRadius:99, fontFamily:"var(--mono)" }}>tú</span>
          )}
          <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginLeft:"auto" }}>{fmtDate(sticker.ts)}</span>
          {sticker.status === "approved" && <span style={{ background:T.greenBg, color:T.green, fontFamily:"var(--mono)", fontSize:9, padding:"1px 6px", borderRadius:99 }}>✓</span>}
          {sticker.status === "discarded" && <span style={{ background:T.roseBg, color:T.rose, fontFamily:"var(--mono)", fontSize:9, padding:"1px 6px", borderRadius:99 }}>✕</span>}
        </div>

        {/* Content */}
        <div style={{ color: isDiscarded ? T.ink4 : T.ink2, fontSize:13, lineHeight:1.6, marginBottom:8 }}>{sticker.text}</div>

        {/* Actions */}
        {!isDiscarded && (
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {sticker.status === "pending" && (
              <>
                <button onClick={() => onUpdate(sticker.id, "approved")}
                  style={{ background:T.greenBg, border:"1px solid "+T.green+"44", color:T.green, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"var(--sans)" }}>
                  ✓ Aprobar
                </button>
                <button onClick={() => onUpdate(sticker.id, "discarded")}
                  style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", color:T.rose, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"var(--sans)" }}>
                  ✕ Descartar
                </button>
              </>
            )}
            {sticker.status === "approved" && (
              <button onClick={() => onUpdate(sticker.id, "discarded")}
                style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", color:T.rose, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"var(--sans)" }}>
                ✕ Descartar
              </button>
            )}
            <button onClick={() => setReplying(r => !r)}
              style={{ background:T.bgPanel, border:"1px solid "+T.border, color:T.ink3, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"var(--sans)", display:"flex", alignItems:"center", gap:4, transition:"all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.color=color; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.ink3; }}>
              ↳ {children.length > 0 ? `Responder (${children.length})` : "Responder"}
            </button>
          </div>
        )}

        {/* Reply form */}
        {replying && (
          <div style={{ marginTop:10 }}>
            <AddStickerForm parentId={sticker.id} onAdd={onAdd} user={user} onCancel={() => setReplying(false)} compact />
          </div>
        )}
      </div>

      {/* Children recursively */}
      {children.map(child => (
        <StickerNode key={child.id} sticker={child} allStickers={allStickers} user={user} onAdd={onAdd} onUpdate={onUpdate} depth={depth + 1} />
      ))}
    </div>
  );
}

function AddStickerForm({ parentId, onAdd, user, onCancel, compact, autoOpen }) {
  const [open, setOpen] = useState(autoOpen || compact || false);
  const [text, setText] = useState("");
  const [type, setType] = useState("opinión");

  async function submit() {
    if (!text.trim()) return;
    await onAdd(parentId, { type, text: text.trim() });
    setText("");
    setType("opinión");
    if (compact) { onCancel && onCancel(); } else { setOpen(false); }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ background:T.accentBg, border:"1.5px dashed "+T.accent+"55", color:T.accent, padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"var(--sans)", width:"100%", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
        onMouseEnter={e => e.currentTarget.style.background = "#EDE9FF"}
        onMouseLeave={e => e.currentTarget.style.background = T.accentBg}>
        + Agregar sticker a esta tarjeta
      </button>
    );
  }

  return (
    <div style={{ background:T.bgCard, border:"1.5px solid "+T.accent+"55", borderRadius:9, padding:"12px", boxShadow:"0 2px 8px rgba(0,0,0,.08)", marginTop: compact ? 0 : 0 }}>
      {!compact && (
        <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:8 }}>NUEVO STICKER</div>
      )}
      {/* Type selector */}
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
        {STICKER_TYPES.map(t => {
          const c = STICKER_COLOR[t];
          const sel = type === t;
          return (
            <button key={t} onClick={() => setType(t)}
              style={{ background:sel?c+"22":"transparent", border:"1.5px solid "+(sel?c:T.border), color:sel?c:T.ink3, fontSize:11, padding:"3px 9px", borderRadius:99, cursor:"pointer", fontFamily:"var(--mono)", transition:"all .15s", display:"flex", alignItems:"center", gap:3 }}>
              {STICKER_ICON[t]} {t}
            </button>
          );
        })}
      </div>
      <OTextarea
        placeholder={
          type === "opinión"     ? "Tu opinión sobre esta tarjeta…" :
          type === "complemento" ? "Algo que complementa esta idea…" :
          type === "pregunta"    ? "Una pregunta para el autor…" :
          type === "objeción"    ? "Una objeción o punto de tensión…" :
                                   "Una referencia útil…"
        }
        value={text}
        onChange={e => setText(e.target.value)}
        rows={compact ? 2 : 3}
        style={{ marginBottom:8 }}
      />
      <div style={{ display:"flex", gap:7, alignItems:"center" }}>
        <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, flex:1 }}>@{user.name}</span>
        <OBtn small onClick={submit} disabled={!text.trim()}>Agregar sticker</OBtn>
        {(compact || !autoOpen) && <OGhostBtn small onClick={() => { setOpen(false); onCancel && onCancel(); }}>×</OGhostBtn>}
      </div>
    </div>
  );
}

// ─── TRASH PANEL ──────────────────────────────────────────────────────────────
function TrashPanel({ cards, onRestore, onDelete, onClose }) {
  return (
    <OOverlay onClose={onClose}><OModalBox wide>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
        <span style={{ fontSize:20 }}>🗑</span>
        <h2 style={{ color:T.ink, fontSize:18, fontWeight:800 }}>Papelera</h2>
        <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:11, marginLeft:"auto" }}>{cards.length} elemento{cards.length!==1?"s":""}</span>
      </div>
      {cards.length===0 && <EmptyMsg>La papelera está vacía</EmptyMsg>}
      <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:400, overflowY:"auto" }}>
        {cards.map(card => (
          <div key={card.id} style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:8, padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ color:T.ink2, fontWeight:600, fontSize:13 }}>{card.title}</div>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginTop:2 }}>
                eliminada {fmtDate(card.deletedAt)} · @{card.author}
              </div>
            </div>
            <button onClick={() => onRestore(card.id)}
              style={{ background:T.greenBg, border:"1px solid "+T.green+"33", color:T.green, padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"var(--sans)" }}>
              ↩ Restaurar
            </button>
            <button onClick={() => onDelete(card.id)}
              style={{ background:T.roseBg, border:"1px solid "+T.rose+"33", color:T.rose, padding:"6px 10px", borderRadius:6, cursor:"pointer", fontSize:12 }}>
              ×
            </button>
          </div>
        ))}
      </div>
      <p style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:11, marginTop:14 }}>Las tarjetas en papelera no se ven en el tablero. Puedes restaurarlas o eliminarlas permanentemente.</p>
    </OModalBox></OOverlay>
  );
}

// ─── CONNECTIONS PANEL ───────────────────────────────────────────────────────
// Module-level constants (not inside any component)
const CONN_TYPE_LABELS  = { complementa:"Complementa", secuencia:"Secuencia", contraste:"Contraste", refuerza:"Refuerza" };
const CONN_TYPE_COLORS  = { complementa:T.accent, secuencia:T.green, contraste:T.orange, refuerza:T.blue };
const CONN_ALL_TYPES    = ["complementa","secuencia","contraste","refuerza"];

// ConnCard is a standalone component — NOT nested inside ConnectionsPanel
function ConnCard({ conn, cards, connections, onUpdate, onAddAsTask }) {
  const ca = cards.find(c => c.id===conn.cardA);
  const cb = cards.find(c => c.id===conn.cardB);
  if (!ca || !cb) return null;

  const [editing, setEditing]           = useState(false);
  const [editReason, setEditReason]     = useState(conn.reason || "");
  const [editNote, setEditNote]         = useState(conn.note || "");
  const [editType, setEditType]         = useState(conn.type || "complementa");
  const [editStrength, setEditStrength] = useState(conn.strength || 7);

  const color     = CONN_TYPE_COLORS[conn.type] || T.accent;
  const editColor = CONN_TYPE_COLORS[editType]  || T.accent;

  async function doUpdateStatus(connId, newStatus) {
    await onUpdate(connections.map(c => c.id===connId ? {...c, status:newStatus} : c));
  }

  async function saveEdit() {
    await onUpdate(connections.map(c =>
      c.id === conn.id
        ? { ...c, type:editType, reason:editReason, note:editNote, strength:editStrength, editedAt:nowTs() }
        : c
    ));
    setEditing(false);
  }

  function cancelEdit() {
    setEditing(false);
    setEditReason(conn.reason || "");
    setEditNote(conn.note || "");
    setEditType(conn.type || "complementa");
    setEditStrength(conn.strength || 7);
  }

  return (
    <div className="conn-card" style={{ background:"rgba(17,17,40,0.8)",
      border:`1px solid ${conn.status==="approved"?T.green+"44":"rgba(255,255,255,0.08)"}`,
      borderRadius:12, padding:"15px",
      boxShadow:conn.status==="approved"?`0 0 0 1px ${T.green}22`:"none",
      backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
        {editing ? (
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", flex:1 }}>
            {CONN_ALL_TYPES.map(t => (
              <button key={t} onClick={() => setEditType(t)}
                style={{ background:editType===t?`${CONN_TYPE_COLORS[t]}22`:"transparent", border:`1.5px solid ${editType===t?CONN_TYPE_COLORS[t]:T.border}`, color:editType===t?CONN_TYPE_COLORS[t]:T.ink3, fontSize:11, padding:"3px 10px", borderRadius:99, cursor:"pointer", fontFamily:"var(--mono)", transition:"all .15s" }}>
                {CONN_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        ) : (
          <>
            <span style={{ background:color+"20", color, fontFamily:"var(--mono)", fontSize:10, padding:"2px 8px", borderRadius:99, fontWeight:600 }}>{CONN_TYPE_LABELS[conn.type]||conn.type}</span>
            <div style={{ flex:1, height:1, background:color+"33" }} />
            <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>⚡{conn.strength}/10</span>
          </>
        )}
      </div>

      {/* Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:8, alignItems:"start", marginBottom:10 }}>
        <div style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:7, padding:"8px 10px" }}>
          <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:9, marginBottom:3 }}>@{ca.author}</div>
          <div style={{ color:T.ink2, fontWeight:600, fontSize:12, lineHeight:1.3 }}>{ca.title}</div>
        </div>
        <span style={{ color:editing?editColor:color, fontSize:16, alignSelf:"center" }}>⇄</span>
        <div style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:7, padding:"8px 10px" }}>
          <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:9, marginBottom:3 }}>@{cb.author}</div>
          <div style={{ color:T.ink2, fontWeight:600, fontSize:12, lineHeight:1.3 }}>{cb.title}</div>
        </div>
      </div>

      {/* Reason */}
      {editing ? (
        <div style={{ marginBottom:10 }}>
          <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:5 }}>RAZÓN</div>
          <textarea value={editReason} onChange={e=>setEditReason(e.target.value)} rows={2}
            style={{ background:T.bgCard, border:"1.5px solid "+T.border2, color:T.ink, padding:"8px 10px", borderRadius:7, fontFamily:"var(--mono)", fontSize:12, width:"100%", outline:"none", resize:"vertical", lineHeight:1.5 }}
            onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border2}/>
        </div>
      ) : (
        <div style={{ color:T.ink3, fontSize:12, lineHeight:1.4, marginBottom:conn.note?8:10, padding:"8px 10px", background:T.bgPanel, border:"1px solid "+color+"28", borderRadius:6 }}>{conn.reason}</div>
      )}

      {/* Note / Complement */}
      {editing ? (
        <div style={{ marginBottom:12 }}>
          <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:5 }}>COMPLEMENTO (opcional)</div>
          <textarea value={editNote} onChange={e=>setEditNote(e.target.value)} rows={2}
            placeholder="Agrega contexto o matices…"
            style={{ background:T.bgCard, border:"1.5px solid "+T.border2, color:T.ink, padding:"8px 10px", borderRadius:7, fontFamily:"var(--mono)", fontSize:12, width:"100%", outline:"none", resize:"vertical", lineHeight:1.5 }}
            onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border2}/>
          <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginTop:6 }}>
            Fuerza: {editStrength}/10 &nbsp;
            <input type="range" min={1} max={10} value={editStrength} onChange={e=>setEditStrength(Number(e.target.value))}
              style={{ verticalAlign:"middle", width:90, accentColor:T.accent }}/>
          </div>
        </div>
      ) : conn.note ? (
        <div style={{ color:T.ink2, fontSize:12, lineHeight:1.5, marginBottom:10, padding:"8px 10px", background:T.accentBg, border:"1px solid "+T.accent+"30", borderRadius:6, fontStyle:"italic" }}>
          <span style={{ color:T.accent, fontFamily:"var(--mono)", fontSize:9, letterSpacing:1, display:"block", marginBottom:3, fontStyle:"normal" }}>COMPLEMENTO</span>
          {conn.note}
        </div>
      ) : null}

      {conn.editedAt && !editing && (
        <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginBottom:8 }}>Editada {fmtDate(conn.editedAt)}</div>
      )}

      {/* Actions */}
      {editing ? (
        <div style={{ display:"flex", gap:7 }}>
          <button onClick={cancelEdit} style={{ background:T.bgPanel, border:"1px solid "+T.border2, color:T.ink3, padding:"7px 14px", borderRadius:7, cursor:"pointer", fontSize:12, fontFamily:"var(--sans)" }}>Cancelar</button>
          <button onClick={saveEdit} style={{ flex:1, background:T.accent, border:"none", color:"#fff", padding:"7px 14px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"var(--sans)" }}>Guardar</button>
        </div>
      ) : (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {conn.status==="pending" && <>
            <button onClick={()=>doUpdateStatus(conn.id,"approved")} style={{ flex:1, background:T.greenBg, border:"1px solid "+T.green+"44", color:T.green, padding:"7px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"var(--sans)" }}>✓ Aprobar</button>
            <button onClick={()=>doUpdateStatus(conn.id,"review")}   style={{ flex:1, background:T.amberBg, border:"1px solid "+T.amber+"44", color:T.amber, padding:"7px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"var(--sans)" }}>👁 Revisar</button>
            <button onClick={()=>doUpdateStatus(conn.id,"discarded")} style={{ flex:1, background:T.roseBg, border:"1px solid "+T.rose+"44", color:T.rose, padding:"7px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"var(--sans)" }}>✕ Descartar</button>
          </>}
          {conn.status==="review" && <>
            <button onClick={()=>doUpdateStatus(conn.id,"approved")}  style={{ background:T.greenBg, border:"1px solid "+T.green+"44", color:T.green, padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"var(--sans)" }}>✓ Aprobar</button>
            <button onClick={()=>doUpdateStatus(conn.id,"discarded")} style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", color:T.rose, padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:12, fontFamily:"var(--sans)" }}>✕ Descartar</button>
            <span style={{ background:T.amberBg, color:T.amber, fontFamily:"var(--mono)", fontSize:10, padding:"3px 10px", borderRadius:99, alignSelf:"center" }}>👁 En revisión</span>
          </>}
          {conn.status==="approved" && <>
            <span style={{ background:T.greenBg, color:T.green, fontFamily:"var(--mono)", fontSize:10, padding:"3px 10px", borderRadius:99, alignSelf:"center" }}>✓ Aprobada</span>
            <button onClick={()=>doUpdateStatus(conn.id,"review")} style={{ background:T.amberBg, border:"1px solid "+T.amber+"44", color:T.amber, padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"var(--sans)" }}>↩ Desaprobar</button>
          </>}
          {conn.status==="discarded" && (
            <button onClick={()=>doUpdateStatus(conn.id,"pending")} style={{ background:T.bgPanel, border:"1px solid "+T.border2, color:T.ink3, padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"var(--sans)" }}>↩ Recuperar</button>
          )}
          {conn.status !== "discarded" && (
            <button onClick={()=>setEditing(true)}
              style={{ background:T.bgPanel, border:"1px solid "+T.border2, color:T.ink3, padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"var(--sans)", transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.color=T.ink3;}}>
              ✎ Editar
            </button>
          )}
          {conn.status !== "discarded" && (
            <button onClick={()=>onAddAsTask(conn)} style={{ background:T.accentBg, border:"1px solid "+T.accent+"44", color:T.accent, padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"var(--sans)" }}>
              + Tarea
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ConnectionsPanel({ cards, connections, onUpdate, onClose, cat, concept, onAddAsTask }) {
  const [status, setStatus]       = useState("idle");
  const [error, setError]         = useState("");
  const [countdown, setCountdown] = useState(0);       // seconds for rate_limit
  const [quotaMs, setQuotaMs]     = useState(0);       // ms remaining until midnight UTC
  const countdownRef              = useRef(null);
  const pending   = connections.filter(c => c.status==="pending");
  const approved  = connections.filter(c => c.status==="approved");
  const inReview  = connections.filter(c => c.status==="review");
  const discarded = connections.filter(c => c.status==="discarded");

  // Rate-limit countdown — tick every second, reset to idle at 0
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown(n => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [countdown > 0]);

  // When rate_limit countdown reaches 0, re-enable button
  useEffect(() => {
    if (countdown === 0 && status === "rate_limit") setStatus("idle");
  }, [countdown]);

  // Daily quota — tick every second until midnight UTC then auto-reset
  useEffect(() => {
    if (status !== "daily_quota") return;
    setQuotaMs(msUntilMidnightUTC());
    const id = setInterval(() => {
      const ms = msUntilMidnightUTC();
      setQuotaMs(ms);
      if (ms <= 0) setStatus("idle");
    }, 1000);
    return () => clearInterval(id);
  }, [status === "daily_quota"]);

  async function findConnections() {
    if (cards.length < 2) { setError("Necesitas al menos 2 tarjetas."); return; }
    setStatus("loading"); setError(""); setCountdown(0);
    const cardTexts = cards.map(c => `ID:${c.id} | [${c.col}][${c.type}] TÍTULO: "${c.title}"${c.body?" | DESC: "+c.body:""}`).join("\n");
    const prompt = `Eres un analista de ideas. Analiza las tarjetas del proyecto "${concept.title||"sin nombre"}" y detecta conexiones conceptuales reales entre pares.\n\nTARJETAS:\n${cardTexts}\n\nResponde SOLO con JSON válido:\n{"connections":[{"cardA":"id1","cardB":"id2","type":"complementa|secuencia|contraste|refuerza","reason":"Explicación breve (máx 120 caracteres)","strength":8}]}\n\nstrength de 1-10. Solo incluye conexiones con strength >= 6. Máximo 8.`;
    try {
      const txt = await callAI("Detectas conexiones conceptuales entre ideas. Respondes ÚNICAMENTE con JSON válido.", prompt, 800);
      const clean = txt.trim().replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      const findCard = (id) => cards.find(c => c.id===id);
      const newConns = (parsed.connections||[]).map(c => ({...c, id:genId(), status:"pending", createdAt:nowTs()})).filter(c => findCard(c.cardA) && findCard(c.cardB));
      const existingIds = new Set(connections.map(c=>c.cardA+"-"+c.cardB));
      const fresh = newConns.filter(c => !existingIds.has(c.cardA+"-"+c.cardB) && !existingIds.has(c.cardB+"-"+c.cardA));
      await onUpdate([...connections, ...fresh]);
      setStatus(fresh.length>0?"done":"none");
    } catch(e) {
      if (e.code==="NO_KEY"||e.code==="INVALID_KEY") { setStatus("no_key"); }
      else if (e.code==="RATE_LIMIT")   { setStatus("rate_limit"); setError(e.detail||""); setCountdown(65); }
      else if (e.code==="DAILY_QUOTA") { setStatus("daily_quota"); setError(e.detail||""); }
      else { setStatus("error"); setError(e.detail || "Error al analizar. Intenta de nuevo."); }
    }
  }

  function renderGroup(title, list, badge) {
    if (!list.length) return null;
    return (
      <div style={{ marginBottom:20 }}>
        <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
          {title}
          {badge && <span style={{ background:T.amberBg, color:T.amber, padding:"1px 7px", borderRadius:99, fontSize:9 }}>{list.length}</span>}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {list.map(c => <ConnCard key={c.id} conn={c} cards={cards} connections={connections} onUpdate={onUpdate} onAddAsTask={onAddAsTask} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,5,.65)", display:"flex", alignItems:"flex-end", justifyContent:"flex-end", zIndex:200, WebkitBackdropFilter:"blur(8px)", backdropFilter:"blur(8px)", padding:20 }}>
      <div style={{ background:T.bgPanel, border:`1px solid rgba(232,82,0,0.18)`,
        borderRadius:16, width:"100%", maxWidth:530, maxHeight:"90vh", display:"flex", flexDirection:"column",
        boxShadow:"0 30px 80px rgba(0,0,0,.55), 0 0 40px rgba(232,82,0,0.06)",
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        animation:"slideIn .3s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ padding:"17px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:17 }}>💡</span>
              <span style={{ color:T.ink, fontWeight:800, fontSize:15 }}>Conexiones entre ideas</span>
            </div>
            <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginTop:2, letterSpacing:"0.03em" }}>
              {pending.length} pendiente · {approved.length} aprobada · {inReview.length} en revisión · {discarded.length} descartada
            </div>
          </div>
          <OGhostBtn small onClick={onClose}>× Cerrar</OGhostBtn>
        </div>
        <div style={{ background:T.accentBg, borderBottom:`1px solid ${T.accent}14`, padding:"10px 18px", display:"flex", gap:8 }}>
          <span style={{ color:T.accent, fontSize:13, flexShrink:0 }}>ℹ</span>
          <p style={{ color:T.ink3, fontSize:12, lineHeight:1.5 }}>Las conexiones se guardan permanentemente. Las aprobadas muestran 🔗 en las tarjetas.</p>
        </div>
        <div style={{ flex:1, overflow:"auto", padding:"16px 18px" }}>
          {status==="no_key" ? (
            <AIKeySetup onSaved={() => setStatus("idle")} />
          ) : (
          <>
          <OBtn full onClick={findConnections} disabled={status==="loading" || status==="rate_limit" || status==="daily_quota"}>
            {status==="loading" ? "🔍 Analizando…" : status==="rate_limit" ? `⏳ Disponible en ${countdown}s` : "🔍 Buscar nuevas conexiones con IA"}
          </OBtn>
          <div style={{ height:12 }}/>
          {status==="loading" && (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div className="spinner" style={{ width:24, height:24, border:"3px solid "+T.border, borderTop:"3px solid "+cat.color, borderRadius:"50%", margin:"0 auto 12px" }} />
              <p style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:12 }}>Analizando conexiones conceptuales…</p>
            </div>
          )}
          {status==="none" && <div style={{ background:T.amberBg, border:"1px solid "+T.amber+"44", borderRadius:8, padding:"12px", color:T.amber, fontSize:13, marginBottom:14 }}>No se encontraron conexiones nuevas significativas.</div>}
          {status==="rate_limit" && (
            <div style={{ background:T.amberBg, border:`1px solid ${T.amber}44`, borderRadius:8, padding:"12px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ color:T.amber, fontSize:13, fontWeight:600, marginBottom:3 }}>⏳ Límite por minuto alcanzado</div>
                <div style={{ color:T.ink3, fontFamily:"var(--mono)", fontSize:11 }}>El botón se reactiva automáticamente en {countdown}s.</div>
              </div>
              <div style={{ color:T.accent, fontFamily:"var(--mono)", fontSize:22, fontWeight:700, flexShrink:0, minWidth:36, textAlign:"center" }}>{countdown}</div>
            </div>
          )}
          {status==="daily_quota" && (
            <div style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", borderRadius:8, padding:"12px 14px", marginBottom:14 }}>
              <div style={{ color:T.rose, fontSize:13, fontWeight:600, marginBottom:4 }}>📊 Cupo diario agotado</div>
              <div style={{ color:T.ink3, fontFamily:"var(--mono)", fontSize:11, lineHeight:1.6 }}>
                El cupo gratuito de Gemini se reinicia a medianoche UTC.<br/>
                <span style={{ color:T.amber, fontWeight:700 }}>Tiempo restante: {fmtCountdownHM(quotaMs)}</span><br/>
                El botón se reactiva automáticamente al llegar a 0.
              </div>
              <button onClick={() => setStatus("idle")} style={{ marginTop:8, background:"none", border:"1px solid "+T.rose+"44", color:T.rose, padding:"4px 10px", borderRadius:5, cursor:"pointer", fontSize:11, fontFamily:"var(--mono)" }}>Reintentar ahora</button>
            </div>
          )}
          {status==="error" && error && <div style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", borderRadius:8, padding:"12px", color:T.rose, fontSize:13, marginBottom:14 }}>{error}</div>}
          {status==="done" && <div style={{ background:T.greenBg, border:"1px solid "+T.green+"44", borderRadius:8, padding:"12px", color:T.green, fontSize:13, marginBottom:14 }}>✓ Nuevas conexiones encontradas.</div>}
          {renderGroup("PENDIENTES DE REVISIÓN", pending, true)}
          {renderGroup("EN REVISIÓN", inReview, false)}
          {renderGroup("APROBADAS", approved, false)}
          {renderGroup("DESCARTADAS", discarded, false)}
          {connections.length===0 && status==="idle" && (
            <div style={{ textAlign:"center", padding:"20px 0", color:T.ink4, fontSize:13 }}>
              <div style={{ fontSize:32, marginBottom:12, opacity:.3 }}>💡</div>
              <p style={{ marginBottom:8 }}>Aún no hay conexiones detectadas.</p>
              <p style={{ fontFamily:"var(--mono)", fontSize:11, lineHeight:1.6 }}>La IA analiza todas las tarjetas y encuentra pares con conexión conceptual real.</p>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EDIT CONCEPT ─────────────────────────────────────────────────────────────
function EditConceptModal({ concept, onSave, onClose, cat }) {
  const [title, setTitle] = useState(concept.title||"");
  const [desc, setDesc]   = useState(concept.desc||"");
  return (
    <OOverlay onClose={onClose}><OModalBox wide>
      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:18 }}>
        <div style={{ width:4, height:22, background:cat.color, borderRadius:2 }} />
        <h2 style={{ color:T.ink, fontSize:20, fontWeight:800 }}>Concepto base</h2>
      </div>
      <OLabel>Idea central *</OLabel>
      <OInput value={title} onChange={e=>setTitle(e.target.value)} placeholder="La idea en una frase…" style={{ marginBottom:12 }} autoFocus />
      <OLabel>Descripción / contexto</OLabel>
      <OTextarea value={desc} onChange={e=>setDesc(e.target.value)} rows={5} placeholder="¿Qué resuelve? ¿Para quién? ¿Diferenciación?…" style={{ marginBottom:18 }} />
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <OGhostBtn onClick={onClose}>Cancelar</OGhostBtn>
        <OBtn onClick={() => title.trim() && onSave({title,desc})}>Guardar concepto</OBtn>
      </div>
    </OModalBox></OOverlay>
  );
}

// ─── AI PANEL ─────────────────────────────────────────────────────────────────
function AIPanel({ board, concept, cards, cat, onClose }) {
  const [status, setStatus]       = useState("idle");
  const [result, setResult]       = useState("");
  const [scores, setScores]       = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [quotaMs, setQuotaMs]     = useState(0);
  const countdownRef              = useRef(null);

  // Rate-limit countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown(n => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [countdown > 0]);

  useEffect(() => {
    if (countdown === 0 && status === "rate_limit") setStatus("idle");
  }, [countdown]);

  // Daily quota — countdown to midnight UTC, auto-reset when it arrives
  useEffect(() => {
    if (status !== "daily_quota") return;
    setQuotaMs(msUntilMidnightUTC());
    const id = setInterval(() => {
      const ms = msUntilMidnightUTC();
      setQuotaMs(ms);
      if (ms <= 0) setStatus("idle");
    }, 1000);
    return () => clearInterval(id);
  }, [status === "daily_quota"]);

  async function run() {
    setStatus("loading"); setResult(""); setScores(null); setCountdown(0);
    const cardText = cards.length ? cards.map(c => `- [${c.col}][${c.type}] ${c.title}${c.body?": "+c.body:""}`).join("\n") : "Sin tarjetas.";
    const prompt = `Analiza este proyecto con criterio profesional y honesto.\n\nPROYECTO: "${board.name}"\nCATEGORÍA: ${cat.label}${board.subcategories?.length?" > "+board.subcategories.join(", "):""}\n\nCONCEPTO BASE:\n${concept.title||"Sin definir"}\n${concept.desc||""}\n\nTARJETAS:\n${cardText}\n\nAnaliza: 1) Potencial real 2) Debilidades 3) Viabilidad 4) Oportunidad 5) Mejoras 6) Recomendación.\n\nTermina con:\n\`\`\`json\n{"potencial":7,"viabilidad":6,"diferenciacion":5,"madurez":4,"recomendacion":"seguir"}\n\`\`\``;
    try {
      const txt = await callAI(cat.expert, prompt, 1000);
      const jm = txt.match(/```json\s*([\s\S]*?)```/);
      if (jm) { try { setScores(JSON.parse(jm[1])); } catch {} }
      setResult(txt.replace(/```json[\s\S]*?```/g,"").trim());
      setStatus("done");
    } catch(e) {
      if (e.code === "NO_KEY" || e.code === "INVALID_KEY") { setStatus("no_key"); }
      else if (e.code === "RATE_LIMIT")   { setStatus("rate_limit"); setResult(e.detail||""); setCountdown(65); }
      else if (e.code === "DAILY_QUOTA") { setStatus("daily_quota"); setResult(e.detail||""); }
      else { setStatus("error"); setResult(e.detail || "Error al conectar con la IA. Intenta de nuevo."); }
    }
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,5,.65)", display:"flex", alignItems:"flex-end", justifyContent:"flex-end", zIndex:200, WebkitBackdropFilter:"blur(8px)", backdropFilter:"blur(8px)", padding:20 }}>
      <div style={{ background:"rgba(13,13,30,0.95)", border:`1px solid ${cat.color}33`,
        borderRadius:16, width:"100%", maxWidth:490, maxHeight:"88vh", display:"flex", flexDirection:"column",
        boxShadow:`0 30px 80px rgba(0,0,0,.6), 0 0 40px ${cat.color}12`,
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        animation:"slideIn .3s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ padding:"17px 20px 12px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ color:cat.color, fontSize:16 }}>✦</span>
              <span style={{ color:T.ink, fontWeight:800, fontSize:15 }}>Análisis IA</span>
            </div>
            <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginTop:1 }}>Experto en {cat.label.replace(/^.{2}/,"").trim()}</div>
          </div>
          <OGhostBtn small onClick={onClose}>× Cerrar</OGhostBtn>
        </div>
        <div style={{ flex:1, overflow:"auto", padding:"18px" }}>
          {status==="no_key" && <AIKeySetup onSaved={() => setStatus("idle")} />}
          {status==="idle" && (
            <div style={{ textAlign:"center", padding:"12px 0" }}>
              <div style={{ width:56, height:56, background:cat.colorBg, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", border:"1px solid "+T.border, fontSize:24 }}>{cat.label.split(" ")[0]}</div>
              <p style={{ color:T.ink3, fontSize:13, lineHeight:1.6, marginBottom:20 }}>Analiza el proyecto con criterio de experto. Sin complacencia.</p>
              <OBtn full onClick={run} disabled={status==="rate_limit"}>
                {status==="rate_limit" ? `⏳ Esperando ${countdown}s…` : "Analizar proyecto →"}
              </OBtn>
            </div>
          )}
          {status==="loading" && (
            <div style={{ textAlign:"center", padding:"44px 0" }}>
              <div style={{ position:"relative", width:48, height:48, margin:"0 auto 18px" }}>
                <div className="spinner" style={{ width:48, height:48, border:`3px solid ${cat.color}22`, borderTop:`3px solid ${cat.color}`, borderRadius:"50%", position:"absolute", inset:0 }} />
                <div style={{ width:16, height:16, background:cat.color+"33", borderRadius:"50%", position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
              </div>
              <p style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:12, letterSpacing:"0.05em" }}>Analizando…</p>
            </div>
          )}
          {status==="rate_limit" && (
            <div style={{ background:T.amberBg, border:`1px solid ${T.amber}44`, borderRadius:12, padding:"20px", textAlign:"center", marginBottom:14 }}>
              <div style={{ color:T.accent, fontWeight:700, fontSize:14, marginBottom:6 }}>⏳ Límite por minuto</div>
              <div style={{ color:T.ink3, fontSize:12, lineHeight:1.55, marginBottom:16 }}>El botón se reactiva automáticamente.</div>
              <div style={{ color:T.accent, fontFamily:"var(--mono)", fontSize:28, fontWeight:900, marginBottom:4 }}>{countdown}</div>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10 }}>segundos</div>
            </div>
          )}
          {status==="daily_quota" && (
            <div style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", borderRadius:12, padding:"20px", textAlign:"center", marginBottom:14 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📊</div>
              <div style={{ color:T.rose, fontWeight:700, fontSize:14, marginBottom:8 }}>Cupo diario agotado</div>
              <div style={{ color:T.ink3, fontSize:12, lineHeight:1.6, marginBottom:10 }}>El cupo gratuito de Gemini se reinicia a medianoche UTC.</div>
              <div style={{ color:T.amber, fontFamily:"var(--mono)", fontSize:22, fontWeight:700, marginBottom:4 }}>{fmtCountdownHM(quotaMs)}</div>
              <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, marginBottom:14 }}>hasta el reinicio — se activa solo</div>
              <button onClick={() => setStatus("idle")} style={{ background:"none", border:"1px solid "+T.rose+"44", color:T.rose, padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"var(--mono)" }}>Reintentar ahora</button>
            </div>
          )}
          {(status==="done"||status==="error") && (
            <div>
              {scores && (
                <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"16px", marginBottom:20 }}>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                    {[["potencial","Potencial"],["viabilidad","Viabilidad"],["diferenciacion","Diferenc."],["madurez","Madurez"]].map(([k,l]) => (
                      <div key={k} style={{ flex:"1 0 70px", textAlign:"center" }}>
                        <div style={{ color:T.ink, fontWeight:900, fontSize:22, letterSpacing:"-0.04em" }}>
                          {scores[k]}<span style={{ fontSize:11, color:T.ink4, fontWeight:400 }}>/10</span>
                        </div>
                        <div style={{ color:T.ink4, fontSize:9, fontFamily:"var(--mono)", marginTop:1, textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</div>
                        <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, marginTop:6 }}>
                          <div style={{ height:"100%", width:((scores[k]||0)*10)+"%", background:`linear-gradient(90deg,${cat.color},${cat.color}88)`, borderRadius:2, transition:"width .7s cubic-bezier(.22,1,.36,1)", boxShadow:`0 0 6px ${cat.color}55` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {scores.recomendacion && (
                    <div style={{ textAlign:"center", paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ background:`${REC_COLOR[scores.recomendacion]||cat.color}18`, color:REC_COLOR[scores.recomendacion]||cat.color, fontWeight:800, fontSize:11, padding:"6px 18px", borderRadius:99, letterSpacing:"0.08em", textTransform:"uppercase", border:`1px solid ${REC_COLOR[scores.recomendacion]||cat.color}44` }}>
                        → {scores.recomendacion}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {status === "error" ? (
                <div style={{ background:"rgba(255,77,126,0.08)", border:"1px solid rgba(255,77,126,0.25)", borderRadius:12, padding:"20px", textAlign:"center" }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>⚠</div>
                  <div style={{ color:T.rose, fontWeight:700, fontSize:14, marginBottom:6 }}>Error en el análisis</div>
                  <div style={{ color:T.ink3, fontSize:13, lineHeight:1.55 }}>{result}</div>
                </div>
              ) : (
                <div style={{ color:T.ink2, fontSize:13, lineHeight:1.75 }}>
                  {result.split("\n").map((line,i) => {
                    const isH = line.startsWith("##")||(line.startsWith("**")&&line.endsWith("**"));
                    const clean = line.replace(/\*\*/g,"").replace(/^#+\s*/,"");
                    if (isH) return <div key={i} style={{ color:T.ink, fontWeight:700, fontSize:14, marginTop:18, marginBottom:5, paddingTop:12, borderTop:"1px solid "+T.border }}>{clean}</div>;
                    if (line.startsWith("- ")||line.startsWith("• ")) return <div key={i} style={{ paddingLeft:12, marginBottom:5, color:T.ink3, marginLeft:4, background:T.accentBg, border:`1px solid ${T.accent}22`, borderRadius:5, paddingTop:3, paddingBottom:3 }}>{line.slice(2)}</div>;
                    if (!line.trim()) return <div key={i} style={{ height:8 }} />;
                    return <div key={i} style={{ marginBottom:3 }}>{line}</div>;
                  })}
                </div>
              )}
              <div style={{ marginTop:18 }}><OGhostBtn full onClick={run}>↻ Nuevo análisis</OGhostBtn></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ATTACH ZONE ──────────────────────────────────────────────────────────────
function AttachZone({ atts, onRemove, onAdd, loading }) {
  const imgs  = atts.filter(a => a.type==="image");
  const files = atts.filter(a => a.type!=="image");
  return (
    <div>
      {imgs.length>0 && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
          {imgs.map(img => (
            <div key={img.id} style={{ position:"relative", width:64, height:64, borderRadius:7, overflow:"hidden", background:T.bgPanel, border:"1px solid "+T.border }}>
              {img.data && <img src={img.data} alt="" loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }} />}
              <button onClick={() => onRemove(img.id)} style={{ position:"absolute", top:3, right:3, background:"rgba(0,0,0,.55)", border:"none", color:"#fff", borderRadius:"50%", width:16, height:16, cursor:"pointer", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
            </div>
          ))}
        </div>
      )}
      {files.length>0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
          {files.map(f => (
            <div key={f.id} style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:6, padding:"4px 9px", display:"flex", gap:5, alignItems:"center" }}>
              <span style={{ fontSize:11 }}>{fileIcon(f.name)}</span>
              <span style={{ color:T.ink3, fontFamily:"var(--mono)", fontSize:11 }}>{f.name.length>18?f.name.slice(0,16)+"…":f.name}</span>
              {f.size && <span style={{ color:T.ink4, fontSize:10 }}>{fmtSize(f.size)}</span>}
              <button onClick={() => onRemove(f.id)} style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer", fontSize:13 }}>×</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={onAdd} className="att-btn"
        style={{ background:T.bgPanel, border:"1.5px dashed "+T.border2, color:T.ink3, padding:"7px 12px", borderRadius:7, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:6, width:"100%", transition:"all .15s", fontFamily:"var(--sans)" }}>
        {loading ? "↑ Procesando…" : "📎 Adjuntar imagen o archivo"}
      </button>
    </div>
  );
}

// ─── DOC PANEL ────────────────────────────────────────────────────────────────
function DocPanel({ board, concept, cards, comments, connections, cat, onClose }) {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [docContent, setDocContent] = useState("");
  const [docTitle, setDocTitle] = useState("");

  const approvedConns = connections.filter(c => c.status === "approved");
  const taskCards = cards.filter(c => c.type === "tarea");

  function buildPrompt() {
    const byCol = (colId) => cards.filter(c => c.col === colId);

    const cardBlock = (list) => list.length === 0 ? "(ninguno)" : list.map(c => {
      const cardComments = (comments[c.id] || []);
      const commentBlock = cardComments.length > 0
        ? "\n    Comentarios:\n" + cardComments.map(cm => `      - @${cm.author}: ${cm.text}`).join("\n")
        : "";
      return `  - [${c.type.toUpperCase()}] ${c.title}${c.body ? "\n    " + c.body : ""}${commentBlock}`;
    }).join("\n");

    const connBlock = approvedConns.length === 0 ? "(ninguna)" : approvedConns.map(c => {
      const ca = cards.find(x => x.id === c.cardA);
      const cb = cards.find(x => x.id === c.cardB);
      return `  - "${ca?.title}" ⇄ "${cb?.title}"\n    Tipo: ${c.type} | Razón: ${c.reason}`;
    }).join("\n");

    return `Eres un consultor senior especializado en ${cat.label.replace(/^.{2}/,"").trim()}. Tu tarea es compilar y estructurar toda la información de este proyecto en un documento maestro profesional y útil.

PROYECTO: "${board.name}"
CATEGORÍA: ${cat.label}${(board.subcategories||[]).length > 0 ? " > " + board.subcategories.join(", ") : ""}

CONCEPTO BASE:
${concept.title || "Sin definir"}
${concept.desc || "(sin descripción)"}

TARJETAS POR COLUMNA:

CONCEPTO (ideas iniciales):
${cardBlock(byCol("concepto"))}

DESARROLLO (en proceso):
${cardBlock(byCol("desarrollo"))}

REVISIÓN (pendiente de aprobación):
${cardBlock(byCol("revision"))}

LISTO (completado):
${cardBlock(byCol("listo"))}

CONEXIONES APROBADAS ENTRE IDEAS:
${connBlock}

TAREAS PENDIENTES:
${taskCards.filter(c => c.col !== "listo").length === 0 ? "(ninguna)" : taskCards.filter(c => c.col !== "listo").map(c => `  - [${c.col.toUpperCase()}] ${c.title}`).join("\n")}

Genera un DOCUMENTO MAESTRO completo y bien estructurado que:
1. Comience con un resumen ejecutivo del proyecto (3-5 frases)
2. Desarrolle el concepto central con profundidad
3. Organice las ideas de forma lógica y coherente (no solo las copie, las integre)
4. Destaque las conexiones entre ideas y cómo se relacionan
5. Incluya una sección de estado actual y progreso
6. Termine con próximos pasos concretos y recomendaciones

Escribe en español. Usa markdown con headers (##), bullets (-) y énfasis (**). Sé específico, útil y profesional. Transforma el material en bruto en un documento que tenga valor propio.`;
  }

  async function generate() {
    setStatus("loading");
    setDocContent("");
    try {
      const txt = await callAI(cat.expert + " Redactas documentos claros, estructurados y de alto valor profesional.", buildPrompt(), 2000);
      setDocContent(txt.trim());
      setDocTitle(board.name + " — Documento Maestro");
      setStatus("done");
    } catch(e) {
      if (e.code==="NO_KEY"||e.code==="INVALID_KEY") setStatus("no_key");
      else setStatus("error");
    }
  }

  function downloadHTML() {
    const lines = docContent.split("\n");
    let html = "";
    lines.forEach(line => {
      if (line.startsWith("# "))       html += `<h1>${line.slice(2)}</h1>\n`;
      else if (line.startsWith("## ")) html += `<h2>${line.slice(3)}</h2>\n`;
      else if (line.startsWith("### "))html += `<h3>${line.slice(4)}</h3>\n`;
      else if (line.startsWith("- "))  html += `<li>${mdInline(line.slice(2))}</li>\n`;
      else if (line.trim() === "")     html += `<p>&nbsp;</p>\n`;
      else                             html += `<p>${mdInline(line)}</p>\n`;
    });

    function mdInline(s) {
      return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
    }

    const fullHTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${docTitle}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', Georgia, serif; background: #F8F7F4; color: #1A1814; padding: 40px 20px; }
  .doc { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 56px 60px; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
  .header { border-bottom: 3px solid ${cat.color}; padding-bottom: 24px; margin-bottom: 36px; }
  .cat-label { display: inline-block; background: ${cat.colorBg}; color: ${cat.color}; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 99px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
  .doc-title { font-size: 28px; font-weight: 800; color: #1A1814; line-height: 1.2; margin-bottom: 8px; letter-spacing: -.5px; }
  .doc-meta { color: #8A837A; font-size: 13px; }
  h1 { font-size: 22px; font-weight: 800; color: #1A1814; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #E0DBD3; }
  h2 { font-size: 17px; font-weight: 700; color: #1A1814; margin: 24px 0 10px; }
  h3 { font-size: 14px; font-weight: 700; color: #4A443C; margin: 18px 0 8px; }
  p { font-size: 14px; line-height: 1.75; color: #4A443C; margin-bottom: 10px; }
  li { font-size: 14px; line-height: 1.7; color: #4A443C; margin-left: 20px; margin-bottom: 5px; list-style: disc; }
  strong { color: #1A1814; font-weight: 700; }
  em { color: #7C3AED; font-style: normal; font-weight: 500; }
  .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #E0DBD3; color: #B8B0A6; font-size: 12px; display: flex; justify-content: space-between; }
  @media print { body { padding: 0; background: #fff; } .doc { box-shadow: none; border-radius: 0; padding: 40px; } }
</style>
</head>
<body>
<div class="doc">
  <div class="header">
    <div class="cat-label">${cat.label}</div>
    <div class="doc-title">${board.name}</div>
    <div class="doc-meta">Documento maestro · Generado el ${new Date().toLocaleDateString("es", { day:"numeric", month:"long", year:"numeric" })}</div>
  </div>
  ${html}
  <div class="footer">
    <span>Tablero de Trabajo Creativo</span>
    <span>${cards.length} tarjetas · ${approvedConns.length} conexiones aprobadas</span>
  </div>
</div>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = board.name.replace(/[^a-z0-9]/gi, "_") + "_documento_maestro.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadMD() {
    const blob = new Blob([`# ${docTitle}\n\n_Generado el ${new Date().toLocaleDateString("es", { day:"numeric", month:"long", year:"numeric" })}_\n\n---\n\n${docContent}`], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = board.name.replace(/[^a-z0-9]/gi, "_") + "_documento_maestro.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,5,.65)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, WebkitBackdropFilter:"blur(8px)", backdropFilter:"blur(8px)", padding:20 }}>
      <div style={{ background:"rgba(13,13,30,0.95)", border:"1px solid rgba(15,214,138,0.2)",
        borderRadius:18, width:"100%", maxWidth:690, maxHeight:"92vh", display:"flex", flexDirection:"column",
        boxShadow:"0 30px 80px rgba(0,0,0,.65), 0 0 40px rgba(15,214,138,0.06)",
        backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
        animation:"scaleIn .25s ease" }}>
        {/* Header */}
        <div style={{ padding:"18px 22px 14px", borderBottom:"1px solid "+T.border, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:18 }}>📄</span>
              <span style={{ color:T.ink, fontWeight:800, fontSize:16 }}>Documento Maestro</span>
            </div>
            <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:11, marginTop:2 }}>
              Compila y organiza todo el contenido del tablero
            </div>
          </div>
          <OGhostBtn small onClick={onClose}>× Cerrar</OGhostBtn>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflow:"auto", padding:"20px 22px" }}>
          {status === "no_key" && <AIKeySetup onSaved={() => setStatus("idle")} />}
          {status === "idle" && (
            <div>
              {/* Summary of what will be compiled */}
              <div style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:10, padding:"16px 18px", marginBottom:20 }}>
                <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:12 }}>SE COMPILARÁ</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {COLUMNS.map(col => {
                    const n = cards.filter(c => c.col === col.id).length;
                    return (
                      <div key={col.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ color:col.color, fontSize:13 }}>{col.icon}</span>
                        <span style={{ color:T.ink2, fontSize:13 }}>{col.label}</span>
                        <span style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:12, marginLeft:"auto" }}>{n}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ height:1, background:T.border, margin:"12px 0" }} />
                <div style={{ display:"flex", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ color:T.accent, fontSize:12 }}>🔗</span>
                    <span style={{ color:T.ink3, fontSize:13 }}>{approvedConns.length} conexiones aprobadas</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ color:T.green, fontSize:12 }}>✓</span>
                    <span style={{ color:T.ink3, fontSize:13 }}>{taskCards.length} tareas</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ color:T.ink4, fontSize:12 }}>💬</span>
                    <span style={{ color:T.ink3, fontSize:13 }}>{Object.values(comments).reduce((s, v) => s + v.length, 0)} comentarios</span>
                  </div>
                </div>
              </div>
              <div style={{ background:T.accentBg, border:"1px solid "+T.accent+"33", borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", gap:10 }}>
                <span style={{ color:T.accent, fontSize:14, flexShrink:0 }}>✦</span>
                <p style={{ color:T.accent, fontSize:13, lineHeight:1.5 }}>
                  La IA compilará todas las tarjetas, comentarios y conexiones en un documento estructurado y coherente — no una lista, sino un documento con narrativa y valor propio. Descargable como HTML (abre en Word o imprime a PDF) o Markdown.
                </p>
              </div>
              <OBtn full onClick={generate}>Generar documento maestro →</OBtn>
            </div>
          )}

          {status === "loading" && (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div className="spinner" style={{ width:36, height:36, border:"3px solid "+T.border, borderTop:"3px solid "+T.green, borderRadius:"50%", margin:"0 auto 20px" }} />
              <p style={{ color:T.ink2, fontWeight:600, fontSize:15, marginBottom:6 }}>Compilando el documento…</p>
              <p style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:12 }}>Leyendo tarjetas, conexiones y comentarios…</p>
            </div>
          )}

          {status === "error" && (
            <div>
              <div style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", borderRadius:8, padding:"14px", color:T.rose, fontSize:13, marginBottom:16 }}>
                Error al generar el documento. Intenta nuevamente.
              </div>
              <OBtn full onClick={generate}>Reintentar</OBtn>
            </div>
          )}

          {status === "done" && (
            <div>
              {/* Download buttons */}
              <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                <button onClick={downloadHTML}
                  style={{ flex:1, background:T.green, border:"none", color:"#fff", padding:"11px 16px", borderRadius:9, cursor:"pointer", fontFamily:"var(--sans)", fontWeight:700, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"opacity .15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  ↓ Descargar HTML
                </button>
                <button onClick={downloadMD}
                  style={{ flex:1, background:T.bgPanel, border:"1px solid "+T.border2, color:T.ink2, padding:"11px 16px", borderRadius:9, cursor:"pointer", fontFamily:"var(--sans)", fontWeight:600, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.bgHover; e.currentTarget.style.color = T.ink; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.bgPanel; e.currentTarget.style.color = T.ink2; }}>
                  ↓ Descargar Markdown
                </button>
                <OGhostBtn small onClick={generate}>↻ Regenerar</OGhostBtn>
              </div>
              <div style={{ background:T.amberBg, border:"1px solid "+T.amber+"33", borderRadius:8, padding:"10px 14px", marginBottom:16, display:"flex", gap:8 }}>
                <span style={{ color:T.amber, fontSize:13, flexShrink:0 }}>💡</span>
                <p style={{ color:T.amber, fontSize:12, lineHeight:1.4 }}>El HTML se puede abrir en Word (Archivo → Abrir) o imprimir a PDF desde el navegador con Ctrl+P / ⌘+P.</p>
              </div>
              {/* Preview */}
              <div style={{ background:T.bgPanel, border:"1px solid "+T.border, borderRadius:10, padding:"18px 20px", maxHeight:360, overflowY:"auto" }}>
                <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, letterSpacing:1, marginBottom:12 }}>VISTA PREVIA</div>
                {docContent.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return <div key={i} style={{ color:T.ink, fontWeight:800, fontSize:18, marginBottom:8, marginTop:16, paddingBottom:8, borderBottom:"2px solid "+cat.color }}>{line.slice(2)}</div>;
                  }
                  if (line.startsWith("## ")) {
                    return <div key={i} style={{ color:T.ink, fontWeight:700, fontSize:15, marginTop:16, marginBottom:6, paddingTop:10, borderTop:"1px solid "+T.border }}>{line.slice(3)}</div>;
                  }
                  if (line.startsWith("### ")) {
                    return <div key={i} style={{ color:T.ink2, fontWeight:700, fontSize:13, marginTop:12, marginBottom:5 }}>{line.slice(4)}</div>;
                  }
                  if (line.startsWith("- ") || line.startsWith("• ")) {
                    return <div key={i} style={{ color:T.ink3, fontSize:13, lineHeight:1.6, paddingLeft:14, marginBottom:4, borderLeft:"2px solid "+T.border2 }}>{line.slice(2).replace(/\*\*/g,"")}</div>;
                  }
                  if (!line.trim()) return <div key={i} style={{ height:8 }} />;
                  return <div key={i} style={{ color:T.ink2, fontSize:13, lineHeight:1.65, marginBottom:5 }}>{line.replace(/\*\*/g,"")}</div>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CANVAS LAYOUTS ───────────────────────────────────────────────────────────
const CARD_W = 210, CARD_H = 60; // collapsed card dimensions
const STKR_W = 185, STKR_HH = 20; // sticker card width + half-height of header attachment point
const NODE_R  = 34; // skill-tree node radius (px)

// Dark + amber/gold palette for micelio skill-tree nodes (War Legend style)
const NODE_GOLD        = "#F59E0B";   // main amber
const NODE_GOLD_BRIGHT = "#FDE68A";   // bright center glow
const NODE_GOLD_DIM    = "#92400E";   // subtle border when idle
// Per-type accent — Navigator palette family
const NODE_PASTEL_BG = { tarea:"#0C1020", idea:"#121008", pregunta:"#090E1A", referencia:"#081410", bloqueo:"#130810" };
const NODE_PASTEL_BD = { tarea:"#7C6AE8", idea:"#C88838", pregunta:"#E85200", referencia:"#3CB87A", bloqueo:"#C04870" };
const NODE_PASTEL_IC = { tarea:"#A898F0", idea:"#E0AB60", pregunta:"#84AEF8", referencia:"#68D4A0", bloqueo:"#DC7898" };
const NODE_ICONS     = { tarea:"✦", idea:"💡", pregunta:"?", referencia:"◎", bloqueo:"⚡" };

// Circle-edge connection endpoint
function circleEdgePt(cx, cy, tx, ty, r) {
  const dx = tx - cx, dy = ty - cy;
  const d  = Math.sqrt(dx*dx + dy*dy) || 1;
  return { x: cx + (dx/d)*r, y: cy + (dy/d)*r };
}

// Edge-to-edge connection endpoint
function edgePt(cx, cy, tx, ty) {
  const dx = tx - cx, dy = ty - cy;
  const angle = Math.atan2(dy, dx);
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const hw = CARD_W/2, hh = CARD_H/2;
  const tx2 = Math.abs(cos) > 0.001 ? hw / Math.abs(cos) : 1e9;
  const ty2 = Math.abs(sin) > 0.001 ? hh / Math.abs(sin) : 1e9;
  const t = Math.min(tx2, ty2);
  return { x: cx + cos * t, y: cy + sin * t };
}

function layoutStack(cards) {
  const pos = {};
  const GAP_X = 240, GAP_Y = 76, START_X = 40, START_Y = 50;
  COLUMNS.forEach((col, ci) => {
    const colCards = cards.filter(c => c.col === col.id);
    colCards.forEach((card, ri) => {
      pos[card.id] = { x: START_X + ci * GAP_X, y: START_Y + ri * GAP_Y };
    });
  });
  return pos;
}

function layoutTree(cards, connections) {
  const pos = {};
  if (!cards.length) return pos;
  const approved = connections.filter(c => c.status === "approved");
  const adj = {};
  cards.forEach(c => { adj[c.id] = []; });
  approved.forEach(c => {
    if (adj[c.cardA]) adj[c.cardA].push(c.cardB);
    if (adj[c.cardB]) adj[c.cardB].push(c.cardA);
  });
  const degrees = Object.fromEntries(cards.map(c => [c.id, adj[c.id].length]));
  const root = cards.reduce((a, b) => degrees[b.id] > degrees[a.id] ? b : a, cards[0]);

  // BFS to assign levels and parents
  const levels = {};
  const parent = {};
  const visited = new Set([root.id]);
  const q = [root.id];
  levels[root.id] = 0;
  while (q.length) {
    const id = q.shift();
    for (const nid of adj[id]) {
      if (!visited.has(nid)) {
        visited.add(nid);
        levels[nid] = levels[id] + 1;
        parent[nid] = id;
        q.push(nid);
      }
    }
  }
  // Unvisited nodes get their own levels
  cards.forEach((c, i) => { if (!(c.id in levels)) levels[c.id] = 0; });

  // Group by level
  const byLevel = {};
  cards.forEach(c => {
    const l = levels[c.id] || 0;
    if (!byLevel[l]) byLevel[l] = [];
    byLevel[l].push(c.id);
  });

  const LEVEL_H = 140, NODE_W = 260;
  Object.entries(byLevel).forEach(([level, ids]) => {
    const y = 60 + Number(level) * LEVEL_H;
    const totalW = (ids.length - 1) * NODE_W;
    ids.forEach((id, i) => {
      pos[id] = { x: 100 + i * NODE_W - totalW / 2 + 600, y };
    });
  });
  return pos;
}

function layoutMicelio(cards, connections, W, H) {
  if (!cards.length) return {};
  const CX = W / 2, CY = H / 2;
  const approved = connections.filter(c => c.status === "approved");
  const adj = {};
  cards.forEach(c => { adj[c.id] = []; });
  approved.forEach(c => {
    if (adj[c.cardA]) adj[c.cardA].push(c.cardB);
    if (adj[c.cardB]) adj[c.cardB].push(c.cardA);
  });
  const degrees = Object.fromEntries(cards.map(c => [c.id, adj[c.id].length]));
  const root = cards.reduce((a, b) => degrees[b.id] > degrees[a.id] ? b : a, cards[0]);
  const placed = new Set();
  const pos = {};
  const bfsQ = [{ id: root.id, depth: 0, angle: -Math.PI/2, spread: Math.PI * 2 }];
  placed.add(root.id);
  pos[root.id] = { x: CX - CARD_W/2, y: CY - CARD_H/2, vx:0, vy:0 };
  while (bfsQ.length) {
    const { id, depth, angle, spread } = bfsQ.shift();
    const children = adj[id].filter(nid => !placed.has(nid));
    if (!children.length) continue;
    const r = 200 + depth * 150;
    const step = spread / children.length;
    const start = angle - spread/2 + step/2;
    children.forEach((cid, i) => {
      placed.add(cid);
      const a = start + i * step + (Math.random()-0.5)*0.18;
      pos[cid] = { x: CX + r*Math.cos(a) - CARD_W/2, y: CY + r*Math.sin(a) - CARD_H/2, vx:0, vy:0 };
      bfsQ.push({ id:cid, depth:depth+1, angle:a, spread:Math.max(step*0.75, 0.5) });
    });
  }
  // Unconnected cards: golden-angle spiral for organic distribution
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  let spiralIdx = 0;
  cards.filter(c => !placed.has(c.id)).forEach((card) => {
    const r = 140 + Math.sqrt(spiralIdx + 1) * 120;
    const a = spiralIdx * goldenAngle;
    pos[card.id] = { x: CX + r*Math.cos(a) - CARD_W/2, y: CY + r*Math.sin(a) - CARD_H/2, vx:0, vy:0 };
    spiralIdx++;
  });
  // Force iterations
  const ITER=100, REP=14000, SPK=0.06, SPL=250, DAMP=0.7, GRAV=0.01;
  for (let k=0; k<ITER; k++) {
    const alpha = 1 - k/ITER;
    const ids = Object.keys(pos);
    for (let i=0;i<ids.length;i++) for (let j=i+1;j<ids.length;j++) {
      const pi=pos[ids[i]],pj=pos[ids[j]];
      const dx=(pi.x-pj.x)||0.01,dy=(pi.y-pj.y)||0.01;
      const d=Math.sqrt(dx*dx+dy*dy)||1;
      const f=(REP*alpha)/(d*d);
      pi.vx+=dx/d*f;pi.vy+=dy/d*f;pj.vx-=dx/d*f;pj.vy-=dy/d*f;
    }
    approved.forEach(c=>{
      const pa=pos[c.cardA],pb=pos[c.cardB];
      if(!pa||!pb)return;
      const dx=pb.x-pa.x,dy=pb.y-pa.y;
      const d=Math.sqrt(dx*dx+dy*dy)||1;
      const f=SPK*(d-SPL)*alpha;
      pa.vx+=dx/d*f;pa.vy+=dy/d*f;pb.vx-=dx/d*f;pb.vy-=dy/d*f;
    });
    ids.forEach(id=>{
      const p=pos[id];
      p.vx+=(CX-CARD_W/2-p.x)*GRAV;p.vy+=(CY-CARD_H/2-p.y)*GRAV;
      p.vx*=DAMP;p.vy*=DAMP;
      p.x=Math.max(20,Math.min(W-CARD_W-20,p.x+p.vx));
      p.y=Math.max(20,Math.min(H-CARD_H-20,p.y+p.vy));
    });
  }
  return Object.fromEntries(Object.entries(pos).map(([id,p])=>[id,{x:Math.round(p.x),y:Math.round(p.y)}]));
}

function computeStickerPos(cards, cardPos) {
  const out = {};
  cards.forEach(card => {
    const cp = cardPos[card.id];
    if (!cp) return;
    out[card.id] = {};
    (card.stickers||[]).filter(s => s.status!=="discarded").forEach((s, i) => {
      const seed  = s.id.split("").reduce((a,c) => a+c.charCodeAt(0), 0);
      const angle = (seed/999)*Math.PI*2 + i*1.20;
      const dist  = 220 + (i%3)*55; // further from card so strings are visible
      out[card.id][s.id] = {
        x: Math.round(cp.x + CARD_W/2 + Math.cos(angle)*dist - STKR_W/2),
        y: Math.round(cp.y + CARD_H/2 + Math.sin(angle)*dist - STKR_HH)
      };
    });
  });
  return out;
}

// ─── CANVAS STICKER NODE ──────────────────────────────────────────────────────
const STKR_COLOR = { "opinión":T.blue, "complemento":T.green, "pregunta":T.amber, "objeción":T.rose, "referencia":T.accent };
const STKR_ICON  = { "opinión":"💬", "complemento":"➕", "pregunta":"❓", "objeción":"⚡", "referencia":"🔗" };
const CONN_COLORS = { complementa:T.accent, secuencia:T.green, contraste:T.orange, refuerza:T.blue };
const CONN_LABELS = { complementa:"Complementa", secuencia:"Secuencia", contraste:"Contraste", refuerza:"Refuerza" };
const CONN_ICONS  = { complementa:"◈", secuencia:"→", contraste:"⇄", refuerza:"◉" };

function CanvasStickerNode({ s, sp, color, icon, onMouseDown, onTouchStart }) {
  return (
    <div style={{
      position:"absolute", left:sp.x, top:sp.y, width:STKR_W, zIndex:4,
      background:"var(--card)",
      border:`1px solid ${color}40`,
      borderTop:`3px solid ${color}`,
      borderRadius:7,
      boxShadow:"var(--shadow-2)",
      cursor:"grab", userSelect:"none"
    }}
      onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
      {/* Header: author + type */}
      <div style={{
        padding:"5px 10px 4px",
        display:"flex", alignItems:"center", gap:6,
        borderBottom:`1px solid ${color}20`
      }}>
        <span style={{fontSize:10, lineHeight:1}}>{icon}</span>
        <span style={{
          color, fontFamily:"var(--mono)", fontSize:8, fontWeight:700,
          textTransform:"uppercase", letterSpacing:"0.09em",
          flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
        }}>
          {s.author} · {s.type}
        </span>
      </div>
      {/* Body: suggestion text — always visible */}
      <div style={{
        padding:"7px 10px 8px",
        color:"var(--ink-2)", fontSize:11, lineHeight:1.45,
        display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical",
        overflow:"hidden"
      }}>
        {s.text}
      </div>
    </div>
  );
}

// ─── CANVAS VIEW ──────────────────────────────────────────────────────────────
function CanvasView({ cards, connections, comments, user, onEditCard, onReadCard, canvasPositions, onSavePositions, cat, onAddCard }) {
  const initPos = { cards:{...canvasPositions.cards}, stickers:{...canvasPositions.stickers} };
  const posRef      = useRef(initPos);
  const [pos, setPos] = useState(initPos);
  const [running, setRunning] = useState(false);
  const [zoomPct, setZoomPct] = useState(100);
  const containerRef = useRef(null);
  const transformRef = useRef(null); // DOM-only transform layer
  const panRef  = useRef({ x:0, y:0 });
  const zoomRef = useRef(1);

  function applyT(px, py, z) {
    if (transformRef.current)
      transformRef.current.style.transform = `translate(${px}px,${py}px) scale(${z})`;
  }

  const hasAllPos = cards.length > 0 && cards.every(c => posRef.current.cards[c.id]);

  function fitToView(cardPositions) {
    const cpMap = cardPositions || posRef.current.cards;
    const pts = Object.values(cpMap);
    if (!pts.length) return;
    const el = containerRef.current;
    if (!el) return;
    const minX = Math.min(...pts.map(p => p.x));
    const maxX = Math.max(...pts.map(p => p.x + CARD_W));
    const minY = Math.min(...pts.map(p => p.y));
    const maxY = Math.max(...pts.map(p => p.y + CARD_H));
    const vw = el.clientWidth, vh = el.clientHeight;
    const pad = 80;
    const scaleX = (vw - pad * 2) / Math.max(1, maxX - minX);
    const scaleY = (vh - pad * 2) / Math.max(1, maxY - minY);
    const nz = Math.min(1.4, Math.max(0.15, Math.min(scaleX, scaleY)));
    const pw = (maxX - minX) * nz;
    const ph = (maxY - minY) * nz;
    const px = (vw - pw) / 2 - minX * nz;
    const py = (vh - ph) / 2 - minY * nz;
    panRef.current  = { x:px, y:py };
    zoomRef.current = nz;
    applyT(px, py, nz);
    setZoomPct(Math.round(nz * 100));
  }

  function runLayout() {
    if (running) return;
    setRunning(true);
    const el = containerRef.current;
    const W  = el ? el.clientWidth  : 1000;
    const H  = el ? el.clientHeight : 700;
    setTimeout(() => {
      const cp = layoutMicelio(cards, connections, W, H);
      const sp = computeStickerPos(cards, cp);
      const np = { cards:cp, stickers:sp };
      posRef.current = np;
      setPos({ ...np });
      onSavePositions(np);
      setRunning(false);
      setTimeout(() => fitToView(cp), 30);
    }, 60);
  }

  useEffect(() => { if (!hasAllPos && cards.length > 0) runLayout(); }, []);

  // Wheel zoom — non-passive
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onWheel(e) {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.91;
      const oz = zoomRef.current;
      const nz = Math.min(4, Math.max(0.1, oz * factor));
      const npx = mx - (mx - panRef.current.x) * (nz / oz);
      const npy = my - (my - panRef.current.y) * (nz / oz);
      panRef.current  = { x:npx, y:npy };
      zoomRef.current = nz;
      applyT(npx, npy, nz);
      setZoomPct(Math.round(nz * 100));
    }
    el.addEventListener("wheel", onWheel, { passive:false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const ZOOM_STEPS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  function zoomStep(dir) {
    const cur = zoomRef.current;
    const el  = containerRef.current;
    const cx  = el ? el.clientWidth/2  : 500;
    const cy  = el ? el.clientHeight/2 : 350;
    // find the step just above current zoom
    let idx = ZOOM_STEPS.findIndex(z => z > cur - 0.01);
    if (idx === -1) idx = ZOOM_STEPS.length - 1;
    const ni = dir > 0
      ? Math.min(ZOOM_STEPS.length - 1, idx + 1)
      : Math.max(0, idx - 1);
    const nz = ZOOM_STEPS[ni];
    const oz = zoomRef.current || 1;
    const npx = cx - (cx - panRef.current.x) * (nz / oz);
    const npy = cy - (cy - panRef.current.y) * (nz / oz);
    panRef.current  = { x:npx, y:npy };
    zoomRef.current = nz;
    applyT(npx, npy, nz);
    setZoomPct(Math.round(nz * 100));
  }
  function zoomBy(factor) {
    const el = containerRef.current;
    const cx = el ? el.clientWidth/2  : 500;
    const cy = el ? el.clientHeight/2 : 350;
    const oz = zoomRef.current;
    const nz = Math.min(4, Math.max(0.1, oz * factor));
    const npx = cx - (cx - panRef.current.x) * (nz / oz);
    const npy = cy - (cy - panRef.current.y) * (nz / oz);
    panRef.current  = { x:npx, y:npy };
    zoomRef.current = nz;
    applyT(npx, npy, nz);
    setZoomPct(Math.round(nz * 100));
  }

  function resetZoom() {
    panRef.current  = { x:0, y:0 };
    zoomRef.current = 1;
    applyT(0, 0, 1);
    setZoomPct(100);
  }

  // Mouse pan — only on background
  function startPan(e) {
    if (e.button !== 0) return;
    const origin = { mx:e.clientX, my:e.clientY, px:panRef.current.x, py:panRef.current.y };
    function onMove(ev) {
      const nx = origin.px + (ev.clientX - origin.mx);
      const ny = origin.py + (ev.clientY - origin.my);
      panRef.current = { x:nx, y:ny };
      applyT(nx, ny, zoomRef.current);
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup",   onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onUp);
  }

  // Drag card/sticker — correct coordinate math
  function startDrag(e, type, id, parentId) {
    e.preventDefault(); e.stopPropagation();
    const cur = type==="card" ? posRef.current.cards[id] : (posRef.current.stickers[parentId]||{})[id];
    if (!cur) return;
    const rect = containerRef.current.getBoundingClientRect();
    const sx0 = e.clientX - rect.left, sy0 = e.clientY - rect.top;
    const ox = cur.x, oy = cur.y;
    function onMove(ev) {
      const r  = containerRef.current.getBoundingClientRect();
      const sx = ev.clientX - r.left, sy = ev.clientY - r.top;
      const nx = ox + (sx - sx0) / zoomRef.current;
      const ny = oy + (sy - sy0) / zoomRef.current;
      const np = { cards:{...posRef.current.cards}, stickers:{...posRef.current.stickers} };
      if (type==="card") np.cards[id]={x:nx,y:ny};
      else np.stickers[parentId]={...(np.stickers[parentId]||{}),[id]:{x:nx,y:ny}};
      posRef.current = np;
      setPos({...np});
    }
    function onUp() {
      onSavePositions(posRef.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup",   onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onUp);
  }

  // Touch: single finger = pan, two fingers = pinch zoom
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      const t0 = e.touches[0];
      const origin = { mx:t0.clientX, my:t0.clientY, px:panRef.current.x, py:panRef.current.y };
      function onMove(ev) {
        if (ev.touches.length !== 1) return;
        ev.preventDefault();
        const nx = origin.px + (ev.touches[0].clientX - origin.mx);
        const ny = origin.py + (ev.touches[0].clientY - origin.my);
        panRef.current = { x:nx, y:ny };
        applyT(nx, ny, zoomRef.current);
      }
      function onEnd() {
        containerRef.current.removeEventListener("touchmove", onMove);
        containerRef.current.removeEventListener("touchend",  onEnd);
      }
      containerRef.current.addEventListener("touchmove", onMove, {passive:false});
      containerRef.current.addEventListener("touchend",  onEnd);
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const rect  = containerRef.current.getBoundingClientRect();
      const dist0 = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      const oz    = zoomRef.current;
      const mcx   = (e.touches[0].clientX+e.touches[1].clientX)/2 - rect.left;
      const mcy   = (e.touches[0].clientY+e.touches[1].clientY)/2 - rect.top;
      const px0   = panRef.current.x, py0 = panRef.current.y;
      function onMove(ev) {
        if (ev.touches.length < 2) return;
        ev.preventDefault();
        const dist = Math.hypot(ev.touches[0].clientX-ev.touches[1].clientX, ev.touches[0].clientY-ev.touches[1].clientY);
        const nz   = Math.min(4, Math.max(0.1, oz * (dist/dist0)));
        const npx  = mcx - (mcx - px0) * (nz / oz);
        const npy  = mcy - (mcy - py0) * (nz / oz);
        panRef.current  = { x:npx, y:npy };
        zoomRef.current = nz;
        applyT(npx, npy, nz);
      }
      function onEnd() {
        setZoomPct(Math.round(zoomRef.current * 100));
        containerRef.current.removeEventListener("touchmove", onMove);
        containerRef.current.removeEventListener("touchend",  onEnd);
      }
      containerRef.current.addEventListener("touchmove", onMove, {passive:false});
      containerRef.current.addEventListener("touchend",  onEnd);
    }
  }

  // Touch drag for cards/stickers
  function startTouchDrag(e, type, id, parentId) {
    if (e.touches.length !== 1) return;
    e.stopPropagation();
    const cur = type==="card" ? posRef.current.cards[id] : (posRef.current.stickers[parentId]||{})[id];
    if (!cur) return;
    const rect = containerRef.current.getBoundingClientRect();
    const t0   = e.touches[0];
    const sx0  = t0.clientX - rect.left, sy0 = t0.clientY - rect.top;
    const ox   = cur.x, oy = cur.y;
    function onMove(ev) {
      if (ev.touches.length !== 1) return;
      ev.preventDefault();
      const r  = containerRef.current.getBoundingClientRect();
      const sx = ev.touches[0].clientX - r.left, sy = ev.touches[0].clientY - r.top;
      const nx = ox + (sx - sx0) / zoomRef.current;
      const ny = oy + (sy - sy0) / zoomRef.current;
      const np = { cards:{...posRef.current.cards}, stickers:{...posRef.current.stickers} };
      if (type==="card") np.cards[id]={x:nx,y:ny};
      else np.stickers[parentId]={...(np.stickers[parentId]||{}),[id]:{x:nx,y:ny}};
      posRef.current = np;
      setPos({...np});
    }
    function onEnd() {
      onSavePositions(posRef.current);
      containerRef.current.removeEventListener("touchmove", onMove);
      containerRef.current.removeEventListener("touchend",  onEnd);
    }
    containerRef.current.addEventListener("touchmove", onMove, {passive:false});
    containerRef.current.addEventListener("touchend",  onEnd);
  }

  const allStickers = cards.flatMap(card =>
    (card.stickers||[]).filter(s=>s.status!=="discarded").map(s=>({...s,cardId:card.id}))
  );
  const approvedConns = connections.filter(c => c.status==="approved" && pos.cards[c.cardA] && pos.cards[c.cardB]);

  return (
    <div ref={containerRef}
      style={{position:"relative",flex:1,overflow:"hidden",cursor:"grab",touchAction:"none",
        background: T.bg,
        backgroundImage: `radial-gradient(${T.border2} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        backgroundPosition: "0 0"}}
      onMouseDown={startPan}
      onTouchStart={onTouchStart}
    >
      {/* ── HUD Toolbar top-left ── */}
      <div style={{position:"absolute",top:14,left:14,zIndex:20,display:"flex",gap:6,alignItems:"center"}}>
        <button className="hud-btn hud-btn-active" onClick={runLayout} disabled={running} title="Reorganizar">
          {running ? "Organizando…" : "↺ Reorganizar"}
        </button>
        <button className="hud-btn" onClick={()=>fitToView()} title="Centrar vista"
          disabled={!Object.keys(posRef.current.cards).length}>
          ⊙ Centrar
        </button>
        {onAddCard && (
          <button className="hud-btn" onClick={onAddCard} style={{fontWeight:600}}>
            + Tarjeta
          </button>
        )}
      </div>

      {/* ── HUD zoom bottom-right ── */}
      <div style={{position:"absolute",bottom:14,right:14,zIndex:20,
        fontFamily:"var(--mono)",fontSize:10,letterSpacing:".13em",
        color:"var(--ink-3)",
        background:"var(--card)",
        border:"1px solid var(--card-border)",
        boxShadow:"var(--shadow-1)",
        borderRadius:8,padding:"8px 12px",lineHeight:1.7}}>
        <div style={{color:"var(--ink-2)",fontWeight:700,marginBottom:4}}>
          {zoomPct}%
        </div>
        <div style={{display:"flex",gap:5}}>
          <button onClick={()=>zoomStep(-1)} className="hud-btn" style={{padding:"2px 8px",fontSize:12,letterSpacing:0}}>−</button>
          <button onClick={()=>fitToView()} className="hud-btn" style={{padding:"2px 6px",fontSize:10,letterSpacing:0}} title="Encuadrar todo">↔</button>
          <button onClick={()=>zoomStep(+1)} className="hud-btn" style={{padding:"2px 8px",fontSize:12,letterSpacing:0}}>+</button>
        </div>
      </div>

      {/* Empty state */}
      {cards.length===0 && (
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
          <div style={{fontSize:44,opacity:0.2,color:T.ink4}}>◯</div>
          <div style={{fontFamily:"var(--mono)",fontSize:13,color:T.ink4}}>
            Sin tarjetas — créalas en la vista Kanban
          </div>
        </div>
      )}

      {/* Transform layer — DOM controlled only, NOT React state */}
      <div ref={transformRef} style={{position:"absolute",inset:0,transformOrigin:"0 0"}}
        onMouseDown={e=>{ e.stopPropagation(); startPan(e); }}>

        {/* SVG: connections + sticker strings */}
        <svg style={{position:"absolute",left:"-3000px",top:"-3000px",width:"9000px",height:"9000px",pointerEvents:"none",zIndex:2}}>
          <defs>
            <marker id="cv-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" strokeWidth="1.8" strokeLinecap="round"/>
            </marker>
          </defs>
          {approvedConns.map(conn=>{
            const pa=pos.cards[conn.cardA], pb=pos.cards[conn.cardB];
            const acx=pa.x+CARD_W/2+3000, acy=pa.y+CARD_H/2+3000;
            const bcx=pb.x+CARD_W/2+3000, bcy=pb.y+CARD_H/2+3000;
            const ep1=edgePt(acx,acy,bcx,bcy);
            const ep2=edgePt(bcx,bcy,acx,acy);
            const mx=(ep1.x+ep2.x)/2, my=(ep1.y+ep2.y)/2;
            const dx=ep2.x-ep1.x;
            const organicD=`M${ep1.x},${ep1.y} C${ep1.x+dx*0.5},${ep1.y} ${ep2.x-dx*0.5},${ep2.y} ${ep2.x},${ep2.y}`;
            return (
              <g key={conn.id}>
                <path d={organicD} stroke="var(--line)" strokeWidth="2" fill="none" opacity="0.65"/>
                <circle cx={ep1.x} cy={ep1.y} r="3.5" fill="var(--noir)" opacity="0.8"/>
                <circle cx={ep2.x} cy={ep2.y} r="3.5" fill="var(--noir)" opacity="0.8"/>
                <circle cx={mx} cy={my} r="5" fill="var(--neon)" stroke="var(--noir)" strokeWidth="1.2"/>
                <text x={mx} y={my-9} textAnchor="middle" fontSize="8"
                  fontFamily="'Quicksand',system-ui" fontWeight="600"
                  fill="var(--ink-3)" letterSpacing="0.04em">
                  {CONN_LABELS[conn.type]}
                </text>
              </g>
            );
          })}
          {/* Sticker strings — card edge → sticker top-center */}
          {allStickers.map(s=>{
            const cp=pos.cards[s.cardId];
            const seed=s.id.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
            const angle=(seed/999)*Math.PI*2;
            const spp=(pos.stickers[s.cardId]||{})[s.id]||(cp?{
              x:Math.round(cp.x+CARD_W/2+Math.cos(angle)*220-STKR_W/2),
              y:Math.round(cp.y+CARD_H/2+Math.sin(angle)*150-STKR_HH)
            }:null);
            if(!cp||!spp)return null;
            const color=STKR_COLOR[s.type]||T.blue;
            // SVG offset +3000 for all coordinates
            const cx=cp.x+CARD_W/2+3000, cy=cp.y+CARD_H/2+3000;
            const sx=spp.x+STKR_W/2+3000; // sticker top-center X
            const sy=spp.y+3000;           // sticker top Y
            const ep=edgePt(cx,cy,sx,sy);
            // Control points: slightly curved S-shape
            const midy=(ep.y+sy)/2;
            return (
              <g key={s.id}>
                <path
                  d={`M${ep.x},${ep.y} C${ep.x},${midy} ${sx},${midy} ${sx},${sy}`}
                  fill="none" stroke={color} strokeWidth="1.8" strokeOpacity="0.55"
                  strokeDasharray="6 4" strokeLinecap="round"/>
                <circle cx={ep.x} cy={ep.y} r="3" fill={color} opacity="0.7"/>
                <circle cx={sx} cy={sy} r="2.5" fill={color} opacity="0.45"/>
              </g>
            );
          })}
        </svg>

        {/* Card nodes */}
        {cards.map(card=>{
          const p=pos.cards[card.id];
          if(!p)return null;
          const col=COLUMNS.find(c=>c.id===card.col);
          const cc=(comments[card.id]||[]).length;
          const sc=(card.stickers||[]).filter(s=>s.status!=="discarded").length;
          return (
            <CanvasSkillNode key={card.id} card={card} p={p} col={col} cc={cc} sc={sc}
              onOpen={onReadCard || onEditCard}
              onMouseDown={e=>startDrag(e,"card",card.id,null)}
              onTouchStart={e=>startTouchDrag(e,"card",card.id,null)}/>
          );
        })}

        {/* Sticker suggestion cards */}
        {allStickers.map(s=>{
          const cardPos=pos.cards[s.cardId];
          const seed=s.id.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
          const angle=(seed/999)*Math.PI*2;
          const sp=(pos.stickers[s.cardId]||{})[s.id]||(cardPos?{
            x:Math.round(cardPos.x+CARD_W/2+Math.cos(angle)*220-STKR_W/2),
            y:Math.round(cardPos.y+CARD_H/2+Math.sin(angle)*150-STKR_HH)
          }:null);
          if(!sp)return null;
          const color=STKR_COLOR[s.type]||T.blue;
          return (
            <CanvasStickerNode key={s.id} s={s} sp={sp} color={color}
              icon={STKR_ICON[s.type]||"💬"}
              onMouseDown={e=>startDrag(e,"sticker",s.id,s.cardId)}
              onTouchStart={e=>startTouchDrag(e,"sticker",s.id,s.cardId)}/>
          );
        })}
      </div>
    </div>
  );
}

// Standalone canvas card node (for Stack / Árbol views)
function CanvasCardNode({ card, p, tc, col, cc, sc, isOwner, onEditCard, onMouseDown, onTouchStart }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{position:"absolute",left:p.x,top:p.y,width:expanded?230:CARD_W,zIndex:5,
      background:T.bgCard,border:"1px solid "+T.border,borderLeft:"4px solid "+tc,
      borderRadius:10,boxShadow:"0 3px 14px rgba(0,0,0,.1)",userSelect:"none",
      cursor:"grab",transition:"width .2s"}}
      onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
      <div onClick={e=>{e.stopPropagation();setExpanded(p=>!p);}}
        style={{padding:"9px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
        <span style={{color:tc,fontSize:10,flexShrink:0}}>{expanded?"▼":"▶"}</span>
        <div style={{color:T.ink,fontWeight:700,fontSize:13,lineHeight:1.2,flex:1,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:expanded?"normal":"nowrap"}}>
          {card.title}
        </div>
        <button onClick={e=>{e.stopPropagation();onEditCard(card);}}
          style={{background:"none",border:"none",color:T.ink4,cursor:"pointer",fontSize:13,padding:"0 2px",lineHeight:1,flexShrink:0}}>
          {isOwner?"✎":"👁"}
        </button>
      </div>
      {!expanded && (cc>0||sc>0) && (
        <div style={{padding:"0 10px 7px",display:"flex",gap:5}}>
          {cc>0&&<span style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:9}}>💬{cc}</span>}
          {sc>0&&<span style={{color:T.blue,fontFamily:"var(--mono)",fontSize:9}}>🗂{sc}</span>}
        </div>
      )}
      {expanded && (
        <div style={{padding:"0 10px 10px",borderTop:"1px solid "+T.border+"55"}}>
          {card.body&&<div style={{color:T.ink3,fontSize:12,lineHeight:1.55,fontFamily:"var(--sans)",marginTop:8,marginBottom:8}}>{card.body}</div>}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <span style={{background:tc+"22",color:tc,fontFamily:"var(--mono)",fontSize:9,padding:"1px 6px",borderRadius:99}}>{card.type}</span>
              <span style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:10}}>@{card.author}</span>
              {cc>0&&<span style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:10}}>💬{cc}</span>}
              {sc>0&&<span style={{color:T.blue,fontFamily:"var(--mono)",fontSize:10}}>🗂{sc}</span>}
            </div>
            {col&&<div style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:col.color}}/>
              <span style={{color:T.ink4,fontSize:10,fontFamily:"var(--mono)"}}>{col.label}</span>
            </div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Micelio card node — Mycelium rectangular sci-fi style ─────────────────────
function CanvasSkillNode({ card, p, col, cc, sc, onOpen, onMouseDown, onTouchStart }) {
  const [expanded, setExpanded] = useState(false);
  const pbd = NODE_PASTEL_BD[card.type] || "#E85200";
  const ico = NODE_ICONS[card.type] || "◈";
  const colColor = col?.color || "#6B7280";
  const isBase = card.col === "listo"; // visually highlight finished cards

  return (
    <div className={`mcard hud-c${expanded ? " mcard-exp" : ""}`}
      style={{ left:p.x, top:p.y, cursor:"grab", userSelect:"none" }}
      onMouseDown={onMouseDown} onTouchStart={onTouchStart}>

      {/* Header row — click to expand/collapse */}
      <div className="mcard-head"
        onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}>
        <span className="mcard-glyph">{expanded ? "◢" : "▸"}</span>
        <span className="mcard-title">{card.title}</span>
        <span className="mcard-dot" style={{ background:colColor,
          boxShadow:`0 0 6px ${colColor}bb` }} />
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="mcard-body">
          {card.body && <p>{card.body}</p>}
          <div className="mcard-tags">
            <span className="mtag" style={{ borderColor:`${pbd}55`, color:pbd }}>
              {ico} {card.type}
            </span>
            {col && (
              <span className="mtag" style={{ borderColor:`${colColor}55`, color:colColor }}>
                {col.label}
              </span>
            )}
          </div>
          <div className="mmuted">
            @{card.author || "—"}
            {cc > 0 && ` · 💬 ${cc}`}
            {sc > 0 && ` · ◎ ${sc}`}
          </div>
          <div className="mcard-btns">
            <button className="hud-btn"
              onClick={e => { e.stopPropagation(); onOpen(card); }}>
              ◎ Leer
            </button>
          </div>
        </div>
      )}

      {/* Collapsed badge row */}
      {!expanded && (cc > 0 || sc > 0) && (
        <div style={{ display:"flex", gap:4, padding:"3px 10px 5px",
          borderTop:"1px solid rgba(0,0,0,0.06)" }}>
          {cc > 0 && (
            <span style={{ fontFamily:"var(--mono)", fontSize:9,
              color:"#8A8480", letterSpacing:".06em" }}>💬 {cc}</span>
          )}
          {sc > 0 && (
            <span style={{ fontFamily:"var(--mono)", fontSize:9,
              color:"#8A8480", letterSpacing:".06em" }}>◎ {sc}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── WORLDBUILDING PANEL ──────────────────────────────────────────────────────
const WB_TABS = [
  { id:"world",    icon:"🗺",  label:"World Atlas"  },
  { id:"timeline", icon:"📅",  label:"Timeline"     },
  { id:"family",   icon:"🌳",  label:"Family Tree"  },
];

const WORLD_CATS = [
  { key:"lugares",    label:"Lugares",     icon:"📍", examples:["ciudad","villa","río","montaña","bosque","isla","reino","territorio","región","mar","lago","desierto","torre","castillo","aldea"] },
  { key:"personajes", label:"Personajes",  icon:"👤", examples:["personaje","héroe","villano","protagonista","antagonista","mago","guerrero","rey","reina","príncipe","princesa","general","espía"] },
  { key:"facciones",  label:"Facciones",   icon:"⚔️",  examples:["facción","clan","gremio","orden","ejército","hermandad","alianza","imperio","reino","facción","sociedad","culto"] },
  { key:"artefactos", label:"Artefactos",  icon:"⚡",  examples:["artefacto","espada","escudo","libro","orbe","aparato","máquina","dispositivo","reliquia","amuleto","objeto mágico"] },
  { key:"magia",      label:"Magia / Tech",icon:"✨",  examples:["magia","hechizo","poder","energía","sistema","tecnología","maná","runa","alquimia","ritual","elemento"] },
  { key:"historia",   label:"Historia",    icon:"📜",  examples:["batalla","guerra","era","época","evento","fundación","colapso","tratado","coronación","profecía","leyenda"] },
  { key:"cultura",    label:"Cultura",     icon:"🎭",  examples:["idioma","religión","tradición","costumbre","festival","rito","creencia","mitología","arte","música","moneda"] },
  { key:"otros",      label:"Otros",       icon:"◈",   examples:[] },
];

function WorldbuildingPanel({ board, concept, cards, cat, onClose }) {
  const [tab, setTab]     = useState("world");
  const [status, setStatus] = useState("idle");
  const [data, setData]   = useState(null);
  const [error, setError] = useState("");

  const cardText = cards.map(c =>
    `TARJETA [${c.type}] "${c.title}":\n${c.body || "(sin descripción)"}`
  ).join("\n\n---\n\n");

  async function analyze() {
    if (!cards.length) { setError("Agrega tarjetas primero."); return; }
    setStatus("loading"); setError("");

    const PROMPTS = {
      world: `Eres un asistente de worldbuilding. Analiza estas tarjetas del proyecto literario "${concept.title || board.name}" y extrae todos los elementos del mundo que encuentres.

${cardText}

Responde SOLO con JSON válido:
{
  "lugares": [{"nombre":"...","tipo":"ciudad|villa|río|montaña|edificio|región|otro","descripcion":"breve descripción si existe","menciones":[]}],
  "personajes": [{"nombre":"...","rol":"...","descripcion":"..."}],
  "facciones": [{"nombre":"...","tipo":"...","descripcion":"..."}],
  "artefactos": [{"nombre":"...","tipo":"...","descripcion":"..."}],
  "magia": [{"nombre":"...","tipo":"...","descripcion":"..."}],
  "historia": [{"nombre":"...","tipo":"batalla|era|evento|otro","descripcion":"..."}],
  "cultura": [{"nombre":"...","tipo":"idioma|religión|costumbre|otro","descripcion":"..."}],
  "otros": [{"nombre":"...","tipo":"...","descripcion":"..."}]
}
Solo incluye elementos que realmente se mencionen. Si una categoría está vacía, devuelve array vacío.`,

      timeline: `Eres un asistente de worldbuilding. Analiza estas tarjetas del proyecto "${concept.title || board.name}" y extrae todos los eventos, fechas, eras y referencias temporales.

${cardText}

Responde SOLO con JSON válido:
{
  "eventos": [
    {
      "fecha": "número o texto de la fecha (ej: '200 ATW', 'Año 42', 'Era del Hielo')",
      "titulo": "nombre del evento",
      "descripcion": "qué pasó",
      "tipo": "batalla|fundacion|nacimiento|muerte|era|profecia|otro",
      "tarjeta": "título de la tarjeta donde se menciona"
    }
  ],
  "sistema_temporal": "nombre del sistema de fechas si se detecta (ej: 'ATW = Antes de la batalla de Whornwater')",
  "era_actual": "en qué época transcurre la historia si se puede determinar"
}
Ordena los eventos cronológicamente si es posible. Incluye TODO lo que suene a referencia temporal.`,

      family: `Eres un asistente de worldbuilding. Analiza estas tarjetas del proyecto "${concept.title || board.name}" y extrae todos los personajes y sus relaciones.

${cardText}

Responde SOLO con JSON válido:
{
  "personajes": [
    {
      "id": "nombre_sin_espacios",
      "nombre": "nombre completo del personaje",
      "descripcion": "breve descripción",
      "grupo": "facción o familia si se conoce"
    }
  ],
  "relaciones": [
    {
      "de": "id del personaje A",
      "a": "id del personaje B",
      "tipo": "padre_de|madre_de|hijo_de|hija_de|hermano_de|hermana_de|abuelo_de|abuela_de|nieto_de|nieta_de|tio_de|tia_de|primo_de|pareja_de|enemigo_de|aliado_de|mentor_de|discipulo_de|otro",
      "descripcion": "descripción adicional si existe"
    }
  ]
}
Incluye TODOS los personajes mencionados, aunque sea brevemente. Infiere relaciones si se mencionan explícitamente.`
    };

    try {
      const raw = await callAI("Eres un asistente experto en worldbuilding literario. Extraes información estructurada de textos creativos. Respondes ÚNICAMENTE con JSON válido, sin texto adicional, sin comentarios, sin markdown.", PROMPTS[tab], 2000);
      const txt = raw.trim().replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(txt);
      setData(prev => ({ ...(prev||{}), [tab]: parsed }));
      setStatus("done");
    } catch(e) {
      if (e.code==="NO_KEY"||e.code==="INVALID_KEY") { setStatus("no_key"); }
      else { setStatus("error"); setError(e.detail || "Error al analizar. Intenta de nuevo."); }
    }
  }

  const tabData = data?.[tab];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,5,.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,WebkitBackdropFilter:"blur(8px)",backdropFilter:"blur(8px)",padding:16}}>
      <div style={{background:"rgba(13,13,30,0.95)",border:`1px solid ${T.amber}33`,borderRadius:18,width:"100%",maxWidth:790,maxHeight:"92vh",display:"flex",flexDirection:"column",
        boxShadow:`0 30px 80px rgba(0,0,0,.65), 0 0 40px ${T.amber}08`,
        backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",animation:"scaleIn .25s ease"}}>

        {/* Header */}
        <div style={{padding:"16px 20px 0",borderBottom:"1px solid "+T.border}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{display:"flex",gap:9,alignItems:"center"}}>
              <span style={{fontSize:20}}>📖</span>
              <div>
                <div style={{color:T.ink,fontWeight:800,fontSize:17}}>Mundo de {concept.title||board.name}</div>
                <div style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:11}}>Extracción automática con IA · {cards.length} tarjetas analizadas</div>
              </div>
            </div>
            <OGhostBtn small onClick={onClose}>× Cerrar</OGhostBtn>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",gap:0}}>
            {WB_TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setStatus("idle"); }}
                style={{background:"none",border:"none",
                  borderBottom:"3px solid "+(tab===t.id?T.amber:"transparent"),
                  color:tab===t.id?T.amber:T.ink3,padding:"9px 18px",cursor:"pointer",
                  fontSize:13,fontWeight:tab===t.id?700:400,fontFamily:"var(--sans)",
                  marginBottom:-1,transition:"all .15s",display:"flex",gap:6,alignItems:"center"}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{flex:1,overflow:"auto",padding:"18px 20px"}}>
          {status==="no_key" && <AIKeySetup onSaved={() => setStatus("idle")} />}
          {/* Analyze button */}
          {(status==="idle"||status==="error") && (
            <div style={{marginBottom:18}}>
              <OBtn onClick={analyze}>
                ✦ Analizar tarjetas → extraer {WB_TABS.find(t=>t.id===tab)?.label}
              </OBtn>
              {error && <p style={{color:T.rose,fontSize:12,marginTop:8,fontFamily:"var(--mono)"}}>{error}</p>}
            </div>
          )}
          {status==="loading" && (
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <div className="spinner" style={{width:32,height:32,border:"3px solid "+T.border,borderTop:"3px solid "+T.amber,borderRadius:"50%",margin:"0 auto 16px"}}/>
              <p style={{color:T.ink3,fontSize:14,fontWeight:600}}>Leyendo las tarjetas…</p>
              <p style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:12,marginTop:4}}>Claude extrae y organiza los elementos del mundo</p>
            </div>
          )}
          {status==="done" && tabData && (
            <div>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                <OGhostBtn small onClick={()=>setStatus("idle")}>↻ Re-analizar</OGhostBtn>
              </div>

              {/* WORLD ATLAS */}
              {tab==="world" && (
                <div style={{display:"flex",flexDirection:"column",gap:20}}>
                  {WORLD_CATS.map(wc => {
                    const items = tabData[wc.key] || [];
                    if (!items.length) return null;
                    return (
                      <div key={wc.key}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:6,borderBottom:"2px solid "+T.amber+"33"}}>
                          <span style={{fontSize:16}}>{wc.icon}</span>
                          <span style={{color:T.ink,fontWeight:700,fontSize:15}}>{wc.label}</span>
                          <span style={{background:T.amberBg,color:T.amber,fontFamily:"var(--mono)",fontSize:10,padding:"1px 8px",borderRadius:99}}>{items.length}</span>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                          {items.map((item,i) => (
                            <div key={i} style={{background:T.bgPanel,border:"1px solid "+T.border,borderLeft:"3px solid "+T.amber,borderRadius:8,padding:"10px 12px"}}>
                              <div style={{color:T.ink,fontWeight:700,fontSize:13,marginBottom:3}}>{item.nombre}</div>
                              {item.tipo && <div style={{color:T.amber,fontFamily:"var(--mono)",fontSize:10,marginBottom:4}}>{item.tipo}</div>}
                              {item.descripcion && <div style={{color:T.ink3,fontSize:12,lineHeight:1.4}}>{item.descripcion}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {WORLD_CATS.every(wc => !(tabData[wc.key]||[]).length) && (
                    <div style={{textAlign:"center",padding:"24px 0",color:T.ink4,fontFamily:"var(--mono)",fontSize:13}}>No se encontraron elementos del mundo. Agrega más detalles en tus tarjetas.</div>
                  )}
                </div>
              )}

              {/* TIMELINE */}
              {tab==="timeline" && (() => {
                const eventos = tabData.eventos || [];
                const TYPE_COLORS_TL = { batalla:T.rose, fundacion:T.green, nacimiento:T.blue, muerte:"#6B7280", era:T.amber, profecia:T.accent, otro:T.ink3 };
                return (
                  <div>
                    {tabData.sistema_temporal && (
                      <div style={{background:T.amberBg,border:"1px solid "+T.amber+"44",borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:8}}>
                        <span style={{color:T.amber,fontSize:14,flexShrink:0}}>🗓</span>
                        <div>
                          <div style={{color:T.amber,fontWeight:700,fontSize:13}}>Sistema temporal</div>
                          <div style={{color:T.amber,fontSize:12,marginTop:2}}>{tabData.sistema_temporal}</div>
                          {tabData.era_actual && <div style={{color:T.amber,fontSize:12,marginTop:2,fontStyle:"italic"}}>Era actual: {tabData.era_actual}</div>}
                        </div>
                      </div>
                    )}
                    {eventos.length === 0 && (
                      <div style={{textAlign:"center",padding:"24px 0",color:T.ink4,fontFamily:"var(--mono)",fontSize:13}}>No se detectaron referencias temporales. Menciona fechas, eras o eventos en tus tarjetas.</div>
                    )}
                    {/* Timeline visual */}
                    <div style={{position:"relative",paddingLeft:32}}>
                      {/* Vertical line */}
                      <div style={{position:"absolute",left:10,top:0,bottom:0,width:2,background:T.border,borderRadius:1}}/>
                      {eventos.map((ev, i) => {
                        const color = TYPE_COLORS_TL[ev.tipo] || T.ink3;
                        return (
                          <div key={i} style={{position:"relative",marginBottom:22}}>
                            {/* Dot */}
                            <div style={{position:"absolute",left:-26,top:6,width:14,height:14,borderRadius:"50%",background:color,border:"3px solid "+T.bgCard,boxShadow:"0 0 0 2px "+color+"55"}}/>
                            <div style={{background:T.bgPanel,border:"1px solid "+T.border,borderLeft:"3px solid "+color,borderRadius:8,padding:"10px 14px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                                <span style={{background:color+"22",color,fontFamily:"var(--mono)",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99}}>{ev.fecha}</span>
                                <span style={{color:T.ink,fontWeight:700,fontSize:14}}>{ev.titulo}</span>
                                <span style={{color:color,fontFamily:"var(--mono)",fontSize:10,marginLeft:"auto"}}>{ev.tipo}</span>
                              </div>
                              {ev.descripcion && <div style={{color:T.ink3,fontSize:13,lineHeight:1.5}}>{ev.descripcion}</div>}
                              {ev.tarjeta && <div style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:10,marginTop:6}}>📌 {ev.tarjeta}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* FAMILY TREE */}
              {tab==="family" && (() => {
                const personajes = tabData.personajes || [];
                const relaciones = tabData.relaciones || [];
                if (!personajes.length) return (
                  <div style={{textAlign:"center",padding:"24px 0",color:T.ink4,fontFamily:"var(--mono)",fontSize:13}}>No se detectaron personajes ni relaciones. Describe personajes y sus vínculos en tus tarjetas.</div>
                );
                const FAMILY_COLORS = { padre_de:T.blue, madre_de:"#EC4899", hijo_de:T.blue, hija_de:"#EC4899", hermano_de:"#8B5CF6", hermana_de:"#8B5CF6", abuelo_de:"#0891B2", abuela_de:"#0891B2", nieto_de:T.green, nieta_de:T.green, pareja_de:T.rose, enemigo_de:T.orange, aliado_de:T.green, mentor_de:T.accent, discipulo_de:T.amber, otro:T.ink3 };
                const REL_LABEL = { padre_de:"padre de", madre_de:"madre de", hijo_de:"hijo de", hija_de:"hija de", hermano_de:"hermano de", hermana_de:"hermana de", abuelo_de:"abuelo de", abuela_de:"abuela de", nieto_de:"nieto de", nieta_de:"nieta de", tio_de:"tío de", tia_de:"tía de", primo_de:"primo de", pareja_de:"pareja de ♥", enemigo_de:"enemigo de ⚔", aliado_de:"aliado de", mentor_de:"mentor de", discipulo_de:"discípulo de", otro:"relacionado con" };

                // Group by family/group
                const groups = {};
                personajes.forEach(p => {
                  const g = p.grupo || "Sin grupo";
                  if (!groups[g]) groups[g] = [];
                  groups[g].push(p);
                });

                return (
                  <div>
                    {/* Relationship summary graph as list */}
                    <div style={{marginBottom:20}}>
                      <div style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:10,letterSpacing:1,marginBottom:12}}>RELACIONES ({relaciones.length})</div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {relaciones.map((rel,i) => {
                          const pA = personajes.find(p=>p.id===rel.de);
                          const pB = personajes.find(p=>p.id===rel.a);
                          const color = FAMILY_COLORS[rel.tipo] || T.ink3;
                          return (
                            <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:T.bgPanel,border:"1px solid "+T.border,borderRadius:8,padding:"10px 14px",flexWrap:"wrap"}}>
                              <div style={{background:color+"22",color,fontWeight:700,fontSize:13,padding:"4px 12px",borderRadius:8,minWidth:100,textAlign:"center"}}>
                                {pA?.nombre||rel.de}
                              </div>
                              <div style={{color,fontFamily:"var(--mono)",fontSize:11,fontWeight:600,flex:1,textAlign:"center",minWidth:100}}>
                                — {REL_LABEL[rel.tipo]||rel.tipo} →
                              </div>
                              <div style={{background:color+"22",color,fontWeight:700,fontSize:13,padding:"4px 12px",borderRadius:8,minWidth:100,textAlign:"center"}}>
                                {pB?.nombre||rel.a}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Family tree SVG for blood relations */}
                    <FamilyTreeSVG personajes={personajes} relaciones={relaciones} />

                    {/* Character cards */}
                    <div style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:10,letterSpacing:1,marginTop:20,marginBottom:12}}>PERSONAJES ({personajes.length})</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
                      {personajes.map((p,i)=>(
                        <div key={i} style={{background:T.bgPanel,border:"1px solid "+T.border,borderLeft:"3px solid "+T.amber,borderRadius:8,padding:"10px 12px"}}>
                          <div style={{color:T.ink,fontWeight:700,fontSize:13,marginBottom:3}}>{p.nombre}</div>
                          {p.rol&&<div style={{color:T.amber,fontFamily:"var(--mono)",fontSize:10,marginBottom:4}}>{p.rol}</div>}
                          {p.descripcion&&<div style={{color:T.ink3,fontSize:12,lineHeight:1.4}}>{p.descripcion}</div>}
                          {p.grupo&&<div style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:10,marginTop:5}}>🏰 {p.grupo}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple SVG family tree for blood/romantic relations
function FamilyTreeSVG({ personajes, relaciones }) {
  const bloodTypes = ["padre_de","madre_de","hijo_de","hija_de","hermano_de","hermana_de","abuelo_de","abuela_de","nieto_de","nieta_de","pareja_de","tio_de","tia_de","primo_de"];
  const relevant = relaciones.filter(r => bloodTypes.includes(r.tipo));
  if (!relevant.length) return null;

  // Simple horizontal layout
  const connected = new Set();
  relevant.forEach(r => { connected.add(r.de); connected.add(r.a); });
  const nodes = personajes.filter(p => connected.has(p.id));
  if (nodes.length < 2) return null;

  const NODE_W = 110, NODE_H = 40, GAP_X = 140, GAP_Y = 90;
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const nodePos = {};
  nodes.forEach((n, i) => {
    nodePos[n.id] = { x: (i % cols) * GAP_X + 20, y: Math.floor(i/cols) * GAP_Y + 20 };
  });
  const svgW = cols * GAP_X + 40;
  const svgH = Math.ceil(nodes.length / cols) * GAP_Y + 60;

  const REL_COLORS = { padre_de:T.blue, madre_de:"#EC4899", hermano_de:"#8B5CF6", hermana_de:"#8B5CF6", pareja_de:T.rose, abuelo_de:"#0891B2", abuela_de:"#0891B2", hijo_de:T.blue, hija_de:"#EC4899", nieto_de:T.green, nieta_de:T.green };
  const REL_LABEL  = { padre_de:"padre", madre_de:"madre", hermano_de:"hermano", hermana_de:"hermana", pareja_de:"♥", abuelo_de:"abuelo", abuela_de:"abuela", hijo_de:"hijo", hija_de:"hija", nieto_de:"nieto", nieta_de:"nieta", tio_de:"tío", tia_de:"tía", primo_de:"primo" };

  return (
    <div style={{marginBottom:20}}>
      <div style={{color:T.ink4,fontFamily:"var(--mono)",fontSize:10,letterSpacing:1,marginBottom:10}}>ÁRBOL VISUAL</div>
      <div style={{overflowX:"auto",background:T.bgPanel,border:"1px solid "+T.border,borderRadius:10,padding:10}}>
        <svg width={svgW} height={svgH} style={{display:"block"}}>
          {/* Relation lines */}
          {relevant.map((rel,i) => {
            const pa = nodePos[rel.de], pb = nodePos[rel.a];
            if (!pa||!pb) return null;
            const color = REL_COLORS[rel.tipo] || T.ink3;
            const x1=pa.x+NODE_W/2, y1=pa.y+NODE_H, x2=pb.x+NODE_W/2, y2=pb.y;
            const my=(y1+y2)/2;
            return (
              <g key={i}>
                <path d={`M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`}
                  fill="none" stroke={color} strokeWidth="1.8" opacity="0.6"
                  strokeDasharray={rel.tipo==="pareja_de"?"5 3":undefined}/>
                <text x={(x1+x2)/2} y={(y1+y2)/2} textAnchor="middle"
                  fontSize="9" fill={color} fontFamily="system-ui"
                  dy="-3">{REL_LABEL[rel.tipo]||rel.tipo}</text>
              </g>
            );
          })}
          {/* Nodes */}
          {nodes.map((n,i)=>{
            const p=nodePos[n.id];
            return (
              <g key={i}>
                <rect x={p.x} y={p.y} width={NODE_W} height={NODE_H} rx="6"
                  fill={T.bgCard} stroke={T.amber} strokeWidth="1.5"/>
                <text x={p.x+NODE_W/2} y={p.y+NODE_H/2} textAnchor="middle"
                  fontSize="12" fontWeight="600" fill={T.ink} fontFamily="system-ui"
                  dy="4">{n.nombre.length>14?n.nombre.slice(0,12)+"…":n.nombre}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
function OInput({ style, ...props }) {
  return (
    <input {...props}
      style={{ background:T.bgCard, border:`1.5px solid ${T.border2}`, color:T.ink,
        padding:"11px 14px", borderRadius:10, fontFamily:"var(--sans)", fontSize:14, width:"100%",
        outline:"none", transition:"border-color .2s, box-shadow .2s", ...style }}
      onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accentBg}`; }}
      onBlur={e  => { e.target.style.borderColor = T.border2; e.target.style.boxShadow = "none"; }}
    />
  );
}
function OTextarea({ style, ...props }) {
  return (
    <textarea {...props}
      style={{ background:T.bgCard, border:`1.5px solid ${T.border2}`, color:T.ink,
        padding:"11px 14px", borderRadius:10, fontFamily:"var(--mono)", fontSize:13, width:"100%",
        outline:"none", resize:"vertical", lineHeight:1.55, transition:"border-color .2s, box-shadow .2s", ...style }}
      onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accentBg}`; }}
      onBlur={e  => { e.target.style.borderColor = T.border2; e.target.style.boxShadow = "none"; }}
    />
  );
}
function OBtn({ children, full, small, disabled, onClick }) {
  const base = {
    background: disabled ? T.bgHover : T.ink,
    color: disabled ? T.ink4 : "#FFFFFF",
    border: disabled ? `1px solid ${T.border2}` : "none",
    padding: small ? "7px 16px" : "10px 24px",
    borderRadius: 99,
    fontFamily: "var(--sans)",
    fontWeight: 600,
    fontSize: small ? 12 : 13,
    letterSpacing: "0.01em",
    cursor: disabled ? "default" : "pointer",
    boxShadow: disabled ? "none" : "0 1px 3px rgba(0,0,0,0.18)",
    width: full ? "100%" : "auto",
    transition: "background .15s, box-shadow .15s, transform .12s",
  };
  return (
    <button onClick={onClick} disabled={disabled} style={base}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background=T.accentHover; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.22)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.background=disabled?T.bgHover:T.ink; e.currentTarget.style.boxShadow=disabled?"none":"0 1px 3px rgba(0,0,0,0.18)"; e.currentTarget.style.transform="translateY(0)"; }}>
      {children}
    </button>
  );
}
function OGhostBtn({ children, small, full, onClick }) {
  return (
    <button onClick={onClick}
      style={{ background:"transparent", border:`1px solid ${T.border2}`, color:T.ink3,
        padding:small?"6px 14px":"9px 20px", borderRadius:99, fontFamily:"var(--sans)",
        fontSize:small?12:13, cursor:"pointer", width:full?"100%":"auto", transition:"all .15s",
        fontWeight:500 }}
      onMouseEnter={e => { e.currentTarget.style.background=T.bgHover; e.currentTarget.style.color=T.ink; e.currentTarget.style.borderColor=T.ink4; }}
      onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.ink3; e.currentTarget.style.borderColor=T.border2; }}>
      {children}
    </button>
  );
}
function OOverlay({ children, onClose }) {
  const downRef = useRef(false);
  return (
    <div
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.65)", display:"flex", alignItems:"center",
        justifyContent:"center", zIndex:100, WebkitBackdropFilter:"blur(8px)", backdropFilter:"blur(8px)", padding:20 }}
      onMouseDown={e  => { downRef.current = (e.target === e.currentTarget); }}
      onMouseUp={e    => { if (downRef.current && e.target === e.currentTarget) onClose(); downRef.current = false; }}
      onTouchEnd={e   => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}
function OModalBox({ children, wide }) {
  return (
    <div style={{ background:"rgba(10,9,8,0.96)", border:"1px solid rgba(196,150,60,0.14)",
      borderRadius:18, padding:"28px", width:"100%", maxWidth:wide?510:430,
      maxHeight:"90vh", overflowY:"auto",
      boxShadow:"0 40px 100px rgba(0,0,0,.7), 0 0 0 1px rgba(196,150,60,0.10), inset 0 1px 0 rgba(255,255,255,0.06)",
      backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
      animation:"scaleIn .22s cubic-bezier(.16,1,.3,1)" }}>
      {children}
    </div>
  );
}
function OLabel({ children, style }) {
  return <div style={{ color:T.ink3, fontFamily:"var(--mono)", fontSize:11, letterSpacing:"0.08em", marginBottom:7, marginTop:2, textTransform:"uppercase", ...style }}>{children}</div>;
}
function OTag({ children, color, bg, small }) {
  return (
    <span style={{ background:bg||"rgba(255,255,255,0.06)", color:color||T.ink3,
      fontFamily:"var(--mono)", fontSize:small?9:10, padding:small?"1px 7px":"2px 9px",
      borderRadius:99, border:`1px solid ${color ? color+"44" : "rgba(255,255,255,0.1)"}`,
      letterSpacing:"0.02em" }}>
      {children}
    </span>
  );
}
function OSection({ title, children }) {
  return (
    <div style={{ marginBottom:32 }}>
      <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.15em", marginBottom:14, textTransform:"uppercase" }}>{title}</div>
      {children}
    </div>
  );
}
function StepBar({ current, total, color }) {
  return (
    <div style={{ display:"flex", gap:5, marginBottom:24 }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{ flex:1, height:3, borderRadius:2,
          background: current>i ? (color||T.accent) : "rgba(255,255,255,0.08)",
          boxShadow: current>i ? `0 0 8px ${(color||T.accent)}66` : "none",
          transition:"all .3s" }}/>
      ))}
    </div>
  );
}
function EmptyMsg({ children }) {
  return <div style={{ color:T.ink4, fontFamily:"var(--mono)", fontSize:12, padding:"18px 0", letterSpacing:"0.02em" }}>{children}</div>;
}
