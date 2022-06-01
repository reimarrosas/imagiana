import { UserInfo } from "./src";

declare module "express-session" {
  interface Session {
    user: UserInfo;
  }
}

declare module "express-async-errors";

type foo = 'foo' | 'bar';
