// Load User List 

var dropped_user = [];
function load_UserList() {
    var userList = data;
    setLeftDataPanel(userList);
    // Generate Right Panel Table
    var no_of_rows = 5, no_of_columns = 4;
    var right_panel_template = "";
    for (var j = 0; j < no_of_rows; j++) {
        right_panel_template = right_panel_template + "<tr>"
        for (var k = 0; k < no_of_columns; k++) {
            right_panel_template = right_panel_template + "<td  class='user-cell' ondrop='drop(event)'  ondragleave='dragLeave(event)' ondragenter='dragEnter()' ondragover='allowDrop(event)' id='" + j + "_" + k + "'></td>";
        }
        right_panel_template = right_panel_template + "</tr>";
    }
    render(right_panel_template, document.querySelector('.user-table'));
}
function render(template, node) {
    if (!node) return;
    node.innerHTML = template;
}
function setLeftDataPanel(userList){
    var left_panel_template = '';
    for (var i = 0; i < userList.length; i++) {
        var user = userList[i];
        left_panel_template = left_panel_template + "<div class='userList' draggable=true  ondragend='dragEnd(event)' ondragstart='drag(event)'  id='" + user.id + "'>" + user.first_name + "</div>";
    }
    render(left_panel_template, document.querySelector('.left-panel-outer'));
}

//Drag And Drop 

function drag(event) {
    event.dataTransfer.setData("Text", event.target.id);
}
function onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
}
function dragEnd(event) {
    event.target.style.border = "";
    resetHover();
}
function drop(event) {
    event.preventDefault();
    var text_data = event.dataTransfer.getData("text");
    event.target.style.border = "";
    if (document.getElementById(text_data)) {
        if (event.target.innerHTML.toString().trim() == "") {
            document.getElementById(text_data).removeAttribute("draggable");
            document.getElementById(text_data).removeAttribute("ondragstart");
            event.target.appendChild(document.getElementById(text_data));
            var delete_icon = document.createElement("span");
            delete_icon.setAttribute("class", "fa fa-close icon-alignment");
            delete_icon.addEventListener("click", deleteConfirmation);
            delete_icon.param = { "id": event.target.id, "text": event.target.outerText, "item_id": text_data };
            event.target.appendChild(delete_icon);
            let index = 0;
            data.find(function (item, i) {
                if (item.id.toString().trim() == text_data.toString().trim()) {
                    index = i;
                    dropped_user.push(item);
                    return i;
                }
            });
            data.splice(index, 1); //Splice user from user list
        }
    }
    resetHover();
}
function allowDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.target.innerHTML.toString().trim() == "") {
        event.target.style.border = "3px solid #0b80ff";
    }
}
function dragEnter() {
    var list = document.getElementsByClassName("user-cell");
    for (var i = 0; i < list.length; i++) {
        if (list[i].innerHTML.toString().trim() == "") {
            list[i].style.border = "3px dotted #04d259";
        }
    }
}
function dragLeave(event) {
    event.target.style.border = "";
    resetHover();
}
function resetHover() {
    var list = document.getElementsByClassName("user-cell");
    for (var i = 0; i < list.length; i++) {
        list[i].style.border = "";
    }
}

//Delete User 

function deleteConfirmation(event) {
    if (confirm("Are you sure you want to delete user?")) {
        deleteUser(event.target.param);
    } else {
        return false;
    }
}
function deleteUser(param) {
    let param_id = param.id;
    let param_text = param.text;
    if (document.getElementById(param_id)) {
        document.getElementById(param_id).innerHTML = "";
        dropped_user.find(function (item, i) {
            if (item.id.toString().trim() == param.item_id.toString().trim()) {
                index = i;
                item.first_name = param_text.toString().trim();
                data.unshift(item); // On Delete ,Add user to user list at starting 
                return item;
            }
        });
        setLeftDataPanel(data);
    }
}