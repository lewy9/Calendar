window.onload = updateCalendar;

// check login status(session) when refresh the calendar page
let isUser = false;
function checkSession(event) {
    fetch("checkSession.php", {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            isUser = data.success;
            if(data.success) {
                document.getElementById("auth").setAttribute("hidden", "hidden");
                document.getElementById("welcome").removeAttribute("hidden");
                document.getElementById("greeting").innerHTML =
                    "Welcome, " + data.username + " !";
            }
            return isUser;
        })
        .catch(error => console.error("Error", error))
}
window.addEventListener("load", checkSession, false);

// Register Ajax
function registerAjax(event) {
    const username = document.getElementById("r_username").value;
    const password = document.getElementById("r_password").value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("register_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            isUser = data.success;
            if(data.success) {
                document.getElementById("auth").setAttribute("hidden", "hidden");
                document.getElementById("welcome").removeAttribute("hidden");
                document.getElementById("greeting").innerHTML =
                    "Welcome, " + data.username + " !";
                document.getElementById("token_edit").value = data.token;
                document.getElementById("token_delete").value = data.token;
                updateCalendar();
            }
            else {
                alert("Register failed.")
            }
        })
        .catch(error => console.error("Error", error));
}
document.getElementById("btn_register").addEventListener("click", registerAjax, false);

// Login Ajax
function loginAjax(event) {
    const username = document.getElementById("l_username").value;
    const password = document.getElementById("l_password").value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            isUser = data.success;
            if(data.success) {
                document.getElementById("auth").setAttribute("hidden", "hidden");
                document.getElementById("welcome").removeAttribute("hidden");
                document.getElementById("greeting").innerHTML =
                    "Welcome, " + data.username + " !";
                document.getElementById("token_edit").value = data.token;
                document.getElementById("token_delete").value = data.token;
                updateCalendar();
            }
            else {
                alert("Login failed.")
            }
        })
        .catch(error => console.error("Error", error));
}
document.getElementById("btn_login").addEventListener("click", loginAjax, false);

// Logout Ajax
function logoutAjax(event) {
    fetch("logout_ajax.php", {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            isUser = !data.success;
            if(data.success) {
                document.getElementById("welcome").setAttribute("hidden", "hidden");
                document.getElementById("auth").removeAttribute("hidden");
                document.getElementById("greeting").innerHTML = "";
                updateCalendar();
            }
        })
        .catch(error => console.error("Error", error));
}
document.getElementById("btn_logout").addEventListener("click", logoutAjax, false);

// Delete Your Account
function deleteAccountAjax(event) {
    fetch("deleteAccount_ajax.php", {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            isUser = !data.success;
            if(data.success) {
                logoutAjax();
                updateCalendar();
            }
        })
        .catch(error => console.error("Error", error));
}
document.getElementById("btn_deleteAccount").addEventListener("click", deleteAccountAjax, false);

let curr_title;
let curr_date;
let curr_time;
let curr_tag;

// Make table cell clickable and navigate to event operations.
let dialogBox;

