const followList = document.querySelector('.following-list');
const followersList = document.querySelector('.followers-list');

//buttons
const followButton = document.querySelector('.following');
const followersButton = document.querySelector('.followers');

followButton.addEventListener('click', () => {
  if (followList.classList.contains('active')) {
    followList.innerHTML = '';
    followList.classList.remove('active');
  } else {
    fetch('/following', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((following) => {
        following.forEach((user) => {
          const li = document.createElement('li');
          li.textContent = user.name;
          followList.appendChild(li);
        })
      })
      .catch((err) => {
        console.log(err);
      })

    followList.classList.add('active');
  }
});

followersButton.addEventListener('click', () => {
  if (followersList.classList.contains('active')) {
    followersList.innerHTML = '';
    followersList.classList.remove('active');
  } else {
    fetch('/followers', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((followers) => {
        followers.forEach((user) => {
          const li = document.createElement('li');
          li.textContent = user.name;
          followersList.appendChild(li);
        })
      })
      .catch((err) => {
        console.log(err);
      })

    followersList.classList.add('active');
  }
});

