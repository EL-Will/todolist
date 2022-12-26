let apiURL = 'http://127.0.0.1:3000/api/v1/todos';

function renderContent(data, pageNum, perPage) {
    var divData = '';
    let startIndex = pageNum * perPage;
    let endIndex = startIndex + perPage;
    if (endIndex > data.length) {
        endIndex = data.length
    }
    for (let i = startIndex; i < endIndex; i++) {
        if (data[i].completed == true) {
            if (i == startIndex) {
                divData += `
                <div class="row format-row">
                    <div class="box-content-todo strick-text col-lg-8 col-xl-8 col-md-8 col-8">${data[i].title}</div>
                    <button type="button" class="col-lg-2 col-xl-2 col-md-2 col-2 border-finish-btn" name="${data[i].id}"><i class="fa-solid fa-square-check"></i></button>
                    <button type="button" class="col-lg-2 col-xl-2 col-md-2 col-2 border-delete-btn" name="${data[i].id}"><i class="fa-sharp fa-solid fa-trash"></i></button>
                </div>
                `;
            }
            else {
                divData += `
                <div class="row format-row margin-top-10">
                    <div class="box-content-todo strick-text col-lg-8 col-xl-8 col-md-8 col-8">${data[i].title}</div>
                    <button type="button" class="col-lg-2 col-xl-2 col-md-2 col-2 border-finish-btn" name="${data[i].id}"><i class="fa-solid fa-square-check"></i></button>
                    <button type="button" class="col-lg-2 col-xl-2 col-md-2 col-2 border-delete-btn" name="${data[i].id}"><i class="fa-sharp fa-solid fa-trash"></i></button>
                </div>
                `;
            }
        }
        else {
            if (i == startIndex) {
                divData += `
                <div class="row format-row">
                    <div class="box-content-todo col-lg-8 col-xl-8 col-md-8 col-8">${data[i].title}</div>
                    <button type="button" class="col-lg-2 col-xl-2 col-md-2 col-2 border-finish-btn" name="${data[i].id}"><i class="fa-solid fa-square-check"></i></button>
                    <button type="button" class="col-lg-2 col-xl-2 col-md-2 col-2 border-delete-btn" name="${data[i].id}"><i class="fa-sharp fa-solid fa-trash"></i></button>
                </div>
                `;
            }
            else {
                divData += `
                <div class="row format-row margin-top-10">
                    <div class="box-content-todo col-lg-8 col-xl-8 col-md-8 col-8">${data[i].title}</div>
                    <button type="button" class="col-lg-2 col-xl-2 col-md-2 col-2 border-finish-btn" name="${data[i].id}"><i class="fa-solid fa-square-check"></i></button>
                    <button type="button" class="col-lg-2 col-xl-2 col-md-2 col-2 border-delete-btn" name="${data[i].id}"><i class="fa-sharp fa-solid fa-trash"></i></button>
                </div>
                `;
            }
        }
    };
    document.getElementById('renderTodoContent').innerHTML = divData;
}

function renderNumberPage(stratPage, endPage) {
    var divData = ''
    divData += ` 
    <li class="page-item">
        <button class="page-link" id="previousPage" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
        </button>
    </li>`;
    for (let i = stratPage; i < endPage + 1; i++) {
        divData += `<li class="page-item"><a class="page-link click-page" href="#${i}">${i}</a></li>`
    }
    divData += `
    <li class="page-item">
        <button class="page-link" id="nextBtn"  aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
        </button>
    </li>
    `
    document.getElementById('renderNumberPage').innerHTML = divData;
}

function nextPage(data, stratPage, endPage, perPage, totalPage) {
    
    if (endPage == (totalPage - 1)) {
        document.getElementById("nextBtn").disabled = true;
    }
    else {
        document.getElementById("nextBtn").disabled = false;
    }
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (endPage + 5 >= totalPage - 1) {
            stratPage = endPage + 1;
            endPage = totalPage - 1;
            console.log(stratPage);
            console.log(endPage);
        }
        else {
            stratPage += 5;
            endPage += 5;
        }
        renderNumberPage(stratPage, endPage);
        let listPage = document.getElementsByClassName('click-page');
        listPage[0].style.backgroundColor = 'rgba(230, 228, 228, 0.829)';
        window.location.hash = `#${stratPage}`;
        renderContent(data, stratPage, perPage);
        changePage(data, stratPage, endPage, perPage);
    });
}

