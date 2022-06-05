import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("comments", (t) => {
    t.bigIncrements("id").primary();
    t.text("comment").notNullable();
    t.bigInteger("postId")
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE");
    t.bigInteger("userId")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    t.timestamp("createdAt").defaultTo(knex.fn.now());
    t.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable("comments");
}
