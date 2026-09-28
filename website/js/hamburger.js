// Sidebar Toggle Logic
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector(".sidebar .close-btn");
  
    // Show Sidebar
    hamburger.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
  
    // Hide Sidebar
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  });
  