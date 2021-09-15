document.querySelectorAll(".checkboxElement").forEach(checkbox => {
  checkbox.addEventListener("change", event => {
    event.path[2].classList.toggle("finished");
    event.path[2].nextElementSibling.nextElementSibling.lastElementChild.classList.toggle(
      "deleteElementVis"
    );
    // event.path[2].nextElementSibling.nextElementSibling.lastElementChild.classList.toggle('deleteElementVis')
  });
});

if (document.querySelector(".btnAdd")) {
  document.querySelector(".btnAdd").addEventListener("click", event => {});
}

let lastClicked;

document.querySelectorAll(".toDoElement").forEach(el => {
  el.addEventListener("click", event => {
    if (event.path[0] == el.childNodes[1].children[0]) {
      return;
    }
    el.classList.add("hidden");
    el.nextElementSibling.value = el.innerText;
    el.nextElementSibling.classList.remove("hidden");
    el.nextElementSibling.focus();
    el.classList.remove("d-flex");
    lastClicked = el;
  });
});

document.querySelectorAll(".toDoElementEdit").forEach(textarea => {
  textarea.addEventListener("focusout", async event => {
    textarea.classList.add("hidden");
    lastClicked.lastElementChild.innerText = textarea.value;
    lastClicked.classList.remove("hidden");
    lastClicked.classList.add("d-flex");

    await fetch(`http://localhost/list/toDo/${textarea.name}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: textarea.value }),
    })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  });
});

// document.querySelector(".inputEditor").addEventListener("keyup", event => {});

document.querySelector(".createList").addEventListener("click", event => {
  document.querySelector(".listCreate").classList.toggle("listDisplay");
});
