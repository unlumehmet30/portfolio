import { prisma } from "../config/prisma.js";
import { resume as fallbackResume } from "../data/resume.js";
import { parseJsonField } from "../utils/json.js";

export async function getResume() {
  const content = await prisma.siteContent.findUnique({
    where: { key: "resume" }
  });

  if (!content) {
    return fallbackResume;
  }

  return parseJsonField(content.value, fallbackResume);
}
