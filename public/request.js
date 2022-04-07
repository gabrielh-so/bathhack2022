
/*
function sendGetItemRequest() {

    console.log("this ran");
    xmlhttp = new XMLHttpRequest();

    const requestObject = {
        user: "0",
    }
    xmlhttp.open("POST", window.location.href + "webclient/getitems", true);
    xmlhttp.onreadystatechange = () => {
        //Call a function when the state changes.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(JSON.parse(xmlhttp.responseText));
        }
    };
    xmlhttp.send(JSON.stringify(requestObject));
}
*/

/*
async function sendGetItemRequest() {

    const requestObject = {
        user: "0",
    }

    const rawResponse = await fetch(window.location.href + "webclient/getitems", {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObject)
    });
    const content = await rawResponse.json();

    console.log(content);
};
console.log("send get item request loaded");
*/

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

let getBinary = number => {
    let done = false;
    let resultInverted = [];
    let acc = number;
    while (!done) {
        let reminder = acc % 2;
        if (acc === 1) {
        done = true;
        }
        acc = Math.floor(acc / 2);
        resultInverted.push(reminder);
    }
    return Number(resultInverted.reverse().join(''));
};

function updateTable(items) {

    let columnDescriptions = ["ids", "days", "descriptions"];
    let columnNames = ["idcol","daycol","descriptioncol"];
    let itemNames = ["iditem","itemdesc","itemdays"];
    for (let i = 0; i < columnNames.length; i++) {
        let col = columnNames[i];
        //console.log(i)
        let entryName = itemNames[i];
        let currentTable = document.getElementById(col);
        let listEntry = document.createElement("ul");
        listEntry.innerHTML = columnDescriptions[i];
        currentTable.innerHTML = '';
        currentTable.appendChild(listEntry);
        for (let k = 0; k < items.length; k++){
            j = items[k];
            listEntry = document.createElement("ul");
            if (itemNames[i] == "itemdays") {

                let daysNumber = parseInt(j[entryName]);
                let days = [];
                
                let binary = getBinary(daysNumber) + "";
                binary.split("").reverse().forEach((b, l)=>{
                    if (b == '1') days.push(daysOfWeek[l]);
                });
                

                listEntry.innerHTML = days;
            }
            else {
                listEntry.innerHTML = j[entryName];
            }
            currentTable.appendChild(listEntry);
        }
    }
}

function sendGetItemRequest() {
    let url = window.location.href + "webclient/getitems";

    let iduser = document.getElementById("userValue").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        //console.log(xhr.responseText);
        updateTable(JSON.parse(xhr.responseText));
    }};

    const requestObject = {
        user: iduser,
    }

    xhr.send(JSON.stringify(requestObject));
}

function sendDeleteItemRequest() {
    let url = window.location.href + "webclient/deleteitem";

    let iduser = document.getElementById("userValue").value;
    let iditem = document.getElementById("itemValue").value;

    console.log(iduser);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        sendGetItemRequest();
    }};

    const requestObject = {
        user: iduser,
        item: iditem,
    }

    xhr.send(JSON.stringify(requestObject));
}

function sendCreateUserRequest() {
    let url = window.location.href + "webclient/createuser";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        document.getElementById("userValue").value = JSON.parse(xhr.responseText)[0]["newId"];
        sendGetItemRequest();
    }};

    const requestObject = {
        username: "steve",
    }

    xhr.send(JSON.stringify(requestObject));
}

function sendCreateItemRequest() {
    let url = window.location.href + "webclient/createitem";

    let iduser = document.getElementById("userValue").value;
    let itemDesc = document.getElementById("itemDesc").value;
    let itemDays = document.getElementById("itemDays").value;

    console.log(iduser);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        sendGetItemRequest();
    }};

    const requestObject = {
        user: iduser,
        desc: itemDesc,
        days: itemDays,
    }

    xhr.send(JSON.stringify(requestObject), (response) => {
        console.log(response.id);
    });
}

function sendUpdateItemRequest() {
    let url = window.location.href + "webclient/updateitem";

    let iduser = document.getElementById("userValue").value;
    let iditem = document.getElementById("itemValue").value;
    let itemDays = document.getElementById("itemDays").value;
    let itemDesc = document.getElementById("itemDesc").value;

    console.log(iduser);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        sendGetItemRequest();
    }};

    const requestObject = {
        user: iduser,
        item: iditem,
        days: itemDays,
        desc: itemDesc,
    }

    xhr.send(JSON.stringify(requestObject));


}

/*
function sendGetItemRequest() {

    let url = window.location.href + "webclient/getitems";

    const requestBody = {
        user: "4345634670",
    }
    
    console.log("ran1");

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: requestBody,
        })
        .then((response) => response.json())
        //Then with the data from the response in JSON...
        .then((data) => {
        console.log('Success:', data);
        });
    console.log("ran2");
}
*/