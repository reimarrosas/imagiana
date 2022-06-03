import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("likes", (t) => {
    t.bigInteger("userId")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    t.bigInteger("postId")
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE");
    t.primary(["userId", "postId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("likes");
}