$("#calendar")
    .on("click", "table .date", function () {
        if(isUser) {
            const cell_id = this.id; // The date of this clicked table cell.
            curr_date = cell_id;
            console.log("You just clicked date: " + cell_id);
            let content = document.getElementById(cell_id).textContent;
            document.getElementById("add_date").value = cell_id;
            if(content.length <= 2) {
                // this table cell is empty
                dialogBox = $("#add");
                dialogBox.dialog();
                $("#btn_addCancel").click(function () {
                    dialogBox.dialog("close");
                });
            }
        }
    })
    .on("click", "table .date .list", function () {
    // console.log(isUser);
    if(isUser) {
        let info = this.id;  // format: title@date@time@tag
        let infoSplit = info.split('@');
        curr_title = infoSplit[0];
        curr_date = infoSplit[1];
        curr_time = infoSplit[2];
        curr_tag = infoSplit[3];
        let content = document.getElementById(curr_date).textContent;

        // pre-fill info for edit dialog
        document.getElementById("add_date").value = curr_date;
        document.getElementById("edit_title").value = curr_title;
        document.getElementById("edit_date").value = curr_date;
        document.getElementById("edit_time").value = curr_time;
        document.getElementById("edit_tag").value = curr_tag;

        // Get event ID
        retrieveInfo();

        // console.log("You just clicked date: " + curr_date + curr_title + curr_time + curr_tag);
        if(content.length > 2) {
            // length >= 2, which means apart from date number, there is also an event on this date
            dialogBox = $("#full");
            dialogBox.dialog();
            $(".add_full").click(function () {
               dialogBox.dialog("close");
               dialogBox = $("#add");
               dialogBox.dialog();
            });
            $("#btn_addCancel").click(function () {
                dialogBox.dialog("close");
                dialogBox = $("#full");
                dialogBox.dialog();
            });
            $(".share").click(function () {
                dialogBox.dialog("close");
                dialogBox = $("#share");
                dialogBox.dialog();
            });
            $("#btn_shareBack").click(function () {
                dialogBox.dialog("close");
                dialogBox = $("#full");
                dialogBox.dialog();
            });
            $("#edit_full").click(function () {
                dialogBox.dialog("close");
                dialogBox = $("#edit");
                dialogBox.dialog();
            });
            $("#btn_editBack").click(function () {
                dialogBox.dialog("close");
                dialogBox = $("#full");
                dialogBox.dialog();
            });
        }
    }
});

// Add an Event
function addEvent(event) {
    const title = document.getElementById("add_title").value;
    const date = document.getElementById("add_date").value;
    const time = document.getElementById("add_time").value;
    const tag = $("#tag option:selected").text();
    // console.log(title + " " + date + " " + time + " " + tag);

    // Make a URL-encoded string for passing POST data:
    const data = { 'title': title, 'date': date, 'time': time, 'tag': tag };

    if(title === "" || date === "" || time === "" || tag === "" || tag === "-") {
        alert("Please check your input!");
    }
    else {
        fetch("addEvent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                if(data.success) {
                    document.getElementById("add_title").value = "";
                    document.getElementById("add_date").value = "";
                    document.getElementById("add_time").value = "";
                    document.getElementById("tag").value = "";
                    dialogBox.dialog("close");
                    updateCalendar();
                }
            })
            .catch(error => console.error("Error", error));
    }
}
document.getElementById("btn_addEvent").addEventListener("click", addEvent, false);

// retrieve event id
function retrieveInfo(event) {
    // Make a URL-encoded string for passing POST data:
    const data = { 'title': curr_title, 'date': curr_date, 'time': curr_time, 'tag': curr_tag };

    fetch("retrieveInfo_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                console.log("Event ID: " + data.eventId);
                document.getElementById("eventId").value = data.eventId;
            }
        })
        .catch(error => console.error("Error", error));
}

// Edit Event
function editEvent(event) {
    const eventId = document.getElementById("eventId").value;
    const newTitle = document.getElementById("edit_title").value;
    const newDate = document.getElementById("edit_date").value;
    const newTime = document.getElementById("edit_time").value;
    const newTag = $("#edit_tag option:selected").text();
    const token = document.getElementById("token_edit").value;
    // console.log("eventID: " + eventId);
    // console.log("token: " + token);
    // Make a URL-encoded string for passing POST data:
    const data = { "eventId": eventId, 'title': newTitle, 'date': newDate, 'time': newTime, 'tag': newTag, 'token': token };

    if(eventId === "" || newTitle === "" || newDate === "" || newTime === "" || newTag === "" || newTag === "-") {
        alert("Please check your input!");
    }
    else {
        fetch("editEvent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                if(data.success) {
                    document.getElementById("edit_title").value = "";
                    document.getElementById("edit_date").value = "";
                    document.getElementById("edit_time").value = "";
                    document.getElementById("edit_tag").value = "";
                    dialogBox.dialog("close");
                    updateCalendar();
                }
            })
            .catch(error => console.error("Error", error));
    }
}
document.getElementById("btn_editEvent").addEventListener("click", editEvent, false);

