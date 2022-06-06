import { RequestHandler } from "express";

import { ControllerResponse } from "..";
import { likePost, unlikePost } from "../db/services/likes.service";
import { validateIdQueryParam } from "../utils/validateIdQueryParam";

export const like: RequestHandler = async (req, res, _next) => {
  const postId = validateIdQueryParam(req.query["id"], "Post");

  const liked = await likePost({ postId, userId: req.session.user.id });
  const response: ControllerResponse = {
    success: true,
    message: `Post ${postId} liked!`,
  };
  if (liked.length === 0) {
    response.success = false;
    response.message = `Liking Post ${postId} failed!`;
  }

  res.send(response);
};

export const unlike: RequestHandler = async (req, res, _next) => {
  const postId = validateIdQueryParam(req.query["id"], "Post");

  const unliked = await unlikePost({ postId, userId: req.session.user.id });

  const response: ControllerResponse = {
    success: true,
    message: `Post ${postId} unliked!`,
  };

  if (unliked === 0) {
    response.success = false;
    response.message = `Unliking Post ${postId} failed!`;
  }
  res.send(response);
};
