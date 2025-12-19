// upcoming Features and Bugs (Work on it)
// 1. only new element should be added  (Bug)
// 2. count feature                     (Feature)
// 3. filter by status                  (Feature)
// 4. local storage use to store data   (Feature)

// Elemenet selector function from Dom 
function getElement(name) {
    return document.querySelector(name)
}

// New Element formate and element return
function newElement(id, name, about, state) {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.id = id;

    div.innerHTML = `
        <div class="name">${name}</div>
        <div class="about">${about}</div>
        <div class="button">
            <button class="edit">✏️</button>
            <button class="delete">🗑️</button>
        </div>
    `;
    return div;

}



// All todos
const Todos = [
    {
        id: 0,
        name: "From js",
        about: "Trying from script",
        state: "Todo"
    }
];
let Atask = null // Active task

// Sections (filters)
const todosBox = getElement(".list")
const progressBox = getElement(".process")
const completeBox = getElement(".Done")

// update and show the Todos on the Page
function updateAndShowTodos(arr) {
    arr.forEach(el => {
        // new element create
        const Newel = newElement(el.id, el.name, el.about, el.state);

        //Add by filter / status and SHOW them
        if (el.state === "Todo") todosBox.appendChild(Newel);
        else if (el.state === "Progress") progressBox.appendChild(Newel);
        else if (el.state === "Done") completeBox.appendChild(Newel);

        // drag events on new element
        Newel.addEventListener("dragstart", () => Atask = Newel);
        Newel.addEventListener("dragend", () => Atask = null);
    })
}

function updateCounts() {
    let todo = 0;
    let progress = 0;
    let done = 0;

    Todos.forEach(t => {
        if (t.state === "Todo") todo++;
        else if (t.state === "Progress") progress++;
        else if (t.state === "Done") done++;
    });

    getElement("#todoCount").textContent = todo;
    getElement("#progressCount").textContent = progress;
    getElement("#doneCount").textContent = done;
}

//calling the update and show button 
updateAndShowTodos(Todos);
updateCounts()

// count feature (not completed)
function dragEvent(box) {
    // drag Enter
    box.addEventListener("dragenter", function () {
        this.classList.add("drag")
    })
    // drag leave
    box.addEventListener("dragleave", function () {
        this.classList.remove("drag")
        updateCounts()

    })
    box.addEventListener("dragover", async (e) => {
        e.preventDefault();
    })
    box.addEventListener("drop", () => {
        if (!Atask) return;
        Atask.state = box.dataset.state;

        // Data update
        const todo = Todos.find(t => t.id === box.dataset.state);
        if (todo) {
            todo.state = newState;
        }

        // UI update
        box.appendChild(Atask);
        box.classList.remove("drag")
        updateCounts()
    })
}
dragEvent(progressBox);
dragEvent(todosBox);
dragEvent(completeBox);

// -------------------------- Add todo Logic
const AddBtn = getElement(".add")
const show = getElement(".AddNewTask")
const form = getElement(".form")

AddBtn.addEventListener("click", () => {
    show.classList.toggle("showAddNewTask")
    form.classList.add("showAddNewTask")
})

show.addEventListener("click", () => {
    show.classList.remove("showAddNewTask")
    form.classList.remove("showAddNewTask")

})
// -------------------------- Add todo Logic

// todo create
class Todo {
    constructor(id, name, about, state = "Todo") {
        this.id = id;
        this.name = name;
        this.about = about;
        this.state = state;
    }
    moveTo(newstate) {
        this.state = newstate;
    }
}

function createTodo() {
    const name = getElement(".form #name").value.trim();
    const about = getElement(".form #about").value.trim();
    const state = getElement(".form select").value
    const id = Todos.length

    const newTodo = new Todo(id, name, about, state)
    Todos.push(newTodo)

    console.log(newTodo)

    updateAndShowTodos([newTodo]);
    updateCounts()


    show.classList.remove("showAddNewTask")
    form.classList.remove("showAddNewTask")


}