// Remove Event
function removeEvent(event) {
    const eventId = document.getElementById("eventId").value;
    const token = document.getElementById("token_delete").value;
    console.log("Delete event with id= " + eventId);
    // Make a URL-encoded string for passing POST data:
    const data = { "eventId": eventId, 'token': token };

    fetch("removeEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            if(data.success) {
                dialogBox.dialog("close");
                updateCalendar();
            }
        })
        .catch(error => console.error("Error", error));
}
document.getElementById("btn_deleteEvent").addEventListener("click", removeEvent, false);

// Add another friend when sharing events
$("#addInput").click(function () {
   let friends = $("#friends");
    friends.append(
      "<div><input type='text' placeholder='Your Friend' /><a href='#' class='removeInput'>X</a></div>"
    );
});

// Click x to remove input box
$("#friends").on("click", ".removeInput", function () {
   $(this).parent('div').remove();
});

// Share Event with another user
function shareEvent(event) {
    const title = document.getElementById("edit_title").value;
    const date = document.getElementById("edit_date").value;
    const time = document.getElementById("edit_time").value;
    const tag = $("#edit_tag option:selected").text();
    const friend = $("#friends input").map(function () {
        return $(this).val();
    }).get();
    // console.log(friend);
    // Make a URL-encoded string for passing POST data:
    const data = { "title": title, 'date': date, 'time': time, 'tag': tag, 'friend': friend };

    // input check
    let flag = false;
    for(let i = 0; i < friend.length; i++) {
        if(friend[i] === "") {
            flag = false;
            alert("Please check your input!");
            break;
        }
        else {
            flag = true;
        }
    }
    if(flag) {
        fetch("shareEvent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                if(data.success) {
                    document.getElementById("share_username").value = "";
                    dialogBox.dialog("close");
                    updateCalendar();
                    alert("Share Success");
                }
                else {
                    alert("Please check your friends' names. It may not exist.")
                }
            })
            .catch(error => console.error("Error", error));
    }
}
document.getElementById("btn_shareEvent").addEventListener("click", shareEvent, false);

// define the current month in a variable in the global scope
let currentMonth = new Month(2019, 2); // March 2019

