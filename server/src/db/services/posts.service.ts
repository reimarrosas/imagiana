import { PostQuery, Posts } from "../..";
import db from "../setup";

export const getAllPosts = async (): Promise<PostQuery[]> =>
  await db<Posts>("posts")
    .join("users", "users.id", "posts.userId")
    .select(
      "posts.id",
      "posts.description",
      "posts.imageUrl",
      "posts.userId",
      "users.fullName",
      "users.email",
      "posts.createdAt",
      "posts.updatedAt"
    );

export const createPost = async (post: Partial<Posts>) =>
  await db<Posts>("posts").insert(post).returning("*");

const pq: PostQuery = {};
