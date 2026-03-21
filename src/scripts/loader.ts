const loader = document.getElementById('page-loader');

if (loader) {
  window.addEventListener('load', () => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  });
}