function previousPage(data, stratPage, endPage, perPage, totalPage) {
    if (stratPage == 0) {
        document.getElementById("previousPage").disabled = true;
    }
    else {
        document.getElementById("previousPage").disabled = false;
    }
    document.getElementById('previousPage').addEventListener('click', () => {
        if (stratPage == 0) {
            stratPage = 0;
            endPage = 4;
        }
        else if (stratPage == totalPage - 1) {
            endPage -= 1;
            stratPage = endPage - 4;
        }
        else {
            stratPage -= 5;
            endPage -= 5;
        }
        renderNumberPage(stratPage, endPage);
        let listPage = document.getElementsByClassName('click-page');
        listPage[0].style.backgroundColor = 'rgba(230, 228, 228, 0.829)';
        window.location.hash = `#${stratPage}`;
        renderContent(data, stratPage, perPage);
        changePage(data, stratPage, endPage, perPage);
    });
}

function changePage(data, stratPage, endPage, perPage) {
    let totalPage = caculateTotalPage(data, perPage);
    nextPage(data, stratPage, endPage, perPage, totalPage);
    previousPage(data, stratPage, endPage, perPage, totalPage);
    selectPage(data, perPage);
    deleteTodo();
    finishTodo();
}

function caculateTotalPage(data, perPage) {
    let len = data.length;
    let totalPage;
    if (len % perPage == 0) {
        totalPage = len / perPage;
    }
    else {
        totalPage = Math.floor(len / perPage) + 1;
    }
    return totalPage;
}

function initialPage(data, stratPage, endPage, perPage) {
    renderNumberPage(stratPage, endPage);
    let listPage = document.getElementsByClassName('click-page');
    listPage[0].style.backgroundColor = 'rgba(230, 228, 228, 0.829)';
    window.location.hash = `#${stratPage}`;
    renderContent(data, stratPage, perPage);
}

function selectPage(data, perPage) {
    let listPage = document.getElementsByClassName('click-page');
    for (let i = 0; i < listPage.length; i++) {
        listPage[i].addEventListener('click', () => {
            for (let j = 0; j < listPage.length; j++) {
                listPage[j].removeAttribute('style');
            }
            listPage[i].style.backgroundColor = 'rgba(230, 228, 228, 0.829)';
            let pageClicked = Number(listPage[i].innerText);
            renderContent(data, pageClicked, perPage);
            deleteTodo();
            finishTodo();
        })
    }
}

