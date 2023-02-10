const { io } = require('socket.io-client');

let username = null;

function connect() {
    username = document.getElementById('Username').value;

    //let socket = io.connect(document.getElementById('Host').value);
    let socket = io.connect('http://192.168.1.115:5000');

    socket.emit('join', JSON.stringify({
        userID: 0,
        username: username,
        room: document.getElementById('Room').value,
    }));

    socket.on('message', (data) => {
        data = JSON.parse(data);
        push_notification(data.message);
    });

    socket.on('user-message', (data) => {
        data = JSON.parse(data);
        document.getElementById('chat').innerHTML += `(${data.username}) ${data.message}\n`;
    });


    document.getElementById('send-button').addEventListener('click', () => {
        let message = document.getElementById('chat-input').value;

        socket.emit('send-message', JSON.stringify({ message: message }));
        document.getElementById('chat').innerHTML += `(yo) ${message}\n`;
    });

    //socket.emit('status');
}


document.getElementById('connect-button').addEventListener('click', () => {
    connect();
});

/*let notification_container = document.getElementsByClassName('notification-zone')[0];
let notification_text = document.getElementsByClassName('notification-message')[0];*/
class Notification {
    constructor(message) {
        this.message = message;
        let container = document.getElementsByClassName('notification-container')[0];

        restart();

        let notif_zone = document.createElement('div');
        notif_zone.setAttribute('class', 'notification-zone green-notif');

        container.appendChild(notif_zone);

        let notification_message = document.createElement('p');
        notification_message.setAttribute('class', 'notification-message');

        notif_zone.appendChild(notification_message);
        notification_message.innerText = message;

        notif_zone.addEventListener("webkitAnimationEnd", restart, false);
        notif_zone.addEventListener("animationend", restart, false);
        notif_zone.addEventListener("oanimationend", restart, false);

        function restart() {
            container.innerHTML = '';
        }
    }
}

function push_notification(message) {
    new Notification(message);
}