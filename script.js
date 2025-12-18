
function getElement(name){
    return document.querySelector(name)
}
function updateAndShowTodos(arr){
    
}

const Todos = [];


const todosBox = getElement(".list")
const progressBox = getElement(".process")
const completeBox = getElement(".Done")


let todoCount = 0;
let progressCount = 0;
let completeCount = 0;

const task = document.querySelectorAll(".task");

// Active task = Atask
let Atask = null

task.forEach(
    (el) => {
        el.addEventListener("dragstart", () => {
            Atask = el
        })
        el.addEventListener("dragend", () => {
            Atask = null;
            // task.classList.remove("dragging");
        });
    }

)

function dragEvent(box) {
    // drag Enter
    box.addEventListener("dragenter", function () {
        this.classList.add("drag")
    })
    // drag leave
    box.addEventListener("dragleave", function () {
        this.classList.remove("drag")
    })
    box.addEventListener("dragover", async (e) => {
        e.preventDefault();
    })
    box.addEventListener("drop",()=>{
        if(!Atask) return;
         box.appendChild(Atask);
         box.classList.remove("drag")
    })
}

dragEvent(progressBox);
dragEvent(todosBox);
dragEvent(completeBox);

// Add todo Logic
const AddBtn =getElement(".add")
const show = getElement(".AddNewTask")
const form = getElement(".form")

AddBtn.addEventListener("click",()=>{
    show.classList.toggle("showAddNewTask")
    form.classList.add("showAddNewTask")
})
show.addEventListener("click",()=>{
    show.classList.remove("showAddNewTask")
    form.classList.remove("showAddNewTask")

})


// todo create


class Todo{
    constructor(id,name , about , state="Todo"){
        this.id = id;
        this.name= name;
        this.about = about;
        this.state = state;
    }
    moveTo(newstate){
        this.state = newstate;
    }
}


function createTodo(){
    const name = getElement(".form #name").value.trim();
    const about = getElement(".form #about").value.trim();
    const state = getElement(".form select").value

    const newTodo = new Todo(name,about,state)
    Todos.push(newTodo)

    console.log(newTodo)

    show.classList.remove("showAddNewTask")
    form.classList.remove("showAddNewTask")

}

