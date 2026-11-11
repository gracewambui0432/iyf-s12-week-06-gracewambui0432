// WEEK 6 - Grace Wambui - Task 11 + Task 12 - All in One JS

// ===== 11.1 SYNC VS ASYNC =====
console.log("1 - Start");
console.log("2 - Middle");
console.log("3 - End");

console.log("1 - Start");
setTimeout(() => {
  console.log("2 - This is delayed");
}, 2000);
console.log("3 - End");

console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
setTimeout(() => console.log("D"), 100);
console.log("E");
// Answer: A, C, E, B, D

function fetchData(callback) {
  setTimeout(() => {
    const data = { name: "John", age: 30 };
    callback(data);
  }, 1000);
}
fetchData(function(data) {
  console.log("Data received:", data);
});

function loadUser(userId, callback) {
  setTimeout(() => {
    const user = { id: userId, name: "Grace", city: "Nairobi", age: 22 };
    callback(user);
  }, 1500);
}
loadUser(1, function(user) {
  console.log("User loaded:", user);
});

// ===== 11.2 CALLBACK HELL =====
function getUserDataOld(userId, callback) {
  setTimeout(() => {
    callback({ id: userId, name: "Grace" });
  }, 1000);
}
function getUserPostsOld(userId, callback) {
  setTimeout(() => {
    callback([
      { id: 1, title: "My first post from Nairobi" },
      { id: 2, title: "Learning JavaScript" }
    ]);
  }, 1000);
}
function getPostCommentsOld(postId, callback) {
  setTimeout(() => {
    callback([
      { id: 1, text: "Great post!" },
      { id: 2, text: "Keep going Grace!" }
    ]);
  }, 1000);
}

getUserDataOld(1, function(user) {
  console.log("User:", user);
  getUserPostsOld(user.id, function(posts) {
    console.log("Posts:", posts);
    getPostCommentsOld(posts[0].id, function(comments) {
      console.log("Comments:", comments);
    });
  });
});

// ===== 11.2 PROMISES =====
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) {
      resolve("It worked!");
    } else {
      reject("Something went wrong");
    }
  }, 1000);
});

myPromise
  .then(result => {
    console.log("Success:", result);
  })
  .catch(error => {
    console.log("Error:", error);
  });

// Refactored to Promises
function getUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "Grace" });
      } else {
        reject("Invalid user ID");
      }
    }, 1000);
  });
}

function getUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve([
          { id: 1, title: "My first post from Nairobi" },
          { id: 2, title: "Learning JavaScript" }
        ]);
      } else {
        reject("No posts - invalid user");
      }
    }, 1000);
  });
}

function getPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (postId > 0) {
        resolve([
          { id: 1, text: "Great post!" },
          { id: 2, text: "Keep going Grace!" }
        ]);
      } else {
        reject("No comments - invalid post");
      }
    }, 1000);
  });
}

// ===== 11.3 PROMISE CHAINING =====
getUserData(1)
  .then(user => {
    console.log("User:", user);
    return getUserPosts(user.id);
  })
  .then(posts => {
    console.log("Posts:", posts);
    return getPostComments(posts[0].id);
  })
  .then(comments => {
    console.log("Comments:", comments);
  })
  .catch(error => {
    console.log("Error:", error);
  });

// Promise.all
Promise.all([getUserData(1), getUserData(2), getUserData(3)])
  .then(results => {
    console.log("All users at once:", results);
  })
  .catch(error => {
    console.log("One failed:", error);
  });

// Promise.race
const fast = new Promise(resolve => setTimeout(() => resolve("Fast!"), 100));
const slow = new Promise(resolve => setTimeout(() => resolve("Slow!"), 500));
Promise.race([fast, slow])
  .then(result => {
    console.log("Winner:", result);
  });

// Build: 3 users at once
async function showThreeUsers() {
  const users = await Promise.all([getUserData(1), getUserData(2), getUserData(3)]);
  console.log("My 3 users:", users);
  const out = document.getElementById("output");
  if (out) {
    out.textContent = "3 users loaded: " + users.map(u => u.name).join(", ");
  }
}
showThreeUsers();

// ===== 11.4 ASYNC AWAIT =====
async function getDataWithAsync() {
  const user = await getUserData(1);
  const posts = await getUserPosts(user.id);
  const comments = await getPostComments(posts[0].id);
  return comments;
}
async function main() {
  const comments = await getDataWithAsync();
  console.log("Async/Await comments:", comments);
}
main();

async function fetchUserData(userId) {
  try {
    const user = await getUserData(userId);
    const posts = await getUserPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.log("Failed to fetch:", error);
    throw error;
  }
}
fetchUserData(1).then(data => console.log("fetchUserData worked:", data));

async function getAllUsers() {
  const [u1, u2, u3] = await Promise.all([getUserData(1), getUserData(2), getUserData(3)]);
  return [u1, u2, u3];
}
getAllUsers().then(users => console.log("getAllUsers parallel:", users));

async function getEverything() {
  try {
    const user = await getUserData(1);
    console.log("Async User:", user);
    const posts = await getUserPosts(user.id);
    console.log("Async Posts:", posts);
    const comments = await getPostComments(posts[0].id);
    console.log("Async Comments:", comments);
    console.log("This is SO much cleaner than callback hell!");
  } catch (error) {
    console.log("Error in getEverything:", error);
  }
}
getEverything();

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
