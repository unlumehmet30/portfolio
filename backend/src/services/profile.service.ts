import { prisma } from "../config/prisma.js";

export async function getProfile() {
  return prisma.userProfile.findFirst();
}
