import { promises as fs } from "fs";
import path from "path";
import type { SiteContent, CourseData, Lesson, User, Lead } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

/* ---------- Site content (landing) ---------- */
export const getContent = () => readJson<SiteContent>("content.json");
export const saveContent = (data: SiteContent) => writeJson("content.json", data);

/* ---------- Course ---------- */
export const getCourse = () => readJson<CourseData>("lessons.json");
export const saveCourse = (data: CourseData) => writeJson("lessons.json", data);

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
export const getUsers = () => readJson<User[]>("users.json");
export const saveUsers = (data: User[]) => writeJson("users.json", data);

/* ---------- Leads ---------- */
export const getLeads = () => readJson<Lead[]>("leads.json");
export async function addLead(lead: Lead): Promise<void> {
  const leads = await getLeads();
  leads.unshift(lead);
  await writeJson("leads.json", leads);
}
