const knex = require("../db/connection");

async function readCritic (critic_id){
  return knex("critics").where({ critic_id }).first();
};

async function getCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
};

 function read (review_id) {
  return knex("reviews")
    .where({ review_id: review_id })
    .first();
};

function list (movie_id) {
  return knex("reviews")
    .where({ movie_id })
    .then((reviews) => Promise.all(reviews.map(getCritic)));
};

function update(updatedReview){
  return knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(() => read(updatedReview.review_id))
    .then(getCritic);
};


function destroy (review_id) {
  return knex("reviews").where({ review_id: review_id }).del();
};

module.exports = {
  list,
  read,
  update,
  delete: destroy,
};
