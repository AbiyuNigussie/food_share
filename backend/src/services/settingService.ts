import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/**
 * Update the authenticated user’s basic info.
 */
export async function updateUserProfile(
  userId: string,
  data: { firstName: string; lastName: string; email: string; phoneNumber: string }
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
    },
  });
}

/**
 * Change the authenticated user’s password.
 */
export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  // fetch existing hash
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });
  if (!user) throw new Error("User not found");

  // verify current password
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    const err = new Error("Current password is incorrect");
    // @ts-ignore
    err.code = "INCORRECT_PASSWORD";
    throw err;
  }

  // hash & save new
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
  return true;
}
