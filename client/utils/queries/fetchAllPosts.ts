import { queryBuilder } from "./queryBuilder";

export const postQuery = (header?: Record<string, any>) =>
  queryBuilder("/posts/get", "get", {}, header);
