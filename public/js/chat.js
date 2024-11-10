const socket = io();
console.log(document.body);
const userId = document.body.getAttribute('data-user-id');
const friendId = document.body.getAttribute('data-friend-id');

// Verify that the IDs are correct
console.log("User ID:", userId);
console.log("Friend ID:", friendId);

const roomId = `room_${Math.min(userId, friendId)}_${Math.max(userId, friendId)}`;

//join room on connection
socket.emit('join_room', { userId, friendId });

//listen for messages
socket.on('chat message', ({ message, sender }) => {
  const chatBox = document.getElementById('chat-box');
  const msgElement = document.createElement('p');
  msgElement.textContent = `${sender}: ${message}`;
  chatBox.appendChild(msgElement);
});

document.getElementById('send').addEventListener('click', () => {
  const messageInput = document.getElementById('message');
  const message = messageInput.value;
  console.log(message);
  if (message) {
    socket.emit('chat message', ({ roomId, message, sender: userId }));
    messageInput.value = '';
  }
})