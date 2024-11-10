const followButtons = document.querySelectorAll('.follow-button');

followButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const listItem = e.target.parentElement;

    //* get user id
    const userId = listItem.dataset.userid;

    //* follow user
    fetch(`/follow/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    })
  })
})



