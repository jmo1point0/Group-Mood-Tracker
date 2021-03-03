const orm = require("./orm");
const db = require("./connection")(process.env.DB_NAME, process.env.DB_PWD);

function router(app) {
  app.get("/api/notes", async (req, res) => {
    const data = await orm.getNotes();

    res.send(data);
  });

  app.get("/api/notes/:id", async function (req, res) {
    const id = req.params.id;
    const notesData = await orm.getOne(id);
    if (notesData.length === 1) {
      console.log(`[GET /api/quotes/${id}] notesData`, notesData);
      res.send(notesData[0]);
    } else {
      res.status(404).end();
    }
  });

  app.get(`/api/dates/:range`, async (req, res) => {
    let range = req.params.range;
    const desiredData = orm.getDesired( range )

    res.send(desiredData);
  });

  app.post("/api/notes", async (req, res) => {
    const note = req.body
    await orm.postNote( note.emotion, note.title, note.note )

    res.redirect("/");
  });

  app.put("/api/notes/:id", async (req, res) => {
    const noteData = req.body;
    const id = req.params.id;
    await orm.updateNote(noteData.emotion, noteData.title, noteData.note, id);

    res.send({ message: "Note Updated!" });
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const id = req.params.id;
    await orm.deleteNote(id);

    res.send({ message: `Delete ${id}` });
  });
}

module.exports = router;
