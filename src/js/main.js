let inputElement  = document.querySelector('#user');
let buttonElement = document.querySelector('#btn-add');
let loadElement   = document.createElement('div');
let listElement   = document.querySelector('#list');
let alertElement  = document.querySelector('#alert');

let users = JSON.parse(localStorage.getItem('users')) || []; 

function renderList() {
    
    listElement.innerHTML = '';

    for(user of users) {
        var media = document.createElement('div');
        var avatar = document.createElement('img');
        var mediaBody = document.createElement('p');
        var userLogin = document.createElement('strong');
        var btnView = document.createElement('button');
        var iconView = document.createElement('i');
        var btnRemove = document.createElement('button');
        var iconRemove = document.createElement('i');

        media.setAttribute('class', 'media text-muted pt-3');
        avatar.setAttribute('src', user.avatar);
        avatar.setAttribute('width', 80);
        avatar.setAttribute('height', 80);
        avatar.setAttribute('class', 'mr-3');
        mediaBody.setAttribute('class', 'media-body pb-3 mb-0 lh-125 border-bottom border-gray');
        userLogin.setAttribute('class', 'd-block text-gray-dark');
        btnView.setAttribute('type', 'button');
        btnView.setAttribute('class', 'btn btn-info mr-2');
        btnView.setAttribute('data-toggle', 'modal');
        btnView.setAttribute('data-target', '#exampleModal');
        btnView.setAttribute('data-user', JSON.stringify(user));
        iconView.setAttribute('class', 'far fa-eye');
        btnRemove.setAttribute('class', 'btn btn-danger');
        btnRemove.setAttribute('onclick', 'deleteUser("' + users.indexOf(user) + '")');
        iconRemove.setAttribute('class', 'far fa-trash-alt');

        userLogin.innerHTML = '@' + user.user;

        mediaBody.appendChild(userLogin);
        mediaBody.innerHTML += '<strong>Name:</strong> ' + user.name 
                            +  '<br><strong>Github:</strong> <a target="_blank" href="' + user.url + '">' + user.url + '</a>';

        btnView.appendChild(iconView);
        btnRemove.appendChild(iconRemove);

        media.appendChild(avatar);
        media.appendChild(mediaBody);
        media.appendChild(btnView);
        media.appendChild(btnRemove);

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
    showAlert('success', 'Usuário salvo!');
}

function saveUser(users) {
    localStorage.setItem('users', users);
    renderList();
}

function deleteUser(user) {
    users.splice(user, 1);
    saveUser(JSON.stringify(users));
    showAlert('success', 'Usuário removido!');
}

function showAlert(type, text) {
    var alertBox = document.createElement('div');
    var alertText = document.createTextNode(text);

    alertBox.setAttribute('class', 'alert alert-' + type + ' mb-0 py-1');
    alertBox.setAttribute('role', 'alert');
    alertBox.appendChild(alertText);

    alertElement.innerHTML = '';
    alertElement.appendChild(alertBox);

    setTimeout(function () {
        alertElement.innerHTML = '';
    }, 2000);
}

buttonElement.onclick = function () {
    if (inputElement.value !== '') {

        var userExiste = false;

        buttonElement.innerHTML = 'Loading ';
        buttonElement.appendChild(loadElement);

        for(user of users) {
            if(user.user.toLowerCase() == inputElement.value.toLowerCase()) {
                buttonElement.innerHTML = 'Adicionar';
                showAlert('info', 'Usuário já existe!');
                userExiste = true;
                break;                
            }
        }

        if(!userExiste) {
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
        }
        
        inputElement.value = '';
    } else {
        showAlert('danger', 'Campo Obrigatório!');
    }
}

loadElement.setAttribute('class', 'spinner-grow spinner-grow-sm');
loadElement.setAttribute('role', 'status');

renderList();

// JQuery code
$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var user = button.data('user'); 

    var modal = $(this);
    modal.find('.modal-title').text('User: @' + user.user);
    modal.find('#avatar').attr('src', user.avatar);
    modal.find('#name').text(user.name);
    modal.find('#github').text(user.url);
    modal.find('#linkGithub').attr('href', user.url);
    modal.find('#email').text(user.email);
    modal.find('#blog').text(user.blog);
    modal.find('#company').text(user.company);
    modal.find('#location').text(user.location);
    modal.find('#bio').text(user.bio);
});