console.log("Hi there! Thanks for checking out my portfolio. Curious? Let's connect!");


document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");
  
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // prevent actual submission for testing
  
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
  
      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }
  
      // Console logging input values
      console.log("📩 Contact Form Submitted");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Message:", message);
  
      alert("Message sent. Thank you!");
      form.reset(); // Clear the form
    });
  });
  