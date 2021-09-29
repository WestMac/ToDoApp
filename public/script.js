(function(e, d, w) {
  if(!e.composedPath) {
    e.composedPath = function() {
      if (this.path) {
        return this.path;
      } 
    var target = this.target;

    this.path = [];
    while (target.parentNode !== null) {
      this.path.push(target);
      target = target.parentNode;
    }
    this.path.push(d, w);
    return this.path;
    }
  }
})(Event.prototype, document, window);


document.querySelectorAll(".checkboxElement").forEach(checkbox => {
  checkbox.addEventListener("change", event => {
    var path = event.path || (event.composedPath && event.composedPath());
    path[2].classList.toggle("finished");
    path[2].nextElementSibling.nextElementSibling.lastElementChild.classList.toggle(
      "deleteElementVis"
    );
    // event.path[2].nextElementSibling.nextElementSibling.lastElementChild.classList.toggle('deleteElementVis')
  });
});

if (document.querySelector(".btnAdd")) {
  document.querySelector(".btnAdd").addEventListener("click", event => {});
}

let lastClicked;

// document.querySelector('body > div.d-flex.flex-row.flex-wrap.align-content-center.justify-content-center.mt-5 > div > h1:nth-child(5) > ul > li:nth-child(1)')
//   .addEventListener('click', event => {
//     alert('elo')
//   })



document.querySelectorAll(".toDoElement").forEach(function(el) {
    el.addEventListener('click', function(event) { 
      // if (event.path[0] == el.childNodes[1].children[0]) {
      //   return;
      // }
      el.classList.add("hidden");
      el.nextElementSibling.value = el.innerText;
      el.nextElementSibling.classList.remove("hidden");
      el.nextElementSibling.focus();
      el.classList.remove("d-flex");
      lastClicked = el;
    })
});

document.querySelectorAll(".toDoElementEdit").forEach(textarea => {
  textarea.addEventListener("focusout", async event => {
    textarea.classList.add("hidden");
    lastClicked.lastElementChild.innerText = textarea.value;
    lastClicked.classList.remove("hidden");
    lastClicked.classList.add("d-flex");

    await fetch(`http://localhost/list/toDo/${textarea.name}`, {
      method: "PATCH",
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
  },false);
});

let typingTimer;
let finishedTypingInterval = 500;
let myInput = document.querySelectorAll(".inputEditor");
let currentFocus;
myInput.forEach(search => {
  
  search.addEventListener("input", event => {
    var path = event.path || (event.composedPath && event.composedPath());
    if (event.keyCode == 40 || event.keyCode == 38 || event.keyCode == 27) {
      return;
    }
    clearTimeout(typingTimer);
    let listId = path[4].getAttribute("name");
    let username = path[0].value;
    if (username) {
      typingTimer = setTimeout(function () {
        fetch(`http://localhost/list/${listId}/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response => response.json())
          .then(data => {
            let box,
              item = username;
            closeAllLists();
            currentFocus = -1;
            box = document.createElement("DIV");
            box.setAttribute("id", "autocomplete-list");
            box.setAttribute("class", "autocomplete-items");
            path[1].appendChild(box);
            for (let i = 0; i < data.length; i++) {
              item = document.createElement("DIV");
              item.innerHTML = "<strong>" + data[i].substr(0, username.length) + "</strong>";
              item.innerHTML += data[i].substr(username.length);
              item.innerHTML += "<input type='hidden' value='" + data[i] + "'>";
              item.addEventListener("click", function (e) {
                var textPath = e.path || (e.composedPath && e.composedPath());
                path[0].value = textPath[0].innerText;
                closeAllLists();
                addEditor(listId, textPath[0].innerText);
              });
              box.appendChild(item);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }, finishedTypingInterval);
    }
  });
});

myInput.forEach(search => {
  search.addEventListener("keydown", function (event) {
    var path = event.path || (event.composedPath && event.composedPath());
    var list = document.getElementById("autocomplete-list");
    if (list) list = list.getElementsByTagName("div");
    if (event.keyCode == 40) {
      // keycode 40 arrow down
      currentFocus++;
      addActive(list);
    } else if (event.keyCode == 38) {
      // keyCode 38 arrow up
      currentFocus--;
      addActive(list);
    } else if (event.keyCode == 13) {
      let listId = path[4].getAttribute("name");
      let username = path[0].value;
      username = path[0].nextElementSibling.children[currentFocus].innerText;
      closeAllLists(event.target);
      event.preventDefault();
      addEditor(listId, username);
      if (currentFocus > -1) {
        if (list) list[currentFocus].click();
      }
    } else if (event.keyCode == 27) {
      closeAllLists(event.target);
    }
  });
});

function addActive(item) {
  if (!item) return false;
  removeActive(item);
  if (currentFocus >= item.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = item.length - 1;
  item[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
  for (let i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}

function closeAllLists(currentList) {
  var list = document.getElementsByClassName("autocomplete-items");
  for (let i = 0; i < list.length; i++) {
    if (currentList != list[i] && currentList != myInput) {
      list[i].parentNode.removeChild(list[i]);
    }
  }
}

function addEditor(listId, username) {
  fetch(`http://localhost/list/${listId}/${username}`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

document.addEventListener("click", function (e) {
  closeAllLists(e.target);
});

document.querySelector(".createList").addEventListener("click", event => {
  document.querySelector(".listCreate").classList.toggle("listDisplay");
});









////////////////////////// FUNCTIONS ?/////////////////////////////////

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}