function deleteTodo() {
    let arrDeleteBtn = document.getElementsByClassName('border-delete-btn');
    for (let i = 0; i < arrDeleteBtn.length; i++) {
        arrDeleteBtn[i].addEventListener('click', async () => {
            const deleteMethod = {
                method: 'DELETE', // Method itself
                headers: {
                    'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
                }
            }
            fetch(`http://127.0.0.1:3000/api/v1/todos/${arrDeleteBtn[i].name}`, deleteMethod)
                .then(response => response.json())
                .then(async (data) => {
                    // let newdata = JSON.parse(JSON.stringify(await fetch(apiURL).then(res => res.json())));
                    // let count = 0;
                    // for (let i in newdata) {
                    //     if (newdata[i].completed == false) {
                    //         count++;
                    //     }
                    // }
                    // document.getElementsByClassName('text-1')[0].innerHTML = `You have <strong>${count}</strong> pending tasks`;
                    alert(data.message);
                    getData(apiURL);
                    // window.location.href = `http://127.0.0.1:3000`;
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(err => console.log(err)); // Do something with the error
        })
    }
}

function finishTodo() {
    let arrFinishBtn = document.getElementsByClassName('border-finish-btn');
    for (let i = 0; i < arrFinishBtn.length; i++) {
        arrFinishBtn[i].addEventListener('click', async () => {
            const someData = {
                "completed": true
            }
            const putMethod = {
                method: 'PUT', // Method itself
                headers: {
                    'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
                },
                body: JSON.stringify(someData) // We send data in JSON format
            }
            fetch(`http://127.0.0.1:3000/api/v1/todos/${arrFinishBtn[i].name}`, putMethod)
                .then(response => response.json())
                .then(async (data) => {
                    // let newdata = JSON.parse(JSON.stringify(await fetch(apiURL).then(res => res.json())));
                    // let count = 0;
                    // for (let i in newdata) {
                    //     if (newdata[i].completed == false) {
                    //         count++;
                    //     }
                    // }
                    // document.getElementsByClassName('text-1')[0].innerHTML = `You have <strong>${count}</strong> pending tasks`;
                    alert(data.message);
                    getData(apiURL);
                    // window.location.href = `http://127.0.0.1:3000`;
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(err => console.log(err)); // Do something with the error
        })
    }
}
function createTodo() {
    let submitPost = document.getElementsByClassName('create-todo-form')[0];
    let newTodo = {};
    submitPost.addEventListener('submit', async (e) => {
        e.preventDefault();
        let data = JSON.parse(JSON.stringify(await fetch(apiURL).then(res => res.json())));
        let id = data[data.length - 1].id + 1;
        newTodo = {
            "userId": 10,
            "id": id,
            "title": submitPost.nameTodo.value,
            "completed": false
        };
        if (newTodo.title != '') {
            const postMethod = {
                method: 'POST', // Method itself
                headers: {
                    'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
                },
                body: JSON.stringify(newTodo) // We send data in JSON format
            }
            fetch(`http://127.0.0.1:3000/api/v1/todos`, postMethod)
                .then(response => response.json())
                .then(async (data) => {
                    // let newdata = JSON.parse(JSON.stringify(await fetch(apiURL).then(res => res.json())));
                    // let count = 0;
                    // for (let i in newdata) {
                    //     if (newdata[i].completed == false) {
                    //         count++;
                    //     }
                    // }
                    // document.getElementsByClassName('text-1')[0].innerHTML = `You have <strong>${count}</strong> pending tasks`;
                    alert(data.message);
                    submitPost.nameTodo.value = '';
                    getData(apiURL);
                    // window.location.href = `http://127.0.0.1:3000`;
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(err => console.log(err)); // Do something with the error
        }
        else {
            alert('Please input data in this form')
        }
    });
}
function changePerPage(data) {
    document.getElementById('perPage').addEventListener('change', () => {
        let stratPage = 0;
        let endPage = 4;
        let strPerPage = document.getElementById('perPage').value;
        let perPage = Number(strPerPage);
        initialPage(data, stratPage, endPage, perPage);
        changePage(data, stratPage, endPage, perPage);
        selectPage(data, perPage);
        deleteTodo();
        finishTodo();
    })
};

async function getData(apiURL) {
    let data = [];
    let spinner = document.getElementById('spinnerLoading');
    if (data.length == 0) {
        if (spinner.className.indexOf('hide-spinner') != -1) {
            spinner.classList.toggle('hide-spinner');
            spinner.classList.toggle('show-spinner');
        }
    }
    data = JSON.parse(JSON.stringify(await fetch(apiURL).then(res => res.json())));
    if (data.length > 0) {
        if (spinner.className.indexOf('hide-spinner') == -1) {
            spinner.classList.toggle('hide-spinner');
            spinner.classList.toggle('show-spinner');
        }
    }
    let count = 0;
    for (let i in data) {
        if (data[i].completed == false) {
            count++;
        }
    }
    document.getElementsByClassName('text-1')[0].innerHTML = `You have <strong>${count}</strong> pending tasks`;
    let stratPage = 0;
    let endPage = 4;
    let strPerPage = document.getElementById('perPage').value;
    let perPage = Number(strPerPage);
    initialPage(data, stratPage, endPage, perPage);
    selectPage(data, perPage);
    changePage(data, stratPage, endPage, perPage);
    changePerPage(data);
}
getData(apiURL);
createTodo();



