import { HttpBadRequest } from "./httpErrors";

type IDType = "Comment" | "Post" | "User";

export const validateIdQueryParam = (id: unknown, idType: IDType): number => {
  if (typeof id !== "string") {
    throw new HttpBadRequest(`${idType} ID must be a string!`);
  }

  const numId = parseInt(id);

  if (!numId) {
    throw new HttpBadRequest(`${idType} ID must be numeric!`);
  } else if (numId === 0) {
    throw new HttpBadRequest(`${idType} ID must be greater than zero!`);
  }

  return numId;
};
