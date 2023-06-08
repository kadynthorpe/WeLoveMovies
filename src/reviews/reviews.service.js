const knex = require("../db/connection");

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

async function addCritic(review) {
  review.critic = await readCritic(review.critic_id);

  return review;
}

function update(updatedReview, reviewId) {
  return knex("reviews as r")
    .select("r.*")
    .where({ "r.review_id": reviewId })
    .update(updatedReview, "r.*")
    .then(() => read(reviewId))
    .then(addCritic);
}

module.exports = {
  read,
  delete: destroy,
  update,
};