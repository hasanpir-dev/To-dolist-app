const removeAll = document.getElementById("removeAllBtn");
const sortBtn = document.getElementById("sortBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let desc = true;


window.addEventListener("load", () => {
    todos = JSON.parse(localStorage.getItem("todos")) || [];
    const toDoBtn = document.getElementById("toDoBtn");
    const toDoInput = document.getElementById("toDoInput");

    const writeTodo = () => {

        const isDuplicate = todos.some(
            (todo) => todo.text.toLowerCase() === toDoInput.value.toLowerCase()
        );

        if (toDoInput.style.display === "none") {
            toDoInput.style.display = "inline";
        } else {
            if (!toDoInput.value) {
                alert("Please enter your todo list");
                return;
            } else if (isDuplicate) {
                alert("Todo already exists!");
                return;
            } else {
                todos.push({ text: toDoInput.value, done: false });
                localStorage.setItem("todos", JSON.stringify(todos));
            }
        }
        toDoInput.value = "";
        toDoInput.focus();

        showTodoList();

    }

    toDoBtn.addEventListener("click", writeTodo);



    let enterKey = false;
    toDoInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && !enterKey) {
            e.preventDefault();
            enterKey = true;
            toDoBtn.click();
        }

    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && !enterKey) {
            e.preventDefault();
            enterKey = true;
            toDoBtn.click();
        }

        enterKey = false;
    });


    showTodoList();
    showInput();
});

const showInput = () => {
    toDoInput.style.display = todos.length === 0 ? "inline" : "none";

    toDoInput.addEventListener("blur", () => {
        toDoInput.style.display = (toDoInput.value === "") && todos.length !== 0 ? "none" : "inline";
    });
};

const showTodoList = () => {
    const toDoList = document.getElementById("toDoList");
    toDoList.innerHTML = "";

    for (let todo of todos) {
        const todoItem = document.createElement("div");
        todoItem.classList.add("toDoItem");

        const editInput = document.createElement("input");
        editInput.classList.add("editInput");
        editInput.style.display = "none";

        const todoli = document.createElement("li");
        todoli.innerText = todo.text;
        todoli.setAttribute("draggable", true);
        todoli.addEventListener('dragstart', dragStart);
        todoli.addEventListener('dragenter', dragEnter);
        todoli.addEventListener('dragover', dragOver);
        todoli.addEventListener('dragleave', dragLeave);
        todoli.addEventListener('drop', drop);
        todoli.addEventListener('dragend', dragEnd);

        const editBtn = document.createElement("img");
        editBtn.src = "img/edit.png";
        editBtn.classList.add("editImg");

        const delBtn = document.createElement("img");
        delBtn.src = "img/delete_nh.svg";
        delBtn.classList.add("deleteImg");

        toDoList.classList.add("tudo-list");
        todoItem.appendChild(editBtn);
        todoItem.appendChild(todoli);
        todoItem.appendChild(editInput);
        todoItem.appendChild(delBtn);
        toDoList.appendChild(todoItem);

        if (todo.done) {
            todoItem.classList.add("done");
        }

        delBtn.addEventListener("click", (e) => {
            const todoText = e.target.previousElementSibling.previousElementSibling.textContent;
            todos = todos.filter((todo) => todo.text !== todoText);
            localStorage.setItem("todos", JSON.stringify(todos));
            showInput();
            showTodoList();
            if (toDoList.childElementCount === 0) {
                toDoList.classList.remove("tudo-list");
            }
        });

        delBtn.addEventListener("mouseenter", (e) => {
            e.target.src = "img/delete_h.svg";
        });

        delBtn.addEventListener("mouseleave", (e) => {
            e.target.src = "img/delete_nh.svg";
        });
    }

    const todoLi = document.querySelectorAll("li");
    const editBtns = document.querySelectorAll(".editImg");

    editBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const li = e.target.nextElementSibling
            const todoText = li.textContent;
            const input = li.nextElementSibling
            input.style.display = 'inline-block';
            li.style.display = 'none';
            input.value = todoText;
            let index = todos.findIndex((todo) => todo.text == todoText);

            input.focus();

            input.addEventListener("blur", (e) => {
                todos[index].text = e.target.value;
                input.style.display = "none";
                li.style.display = 'inline-block';
                localStorage.setItem("todos", JSON.stringify(todos));
                showTodoList();
            });

            input.addEventListener("keyup", (e) => {
                if (e.key === 'Enter') {

                    e.preventDefault();
                    input.blur();
                }

            })

        })
    })

    todoLi.forEach((li,) => {
        li.addEventListener("click", (e) => {
            let index = todos.findIndex((todo) => todo.text == e.target.textContent);
            todos[index].done = !todos[index].done ? true : false;
            localStorage.setItem("todos", JSON.stringify(todos));
            showTodoList();
        })
    })
};

const removeAllTodos = () => {
    toDoList.classList.remove("tudo-list");
    if (todos.length > 0) {
        todos.length = 0;
        localStorage.clear();
    } else {
        alert("To-Do list is empty");
    }

    showTodoList();
    showInput();
};

removeAll.addEventListener("click", removeAllTodos);

/* SORT */

const sort = () => {
    if (desc) {
        todos.sort((a, b) => a.text.localeCompare(b.text));
        desc = false;
    } else {
        todos.sort((a, b) => b.text.localeCompare(a.text));
        desc = true;
    }
    // e.target.src = desc ? "img/sort_nha.svg" : "img/sort_nhz.svg";
    localStorage.setItem("todos", JSON.stringify(todos));
    showTodoList();
};

sortBtn.addEventListener("click", sort);

sortBtn.addEventListener("mouseenter", (e) => {
    e.target.src = desc ? "img/sort_ha.svg" : "img/sort_hz.svg";
});

sortBtn.addEventListener("mouseleave", (e) => {
    e.target.src = desc ? "img/sort_nhz.svg" : "img/sort_nha.svg";
});

/* DRAG AND DROP */
const dragStart = (e) => {
    const target = e.target;
    if (target.tagName !== "LI") {
        alert("Cant select");
        e.preventDefault();
        return;
    }
    e.dataTransfer.setData("text/plain", target.innerText);
    target.style.opacity = "0.4";
    target.style.transition = "opacity 0.5s";

};

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('over');
}

function dragLeave(e) {
    e.stopPropagation();
    this.classList.remove('over');
}

const dragOver = (e) => {
    e.preventDefault();
};

const dragEnd = (e) => {
    e.stopPropagation();
};

const drop = (e) => {
    e.preventDefault();
    const target = e.target.parentNode;
    const newText = e.dataTransfer.getData("text/plain");
    const oldText = target.textContent;

    if (typeof oldText !== "string" || typeof newText !== "string") return;

    let oldIndex = todos.findIndex((todo) => todo.text == oldText);
    let newIndex = todos.findIndex((todo) => todo.text == newText);
    if (newIndex === -1) {
        alert("Only to-do list items are allowed to be moved");
        return;
    }

    [todos[oldIndex].text, todos[newIndex].text] = [newText, oldText];

    localStorage.setItem("todos", JSON.stringify(todos));
    showTodoList();

};