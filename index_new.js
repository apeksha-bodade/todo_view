"use strict";
// let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const xhr = new XMLHttpRequest();

let inputAlphabet = inputtext => {
    const alphaExp = /^[a-zA-Z 	]+$/;
    if (inputtext.match(alphaExp)) {
        return true;
    } else {
        return false;
    }
};

let insertJson = (data) => {
    let Promise1 = new Promise((resolve, reject) => {
        xhr.open('POST', "http://localhost:3000/todo", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve();
            } else {
              reject(this.status);
            }

        };
        let task = data.task;
        let timestamp = data.timestamp;
        let status = data.status;
        xhr.send("task=" + task + "&timestamp=" + timestamp + "&status=" + status);
    });
    Promise1
        .then(() => {
            console.log("read successful");
            alert("successful");
        })
        .catch((status) => {
            console.log("Insert Failed with status code" + status);
        });
    return Promise1;
};

const addTask = () => {
    const inputValue = document.getElementById("myForm").elements.namedItem("input_data").value;
    if (!inputValue.replace(/\s/g, '').length) {
        alert("Please enter some task, don't just enter space");
    }
    else if (!inputAlphabet(inputValue)) {
        alert("Your content seems to have some undefined text");
    }
    else {

        const date = new Date();
        const timeStamp = date.getTime();
        let data = {};
        data.task = inputValue;
        data.timestamp = timeStamp;
        data.status = "todo";

        insertJson(data);
        printTodo(status);
    }

};

let deleteElement = (id) => {

    let Promise1 = new Promise((resolve, reject) => {
        xhr.open("DELETE", "http://localhost:3000/todo" + "/" + id, false);
        xhr.onload = function () {
            // var users = JSON.parse(xhr.responseText);
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve();
            } else {
                console.log("fail");
                reject(xhr.status);
            }
        };
        xhr.send(null);
    });
    Promise1
        .then(() => {
            console.log("Successfully deleted element");
        })
        .catch((status) => {
            console.log("Delete 'Failed' with status " + status);

        });

};

const addCloseButton = () => {
    let closeButtons = document.getElementsByClassName("close");
    Array.prototype.forEach.call(closeButtons, closeButton => {
        closeButton.onclick = () => {
            let div = closeButton.parentElement;
            div.style.display = "none";
            let key = closeButton.parentElement.getElementsByTagName("span")[1].innerHTML;
            deleteElement(key);
        }
    });
};

let readDataElement = (id,callback) => {
    let data;
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            callback(data);
        }

        if (xhr.status === 404) {
            console.log("File or resource not found");
        }
    };
    xhr.open('GET', "http://localhost:3000/todo" + "/" + id, false);
    xhr.send();
};

let update = (id, status) => {
    let Promise1 = new Promise( (resolve, reject) => {
        let globalData = [];
        readDataElement(id, (data) => {
            globalData = data;
        });
        let task = globalData.task;
        let timestamp = globalData.timestamp;
        deleteElement(id);
        xhr.open("POST", "http://localhost:3000/todo", false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve();
            } else {
                reject(xhr.status);
            }
        };
        xhr.send("task=" + task + "&timestamp=" + timestamp + "&status=" + status);
    });

    Promise1
        .then(() => {
            console.log("Successfully updated");
        })
        .catch((status) => {
            console.log("Failed with status" + status);
        });
    return(Promise1);

};

const addCheckBoxEvents = (checkBoxElements, status) => {
    Array.prototype.forEach.call(checkBoxElements, checkBoxElement => {
        checkBoxElement.onclick = () => {
            if(checkBoxElement.checked) {
                let key = checkBoxElement.parentElement.parentElement.getElementsByTagName("span")[1].innerHTML;
                update(key,status);
                printTodo(status);
            } else {

            }
        }
    });

};


const createCheckBox = (str,status) => {
    let spanCheck = document.createElement("span");
    spanCheck.title = status;
    let inputCheck = document.createElement("input");
    inputCheck.type = "checkbox";
    inputCheck.className = "check_" + status;
    inputCheck.name = "check_" + status;
    if (str === status) {
        inputCheck.checked = true;
        inputCheck.disabled = true;
    }
    spanCheck.appendChild(inputCheck);
    return spanCheck;

};

const createElements = (dataElement,str) => {
    let div = document.createElement("div");
    div.className = "li_element";
    let span_task = document.createElement("span");
    span_task.className="task";
    let task_txt = document.createTextNode(dataElement.task);
    span_task.appendChild(task_txt);
    let span_key = document.createElement("span");
    span_key.className = "span_key";
    // span_key.style.display = "none";
    let key_txt = document.createTextNode(dataElement.id);
    span_key.appendChild(key_txt);

    let button = document.createElement("button");
    let txt = document.createTextNode("x");
    button.className = "close";
    button.appendChild(txt);

    let span_check1 = createCheckBox(str, "todo");
    let span_check2 = createCheckBox(str, "inprogress");
    let span_check3 = createCheckBox(str, "done");

    div.appendChild(span_task);
    div.appendChild(span_key);
    div.appendChild(button);
    div.appendChild(span_check1);
    div.appendChild(span_check2);
    div.appendChild(span_check3);


    return(div);
};


let readData = (callback) => {
    let Promise1 = new Promise( (resolve, reject) => {
        let data;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
                resolve();
                callback(data);

            }

            if (xhr.status === 404) {
                reject(xhr.status);
                console.log("File or resource not found");
            }
        };
        xhr.open('GET', "http://localhost:3000/todo", false);
        xhr.send();
    });
    Promise1
        .then(() => {
            console.log("Successful");
        })
        .catch((status) => {
            console.log("Reading data Failed with status " + status)
        });

    return(Promise1);
};

const printTodo = (str) => {
    let globalData = [];
    readData((data) => {
        globalData = data;
        // console.log("this" + data[0].task);
    });

    let dataElements = [];
    globalData.forEach((globalDataElement) => {
        if (globalDataElement.status === str) {
            dataElements.push(globalDataElement);
        }
    });

    document.getElementById("demo").innerHTML = "";
    let list = document.getElementById("demo");

    let divOuter = document.createElement("div");
    divOuter.className = "flex-container";

    dataElements.forEach( dataElement => {
        let div = createElements(dataElement,str);
        divOuter.appendChild(div);
    });


    list.appendChild(divOuter);

//add close button to the li elements and click event
    addCloseButton();

//add checkbox events
    let checkBoxElementTodo = document.getElementsByClassName('check_todo');
    let checkBoxElementInProgress = document.getElementsByClassName('check_inprogress');
    let checkBoxElementDone = document.getElementsByClassName('check_done');
    addCheckBoxEvents(checkBoxElementTodo,"todo");
    addCheckBoxEvents(checkBoxElementInProgress,"inprogress");
    addCheckBoxEvents(checkBoxElementDone,"done");

};

printTodo('todo');