
var notesTemplate = Handlebars.compile(
  `
    {{#each notes}}
    <div class="note">
        <span class="input"><textarea data-horse="pony" data-id="{{ @index }}"> {{ this }}</textarea></span>

        <button class="remove btn btn-xs" data-id="{{ @index }}">Delete</button>
        </div>
        {{/each}}
    `
);

const reloadNotes = (notes) => {
  console.log("RELOADING");
  console.log(notes);
  console.log(8);
  $("#notes").html(notesTemplate({ notes: notes }));
};

const beginSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").show();
};

// This function is used and defined to make a message disappear on the dom after saving our note.
const endSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").hide();
};



  // Add an event listener on the add button, such then when we press the button we grab the value from our text box and then send that value to our server in our post request, then we receive the new data from our server and reload all of our notes.
  $("#add").submit((e) => {
    e.preventDefault();
    console.log("add pressed");
    console.log(1);

    var val = $("textarea[name=note]").val();
    console.log(val);
    if (val === "") {
      return;
    }
    $("textarea[name=note]").val("");
    axios
      .post("/api/info/", {
        note: val,
      })
      .then((res) => {
        // window.location.reload();
        console.log(res);
        console.log(res.data);
        console.log(7);
        reloadNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  });

  $("#notes").on("blur", "textarea", (event) => {
    beginSaving(event.currentTarget);
    console.log($(event.currentTarget).data("horse"));
    console.log($(event.currentTarget).data("id"));

    axios
      .put("/api/info/" + $(event.currentTarget).data("id"), {
        note: $(event.currentTarget).val(),
      })
      .then((res) => {
        endSaving(event.currentTarget);
        reloadNotes(res.data);
      })
      .catch((e) => {
        endSaving(event.currentTarget);
        alert(e);
      });
  });

  $("#notes").on("click", ".remove", (event) => {
    beginSaving(event.currentTarget); // show saving message on DOM
    // Below we send out delete request using the data-id property on our targeted text area/ button
    console.log($(event.currentTarget).data("id"));
    axios
      .delete("/api/info/" + $(event.currentTarget).data("id"))
      .then((res) => {
        endSaving(event.currentTarget); // remove saving message from the DOM
        reloadNotes(res.data); // reload the notes on the DOM so that we only render the updated notes
      })
      .catch((e) => {
        endSaving(e.currentTarget);
        alert(e);
      });
  });


