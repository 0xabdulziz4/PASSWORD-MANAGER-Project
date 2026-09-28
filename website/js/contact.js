document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission

    // Clear any previous errors
    const errorContainer = document.getElementById("error-container");
    if (errorContainer) {
      errorContainer.innerHTML = "";
    }

    // Collect form data
    const formData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      gender: document.getElementById("gender").value,
      mobile: document.getElementById("mobile").value.trim(),
      dob: document.getElementById("dob").value,
      email: document.getElementById("email").value.trim(),
      language: document.getElementById("language").value,
      message: document.getElementById("message").value.trim(),
    };

    // Perform front-end validation
    const errors = validateForm(formData);
    if (errors.length > 0) {
      displayErrors(errors);
      return; // Stop submission if there are errors
    }

    console.log(formData);
    // Send form data to the backend
    fetch("/submit-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Contact form submitted successfully!");
          form.reset(); // Clear the form after successful submission
        } else {
          response.json().then((data) => {
            alert(data.error || "Failed to submit contact form.");
          });
        }
      })
      .catch((error) => {
        console.error("Error submitting contact form:", error);
        alert("An error occurred. Please try again later.");
      });
  });

  function validateForm(data) {
    const errors = [];

    // Validate first name
    if (!data.firstName) {
      errors.push("First name is required.");
    } else if (!/^[A-Za-z]+$/.test(data.firstName)) {
      errors.push("First name must contain only letters.");
    }

    // Validate last name
    if (!data.lastName) {
      errors.push("Last name is required.");
    } else if (!/^[A-Za-z]+$/.test(data.lastName)) {
      errors.push("Last name must contain only letters.");
    }

    // Validate gender
    if (!data.gender) {
      errors.push("Gender selection is required.");
    }

    // Validate mobile
    if (!data.mobile) {
      errors.push("Mobile number is required.");
    } else if (!/^\d{10}$/.test(data.mobile)) {
      errors.push("Mobile number must be a 10-digit number.");
    }

    // Validate date of birth
    if (!data.dob) {
      errors.push("Date of birth is required.");
    }

    // Validate email
    if (!data.email) {
      errors.push("Email address is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Invalid email address format.");
    }

    // Validate language
    if (!data.language) {
      errors.push("Language selection is required.");
    }

    // Validate message
    if (!data.message) {
      errors.push("Message is required.");
    } else if (data.message.length < 10) {
      errors.push("Message must be at least 10 characters long.");
    }

    return errors;
  }

  function displayErrors(errors) {
    const errorContainer = document.getElementById("error-container");
    errorContainer.innerHTML = errors
      .map((error) => `<p style="color: red;">${error}</p>`)
      .join("");
  }
});
