const input = document.querySelector('#search');

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    window.location.href = `/search?query=${input.value}`
  }
})