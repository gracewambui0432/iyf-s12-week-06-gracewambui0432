// ===== 12.1 FETCH API =====
async function getUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Failed to fetch user:", error);
  }
}
getUser(1).then(u => console.log("Single user:", u));

fetch("https://jsonplaceholder.typicode.com/users/1/posts")
  .then(r => r.json())
  .then(p => console.log("Posts for user 1:", p));

// ===== 12.2 + 12.4 USER DIRECTORY =====
let allUsers = [];
const loadingEl = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const cityFilter = document.getElementById("city-filter");

async function loadUsers() {
  if (!container) return;
  try {
    if (loadingEl) loadingEl.classList.remove("hidden");
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    allUsers = await response.json();
    console.log("All users:", allUsers);
    if (cityFilter) {
      const cities = [...new Set(allUsers.map(u => u.address.city))];
      cities.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        cityFilter.appendChild(opt);
      });
    }
    displayUsers(allUsers);
  } catch (error) {
    if (errorDiv) {
      errorDiv.textContent = "Error: " + error.message;
      errorDiv.classList.remove("hidden");
    }
  } finally {
    if (loadingEl) loadingEl.classList.add("hidden");
  }
}

function displayUsers(users) {
  if (!container) return;
  container.innerHTML = users.map(user => `
    <div class="user-card">
      <h2>${user.name}</h2>
      <p>Email: ${user.email}</p>
      <p>Company: ${user.company.name}</p>
      <p>City: ${user.address.city}</p>
    </div>
  `).join("");
  if (users.length === 0) {
    container.innerHTML = "<p>No users found.</p>";
  }
}

function applyFilters() {
  if (!container) return;
  const query = searchInput ? searchInput.value.toLowerCase() : "";
  let filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  );
  if (cityFilter && cityFilter.value !== "all") {
    filtered = filtered.filter(u => u.address.city === cityFilter.value);
  }
  if (sortSelect && sortSelect.value === "za") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
  displayUsers(filtered);
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (sortSelect) sortSelect.addEventListener("change", applyFilters);
if (cityFilter) cityFilter.addEventListener("change", applyFilters);

// ===== 12.3 POST REQUEST =====
async function createPost(title, body, userId) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, userId })
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
}

const postForm = document.getElementById("post-form");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;
    const result = document.getElementById("post-result");
    try {
      const newPost = await createPost(title, body, 1);
      console.log("Created:", newPost);
      result.textContent = "Created! New post ID: " + newPost.id + " - Title: " + newPost.title;
      e.target.reset();
    } catch (err) {
      result.textContent = "Failed: " + err.message;
    }
  });
}

loadUsers();
console.log("Done - Grace understood async!");
