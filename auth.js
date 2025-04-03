// Initialize users array in localStorage if it doesn't exist
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

// Get the users array from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users"));
}

// Save users array to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Register a new user
function registerUser(username, password) {
  const users = getUsers();

  // Check if username already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return { success: false, message: "Username already exists" };
  }

  // Add new user (in a real app, you would hash the password)
  users.push({ username, password });
  saveUsers(users);

  return { success: true, message: "Registration successful" };
}

// Authenticate a user
function authenticateUser(username, password) {
  const users = getUsers();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (user.password !== password) {
    return { success: false, message: "Incorrect password" };
  }

  // In a real app, you would set a session token or JWT
  sessionStorage.setItem("currentUser", JSON.stringify(user));

  return { success: true, message: "Login successful", user };
}

// Check if a user is logged in
function isLoggedIn() {
  return sessionStorage.getItem("currentUser") !== null;
}

// Get current user
function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("currentUser"));
}

// Logout
function logout() {
  sessionStorage.removeItem("currentUser");
}

// Handle registration form submission
if (document.getElementById("registerForm")) {
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        document.getElementById("message").innerHTML =
          '<div class="error">Passwords do not match</div>';
        return;
      }

      const result = registerUser(username, password);

      if (result.success) {
        document.getElementById("message").innerHTML =
          '<div class="success">' +
          result.message +
          '. <a href="login.html">Login now</a></div>';
        document.getElementById("registerForm").reset();
      } else {
        document.getElementById("message").innerHTML =
          '<div class="error">' + result.message + "</div>";
      }
    });
}

// Handle login form submission
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const result = authenticateUser(username, password);

    if (result.success) {
      document.getElementById("message").innerHTML =
        '<div class="success">' + result.message + "</div>";
      // Redirect to dashboard or home page after successful login
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      document.getElementById("message").innerHTML =
        '<div class="error">' + result.message + "</div>";
    }
  });
}