// Change the month when the "next" button is pressed
document.getElementById("btn_next").addEventListener("click", function(event){
    currentMonth = currentMonth.nextMonth();
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);

// Change the month when the "prev" button is pressed
document.getElementById("btn_prev").addEventListener("click", function(event){
    currentMonth = currentMonth.prevMonth();
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);

function updateCalendar() {
    let weeks = currentMonth.getWeeks();
    let c_Month = currentMonth.month + 1;
    let x; // convert month number to String
    switch (c_Month) {
        case 1:
            x = "January";
            break;
        case 2:
            x = "February";
            break;
        case 3:
            x = "March";
            break;
        case 4:
            x = "April";
            break;
        case 5:
            x = "May";
            break;
        case 6:
            x = "June";
            break;
        case 7:
            x = "July";
            break;
        case 8:
            x = "August";
            break;
        case 9:
            x = "September";
            break;
        case 10:
            x = "October";
            break;
        case 11:
            x = "November";
            break;
        case 12:
            x = "December";
            break;
    }
    let c_Year = currentMonth.year;

    let calendarView = "<p id='word3'>" + x + ' ' + c_Year + "</p>";
    calendarView +=
        "<table border='1'>" +
        "<tr>" +
        "<th>Sun</th>" +
        "<th>Mon</th>" +
        "<th>Tue</th>" +
        "<th>Wed</th>" +
        "<th>Thu</th>" +
        "<th>Fri</th>" +
        "<th>Sat</th>" +
        "</tr>";
    for(let w in weeks) {
        let days = weeks[w].getDates();
        // days contains normal JavaScript Date Object
        calendarView += "<tr>";
        //alert("Week starting on " + days[0]);
        for(let d in days) {
            //console.log(days[d].toISOString());
            // if(weeks[w].contains(days[d])) {
            if(days[d].getMonth() + 1 == c_Month) {
                // this day belongs to the current month
                let id = convertDateId(days[d]);
                // console.log(id);
                calendarView += "<td class='date' id='" + id + "'>" + days[d].getDate() + "</td>";
            }
            else {
                calendarView += "<td id='123'></td>";
            }
        }
        calendarView += "</tr>";
    }
    calendarView += "</table>";
    displayEvent();
    document.getElementById("calendar").innerHTML = calendarView;
}
document.getElementById("tagBox").addEventListener("change", updateCalendar, false);

// a helper function which convert input day into mysql DATE format (year-month-date)
function convertDateId(day) {
    let year = day.getFullYear();
    let month = day.getMonth() + 1;
    let date = day.getDate();

    if(month < 10)
        month = "0" + month;

    if(date < 10)
        date = "0" + date;

    return year + "-" + month + "-" + date;
}

// Make ajax call, retrieve events of current user and append to the calendar.
function displayEvent(event) {
    fetch("events_ajax.php", {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if(data.success) {

                let box = document.getElementsByName("tagBox");
                let titles = data.titles;
                let dates = data.dates;
                let times = data.times;
                let tags = data.tags;

                for(let i = 0; i < dates.length; i++) {
                    let title = titles[i];
                    let time = times[i];
                    let tag = tags[i];
                    let date = dates[i];
                    if(document.getElementById(date) != null) {
                        if(box[0].checked && tag === "Entertainment") {
                            const newE = document.createElement("p");
                            newE.setAttribute("class", "list");
                            newE.setAttribute("id", title + "@" + date + "@" + time + "@" + tag);
                            newE.appendChild(document.createTextNode(tag + ": " + title + " at " + time));
                            document.getElementById(date).appendChild(newE);
                        }
                        if(box[1].checked && tag === "Work") {
                            const newE = document.createElement("p");
                            newE.setAttribute("class", "list");
                            newE.setAttribute("id", title + "@" + date + "@" + time + "@" + tag);
                            newE.appendChild(document.createTextNode(tag + ": " + title + " at " + time));
                            document.getElementById(date).appendChild(newE);
                        }
                        if(box[2].checked && tag === "Personal") {
                            const newE = document.createElement("p");
                            newE.setAttribute("class", "list");
                            newE.setAttribute("id", title + "@" + date + "@" + time + "@" + tag);
                            newE.appendChild(document.createTextNode(tag + ": " + title + " at " + time));
                            document.getElementById(date).appendChild(newE);
                        }
                    }
                }
            }
        })
        .catch(error => console.error("Error", error));
}

// Calendar helper function from wiki (I imported url, but it didn't work)
(function(){Date.prototype.deltaDays=function(c){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+c)};Date.prototype.getSunday=function(){return this.deltaDays(-1*this.getDay())}})();
function Week(c){this.sunday=c.getSunday();this.nextWeek=function(){return new Week(this.sunday.deltaDays(7))};this.prevWeek=function(){return new Week(this.sunday.deltaDays(-7))};this.contains=function(b){return this.sunday.valueOf()===b.getSunday().valueOf()};this.getDates=function(){for(var b=[],a=0;7>a;a++)b.push(this.sunday.deltaDays(a));return b}}
function Month(c,b){this.year=c;this.month=b;this.nextMonth=function(){return new Month(c+Math.floor((b+1)/12),(b+1)%12)};this.prevMonth=function(){return new Month(c+Math.floor((b-1)/12),(b+11)%12)};this.getDateObject=function(a){return new Date(this.year,this.month,a)};this.getWeeks=function(){var a=this.getDateObject(1),b=this.nextMonth().getDateObject(0),c=[],a=new Week(a);for(c.push(a);!a.contains(b);)a=a.nextWeek(),c.push(a);return c}};
