const suggestedTasks = [
  "Drink water 💧",
  "Take a 10 min walk 🚶",
  "Eat fruits 🍎",
  "Do meditation 🧘",
  "Read a book 📖",
  "Stretch your body 🤸",
  "Write journal ✍️",
  "Organize your desk 🧹",
  "Take deep breaths 🌿",
  "Listen to calm music 🎧"
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function normalize(text){
  return text.trim().toLowerCase();
}

function addTask(){

  const input = document.getElementById("taskInput");
  const timeInput = document.getElementById("taskTime");

  const taskText = input.value.trim();
  const taskTime = timeInput.value;

  if(taskText === ""){
    alert("Please enter a task");
    return;
  }

  const exists = tasks.some(
    t => normalize(t.text) === normalize(taskText)
  );

  if(exists){
    alert("⚠️ Task already added!");
    return;
  }

  tasks.push({
    text: taskText,
    completed: false,
    time: taskTime
  });

  input.value = "";
  timeInput.value = "";

  renderTasks();
}

function addSuggested(task){

  const exists = tasks.some(
    t => normalize(t.text) === normalize(task)
  );

  if(exists){
    alert("⚠️ Task already added!");
    return;
  }

  tasks.push({
    text: task,
    completed: false,
    time: ""
  });

  renderTasks();
}

function deleteTask(index){
  tasks.splice(index, 1);
  renderTasks();
}

function toggleComplete(index){

  tasks[index].completed =
    !tasks[index].completed;

  renderTasks();
}

function editTask(index){

  const updatedTask = prompt(
    "Edit Task",
    tasks[index].text
  );

  if(updatedTask && updatedTask.trim() !== ""){

    tasks[index].text =
      updatedTask.trim();

    renderTasks();
  }
}

function renderTasks(){

  const list =
    document.getElementById("taskList");

  list.innerHTML = "";

  // USER TASKS
  tasks.forEach((task, index) => {

    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <span
        style="
          text-decoration:${task.completed ? "line-through" : "none"};
          opacity:${task.completed ? "0.6" : "1"};
        ">
          ${task.text}
        </span>

        ${
          task.time
            ? `<br><small>⏰ ${task.time}</small>`
            : ""
        }
      </div>

      <div>

        <button onclick="toggleComplete(${index})">
          ${task.completed ? "↩" : "✔"}
        </button>

        <button onclick="editTask(${index})">
          ✏
        </button>

        <button class="delete"
        onclick="deleteTask(${index})">
          X
        </button>

      </div>
    `;

    list.appendChild(li);
  });

  // HEADING
  const heading = document.createElement("li");

  heading.textContent =
    "💡 Suggested Tasks";

  heading.style.fontWeight = "bold";

  list.appendChild(heading);

  // SUGGESTED TASKS
  suggestedTasks.forEach(task => {

    const alreadyAdded = tasks.some(
      t => normalize(t.text) === normalize(task)
    );

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${task}</span>

      <button
      ${alreadyAdded ? "disabled" : ""}
      onclick="addSuggested('${task}')">

      ${alreadyAdded ? "✓" : "+"}

      </button>
    `;

    list.appendChild(li);
  });

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

  document.getElementById("stats").innerHTML =
  `
    Total Tasks: ${tasks.length}
    |
    Completed:
    ${tasks.filter(t => t.completed).length}
  `;
}

renderTasks();

setInterval(() => {

  const now = new Date();

  const currentTime =
    now.getHours().toString().padStart(2,"0")
    +
    ":" +
    now.getMinutes().toString().padStart(2,"0");

  tasks.forEach(task => {

    if(
      task.time &&
      task.time === currentTime &&
      !task.completed
    ){
      alert("⏰ Reminder: " + task.text);
    }

  });

}, 30000);