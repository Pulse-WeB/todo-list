const overlay = document.querySelector(".overlay");
const cancelButton = document.querySelector(".btn-cancel");

// ================================
// ДАТЫ-------
// ============================
const todayDay = document.querySelector(".todayDay");
const todayDate = document.querySelector(".todayDate");
const date = new Date();
const day = date.getDay();
const days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];
const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function currentDayOfTheWeek(day) {
  todayDay.textContent = days[day];
}
currentDayOfTheWeek(day);

function currentDate() {
  let currentMonth = date.getMonth();
  let currentDayOfTheMonth = date.getDate();
  todayDate.textContent = `${currentDayOfTheMonth} ${months[currentMonth]}`;
}
currentDate();
// ================================
// ЗАДАЧИ-------
// ============================

const addButton = document.querySelector(".add-task");
const taskDescription = document.querySelector("#taskDescription");
const taskDate = document.querySelector("#taskDate");
const addConfirmButton = document.querySelector(".btn-add");
const allTaskList = document.querySelector("#all-task");
const activeTaskList = document.querySelector("#active-task");
const finishTask = document.querySelector("#finish-task");
const savedTasks = localStorage.getItem("tasksString");
const parsedTasks = JSON.parse(savedTasks);
const tasks = parsedTasks || [];
addConfirmButton.addEventListener("click", () => {
  const taskTextValue = taskDescription.value;
  const taskDateValue = taskDate.value;
  const task = {
    date: taskDateValue,
    text: taskTextValue,
    completed: false,
  };
  tasks.push(task);
  localStorage.setItem("tasksString", JSON.stringify(tasks));

  renderTasks(tasks, allTaskList);
});

function renderTasks(arr, container) {
  container.textContent = "";
  arr.forEach((task) => {
    const li = document.createElement("li");
    const taskBody = document.createElement("div");
    const taskText = document.createElement("span");
    const taskDate = document.createElement("span");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      if (checkbox.checked === true) {
        li.classList.add("done");
        task.completed = true;
      } else {
        li.classList.remove("done");
        task.completed = false;
      }
      localStorage.setItem("tasksString", JSON.stringify(tasks));
    });
    if (task.completed === true) {
      li.classList.add("done");
    }
    li.classList.add("task");
    taskBody.classList.add("task-body");
    taskDate.classList.add("task-date");
    taskDate.textContent = task.date;
    taskText.classList.add("task-text");
    taskText.textContent = task.text;
    container.append(li);
    li.append(checkbox);
    li.append(taskBody);
    taskBody.append(taskDate);
    taskBody.append(taskText);
  });
}
renderTasks(tasks, allTaskList);
// ================================
// ТАБЫ-------
// ============================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabs = document.querySelector(".tabs");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    tabs.dataset.current = button.dataset.tab;
    if (button.dataset.tab === "all") {
      renderTasks(tasks, allTaskList);
    }
    if (button.dataset.tab === "active") {
      const activeTask = tasks.filter((task) => {
        return task.completed === false;
      });
      renderTasks(activeTask, activeTaskList);
    }
    if (button.dataset.tab === "finish") {
      const finishTasks = tasks.filter((task) => {
        return task.completed === true;
      });
      renderTasks(finishTasks, finishTask);
    }
  });
});

function openSheet() {
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
}

addButton.addEventListener("click", openSheet);

function closeSheet() {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
}

cancelButton.addEventListener("click", closeSheet);
addConfirmButton.addEventListener("click", closeSheet);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeSheet();
});
