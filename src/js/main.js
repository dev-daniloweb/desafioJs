let inputElement  = document.querySelector('#user');
let buttonElement = document.querySelector('#btn-add');
let loadElement   = document.createElement('div');
let listElement   = document.querySelector('#list');
let alertElement  = document.querySelector('#alert');

let users = JSON.parse(localStorage.getItem('users')) || [];

//  

function renderList() {
    
    listElement.innerHTML = '';

    for(user of users) {
        var media = document.createElement('div');
        var avatar = document.createElement('img');
        var mediaBody = document.createElement('p');
        var userLogin = document.createElement('strong');

        media.setAttribute('class', 'media text-muted pt-3');
        avatar.setAttribute('src', user.avatar);
        avatar.setAttribute('width', 80);
        avatar.setAttribute('height', 80);
        avatar.setAttribute('class', 'mr-3');
        mediaBody.setAttribute('class', 'media-body pb-3 mb-0 lh-125 border-bottom border-gray');
        userLogin.setAttribute('class', 'd-block text-gray-dark');

        userLogin.innerHTML = '@' + user.user;

        mediaBody.appendChild(userLogin);
        mediaBody.innerHTML += 'Nome: ' + user.name + '<br>Github: <a target="_blank" href="' + user.url + '">' + user.url + '</a><br>Local: ' + user.location;

        media.appendChild(avatar);
        media.appendChild(mediaBody);

        listElement.appendChild(media);
    }
}

function addUserToList(data) {
    var user = {
        user: data.login,
        name: data.name,
        avatar: data.avatar_url,
        url: data.html_url,
        bio: data.bio,
        location: data.location,
        email: data.email,
        company: data.company,
        blog: data.blog
    };

    users.push(user);
    saveUser(JSON.stringify(users));
}

function saveUser(user) {
    localStorage.setItem('users', user);
    renderList();
    showAlert('success', 'Usuário salvo!');
}

function showAlert(type, text) {
    var alertBox = document.createElement('div');
    var alertText = document.createTextNode(text);

    alertBox.setAttribute('class', 'alert alert-' + type + ' mb-0 py-1');
    alertBox.setAttribute('role', 'alert');
    alertBox.appendChild(alertText);

    alertElement.appendChild(alertBox);

    setTimeout(function () {
        alertElement.removeChild(alertBox);
    }, 2000);
}

buttonElement.onclick = function () {
    if (inputElement.value !== '') {

        buttonElement.innerHTML = 'Loading ';
        buttonElement.appendChild(loadElement);

        axios.get('https://api.github.com/users/' + inputElement.value)
             .then(function (response) {
                buttonElement.innerHTML = 'Adicionar';
                addUserToList(response.data);
             })
             .catch(function (error) {
                buttonElement.innerHTML = 'Adicionar';
                showAlert('danger', 'Ocorreu algum erro!');
                console.warn(error);
             });
        
        inputElement.value = '';
    } else {
        showAlert('danger', 'Campo Obrigatório!');
    }
}

loadElement.setAttribute('class', 'spinner-grow spinner-grow-sm');
loadElement.setAttribute('role', 'status');

renderList();