import { RequestHandler } from "express";

import { CommentData, Comments, ControllerResponse } from "..";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../db/services/comments.service";
import { HttpBadRequest, HttpForbidden } from "../utils/httpErrors";
import { validateIdQueryParam } from "../utils/validateIdQueryParam";

const validateCommentData = (
  commentData: Partial<CommentData>
): CommentData => {
  const { comment, postId } = commentData;
  if (typeof comment !== "string" || comment.trim().length === 0) {
    throw new HttpBadRequest("Comment must be a non-empty string!");
  } else if (
    typeof postId !== "number" ||
    !Number.isInteger(postId) ||
    postId < 1
  ) {
    throw new HttpBadRequest("Post ID must be an integer greater than one!");
  }

  return {
    comment,
    postId,
  };
};

export const create: RequestHandler = async (req, res, _next) => {
  const commentData: Partial<Comments> = validateCommentData(req.body);

  commentData.userId = req.session.user.id;

  const comment = await createComment(commentData);

  if (comment.length === 0) {
    throw new Error("Comment insertion failed!");
  }

  const response: ControllerResponse = {
    message: "Comment creation successful!",
    success: true,
  };

  res.status(201).send(response);
};

export const update: RequestHandler = async (req, res, _next) => {
  const commentData = validateCommentData(req.body);
  const commentId = validateIdQueryParam(req.query["id"], "Comment");

  const updated = await updateComment(
    { id: commentId, userId: req.session.user.id },
    commentData
  );

  if (updated === 0) {
    throw new HttpForbidden("Comment update forbidden!");
  }

  const response: ControllerResponse = {
    success: true,
    message: "Comment update successful!",
  };

  res.send(response);
};

export const del: RequestHandler = async (req, res, _next) => {
  const commentId = validateIdQueryParam(req.query["id"], "Comment");

  const deleted = await deleteComment({
    id: commentId,
    userId: req.session.user.id,
  });

  if (deleted === 0) {
    throw new HttpForbidden("Comment deletion forbidden!");
  }

  const response: ControllerResponse = {
    success: true,
    message: "Comment deletion successful!",
  };

  res.send(response);
};
