import db from "../setup";

import type { Likes } from "../..";

export const likePost = async (like: Likes) =>
  await db<Likes>("likes")
    .insert(like, "*")
    .onConflict(["postId", "userId"])
    .ignore();

export const unlikePost = async (like: Likes) =>
  await db<Likes>("likes").where(like).del();
