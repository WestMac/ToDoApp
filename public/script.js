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

///////////////////////////////EVENET LISTENING FOR CLICK ON SVG TO POP UP EDIOTRS////////////////////////////////
document.querySelector(".editorBox").addEventListener('click', event =>{
  event = event.target
  
  if(event.nextElementSibling.classList.contains('fadeInRight')){
    event.nextElementSibling.classList.toggle('fadeInLeft')
  } else {
    event.nextElementSibling.classList.toggle('fadeInRight')
  }

})

document.querySelectorAll(".checkboxElement").forEach(checkbox => {
  checkbox.addEventListener("change", event => {
    var path = event.path || (event.composedPath && event.composedPath());
    path[2].classList.toggle("finished");
    checkbox.nextSibling.preventDefault();
  });
});

if (document.querySelector(".btnAdd")) {
  document.querySelector(".btnAdd").addEventListener("click", event => {});
}

let lastClicked;

/////////////////////////// EVENT LISTENING FOR CLICK ON TEXT ELEMENT OF ToDo ////////////////////////////
document.querySelectorAll(".toDoText").forEach(function(el) {
  el.addEventListener('click', function(event) { 
    el.parentElement.classList.add("hidden");
    el.parentElement.nextElementSibling.value = el.innerText;
    el.parentElement.nextElementSibling.classList.remove("hidden");
    el.parentElement.nextElementSibling.focus();
    el.parentElement.classList.remove("d-flex");
    lastClicked = el.parentElement;
  })
});

document.querySelectorAll(".toDoElementEdit").forEach(textarea => {
  textarea.addEventListener("focusout", async event => {
    textarea.classList.add("hidden");
    lastClicked.lastElementChild.innerText = textarea.value;
    lastClicked.classList.remove("hidden");
    lastClicked.classList.add("d-flex");

    await fetch(`http://192.168.1.125/list/toDo/${textarea.name}`, {
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
        fetch(`http://192.168.1.125/list/${listId}/${username}`, {
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
            location.reload();
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
      username = path[0].nextElementSibling.children[currentFocus].innerText;
      closeAllLists(event.target);
      event.preventDefault();
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
  fetch(`http://192.168.1.125/list/${listId}/${username}`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => response.json()).then(response => { 
  document.querySelectorAll('.editorCircle').forEach( (e) => {
    if(e.getAttribute('title') === response){
      e.remove()
      snackbar('success', `Editor <strong>${response}</strong> has been removed`, 2000);
      response = false
      return;
    } 
  })
  if(response) {
  let editor = document.createElement('span')
  editor.setAttribute('title', response)
  editor.classList.add('editorCircle')
  let firstLetters = response.match(/\b(\w)/g) 
  let acronym = firstLetters.join('') 
  editor.innerText = acronym
  document.querySelector('.editors').append(editor)
  snackbar('success', `New editor <strong>${response}</strong> has been added`, 2000);
}
}).catch( err => {
    snackbar('warning', `Failed to add editor`, 3000);
})
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


//////////////////////// FLASH MESSAGE ////////////////////////////////

function snackbar(type, msg, time){
  const box = document.createElement('P');
  box.classList.add('snackbar');
  box.innerHTML = `${msg} <span> &times </span>`;

  if(type === 'error'){
      box.classList.add('error');
  }
  else if(type ==='success'){
      box.classList.add('success');
  }
  else if(type ==='warning'){
      box.classList.add('warning');
  }
  else if(type ==='info'){
      box.classList.add('info');
  }

  snackbarContainer.appendChild(box);
  box.classList.add('fadeout');

  setTimeout(()=>{
          snackbarContainer.removeChild(box)
  }, time)

}