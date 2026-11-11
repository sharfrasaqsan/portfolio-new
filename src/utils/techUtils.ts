// Canonical list of primary core technologies (excluding minor scripts, page builders, styling utilities, and sub-APIs)
export const MAIN_TECHS = [
  "React",
  "Next.js",
  "TypeScript",
  "WordPress",
  "PHP",
  "GoHighLevel (GHL)",
  "Node.js",
  "Supabase",
  "Firebase",
] as const;

export type MainTech = (typeof MAIN_TECHS)[number];

export const normalizeToMainTech = (raw: string): MainTech | null => {
  if (!raw) return null;
  const lower = raw.trim().toLowerCase();
  if (lower === "react" || lower === "react.js") return "React";
  if (lower === "next.js" || lower === "next" || lower === "nextjs")
    return "Next.js";
  if (lower === "typescript" || lower === "ts") return "TypeScript";
  if (lower === "wordpress" || lower === "wp") return "WordPress";
  if (lower.includes("gohighlevel") || lower.includes("ghl"))
    return "GoHighLevel (GHL)";
  if (lower === "php") return "PHP";
  if (
    lower === "node.js" ||
    lower === "node" ||
    lower === "nodejs" ||
    lower === "express.js" ||
    lower === "express"
  )
    return "Node.js";
  if (lower === "supabase") return "Supabase";
  if (lower === "firebase" || lower === "firestore") return "Firebase";
  return null;
};

export const extractMainTechs = (techStack: any): MainTech[] => {
  const list: string[] = Array.isArray(techStack)
    ? techStack
    : typeof techStack === "string"
      ? techStack.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const result: MainTech[] = [];
  list.forEach((t) => {
    const main = normalizeToMainTech(t);
    if (main && !result.includes(main)) {
      result.push(main);
    }
  });

  return result;
};

