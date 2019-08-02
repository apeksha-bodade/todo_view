"use strict";
// let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// const xhr = new XMLHttpRequest();

let inputAlphabet = inputtext => {
    const alphaExp = /^[a-zA-Z ]+$/;
    if (inputtext.match(alphaExp)) {
        return true;
    } else {
        return false;
    }
};

const insertJson = (data) => {
    fetch("http://localhost:3000/todo",{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({task: data.task, timestamp: data.timestamp, status: data.status})
    }).then(() => {
        console.log("read successful");
        alert("successful");
    }).catch(() => {
        console.log("Insert Failed with status code" + status);
    });

};

// eslint-disable-next-line no-unused-vars
const addTask = () => {
    let inputValue = document.getElementById("myForm").elements.namedItem("inputData").value;
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

const deleteElement = (id) => {
    fetch("http://localhost:3000/todo" + "/" + id,{
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({task: data.task, timestamp: data.timestamp, status: data.status})
    }).then(() => {
        console.log("Successfully deleted element");
    }).catch((status) => {
        console.log("Delete Failed with status" + status);
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

const update = (id, status) => {
    fetch("http://localhost:3000/todo" + "/" + id, {

        method: 'PATCH',
            headers: {
            'Accept': 'application/json',
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({status: status})
    }).then(() => {
        console.log("Successfully updated element");
    }).catch((status) => {
        console.log("update Failed with status" + status);
    });
}

const addCheckBoxEvents = (checkBoxElements, status) => {
    Array.prototype.forEach.call(checkBoxElements, checkBoxElement => {
        checkBoxElement.onclick = () => {
            if(checkBoxElement.checked) {
                let key = checkBoxElement.parentElement.parentElement.getElementsByTagName("span")[1].innerHTML;
                update(key,status);
                printTodo(status);
            }
            // else {
            //
            // }
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

let printTodo = (status) => {
    fetch("http://localhost:3000/todo",{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

    })
        .then((response) => {

            return (response.json());

        })
        .then((responseText) => {

            let dataElements = [];
            Array.prototype.forEach.call(responseText, (dataValue) => {

                if (dataValue.status === status) {

                    dataElements.push(dataValue);
                }
            });

            // document.getElementById("demo").innerHTML = '<button class="delete" onclick="deleteAll()">DELETE ALL</button>';
            document.getElementById("demo").innerHTML = "";
            let list = document.getElementById("demo");

            let divOuter = document.createElement("div");
            divOuter.className = "flex-container";

            dataElements.forEach( dataElement => {
                let div = createElements(dataElement,status);
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
        })
            .catch((status1) => {
                console.log("Reading data Failed with status " + status1)
            });
};


// printTodo('todo');