// alerts in forms
const alert = document.querySelector('.alert-reg');
setTimeout(() => {
    alert.classList.add('d-none');
}, 3000);


// search
const searchBtn = document.querySelector('.search-btn');
const searchClose = document.querySelector('.search-close');
const searchBox = document.querySelector('.search-box');
const searchBar = document.querySelector('.search-bar');
const searchItems = document.querySelector('.search-items');
let searchBoxDisplay = searchBox.classList;

searchBtn.addEventListener('click', () => {
    searchBoxDisplay.remove('d-none');
});

searchClose.addEventListener('click', () => {
    searchBoxDisplay.add('d-none');
});

let search;
// on keyup event it will search and create elements
searchBar.addEventListener('keyup', () => {
    let query = searchBar.value;
    clearTimeout(search);
    document.querySelector('.loading').classList.remove('d-none');
    searchItems.innerHTML = '';

    if(query){
        search = setTimeout(async ()=> {
            await fetch(`/search/${query}`)
          .then((response) => response.json())
          .then((data) => {
            if(data.length === 0){
                document.querySelector('.search-alert').classList.remove('d-none');
                document.querySelector('.loading').classList.add('d-none');
            }else {

                data.forEach(data => {
                    document.querySelector('.search-alert').classList.add('d-none');
                    document.querySelector('.loading').classList.add('d-none');
                    let searchItem = document.createElement('div');
                    searchItem.innerHTML = `<div class="my-2 p-3 d-flex align-items-center border"><a href="/users/${data.username}"><img class="nav-img mx-2 border border-dark"src="data:image/image/jpg;base64,
                    ${data.picture}"></a>
                    <a href="/users/${data.username}"><h6 class="m-0 ms-3 fw-bold">${data.username}</h6></a></div>`;
                    searchItems.appendChild(searchItem);
                });
            }
          });
    
        },1500);

    }
});


    // socket
    if(location.pathname === '/chat'){
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.querySelector('.chat-messages');
    const usersList = document.querySelector('#users');

    const user = document.querySelector('.username-socket').getAttribute('href').substring(7);

    const socket = io();

    // get users
    socket.on('chatUsers', (users) => {
        outputUsers(users);
    });

    // join chat
    socket.emit('joinChat', user);

    // message from server
    socket.on('message', (message) => {
        outputMessage(message);

        // scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    })

    // message Submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = e.target.elements.msg.value;

        // emit msg to server
        socket.emit('chatMessage', msg);

        // clear message
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();

    });

    // output message to DOM
    function outputMessage(message){
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`
        document.querySelector('.chat-messages').appendChild(div);
    }

    // add users to dom
    function outputUsers(users){
        usersList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
    }
}