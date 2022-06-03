import { RequestHandler } from "express";

import { ControllerResponse } from "..";
import { HttpBadRequest, HttpInternal } from "../utils/httpErrors";
import { likePost, unlikePost } from "../db/services/likes.service";

const validatePostId = (pid: unknown): number => {
  if (typeof pid !== "string") throw new HttpBadRequest("Post ID required!");
  const postId = parseInt(pid);
  if (!pid) throw new HttpBadRequest("Post ID must be an integer!");
  return postId;
};

export const like: RequestHandler = async (req, res, _next) => {
  const { postId: pid } = req.query;

  const postId = validatePostId(pid);

  const result = await likePost({ postId, userId: req.session.user.id });
  if (result.length === 0) throw new HttpInternal();

  const response: ControllerResponse = {
    success: true,
    message: `Post ${pid} liked!`,
  };
  res.send(response);
};

export const unlike: RequestHandler = async (req, res, _next) => {
  const { postId: pid } = req.query;

  const postId = validatePostId(pid);

  const result = await unlikePost({ postId, userId: req.session.user.id });
  if (result.length === 0) throw new HttpInternal();

  const response: ControllerResponse = {
    success: true,
    message: `Post ${pid} unliked!`,
  };
  res.send(response);
};
