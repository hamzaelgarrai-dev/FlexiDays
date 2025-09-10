


//styling the navbar
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname; 
  const navLinks = document.querySelectorAll(".links a");

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active-tab"); 
    } else {
      link.classList.remove("active-tab"); 
    }
  });
});

