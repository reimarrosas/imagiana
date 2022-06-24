import { queryBuilder } from "./queryBuilder";

export const authStatusQuery = (headers?: Record<string, any>) =>
  queryBuilder("/auth/status", "post", {}, headers);
