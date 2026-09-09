const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

const STORAGE_KEY = "todo-list";

let tasks = loadTasks();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  input.value = "";
  saveAndRender();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  const checkbox = event.target.closest("input[type='checkbox']");
  const item = event.target.closest(".task");

  if (!item) return;

  const id = item.dataset.id;

  if (checkbox) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, done: checkbox.checked } : task
    );
    saveAndRender();
    return;
  }

  if (button?.dataset.action === "delete") {
    tasks = tasks.filter((task) => task.id !== id);
    saveAndRender();
  }
});

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  render();
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function render() {
  list.innerHTML = tasks
    .map(
      (task) => `
        <li class="task ${task.done ? "done" : ""}" data-id="${task.id}">
          <input type="checkbox" ${task.done ? "checked" : ""}>
          <span>${escapeHtml(task.text)}</span>
          <button type="button" data-action="delete" aria-label="Удалить">✕</button>
        </li>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

render();
