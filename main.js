let Input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let clearAllBtn = document.querySelector(".clear-all");

// مصفوفة لتخزين المهام
let arrayOfTasks = [];

// التحقق من وجود بيانات في localStorage
if (localStorage.getItem("tasks")) {
    arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

// استعادة البيانات من localStorage عند تحميل الصفحة
getDataFromLocalStorage();
toggleClearAllButton(); // تحديث زر الحذف الكلي

submit.onclick = function (event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة عند الضغط على الزر

    if (Input.value !== "") {
        addTaskToArray(Input.value);
        Input.value = "";
    }
}

// حدث النقر على المهام
tasksDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("del")) {
        let taskElement = e.target.parentElement; // العنصر الذي سيتم حذفه
        let taskId = taskElement.getAttribute("data-id"); // استخراج الـ ID الخاص بالمهمة
        
        // حذف المهمة من localStorage
        deleteTaskWith(taskId);

        // حذف التاريخ والمهمة معًا من الصفحة
        let dateElement = taskElement.previousElementSibling; // العنصر الذي يحتوي على التاريخ
        if (dateElement && dateElement.classList.contains("task-date")) {
            dateElement.remove();
        }
        taskElement.remove();

        toggleClearAllButton(); // تحديث زر الحذف الكلي
    }
    
    // عند الضغط على المهمة يتم التبديل بين "تمت" و "لم تتم"
    if (e.target.classList.contains("task")) {
        toggleStatusTaskWith(e.target.getAttribute("data-id"));
        e.target.classList.toggle("done");
    }
});

// زر حذف جميع المهام
clearAllBtn.onclick = function () {
    arrayOfTasks = []; // تفريغ المصفوفة
    tasksDiv.innerHTML = ""; // تفريغ المهام من الصفحة
    localStorage.removeItem("tasks"); // حذف المهام من localStorage
    toggleClearAllButton(); // إخفاء زر الحذف الكلي
}

function addTaskToArray(taskText) {
    let now = new Date();
    let formattedDate = now.toLocaleString("EG-ar", { // استخدام اللغة العربية للتاريخ
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    const task = {
        id: Date.now(),
        title: taskText,
        completed: false,
        date: formattedDate
    };

    arrayOfTasks.push(task);
    addElementToPageFrom(arrayOfTasks);
    addDataToLocalStorage(arrayOfTasks);
    toggleClearAllButton();
}

function addElementToPageFrom(arrayOfTasks) {
    tasksDiv.innerHTML = ""; // تفريغ المهام القديمة حتى لا تتكرر

    arrayOfTasks.forEach(task => {
        let dateDiv = document.createElement("div");
        dateDiv.classList.add("task-date");
        dateDiv.innerHTML = `<strong>${task.date}</strong>`;

        let newDiv = document.createElement("div");
        newDiv.classList.add("task");

        // ضبط اتجاه النص بناءً على اللغة
        newDiv.style.direction = /[\u0600-\u06FF]/.test(task.title) ? "rtl" : "ltr"; 

        if (task.completed) {
            newDiv.classList.add("done");
        }

        newDiv.setAttribute("data-id", task.id);
        newDiv.innerHTML = task.title;

        let span = document.createElement("span");
        span.classList.add("del");
        span.innerHTML = "Delete";

        newDiv.appendChild(span);

        tasksDiv.appendChild(dateDiv);
        tasksDiv.appendChild(newDiv);
    });

    toggleClearAllButton();
}

// تخزين المهام في localStorage
function addDataToLocalStorage(arrayOfTasks) {
    window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

// استعادة البيانات من localStorage عند تحميل الصفحة
function getDataFromLocalStorage() {
    let Data = window.localStorage.getItem("tasks");
    if (Data) {
        let tasks = JSON.parse(Data);
        addElementToPageFrom(tasks);
    }
}

// حذف المهمة من localStorage
function deleteTaskWith(taskId) {
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
    addDataToLocalStorage(arrayOfTasks);
}

// تبديل حالة المهمة (مكتملة / غير مكتملة)
function toggleStatusTaskWith(taskId) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id == taskId) {
            arrayOfTasks[i].completed = !arrayOfTasks[i].completed;
        }
    }
    addDataToLocalStorage(arrayOfTasks);
}

// وظيفة لإظهار أو إخفاء زر "حذف جميع المهام"
function toggleClearAllButton() {
    if (arrayOfTasks.length > 0) {
        clearAllBtn.style.display = "block";
    } else {
        clearAllBtn.style.display = "none";
    }
}

let micButton = document.querySelector(".mic-button");

micButton.onclick = function () {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "ar-EG"; // التعرف على العربية
    recognition.start();

    recognition.onresult = function (event) {
        let speechText = event.results[0][0].transcript;
        Input.value = speechText;
    };
};

