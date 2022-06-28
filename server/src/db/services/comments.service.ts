import { Comments } from "../..";
import db from "../setup";

export const getAllCommentsWithPostId = async (postId: number) =>
  await db<Comments>("comments")
    .join("users", "comments.userId", "users.id")
    .select(
      "comments.id",
      "users.email",
      "users.fullName",
      "comments.comment",
      "comments.postId",
      "comments.userId",
      "comments.createdAt",
      "comments.updatedAt"
    )
    .where({ postId })
    .orderBy("createdAt", "asc");

export const createComment = async (comment: Partial<Comments>) =>
  (await db<Comments>("comments").insert(comment, "*"))[0];

export const updateComment = async (
  previousComment: Partial<Comments>,
  newComment: Partial<Comments>
) => await db<Comments>("comments").where(previousComment).update(newComment);

export const deleteComment = async (comment: Partial<Comments>) =>
  await db<Comments>("comments").where(comment).del();
