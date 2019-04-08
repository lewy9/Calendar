<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Calendar</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css">
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
</head>
<body>
<!--Login & Register-->
<div id="auth">
    <!--Login-->
    <div id="login">
    <p>Login Your Account Here.</p>
    <input type="text" id="l_username" placeholder="Username" />
    <input type="password" id="l_password" placeholder="Password" />
    <button id="btn_login">Login</button>
    </div>
    <!--Register-->
    <div id="register">
    <p>Don't have an account? Register here.</p>
    <input type="text" id="r_username" placeholder="Username" />
    <input type="password" id="r_password" placeholder="Password" />
    <button id="btn_register">Register</button>
    </div>
    <br><br><br><br><br><br><br>
</div>

<!--Welcome & LogOut button & Delete Account button-->
<div id="welcome" hidden="hidden">
    <div id="welcome1">
    <h1 id="greeting"></h1>
    <button id="btn_logout">Logout</button>
    <button id="btn_deleteAccount">Delete Yourself</button>
    </div>
    <p id="word1">Click the table cell to create new events or click the already created event to modify</p>
    <p id="word2">You can view events by the following tags: </p>
    <div id="tagBox">
    <label>Entertainment
        <input type="checkbox" name="tagBox" value="Entertainment" checked/>
    </label>
    <label>Work
        <input type="checkbox" name="tagBox" value="Work" checked/>
    </label>
    <label>Personal
        <input type="checkbox" name="tagBox" value="Personal" checked/>
    </label>
    </div><br>
</div>

<!--Change the month button (Previous & Next)-->
<div id="prev_next">
    <button id="btn_prev">Prev</button>
    <button id="btn_next">Next</button><br>
</div>

<!--Calendar View-->
<div id="calendar">
</div>

<!--Event operations for registered users-->
<!--Add event Dialog-->
<div id="container">
<dialog id="add">
    Title: <input type="text" id="add_title" placeholder="Title" /> <br/>
    Date: <label for="add_date"></label><input type="date" id="add_date" /> <br/>
    Time: <label for="add_time"></label><input type="time" id="add_time" /> <br/>
    <label>Tag:
        <select id="tag">
            <option>-</option>
            <option>Entertainment</option>
            <option>Work</option>
            <option>Personal</option>
        </select>
    </label> <br>
    <button id="btn_addEvent">Add</button>
    <button id="btn_addCancel">Cancel</button>

</dialog>

<!--Share event Dialog-->
<dialog id="share">
    <div id="friends">
    <div><input type="text" id="share_username" placeholder="Your Friend" /></div>
    </div><br>
    <button id="addInput">Add another friend</button>
    <button id="btn_shareEvent">Share</button>
    <button id="btn_shareBack">Back</button>
</dialog>

<?php
session_start();
if(!isset($_SESSION['username']))
    session_destroy();
?>
<!--Edit event Dialog-->
<dialog id="edit">
    Title: <input type="text" id="edit_title" placeholder="Title" /> <br/>
    Date: <label for="edit_date"></label><input type="date" id="edit_date" /> <br/>
    Time: <label for="edit_time"></label><input type="time" id="edit_time" /> <br/>
    <label>Tag:
        <select id="edit_tag">
            <option>-</option>
            <option>Entertainment</option>
            <option>Work</option>
            <option>Personal</option>
        </select>
    </label><br>
    <input type="hidden" id="eventId" value=""/>
    <input type="hidden" id="token_edit" value="<?php echo $_SESSION['token'];?>" />
    <button id="btn_editEvent">Edit</button>
    <button id="btn_editBack">Back</button>
</dialog>

<!--Button Dialog for a scheduled day(You can share/public/edit/delete)-->
<dialog id="full">
    <button class="add_full">Add</button>
    <button class="share">Share</button>
    <button id="edit_full">Edit</button>
    <button id="btn_deleteEvent">Delete</button>
    <input type="hidden" id="token_delete" value="<?php echo $_SESSION['token'];?>" />
</dialog>

</div>

<script type="text/javascript" src="ajax.js"></script>
<script type="text/javascript" src="http://classes.engineering.wustl.edu/cse330/content/calendar.min.js"></script>
</body>
</html>