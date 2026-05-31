import { z } from "zod";
import { prisma } from "../config/prisma.js";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  email: z.string().trim().email("A valid email address is required"),
  subject: z.string().trim().min(1, "Subject is required").max(160, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long")
});

export async function createContactMessage(input: unknown) {
  const data = contactSchema.parse(input);

  return prisma.contactMessage.create({
    data
  });
}
