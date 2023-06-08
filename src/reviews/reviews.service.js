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

function update(updatedReview, review_id) {
  return knex("reviews")
    .where({ review_id })
    .update(updatedReview)
    .then(() => {
      return knex("reviews")
        .where({ review_id })
        .join("critics", "reviews.critic_id", "critics.critic_id")
        .select("reviews.*", "critics.*")
        .first();
    })
    .then(updatedRecord => {
      if (updatedRecord) {
        return addCritic(updatedRecord);
      }
      return null;
    });
}

module.exports = {
  read,
  delete: destroy,
  update,
};
