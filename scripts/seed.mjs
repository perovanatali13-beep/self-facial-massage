import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import path from "path";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL / SUPABASE_KEY не заданы");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const dataDir = path.join(process.cwd(), "data");
const read = (f) => JSON.parse(readFileSync(path.join(dataDir, f), "utf-8"));

const docs = [
  { id: "content", data: read("content.json") },
  { id: "course", data: read("lessons.json") },
  { id: "users", data: read("users.json") },
  { id: "leads", data: read("leads.json") },
];

for (const doc of docs) {
  const { error } = await supabase
    .from("documents")
    .upsert({ id: doc.id, data: doc.data, updated_at: new Date().toISOString() });
  if (error) {
    console.error(`✗ ${doc.id}:`, error.message);
    process.exit(1);
  }
  console.log(`✓ ${doc.id}`);
}
console.log("Готово: данные загружены в Supabase.");
