const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const textArea = document.querySelector(".textArea-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const removeBtn = document.querySelector(".remove-btn");
const toolBoxColors = document.querySelectorAll(".color-box");

let ticketArr = [];

//colors array
const colors = ["lightpink", "lightgreen", "lightblue", "black"];

modalCont.style.display = "none";
//local variables
let modalPrioritycolor = "black";
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let addtaskflag = false;
let removeTaskFlag = false;

const ticketsFromLocalStorage = JSON.parse(localStorage.getItem("ticketArr"));

if (ticketsFromLocalStorage) {
  ticketArr = ticketsFromLocalStorage;

  ticketArr.forEach(function (ticket) {
    createTicket(ticket.id, ticket.TicketTask, ticket.ticketColor);
  });
}

//Modal pop-up
addBtn.addEventListener("click", function () {
  addtaskflag = !addtaskflag;

  if (addtaskflag === true) {
    modalCont.style.display = "flex";
    textArea.value = "";

    //deactivate remove mode if active
    if (removeTaskFlag) {
      removeTaskFlag = false;
      removeBtn.style.color = "white";
    }
  } else {
    modalCont.style.display = "none";
  }
});

removeBtn.addEventListener("click", function () {
  removeTaskFlag = !removeTaskFlag;
  if (removeTaskFlag) {
    alert("Delete Button is Activated");
    removeBtn.style.color = "red";

    //If modal is open,close it and reset flag
    if (addtaskflag) {
      modalCont.style.display = "none";
      addtaskflag = false;
    }
  } else {
    alert("Delete Button Deactivated");
    removeBtn.style.color = "white";
  }
});

//Generating Ticket

document.addEventListener("keydown", function (e) {
  if (!addtaskflag) return;
  let key = e.key;

  if (key === "Shift") {
    let task = textArea.value;
    createTicket(null, task, modalPrioritycolor);
  }
});

function createTicket(Ticketid, TicketTask, ticketColor) {
  let id;
  if (Ticketid) {
    id = Ticketid;
  } else {
    id = shortid();
  }
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");

  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">${id}</div>
            <div class="ticket-task">${TicketTask}</div>
            <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;
  mainCont.appendChild(ticketCont);
  modalCont.style.display = "none";
  handleLock(id, ticketCont);
  handleRemoval(id, ticketCont);
  handleColor(id, ticketCont);
  if (!Ticketid) {
    ticketArr.push({ id, TicketTask, ticketColor });
    updateLocalstorage();
  }
}

allPriorityColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    allPriorityColors.forEach(function (priorityColorElements) {
      priorityColorElements.classList.remove("active");
    });
    colorElem.classList.add("active");
    let colorSelected = colorElem.classList[1];
    modalPrioritycolor = colorSelected;
  });
});

//Lock Handling to Edit Content

function handleLock(id, ticket) {
  let ticketLockElem = ticket.querySelector(".ticket-lock");
  let ticketLockIcon = ticketLockElem.children[0];

  let ticketTaskArea = ticket.querySelector(".ticket-task");

  ticketLockIcon.addEventListener("click", function () {
    if (ticketLockIcon.classList.contains(lockClass)) {
      ticketLockIcon.classList.remove(lockClass);
      ticketLockIcon.classList.add(unlockClass);

      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLockIcon.classList.remove(unlockClass);
      ticketLockIcon.classList.add(lockClass);

      ticketTaskArea.setAttribute("contenteditable", "false");
      let idx = ticketArr.findIndex(function (ticket) {
        return ticket.id === id;
      });
      ticketArr[idx].TicketTask = ticketTaskArea.textContent;
      updateLocalstorage();
    }
  });
}

//Remove function-Deleting Ticket

function handleRemoval(id, ticket) {
  ticket.addEventListener("click", function () {
    if (!removeTaskFlag) return;
    ticket.remove(); //Removing from UI
    ticketArr = ticketArr.filter(function (ticket) {
      return ticket.id != id;
    });
    updateLocalstorage();
  });
}

function handleColor(id, ticket) {
  let ticketColorBand = ticket.querySelector(".ticket-color");
  ticketColorBand.addEventListener("click", function () {
    let currentColor = ticketColorBand.classList[1];
    let currentColorIdx = colors.findIndex(function (color) {
      return currentColor == color;
    });
    currentColorIdx++;
    let newTicketColorIdx = currentColorIdx % colors.length;
    let newTicketColor = colors[newTicketColorIdx];

    ticketColorBand.classList.remove(currentColor);
    ticketColorBand.classList.add(newTicketColor);

    let idx = ticketArr.findIndex(function (ticket) {
      return ticket.id === id;
    });
    ticketArr[idx].ticketColor = newTicketColor;
    updateLocalstorage();
  });
}

//Ticket filteration wrt colors
toolBoxColors.forEach(function (colorBox, i) {
  colorBox.addEventListener("click", function () {
    let selectedToolBoxColor = toolBoxColors[i].classList[0];

    let filteredTickets = ticketArr.filter(function (ticket) {
      return selectedToolBoxColor === ticket.ticketColor;
    });
    mainCont.innerHTML = "";
    filteredTickets.forEach(function (filteredTicket) {
      createTicket(
        filteredTicket.id,
        filteredTicket.TicketTask,
        filteredTicket.ticketColor
      );
    });
  });
  colorBox.addEventListener("dblclick", function () {
    mainCont.innerHTML = "";
    ticketArr.forEach(function (ticket) {
      createTicket(ticket.id, ticket.TicketTask, ticket.ticketColor);
    });
  });
});

function updateLocalstorage() {
  localStorage.setItem("ticketArr", JSON.stringify(ticketArr));
}
