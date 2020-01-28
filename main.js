document.getElementById('toDoInputForm').addEventListener('submit', addToDo);

function pageLoad() {
    fetchToDos();
    filterDoneToDos();
};

// ------------------------------------- ADD + FETCH -------------------------------------

function addToDo(e) {
    // Main to do task
    var toDoID = chance.guid()
    var toDo = document.getElementById('toDoInput').value
    var desc = ''
    var currentDate = getTimestamp()
    var toDoStatus = 'Open'
    var subtask = ''

    toDo = {
        id: toDoID,
        toDo: toDo,
        description: desc,
        timestamp: currentDate,
        status: toDoStatus,
        subtasks: subtask
    };
    

    if (localStorage.getItem('toDos') == null) {
        var toDos = [];
        toDos.push(toDo);
        localStorage.setItem('toDos', JSON.stringify(toDos))
    } else {
        var toDos = JSON.parse(localStorage.getItem('toDos'))
        toDos.push(toDo)
        localStorage.setItem('toDos', JSON.stringify(toDos))
    }

    document.getElementById('toDoInputForm').reset()
    fetchToDos()
    //e.preventDefault();
}

function fetchToDos() {
    var toDos = JSON.parse(localStorage.getItem('toDos'))
    var toDosList = document.getElementById('toDosList')

    toDosList.innerHTML = ''

    for (var i = 0 ; i < toDos.length ; i++) {
        var id = toDos[i].id
        var toDo = toDos[i].toDo
        var toDoDesc = toDos[i].description
        var timestamp = toDos[i].timestamp
        var addDescLink = ''
        var descStyle = ''
        if (toDos[i].description == '') {
            descStyle = 'style="display: none"'
        } else {
            addDescLink = 'style="display: none"'
        }

        if (toDos[i].status == 'Open') {
            toDosList.innerHTML += '<div class="card">' +
                                        '<div class="card-body">' +
                                            '<i class="fas fa-check todoCheck" onclick="doneToDo(\''+id+'\')">&nbsp;&nbsp;&nbsp;&nbsp;</i>' +
                                            '<h6 class="timestamp">' + timestamp + '</h6>' +
                                            '<div id=\''+id+'\'>' +
                                                '<h4 class="toDoTitle" onclick="editToDo(\''+id+'\')">' + toDo + '</h4>' +
                                            '</div>' +
                                            '<div id=toDoDescription'+id+' class="toDoDesc" ' + descStyle + ' onclick="editDescription(\''+id+'\')"><p class="descriptionText">' + toDoDesc + '</p></div>' +
                                            '<a href="#" id="addDescriptionLink'+id+'" ' + addDescLink + ' class="addDescriptionLink" onclick="addDescriptionLayout(\''+id+'\')"><small>Add description ...</small></a>' +
                                            '<div id="addDescriptionInput'+id+'" style="display: none">' +
                                                '<textarea id="descriptionInput'+id+'" type=text class="form-control" placeholder="Add task description ..."></textarea>' +
                                            '</div>' +
                                            '<div id="subtaskList"></div>' +
                                            '<div id="addSubtaskInput'+id+'" style="display: none">' +
                                                '<input id="subtaskInput'+id+'" type=text class="form-control" placeholder="Add subtask description ..."></input>' +
                                            '</div>' +
                                            '<a href="#" onclick="addSubtaskLayout(\''+id+'\')"><small>Add subtask ...</small></a>' +
                                        '</div>' +
                                    '</div>';

            if (toDos[i].subtasks !== '') {
                var subtaskArray = toDos[i].subtasks
                var subtaskList = document.getElementById('subtaskList');

                for (var s = 0 ; s < subtaskArray.length ; s++) {
                    var subtaskID = subtaskArray[s].id;
                    var subtaskDesc = subtaskArray[s].desc;
                    var subtaskClass = "";
                    var subtaskDone = "";

                    if (subtaskArray[s].status == 'Done') {
                        subtaskClass = "subtask subtask-done";
                        subtaskDone = "subtaskCheck subtaskCheck-checked";
                    } else {
                        subtaskClass = "subtask";
                        subtaskDone = "subtaskCheck";
                    };

                    subtaskList.innerHTML += '<div id="subtask'+subtaskID+'" class=\''+subtaskClass+'\'>' +
                                                '<i class="fas fa-check '+subtaskDone+'" onclick="doneSubtask(\''+subtaskID+'\')">&nbsp;&nbsp;&nbsp;&nbsp;</i>' +
                                                '<h5>' + subtaskDesc + '</h5>' +
                                             '</div>';
                };
            };
        };
    };
};

