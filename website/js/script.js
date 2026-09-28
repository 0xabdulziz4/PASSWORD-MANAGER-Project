document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save");
  const tableBody = document.querySelector("tbody"); // Select the tbody to populate rows

  /**
   * Validate input fields
   */
  function validateInputs(website, username, password) {
    const errors = [];

    // Validate website (optional http/https with valid domain format)
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/\S*)?$/;
    if (!urlRegex.test(website)) {
      errors.push(
        "Invalid website URL. Example: example.com or http://example.com"
      );
    }

    // Validate username (non-empty and alphanumeric)
    if (!/^\w+$/.test(username)) {
      errors.push(
        "Username must contain only alphanumeric characters and cannot be empty."
      );
    }

    // Validate password (minimum 8 characters)
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    return errors;
  }

  /**
   * Display validation errors below the table
   */
  function displayErrors(errors) {
    const tableContainer = document.querySelector(".container-passwords");
    if (!tableContainer) {
      console.error(
        "Error: .container-passwords element not found in the DOM."
      );
      return;
    }

    let errorContainer = document.getElementById("error-container");
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.id = "error-container";
      errorContainer.style.color = "red";
      errorContainer.style.marginTop = "10px";
      errorContainer.style.textAlign = "left"; // Align to left
      errorContainer.style.fontSize = "0.9rem";
      tableContainer.appendChild(errorContainer);
    }

    errorContainer.innerHTML = errors
      .map((error) => `<p>${error}</p>`)
      .join("");
  }

  /**
   * Insert a new record
   */
  saveButton.addEventListener("click", () => {
    const website = document.getElementById("website").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate inputs
    const errors = validateInputs(website, username, password);
    if (errors.length > 0) {
      displayErrors(errors);
      return;
    }

    // Clear any previous error messages
    const errorContainer = document.getElementById("error-container");
    if (errorContainer) {
      errorContainer.innerHTML = "";
    }

    // Send data to the server
    fetch("/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ website, username, password }),
    })
      .then((response) => {
        if (response.ok) {
          fetchRecords(); // Reload the table after adding the new record
        } else {
          response
            .json()
            .then((data) => alert(data.error || "Failed to add the record."));
        }
      })
      .catch((error) => console.error("Error adding record:", error));
  });

  /**
   * Fetch and display records
   */
  const fetchRecords = () => {
    fetch("/view")
      .then((response) => response.json())
      .then((data) => {
        tableBody.innerHTML = ""; // Clear existing rows
        data.forEach((record) => {
          const row = document.createElement("tr");
          row.setAttribute("data-id", record.id); // Add data-id attribute

          // Create cells
          const websiteCell = document.createElement("td");
          websiteCell.textContent = record.website;

          const usernameCell = document.createElement("td");
          usernameCell.textContent = record.username;

          const passwordCell = document.createElement("td");
          passwordCell.textContent = record.password;

          const actionsCell = document.createElement("td");

          // Add edit and delete icons to the actions cell
          actionsCell.innerHTML = `
            <i class="fa-solid fa-pen-to-square edit-icon" title="Edit" onclick="editRecord(${record.id})"></i>
            <i class="fa-solid fa-trash delete-icon" title="Delete" onclick="deleteRecord(${record.id})"></i>
          `;

          // Append cells to the row
          row.appendChild(websiteCell);
          row.appendChild(usernameCell);
          row.appendChild(passwordCell);
          row.appendChild(actionsCell);

          // Append row to the table body
          tableBody.appendChild(row);
        });
      })
      .catch((error) => console.error("Error fetching records:", error));
  };

  /**
   * Delete a record
   */
  window.deleteRecord = (id) => {
    fetch(`/deleteRecord/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          fetchRecords(); // Reload the table after deletion
        } else {
          alert("Failed to delete the record. Please try again.");
        }
      })
      .catch((error) => console.error("Error deleting record:", error));
  };

  /**
   * Edit a record
   */
  window.editRecord = (id) => {
    const row = document.querySelector(`tr[data-id="${id}"]`); // Find the specific row
    const websiteCell = row.querySelector("td:nth-child(1)");
    const usernameCell = row.querySelector("td:nth-child(2)");
    const passwordCell = row.querySelector("td:nth-child(3)");
    const actionsCell = row.querySelector("td:nth-child(4)");

    // Save the current values
    const currentWebsite = websiteCell.textContent;
    const currentUsername = usernameCell.textContent;
    const currentPassword = passwordCell.textContent;

    // Replace text with input fields
    websiteCell.innerHTML = `<input type="text" id="editWebsite" value="${currentWebsite}">`;
    usernameCell.innerHTML = `<input type="text" id="editUsername" value="${currentUsername}">`;
    passwordCell.innerHTML = `<input type="text" id="editPassword" value="${currentPassword}">`;

    // Update actions to show Save and Cancel buttons
    actionsCell.innerHTML = `
      <button id="save-edit" onclick="saveEdit(${id})">Save</button>
      <button id="cancel-edit" onclick="cancelEdit(${id}, '${currentWebsite}', '${currentUsername}', '${currentPassword}')">Cancel</button>
    `;
  };

  /**
   * Save the edited record
   */
  window.saveEdit = (id) => {
    const website = document.getElementById("editWebsite").value.trim();
    const username = document.getElementById("editUsername").value.trim();
    const password = document.getElementById("editPassword").value.trim();

    // Validate inputs
    const errors = validateInputs(website, username, password);
    if (errors.length > 0) {
      displayErrors(errors);
      return;
    }

    // Clear any previous error messages
    const errorContainer = document.getElementById("error-container");
    if (errorContainer) {
      errorContainer.innerHTML = "";
    }

    // Send the updated record to the server
    fetch(`/editRecord/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ website, username, password }),
    })
      .then((response) => {
        if (response.ok) {
          fetchRecords(); // Reload the table to reflect changes
        } else {
          response
            .json()
            .then((data) =>
              alert(data.error || "Failed to update the record.")
            );
        }
      })
      .catch((error) => console.error("Error updating record:", error));
  };

  /**
   * Cancel editing
   */
  window.cancelEdit = (id, website, username, password) => {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const websiteCell = row.querySelector("td:nth-child(1)");
    const usernameCell = row.querySelector("td:nth-child(2)");
    const passwordCell = row.querySelector("td:nth-child(3)");
    const actionsCell = row.querySelector("td:nth-child(4)");

    // Restore original values
    websiteCell.textContent = website;
    usernameCell.textContent = username;
    passwordCell.textContent = password;

    // Restore actions
    actionsCell.innerHTML = `
      <i class="fa-solid fa-pen-to-square edit-icon" title="Edit" onclick="editRecord(${id})"></i>
      <i class="fa-solid fa-trash delete-icon" title="Delete" onclick="deleteRecord(${id})"></i>
    `;
  };

  // Initial fetch of records when the page loads
  fetchRecords();
});
