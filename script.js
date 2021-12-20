const apikey = '6bc34d92-1112-47f8-9302-7a729b1c3a18'; // https://todo-api.coderslab.pl/apikey/create
const apihost = 'https://todo-api.coderslab.pl';

document.addEventListener('DOMContentLoaded', function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error('Wystąpił błąd! :apiListTasks()');
            }
        }
    ).then(function (resp) {

        resp.data.forEach(function (singleTask) {
            renderTask(singleTask.id, singleTask.title, singleTask.description, singleTask.status);
        });

    }).then(() => {
        const addTaskButton = document.querySelector('button');
        const titleInput = document.querySelectorAll('input')[0];
        const descriptionInput = document.querySelectorAll('input')[1];

        addTaskButton.addEventListener("click", function (e) {
            e.preventDefault();
            if (titleInput.value != "" && descriptionInput.value != "") {
                apiCreateTask(titleInput.value, descriptionInput.value).then(function (resp) {
                    renderTask(resp.data.id, resp.data.title, resp.data.description, resp.data.status);
                    titleInput.value = '';
                    descriptionInput.value = '';
                });
            }
        });
    }).catch(function (err) {
        console.log(err);
    });
});

function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error('Wystąpił błąd! :apiCreateTask()');
            }
        }
    ).catch(function (err) {
        console.log(err);
    });
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                throw new Error('Wystąpił błąd! :apiDeleteTask()');
            }
        }
    ).catch(function (err) {
        console.log(err);
    })
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + '/api/tasks/' + taskId  + '/operations',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error('Wystąpił błąd! :apiCreateOperationForTask()');
            }
        }
    ).catch(function (err) {
        console.log(err);
    });
}

function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(
        apihost + "/api/operations/" + operationId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: timeSpent}),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error('Wystąpił błąd! :apiUpdateOperation()');
            }
        }
    ).catch(function (err) {
        console.log(err);
    })
}

function apiDeleteOperation(operationId) {
    return fetch(
        apihost + "/api/operations/" + operationId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error('Wystąpił błąd! :apiUpdateOperation()');
            }
        }
    ).catch(function (err) {
        console.log(err);
    })
}

function apiUpdateTask(taskId, title, description, status) {
    return fetch(
        apihost + "/api/tasks/" + taskId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'closed'}),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error('Wystąpił błąd! :apiUpdateOperation()');
            }
        }
    ).catch(function (err) {
        console.log(err);
    })
}

function renderTask(taskId, title, description, status) {
    const section = document.createElement("section");
    section.classList = "card mt-5 shadow-sm";
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status == 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
        finishButton.addEventListener("click", function (e) {
            e.preventDefault();
            apiUpdateTask(taskId, title, description, status).then(
                function () {
                    finishButton.remove();
                    formDiv.remove();
                    ul.querySelectorAll('button').forEach(function (el) {
                        el.remove();
                    })
                    formDiv.remove();
                }
            );
        })
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);
    deleteButton.addEventListener("click", function (e) {
        e.preventDefault();
        apiDeleteTask(taskId).then(function () {
                section.remove();
            }
        );
    });

    const ul = document.createElement('ul');
    ul.classList = "list-group list-group-flush";
    section.appendChild(ul);

    apiListOperationsForTask(taskId).then(function (response) {
        response.data.forEach(
            function (operation) {
                renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
            }
        );
    });

    const formDiv = document.createElement('div');
    formDiv.className = 'card-body';
    section.appendChild(formDiv);

    const form = document.createElement('form');
    formDiv.appendChild(form);

    const formDivInner = document.createElement('div');
    formDivInner.className = 'input-group';
    formDiv.appendChild(formDivInner);

    const inputEl = document.createElement('input');
    inputEl.type = "text";
    inputEl.placeholder = "Operation description";
    inputEl.className = 'form-control';
    inputEl.minLength = '5';
    formDivInner.appendChild(inputEl);

    const formDivInner1 = document.createElement('div');
    formDivInner1.className = 'input-group-append';
    formDivInner.appendChild(formDivInner1);

    const buttonAdd = document.createElement('button');
    buttonAdd.className = 'btn btn-info';
    buttonAdd.innerText = 'Add';
    formDivInner1.appendChild(buttonAdd);
    buttonAdd.addEventListener("click", function (e) {
        e.preventDefault();
        apiCreateOperationForTask(taskId, inputEl.value).then(function (resp) {
            renderOperation(ul, resp.data.task.status, resp.data.id, resp.data.description, resp.data.timeSpent);
            inputEl.value = "";
        });
    })
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error('Wystąpił błąd! :apiListOperationsForTask()');
            }
        }
    );
}

function formatTime(timeOfMinute) {
    const hour = Math.trunc(timeOfMinute / 60);
    const minute = timeOfMinute % 60;
    if (hour > 0) {
        if (minute > 0) {
            return hour + "h " + (timeOfMinute % 60) + "m";
        } else {
            return hour + "h";
        }
    } else {
        return (timeOfMinute % 60) + "m";
    }
}

function renderOperation(operationsUl, status, operationId, operationDescription, timeSpent) {

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    operationsUl.appendChild(li);

    const descriptionDiv1 = document.createElement('div');
    descriptionDiv1.innerText = operationDescription;
    li.appendChild(descriptionDiv1);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = formatTime(timeSpent);
    descriptionDiv1.appendChild(time);

    if (status == "open") {
        const descriptionDivButtons = document.createElement('div');
        li.appendChild(descriptionDivButtons);

        const button5m = document.createElement('button');
        button5m.className = 'btn btn-outline-success btn-sm mr-2';
        button5m.innerText = '-5m';
        descriptionDivButtons.appendChild(button5m);
        button5m.addEventListener("click", function (e) {
            e.preventDefault();
            apiUpdateOperation(operationId, operationDescription, timeSpent - 5).then(
                function () {
                    if (timeSpent >= 5) {
                        timeSpent = timeSpent - 5;
                        time.innerText = formatTime(timeSpent);
                    }
                }
            );
        });

        const button15m = document.createElement('button');
        button15m.className = 'btn btn-outline-success btn-sm mr-2';
        button15m.innerText = '+15m';
        descriptionDivButtons.appendChild(button15m);
        button15m.addEventListener("click", function (e) {
            e.preventDefault();
            apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
                function () {
                    timeSpent = timeSpent + 15;
                    time.innerText = formatTime(timeSpent);
                }
            );
        });

        const button1h = document.createElement('button');
        button1h.className = 'btn btn-outline-success btn-sm mr-2';
        button1h.innerText = '+1h';
        descriptionDivButtons.appendChild(button1h);
        button1h.addEventListener("click", function (e) {
            e.preventDefault();
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(
                function () {
                    timeSpent = timeSpent + 60;
                    time.innerText = formatTime(timeSpent);
                });
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn btn-outline-danger btn-sm';
        buttonDelete.innerText = 'Delete';
        descriptionDivButtons.appendChild(buttonDelete);
        buttonDelete.addEventListener("click", function (e) {
            e.preventDefault();
            apiDeleteOperation(operationId).then(
                function () {
                    li.remove();
                });
        });
    }
}

