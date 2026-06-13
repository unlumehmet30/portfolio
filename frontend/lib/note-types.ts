import type { Locale } from "@/lib/locale";
import type { PostType } from "@/types/content";

export const noteTypeOptions: Array<{ value: PostType; label: Record<Locale, string> }> = [
  { value: "blog", label: { en: "Blog", tr: "Blog" } },
  { value: "course-note", label: { en: "Course Note", tr: "Ders Notu" } },
  { value: "visual-note", label: { en: "Visual Note", tr: "Görsel Not" } },
  { value: "cheatsheet", label: { en: "Cheat Sheet", tr: "Özet Kartı" } }
];

export function normalizeNoteType(type: PostType | null | undefined): PostType {
  return noteTypeOptions.find((option) => option.value === type)?.value ?? "blog";
}

export function getNoteTypeLabel(type: PostType | null | undefined, locale: Locale) {
  const normalizedType = normalizeNoteType(type);
  return noteTypeOptions.find((option) => option.value === normalizedType)?.label[locale] ?? normalizedType;
}
