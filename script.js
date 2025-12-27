// ==========================================
// 1. HELPERS & SELECTORS
// ==========================================
const getElement = (selector) => document.querySelector(selector);

// DOM Elements
const elements = {
    addBtn: getElement(".add"),
    modal: getElement(".AddNewTask"),
    form: getElement(".form"),
    columns: {
        Todo: getElement(".Todo"),
        Progress: getElement(".process"),
        Done: getElement(".Done")
    },
    counts: {
        Todo: getElement("#todoCount"),
        Progress: getElement("#progressCount"),
        Done: getElement("#doneCount")
    },
    inputs: {
        name: getElement("#name"),
        about: getElement("#about"),
        state: getElement(".form select")
    }
};

// ==========================================
// 2. STORAGE CLASS
// ==========================================
class Storage {
    constructor(dbName) {
        this.prefix = `${dbName}_`;
    }

    _getKey(id) {
        return `${this.prefix}${id}`;
    }

    set(id, data) {
        localStorage.setItem(this._getKey(id), JSON.stringify(data));
    }

    get(id) {
        const value = localStorage.getItem(this._getKey(id));
        return value ? JSON.parse(value) : null;
    }

    delete(id) {
        localStorage.removeItem(this._getKey(id));
    }

    // Get all items belonging to this app
    getAll() {
        const items = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                items.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        return items;
    }
}

// Initialize Database
const DB = new Storage('TaskApp');

// ==========================================
// 3. STATE MANAGEMENT
// ==========================================
// Load initial state from DB
let todos = DB.getAll(); 

// Class for creating new objects
class TodoItem {
    constructor(name, about, state) {
        this.id = Date.now().toString(); // Unique ID
        this.name = name;
        this.about = about;
        this.state = state;
    }
}

// ==========================================
// 4. RENDERING & UI LOGIC
// ==========================================

// Create HTML for a single task
function createTaskElement(task) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.draggable = true;
    div.dataset.id = task.id; // Store ID in DOM for easy access

    div.innerHTML = `
        <div class="name">${task.name}</div>
        <div class="about">${task.about}</div>
        <div class="button">
            <button class="edit" onclick="handleEdit('${task.id}')">✏️</button>
            <button class="delete" onclick="handleDelete('${task.id}')">🗑️</button>
        </div>
    `;

    // Attach Drag Event Locally
    div.addEventListener("dragstart", () => {
        div.classList.add("dragging");
        activeTaskID = task.id;
    });

    div.addEventListener("dragend", () => {
        div.classList.remove("dragging");
        activeTaskID = null;
    });

    return div;
}

function renderAll(){
    // 1. Clear all columns
    Object.values(elements.columns).forEach(col => col.innerHTML = '');

    // 2. Sort tasks into columns
    todos.forEach(task => {
        const element = createTaskElement(task);
        // Match state string to column element
        if (elements.columns[task.state]) {
            elements.columns[task.state].appendChild(element);
        }
    });

    updateCounts();
}

function updateCounts() {
    const counts = { Todo: 0, Progress: 0, Done: 0 };
    todos.forEach(t => counts[t.state]++);

    elements.counts.Todo.textContent = counts.Todo;
    elements.counts.Progress.textContent = counts.Progress;
    elements.counts.Done.textContent = counts.Done;
}

// ==========================================
// 5. EVENT HANDLERS (Drag & Drop)
// ==========================================
let activeTaskID = null;



function setupDragDrop() {
    Object.entries(elements.columns).forEach(([stateKey, box]) => {
        
        box.addEventListener("dragover", (e) => {
            e.preventDefault(); // Allow dropping
            box.classList.add("drag-over");
        });

        box.addEventListener("dragleave", () => {
            box.classList.remove("drag-over");
        });

        box.addEventListener("drop", () => {
            box.classList.remove("drag-over");
            
            if (!activeTaskID) return;

            // 1. Find the task in our data
            const taskIndex = todos.findIndex(t => t.id === activeTaskID);
            if (taskIndex > -1) {
                const task = todos[taskIndex];
                
                // 2. Update State in Memory
                task.state = stateKey; // The key from the loop (Todo, Progress, Done)

                // 3. Update Storage
                DB.set(task.id, task);

                // 4. Re-render UI
                renderAll();
            }
        });
    });
}

// ==========================================
// 6. FORM & ACTIONS
// ==========================================

// Toggle Modal
const toggleModal = () => {
    elements.modal.classList.toggle("showAddNewTask");
    elements.form.classList.toggle("showAddNewTask");
};

elements.addBtn.addEventListener("click", toggleModal);
elements.modal.addEventListener("click", (e) => {
    // Close only if clicking the background, not the form itself
    if(e.target === elements.modal) toggleModal();
});

// Create New Task
function createTodo() {
    const name = elements.inputs.name.value.trim();
    const about = elements.inputs.about.value.trim();
    const state = elements.inputs.state.value;

    if (!name) return alert("Task name is required!");

    // 1. Create Object
    const newTask = new TodoItem(name, about, state);

    // 2. Save to Data & Storage
    todos.push(newTask);
    DB.set(newTask.id, newTask);

    // 3. Update UI
    renderAll();
    toggleModal();
    
    // 4. Clear Inputs
    elements.inputs.name.value = "";
    elements.inputs.about.value = "";
}

// Global handlers for buttons generated dynamically
window.handleDelete = (id) => {
    if(!confirm("Delete this task?")) return;
    
    // Remove from Array
    todos = todos.filter(t => t.id !== id);
    
    // Remove from Storage
    DB.delete(id);
    
    renderAll();
};

window.handleEdit = (id) => {
    alert("Edit feature coming soon for ID: " + id);
};

// ==========================================
// 7. INITIALIZATION
// ==========================================
setupDragDrop();
renderAll();