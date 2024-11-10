const friendsList = document.querySelector('ul');

fetch('/friendList', {
  method: 'GET',
})
  .then((res) => res.json())
  .then((friends) => {
    console.log(friends);
    friends.forEach((friend) => {
      const li = document.createElement('li');
      li.textContent = friend.name;
      li.addEventListener('click', () => {
        window.location.href = `/chat?id=${friend.id}`
      })
      friendsList.appendChild(li);
    })
  })
  .catch((err) => {
    console.log(err);
  });

