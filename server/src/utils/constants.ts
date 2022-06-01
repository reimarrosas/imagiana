export const port = process.env["PORT"] ?? 8080;

export const sessionSecret = process.env["SESSION_SECRET"] ?? "keyboard cat";

export const sessionStoreUrl =
  process.env["SESSION_URL"] ?? "redis://localhost:6379";

export const databaseUrl =
  process.env["DATABASE_URL"] ?? "postgres://reimar:reimar@localhost/imagiana";

export const urlRoot = process.env["URL_ROOT"] ?? `http://localhost:${port}`;
