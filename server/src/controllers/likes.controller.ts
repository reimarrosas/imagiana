import { RequestHandler } from "express";

import { ControllerResponse } from "..";
import { likePost, unlikePost } from "../db/services/likes.service";
import { validateIdQueryParam } from "../utils/validateIdQueryParam";

export const like: RequestHandler = async (req, res, _next) => {
  const postId = validateIdQueryParam(req.query["id"], "Post");

  const liked = await likePost({ postId, userId: req.session.user.id });
  if (liked.length === 0) throw new Error("Post liking failed!");

  const response: ControllerResponse = {
    success: true,
    message: `Post ${postId} liked!`,
  };
  res.send(response);
};

export const unlike: RequestHandler = async (req, res, _next) => {
  const postId = validateIdQueryParam(req.query["id"], "Post");

  const unliked = await unlikePost({ postId, userId: req.session.user.id });
  if (unliked === 0) throw new Error("Post unliking failed!");

  const response: ControllerResponse = {
    success: true,
    message: `Post ${postId} unliked!`,
  };
  res.send(response);
};