// ------------------------------------- END ADD + FETCH -------------------------------------

// ------------------------------------- TODO FUNCTIONS -------------------------------------
function editToDo(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'))
    var toDoTitleText = document.getElementById(id)

    // Retrieve JSON values of clicked to do
    for (var i = 0 ; i < toDos.length ; i++) {
        if (toDos[i].id == id) {
            var toDoTitleJSON = toDos[i].toDo

            toDoTitleText.innerHTML = '<input type="text" id="editToDoTitle" class="form-control editToDoForm" value="'+toDoTitleJSON+'">&nbsp;</input>'
        }
    }

    var newToDoTitleText = document.getElementById('editToDoTitle')
    newToDoTitleText.select()
    // Save on enter
    newToDoTitleText.addEventListener("keyup", function (){
        if (event.key === "Enter") {
            saveEditToDo(id)
        }
    })
    // Save on click outside of textfield
    newToDoTitleText.addEventListener("blur", function () {
        saveEditToDo(id)
    })
}

function saveEditToDo(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'))
    var newToDoText = document.getElementById('editToDoTitle')
    var toDoTitleText = document.getElementById(id)
    
    for (var i = 0 ; i < toDos.length ; i++) {
        if (toDos[i].id == id) {
            toDos[i].toDo = newToDoText.value
            var toDo = toDos[i].toDo

            toDoTitleText.innerHTML = '<h4 class="toDoTitle" onclick="editToDo(\''+id+'\')">' + toDo + '</h4>'
        }
    }

    localStorage.setItem('toDos', JSON.stringify(toDos))
}

function doneToDo(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'));

    for (var i = 0 ; i < toDos.length ; i++) {
        if (toDos[i].id == id) {
            var subtaskArray = toDos[i].subtasks

            for (var s = 0 ; s < subtaskArray.length ; s++) {
                subtaskArray[s].status = 'Done';
            };
            toDos[i].status = 'Done';
        };
    };

    localStorage.setItem('toDos', JSON.stringify(toDos));
    filterDoneToDos();
    fetchToDos();
};

function filterDoneToDos() {
    var toDos = JSON.parse(localStorage.getItem('toDos'));
    var count = 0;
    var fillTF = document.getElementById('doneToDosCountField')

    for (var i = 0 ; i < toDos.length ; i++) {
        if (toDos[i].status == 'Done') {
            count += 1;
        };
    };

    fillTF.textContent = count;
};

// ------------------------------------- END EDIT FUNCTIONS -------------------------------------

// ------------------------------------- SUBTASKS -------------------------------------

function addSubtaskLayout(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'));

    for (var i = 0 ; i < toDos.length ; i++) {
            if (toDos[i].id == id) {
            // Add add subtask layout
            var subtaskInputField = document.getElementById('addSubtaskInput' + id);

            subtaskInputField.style.display = "block";

            var subtaskDesc = document.getElementById('subtaskInput' + id);
            subtaskDesc.select();

            // Change subtask layout on save
            // When pressing enter
            subtaskDesc.addEventListener("keyup", function (){
                if (event.key === "Enter") {
                    addSubtask(id);
                };
            });

            // Save on click outside of textfield
            subtaskDesc.addEventListener("blur", function () {
                addSubtask(id);
            });
        };
    };
};

function addSubtask(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'));

    for (var i = 0 ; i < toDos.length ; i++) {
        var taskDesc = document.getElementById('subtaskInput' + id).value

        if (toDos[i].id == id) {
            // Add the subtask
            // Subtask
            var taskID = chance.guid()
            var taskStatus = 'Open'
            var subtasks = toDos[i].toDo
            console.log(subtasks)

            var newSubtaskValue = {
                id: taskID,
                desc: taskDesc,
                status: taskStatus
            }

            if (toDos[i].subtasks == '') {
                var toDos = JSON.parse(localStorage.getItem('toDos'))
                var subs = toDos[i].subtasks = []

                subs.push(newSubtaskValue)
                localStorage.setItem('toDos', JSON.stringify(toDos))
            } else {
                var toDos = JSON.parse(localStorage.getItem('toDos'))
                
                for (var s = 0 ; s < toDos.length ; s++) {
                    if (toDos[s].id == id) {
                        subsList = toDos[s].subtasks
                        console.log(subsList)
                        subsList.push(newSubtaskValue)
                        localStorage.setItem('toDos', JSON.stringify(toDos))
                    };
                };
            };

            // Change layout
            var subtaskInputField = document.getElementById('addSubtaskInput' + id)

            // Reset input field
            subtaskInputField.style.display = "none"
        };
    };

    fetchToDos();
};

