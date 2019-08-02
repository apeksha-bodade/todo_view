"use strict";
// let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();
// eslint-disable-next-line no-undef
$(document).ready(function ($) {
    window.readData = () => {
        return new Promise((resolve, reject) => {
            let data;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    data = JSON.parse(xhr.responseText);
                    resolve(data);
                    // callback(data);

                }

                if (xhr.status === 404) {
                    reject(xhr.status);
                    console.log("File or resource not found");
                }
            };
            xhr.open('GET', "http://localhost:3000/todo", false);
            xhr.send();
        });
    };


    window.insertJson = (data) => {
        alert("Insert called");
        let Promise1 = new Promise((resolve, reject) => {
            xhr.open('POST', "http://localhost:3000/todo", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
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
                console.log("Insert Failed with status " + status);
            });
        return Promise1;
    };

    window.inputAlphabet = (inputtext) => {
        alert("input alphabet called");
        const alphaExp = /^[a-zA-Z ]+$/;
        if (inputtext.match(alphaExp)) {
            return true;
        } else {
            return false;
        }
    };

    window.addTask = function() {
        alert("hi i'm in the function");
        let inputValue = document.getElementById("myForm").elements.namedItem("inputData").value;
        if (!inputValue.replace(/\s/g, '').length) {
            alert("Please enter some task, don't just enter space");
        }
        else if (!window.inputAlphabet(inputValue)) {
            alert("Your content seems to have some undefined text");
        }
        else {

            const date = new Date();
            const timeStamp = date.getTime();
            let data = {};
            data.task = inputValue;
            data.timestamp = timeStamp;
            data.status = "todo";

            window.insertJson(data);
            // printTodo(status);
        }
    }

    // eslint-disable-next-line no-unused-vars
    window.createElements = (dataElement,str) => {
        let div = $("<div>");
        div.addClass("li_element");
        let spanTask = $("<span>");
        spanTask.addClass("task");
        spanTask.text(dataElement.task);
        let spanKey = $("<span>");
        spanKey.addClass("span_key");
        spanKey.text(dataElement.id);
        let button = $("<button>");
        button.text("x");
        button.addClass("close");


        let span_check1 = createCheckBox(str, "todo");
        let span_check2 = createCheckBox(str, "inprogress");
        let span_check3 = createCheckBox(str, "done");



        div.append(spanTask);
        div.append(spanKey);
        div.append(button);
        div.append(span_check1);
        div.append(span_check2);
        div.append(span_check3);

        return(div);
    };

    window.deleteElement = (id) => {
        // console.log("Was called " + id);
        let Promise1 = new Promise((resolve, reject) => {
            xhr.open("DELETE", "http://localhost:3000/todo" + "/" + id, false);
            xhr.onload = () => {
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
        return Promise1;
    };

    window.addCloseButton = () => {
        // let closeButtons = $(".close").html();
        // alert(closeButtons.parent().html());
        $(".close").each(function(index, element) {
           // alert($(element).parent().html() + "   " + index);
            $(element).click(function () {
                let newElement = $(element).parent();
                // let key = $(newElement).children(".spanKey");
                // alert($(newElement).find(".span_key").html());
                let key = $(newElement).find(".span_key").html();
                window.deleteElement(key);
                window.printTodo('todo');
                // alert($(key).html());
            })
            // alert(element[index].html());
        });
    };

    window.update = (id, status) => {
        let Promise1 = new Promise( (resolve, reject) => {
            xhr.open("PATCH", "http://localhost:3000/todo/" + id, false);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve();
                } else {
                    reject(xhr.status);
                }
            };
            xhr.send("status=" + status);
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

    window.addCheckBoxEvents = (checkBoxElements, status) => {
        $(checkBoxElements).each(function(index, element) {
           $(element).click( function () {
               if ($(element).prop("checked")) {
                   let key = $(element).parent().parent().find(".span_key").html();
                   alert("key="+key);
                   window.update(key,status);
                   window.printTodo(status);
               }
           });
        });
    };



    const createCheckBox = (str,status) => {
        let spanCheck = $("<span>");
        spanCheck.attr("title",status);
        let inputCheck = $("<input>");
        inputCheck.addClass("check_"+status);
        inputCheck.attr("type","checkbox");
        inputCheck.attr("name","check_"+status);
        if (str === status) {
            inputCheck.attr("checked","true");
            inputCheck.attr("disabled","true");
        }

        spanCheck.append(inputCheck);
        return spanCheck;

    };

    window.printTodo = (status) => {
        let Promise1 = window.readData();

        Promise1
            .then((data) => {
                console.log("Successful");
                return (data);
            })
            .then((data) => {

                let dataElements = [];
                data.forEach((dataValue) => {
                    if (dataValue.status === status) {
                        dataElements.push(dataValue);
                    }
                });
                if(status === "todo") {
                    $("#li_todo").addClass("active");
                    $("#li_inprogress").removeClass();
                    $("#li_done").removeClass();
                } else if (status === "inprogress") {
                    $("#li_todo").removeClass();
                    $("#li_inprogress").addClass("active");
                    $("#li_done").removeClass();
                } else if (status === "done") {
                    $("#li_todo").removeClass();
                    $("#li_inprogress").removeClass();
                    $("#li_done").addClass("active");
                }


                let divOther = $("<div>");
                divOther.addClass("flex-container");
                dataElements.forEach( dataElement => {
                    let div = window.createElements(dataElement,status);
                    divOther.append(div);
                });


                $(".demo_class").html(divOther);

    //add close button to the li elements and click event
                window.addCloseButton();


    //add checkbox events

                let checkBoxElementTodo = $(".check_todo");
                let checkBoxElementInProgress = $(".check_inprogress");
                let checkBoxElementDone = $(".check_done");
                window.addCheckBoxEvents($(checkBoxElementTodo), "todo");
                window.addCheckBoxEvents($(checkBoxElementInProgress), "inprogress")
                window.addCheckBoxEvents($(checkBoxElementDone), "done");

            })
            .catch((error) => {
                console.log("Reading data Failed with status " + error)
            });

        return(Promise1);
    };
});
