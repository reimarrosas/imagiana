import type { RequestHandler } from "express";
import { v2 as cloudinary } from "cloudinary";

import { ControllerResponse, PostData, PostResult } from "..";
import {
  HttpBadRequest,
  HttpForbidden,
  HttpInternal,
} from "../utils/httpErrors";
import { cloudinaryMaxDataUriLength } from "../utils/constants";
import {
  createPost,
  deletePost,
  getAllPosts,
} from "../db/services/posts.service";
import { validateIdQueryParam } from "../utils/validateIdQueryParam";
import { getAllCommentsWithPostId } from "../db/services/comments.service";
import { isPostLiked } from "../db/services/likes.service";

const validatePostData = (postData: Partial<PostData>): PostData => {
  const { description, imageData } = postData;
  if (typeof description !== "string" || description.trim().length === 0) {
    throw new HttpBadRequest("Description must be a non-empty string!");
  } else if (
    typeof imageData !== "string" ||
    !imageData.includes("image/") ||
    imageData.length > cloudinaryMaxDataUriLength
  ) {
    throw new HttpBadRequest("Image Data URI must have an image MIME type!");
  }

  return {
    imageData,
    description,
  };
};

const fetchAllPosts = async (userId: number) => {
  const postQueries = await getAllPosts();

  const postResult = postQueries.map(async (p) => ({
    comments: await getAllCommentsWithPostId(p.id),
    likedByUser:
      (await isPostLiked({
        postId: p.id,
        userId,
      })) !== undefined,
    email: p.email,
    fullName: p.fullName,
    id: p.id,
    description: p.description,
    imageUrl: p.imageUrl,
    userId: p.userId,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  return Promise.all(postResult);
};

export const getAll: RequestHandler = async (req, res, _next) => {
  const posts: PostResult[] = await fetchAllPosts(req.session.user.id);

  const response: ControllerResponse = {
    message: "All posts are fetched",
    success: true,
    query: posts,
  };

  res.send(response);
};

export const create: RequestHandler = async (req, res, _next) => {
  const { imageData, description } = validatePostData(req.body);

  const result = await cloudinary.uploader.upload(imageData);
  const postCreated = await createPost({
    description,
    userId: req.session.user.id,
    imageUrl: result.secure_url,
  });

  if (postCreated.length === 0) throw new HttpInternal();
  const response: ControllerResponse = {
    message: "Post creation successful!",
    success: true,
    query: postCreated,
  };

  res.status(201).send(response);
};

export const delPost: RequestHandler = async (req, res, _next) => {
  const postId = validateIdQueryParam(req.query["id"], "Post");

  const deletedPost = await deletePost(postId, req.session.user.id);

  if (deletedPost.length === 0) {
    throw new HttpForbidden("Post deletion forbidden!");
  }

  const response: ControllerResponse = {
    success: true,
    message: `Post ${postId} deletion successful!`,
  };

  res.send(response);
};
