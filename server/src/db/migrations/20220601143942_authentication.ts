import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (t) => {
      t.bigIncrements("id").primary();
      t.string("fullName").notNullable();
      t.string("email").unique().notNullable();
      t.string("password").notNullable();
      t.boolean("isVerified").defaultTo(false);
      t.timestamp("createdAt").defaultTo(knex.fn.now());
      t.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
    .createTable("verificationIds", (t) => {
      t.bigIncrements("id").primary();
      t.string("verificationId").notNullable();
      t.bigInteger("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("verificationIds").dropTable("users");
}
