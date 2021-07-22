

class NoteService {
  constructor(knex) {
    this.knex = knex;
  }

  async add(note, user) {
    let query = await this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    console.log(query);

    if (query.length === 1) {
      await this.knex
        .insert({
          content: note,
          user_id: query[0].id,
        })
        .into("notes");
    } else {
      throw new Error(`The note is not there`);
    }
  }

  list(user) {
    if (typeof user !== "undefined") {
      let query = this.knex
        .select("notes.id", "notes.content")
        .from("notes")
        .innerJoin("users", "notes.user_id", "users.id")
        .where("users.username", user)
        .orderBy("notes.id", "asc");

      return query.then((rows) => {
        console.log(rows, "pp");
        return rows.map((row) => ({
          id: row.id,
          content: row.content,
        }));
      });
    } else {
      let query = this.knex
        .select("users.username", "notes.id", "content")
        .from("notes")
        .innerJoin("users", "notes.user_id", "users.id");

      return query.then((rows) => {
        console.log(rows);
        const result = {};
        rows.forEach((row) => {
          if (typeof result[row.username] === "undefined") {
            result[row.username] = [];
          }
          result[row.username].push({
            id: row.id,
            content: row.content,
          });
        });
        return result;
      });
    }
  }
  update(id, note, user) {
    let query = this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    return query.then((rows) => {
      if (rows.length === 1) {
        return this.knex("notes").where("id", id).update({
          content: note,
        });
      } else {
        throw new Error(`The user is not there`);
      }
    });
  }
  remove(id, user) {
    let query = this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    return query.then((rows) => {
      if (rows.length === 1) {
        return this.knex("notes").where("id", id).del();
      } else {
        throw new Error(`The user is not there`);
      }
    });
  }
}

module.exports = NoteService;
