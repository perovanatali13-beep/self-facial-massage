import { getSupabase, DOC } from "./supabase";
import type { SiteContent, CourseData, Lesson, User, Lead } from "./types";

/**
 * Data is stored in a single `documents` table on Supabase: one JSON document
 * per key (content / course / users / leads). These helpers mirror the old
 * file-based API so the rest of the app stays unchanged.
 */
async function readDoc<T>(id: string): Promise<T> {
  const { data, error } = await getSupabase()
    .from("documents")
    .select("data")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Не удалось прочитать «${id}»: ${error.message}`);
  return (data?.data ?? null) as T;
}

async function writeDoc(id: string, value: unknown): Promise<void> {
  const { error } = await getSupabase()
    .from("documents")
    .upsert({ id, data: value, updated_at: new Date().toISOString() });
  if (error) throw new Error(`Не удалось сохранить «${id}»: ${error.message}`);
}

/* ---------- Site content (landing) ---------- */
export const getContent = () => readDoc<SiteContent>(DOC.content);
export const saveContent = (data: SiteContent) => writeDoc(DOC.content, data);

/* ---------- Course ---------- */
export const getCourse = () => readDoc<CourseData>(DOC.course);
export const saveCourse = (data: CourseData) => writeDoc(DOC.course, data);

export async function getLesson(id: string): Promise<Lesson | undefined> {
  const course = await getCourse();
  return course.lessons.find((l) => l.id === id);
}

export async function upsertLesson(lesson: Lesson): Promise<void> {
  const course = await getCourse();
  const idx = course.lessons.findIndex((l) => l.id === lesson.id);
  if (idx >= 0) course.lessons[idx] = lesson;
  else course.lessons.push(lesson);
  course.lessons.sort((a, b) => a.day - b.day);
  await saveCourse(course);
}

export async function deleteLesson(id: string): Promise<void> {
  const course = await getCourse();
  course.lessons = course.lessons.filter((l) => l.id !== id);
  await saveCourse(course);
}

/* ---------- Users ---------- */
export const getUsers = () => readDoc<User[]>(DOC.users);
export const saveUsers = (data: User[]) => writeDoc(DOC.users, data);

/* ---------- Leads ---------- */
export const getLeads = () => readDoc<Lead[]>(DOC.leads);
export async function addLead(lead: Lead): Promise<void> {
  const leads = (await getLeads()) ?? [];
  leads.unshift(lead);
  await writeDoc(DOC.leads, leads);
}
