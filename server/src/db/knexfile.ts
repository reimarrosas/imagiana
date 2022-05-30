import type { Knex } from "knex";
import path from "path";

import { databaseUrl } from "../utils/constants";

const config: Knex.Config = {
  client: "postgresql",
  connection: databaseUrl,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: path.join(__dirname, "migrations"),
  },
};

export default config;
