const APIKey = '';

const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');

const savedTodoList = JSON.parse(localStorage.getItem('saved-items'));

const createTodo = (storageData) => {
    let todoContent = todoInput.value;
    if (storageData) {
        todoContent = storageData.contents;
    }

    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    const newBtn = document.createElement('button');

    newBtn.addEventListener('click', () => {
        newLi.classList.toggle('complete');
        saveItemsFn();
    });

    newLi.addEventListener('dblclick', () => {
        newLi.remove();
        saveItemsFn();
    });

    if (storageData?.complete === true) {
        // storageData가 존재하지 않는데 complete를 참조하려 하기 때문에
        // ? : undefine이거나 null이면 참조하지 않겠다.
        newLi.classList.add('complete');
    }

    newSpan.innerHTML = todoContent;
    newLi.appendChild(newBtn);
    newLi.appendChild(newSpan);
    todoList.appendChild(newLi);
    todoInput.value = '';
    saveItemsFn();
    // console.log(todoList.children[0].querySelector('span').innerHTML);
};

const keyCodeCheck = () => {
    if (window.event.keyCode === 13 && todoInput.value !== '') {
        createTodo();
    }
};

const deleteAll = () => {
    const liList = document.querySelectorAll('li');
    for (let i = 0; i < liList.length; i++) {
        liList[i].remove();
    }
};

const saveItemsFn = () => {
    const saveItems = [];
    for (let i = 0; i < todoList.children.length; i++) {
        // console.log(todoList.children[0].querySelector('span').innerHTML);
        const todoObj = {
            contents: todoList.children[i].querySelector('span').innerHTML,
            complete: todoList.children[i].classList.contains('complete'),
        };
        saveItems.push(todoObj);
    }
    if (saveItems.length === 0) {
        localStorage.removeItem('saved-items');
    } else {
        localStorage.setItem('saved-items', JSON.stringify(saveItems));
    }
};

if (savedTodoList) {
    for (let i = 0; i < savedTodoList.length; i++) {
        createTodo(savedTodoList[i]);
    }
}

const weatherSearch = (position) => {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${APIKey}`
    )
        .then((res) => {
            // return JSON.parse(res); // JSON문자열을 JavaScript객체로 파싱
            return res.json(); // HTTP응답객체를 JavaScript객체로 파싱
            // response에 Header가 존재하면 JSON.parse사용 불가
        })
        .then((json) => {
            console.log(json.name, json.weather[0].description); // res.json() 변환하는데 시간이 걸림 따라서 추가 then을 해준다.
        })
        .catch((err) => {
            console.log(err);
        });
};

const accessToGeo = (position) => {
    const positionObj = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    };
    weatherSearch(positionObj);
};

const locErr = (err) => {
    console.log(err);
};

const askForLocation = () => {
    navigator.geolocation.getCurrentPosition(accessToGeo, locErr);
};
askForLocation();
