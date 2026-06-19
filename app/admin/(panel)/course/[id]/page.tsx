import { notFound } from "next/navigation";
import { getLesson, getCourse } from "@/lib/data";
import type { Lesson } from "@/lib/types";
import LessonEditor from "../LessonEditor";

export const dynamic = "force-dynamic";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let lesson: Lesson;
  if (id === "new") {
    const course = await getCourse();
    const nextDay =
      course.lessons.reduce((max, l) => Math.max(max, l.day), 0) + 1;
    lesson = {
      id: "new",
      day: nextDay,
      title: "",
      category: "",
      description: "",
      videoUrl: "",
      videoFile: "",
      content: "",
      published: false,
      date: new Date().toISOString().slice(0, 10),
    };
  } else {
    const found = await getLesson(id);
    if (!found) notFound();
    lesson = found;
  }

  return <LessonEditor lesson={lesson} />;
}
