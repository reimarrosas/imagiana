import { Comments } from "../..";
import db from "../setup";

export const getAllCommentsWithPostId = async (postId: number) =>
  await db<Comments>("comments").where({ postId });

export const createComment = async (comment: Partial<Comments>) =>
  await db<Comments>("comments").insert(comment, "*");

export const updateComment = async (
  previousComment: Partial<Comments>,
  newComment: Partial<Comments>
) => await db<Comments>("comments").where(previousComment).update(newComment);

export const deleteComment = async (comment: Partial<Comments>) =>
  await db<Comments>("comments").where(comment).del();
