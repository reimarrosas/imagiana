import { RequestHandler } from "express";
import argon2 from "argon2";
import { createTransport } from "nodemailer";

import type { AuthCreds, ControllerResponse, SignupCreds, UserInfo } from "..";
import {
  createUser,
  createVerificationId,
  deleteVerificationId,
  getUserByEmail,
  verifyUser,
} from "../db/services/auth.service";
import {
  HttpBadRequest,
  HttpInternal,
  HttpUnauthorized,
} from "../utils/httpErrors";
import { urlRoot } from "../utils/constants";
import { nanoid } from "nanoid";
import { validateIdQueryParam } from "../utils/validateIdQueryParam";

const isEmailValid = (email: string): boolean =>
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    email
  );

const isPasswordValid = (password: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

const isAuthCredsValid = (authCreds: Partial<AuthCreds>): AuthCreds => {
  const { email, password } = authCreds;

  if (typeof email !== "string" || !isEmailValid(email)) {
    throw new HttpBadRequest("Email is invalid!");
  } else if (typeof password !== "string" || !isPasswordValid(password)) {
    throw new HttpBadRequest("Password must be alphanumeric with length 8!");
  }

  return {
    email: email.trim().toLowerCase(),
    password,
  };
};

const isSignupCredsValid = (signupCreds: Partial<SignupCreds>): SignupCreds => {
  const { fullName } = signupCreds;

  const authCreds = isAuthCredsValid(signupCreds);

  if (typeof fullName !== "string" || fullName.trim().length === 0) {
    throw new HttpBadRequest("Full Name must be a non-empty string!");
  }

  return {
    fullName,
    ...authCreds,
  };
};

const sendVerificationEmail = async (email: string, verificationId: string) => {
  const transporter = createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env["TRANSPORT_EMAIL"],
      pass: process.env["TRANSPORT_PASS"],
    },
  });
  await transporter.sendMail({
    from: `Imagiana <${process.env["TRANSPORT_EMAIL"]}>`,
    to: email,
    subject: "Verify your email!",
    html: `Verify your account using this <a href="${urlRoot}/api/auth/verify?id=${verificationId}">link</a>`,
  });
};

// Login
export const login: RequestHandler = async (req, res, _next) => {
  const { email, password } = isAuthCredsValid(req.body);
  const { keep } = req.query;

  const user = await getUserByEmail(email);

  let response: Partial<ControllerResponse> = {
    success: false,
  };

  if (!user) {
    response.message = "User does not exist!";
  } else if (!user.isVerified) {
    response.message = "User is not verified!";
  } else if (!(await argon2.verify(user.password, password))) {
    response.message = "Password is invalid!";
  } else {
    const THREE_YEARS = 1000 * 60 * 60 * 24 * 365;

    response.success = true;
    response.message = "Login successful!";
    const userInfo: UserInfo = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };
    response["user"] = userInfo;
    req.session.user = userInfo;
    req.session.cookie.maxAge = keep ? THREE_YEARS : undefined;
  }

  res.send(response);
};

// Signup
export const signup: RequestHandler = async (req, res, _next) => {
  const { fullName, email, password } = isSignupCredsValid(req.body);

  const user = await getUserByEmail(email);

  let response: Partial<ControllerResponse> = {
    success: false,
  };
  let statusCode: number = 200;

  if (user) {
    response.message = "User already exists!";
  } else {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 14, // 16MB
    });
    const user = await createUser({
      fullName,
      email,
      password: hashedPassword,
    });

    if (!user) throw new HttpInternal();

    const verificationId = nanoid();
    await createVerificationId({ userId: user.id, verificationId });
    await sendVerificationEmail(email, verificationId);
    response.success = true;
    response.message = "Signup successful!";
    statusCode = 201;
  }

  res.status(statusCode).send(response);
};

export const verify: RequestHandler = async (req, res, _next) => {
  const id = validateIdQueryParam(req.query["id"], "Verification");

  if (typeof id !== "string")
    throw new HttpBadRequest("Verification ID required!");

  const verificationId = await deleteVerificationId(id);

  let response: Partial<ControllerResponse> = { success: false };
  if (!verificationId) {
    response.message = "Verification ID already used or does not exist!";
  } else {
    const verifiedUser = await verifyUser(verificationId.userId);
    if (!verifiedUser) throw new HttpInternal();
    response.success = true;
    response.message = "User verification successful!";
  }

  res.send(response);
};

export const logout: RequestHandler = async (req, res, _next) => {
  req.session.destroy(() => {});
  const response: ControllerResponse = {
    success: true,
    message: "Logout successful!",
  };
  res.send(response);
};

export const authorize: RequestHandler = async (req, _res, next) => {
  if (!req.session.user) throw new HttpUnauthorized();
  return next();
};
