exports.seed = function (knex, Promise) {
  return knex("notes")
    .del()
    .then(() => {
      return knex("users")
        .del()
        .then(function () {
          // Inserts seed entries
          return knex("users")
            .insert([
              { username: "zach", password: "ihatenotes" },
            ])
            .then(() => {
              return knex("notes").insert([
                { content: "one", user_id: 1 },
              ]);
            });
        });
    });
};
