import type { Users, VerificationIds } from "../..";
import db from "../setup";

export const getUserByEmail = async (email: string) =>
  await db<Users>("users").where({ email }).first();

export const createUser = async (user: Partial<Users>) =>
  (await db<Users>("users").insert(user).returning("*"))[0];

export const verifyUser = async (userId: number) =>
  (
    await db<Users>("users")
      .where({ id: userId })
      .update("isVerified", true)
      .returning("*")
  )[0];

export const createVerificationId = async (
  verificationId: Partial<VerificationIds>
) => await db<VerificationIds>("verificationIds").insert(verificationId);

export const deleteVerificationId = async (verificationId: string) =>
  (
    await db<VerificationIds>("verificationIds")
      .where({ verificationId })
      .del()
      .returning("*")
  )[0];
