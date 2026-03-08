document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burger-btn");
  const navMenu = document.getElementById("nav-menu");

  // Show/hide navigation menu on burger button click
  burgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
});
