import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("posts", (t) => {
    t.bigIncrements("id").primary();
    t.text("description").notNullable();
    t.text("imageUrl").notNullable();
    t.bigInteger("userId")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    t.timestamp("createdAt").defaultTo(knex.fn.now());
    t.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("posts");
}