function doneSubtask(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'));

    for (var i = 0 ; i < toDos.length ; i++) {
        var subtaskArray = toDos[i].subtasks

        for (var s = 0 ; s < subtaskArray.length ; s++) {
            if (subtaskArray[s].id == id && subtaskArray[s].status == 'Open') {
                var subtaskDiv = document.getElementById('subtask' + id);
                subtaskArray[s].status = 'Done';

                subtaskDiv.setAttribute("class", "subtask subtask-done");

            } else if (subtaskArray[s].id == id && subtaskArray[s].status == 'Done') {
                var subtaskDiv = document.getElementById('subtask' + id);
                subtaskArray[s].status = 'Open';

                subtaskDiv.setAttribute("class", "subtask");
            };
        };
    };

    localStorage.setItem('toDos', JSON.stringify(toDos));
    fetchToDos();
};


// ------------------------------------- END SUBTASKS -------------------------------------

// ------------------------------------- DESCRIPTION --------------------------------------

function addDescriptionLayout(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'))

    for (var i = 0 ; i < toDos.length ; i++) {
        if (toDos[i].id == id) {

            // Hide 'Add description ...' field
            var addDescriptionLink = document.getElementById('addDescriptionLink' + id)
            addDescriptionLink.style.display = "none"

            // Show description input field
            var descriptionInputField = document.getElementById('addDescriptionInput' + id)
            descriptionInputField.style.display = "inline"

            // Change subtask layout on save
            var descriptionDesc = document.getElementById('descriptionInput' + id);
            descriptionDesc.select();

            // When pressing enter
            descriptionDesc.addEventListener("keyup", function (){
                if (event.key === "Enter") {
                    addDescription(id);
                };
            });

            // Save on click outside of textfield
            descriptionDesc.addEventListener("blur", function () {
                addDescription(id);
            });
        }
    }
}

function addDescription(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'));
    
    for (var i = 0 ; i < toDos.length ; i++) {
        var taskDesc = document.getElementById('descriptionInput' + id).value

        if (toDos[i].id == id) {
            toDos[i].description = taskDesc
        }
    }

    localStorage.setItem('toDos', JSON.stringify(toDos))

    fetchToDos()
}

function editDescription(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'))
    var toDoDescriptionText = document.getElementById('toDoDescription' + id)

    // Retrieve JSON values of clicked to do and place in editable textarea
    for (var i = 0 ; i < toDos.length ; i++) {
        if (toDos[i].id == id) {
            var toDoTitleJSON = toDos[i].description

            toDoDescriptionText.innerHTML = '<textarea type="text" id="editDescription" class="form-control editToDoForm">'+toDoTitleJSON+'</textarea>'
        }
    }

    var newDescriptionText = document.getElementById('editDescription')
    newDescriptionText.select()
    // Save on enter
    newDescriptionText.addEventListener("keyup", function (){
        if (event.key === "Enter") {
            saveEditDescription(id)
        }
    })
    // Save on click outside of textfield
    newDescriptionText.addEventListener("blur", function () {
        saveEditDescription(id)
    })
}

function saveEditDescription(id) {
    var toDos = JSON.parse(localStorage.getItem('toDos'))
    var newDescriptionText = document.getElementById('editDescription')
    var toDoDescriptionText = document.getElementById('toDoDescription' + id)
    
    for (var i = 0 ; i < toDos.length ; i++) {
        if (toDos[i].id == id) {
            toDos[i].description = newDescriptionText.value
            var description = toDos[i].description

            toDoDescriptionText.innerHTML = '<p class="descriptionText">' + description + '</p>'
        }
    }

    localStorage.setItem('toDos', JSON.stringify(toDos))
}

// ----------------------------------- END DESCRIPTION ------------------------------------


// ------------------------------------- ADDITIONAL FUNCTIONS -------------------------------------

function getTimestamp() {
    var date = new Date();
    var year = String(date.getFullYear()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hour = String(date.getHours()).padStart(2, '0');
    var min = String(date.getMinutes()).padStart(2, '0');
    var sec = String(date.getSeconds()).padStart(2, '0');
    var currentDate = day + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec;

    return currentDate;
};