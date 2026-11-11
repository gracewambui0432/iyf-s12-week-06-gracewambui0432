// Lesson 11.1 - Understanding Async - Grace Wambui

// --- Exercise 1: Sync vs Async ---

// Sync - goes in order, one by one
console.log("1 - Start");
console.log("2 - Middle");
console.log("3 - End");
// Output: 1, 2, 3

// Async - doesn't wait
console.log("1 - Start");

setTimeout(() => {
  console.log("2 - This is delayed");
}, 2000);

console.log("3 - End");
// Output: 1, 3, then 2 after 2 seconds
// Because setTimeout goes to the side and lets the rest run first

// --- Predict the output ---

console.log("A");

setTimeout(() => console.log("B"), 0);

console.log("C");

setTimeout(() => console.log("D"), 100);

console.log("E");

// MY ANSWER: A, C, E, B, D
// Why? A, C, E are normal code so they run first in order.
// B is 0ms but it STILL has to wait for A, C, E to finish.
// D is 100ms so it comes last.

// --- Exercise 2: Callback Pattern ---

// Old style
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: "John", age: 30 };
    callback(data);
  }, 1000);
}

fetchData(function(data) {
  console.log("Data received:", data);
});

// Build: My own loadUser function
function loadUser(userId, callback) {
  // Pretend we are checking the database, it takes 1.5 seconds
  setTimeout(() => {
    const user = {
      id: userId,
      name: "Grace",
      city: "Nairobi",
      age: 22
    };
    // When we find the user, we call the callback
    callback(user);
  }, 1500);
}

// Using it
loadUser(1, function(user) {
  console.log("User loaded:", user);
});

loadUser(2, function(user) {
  console.log("Second user:", user);
});

// --- Task 11.2: Callback Hell & Promises - Grace ---

// Exercise 1: Callback Hell - this is the BAD way
// It works but it's hard to read, it keeps going right and right

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

// The nightmare - pyramid shape
getUserDataOld(1, function(user) {
  console.log("User:", user);
  getUserPostsOld(user.id, function(posts) {
    console.log("Posts:", posts);
    getPostCommentsOld(posts[0].id, function(comments) {
      console.log("Comments:", comments);
      console.log("See how messy this is? Too many brackets inside brackets");
    });
  });
});

// Exercise 2: Promises to the Rescue - the GOOD way

// My first promise
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

// Now refactor ALL THREE to return Promises - this is what they asked for

function getUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "Grace" });
      } else {
        reject("Invalid user ID - ID must be more than 0");
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

// Test the promise versions
getUserData(1)
  .then(user => {
    console.log("Promise User:", user);
    return getUserPosts(user.id);
  })
  .then(posts => {
    console.log("Promise Posts:", posts);
    return getPostComments(posts[0].id);
  })
  .then(comments => {
    console.log("Promise Comments:", comments);
    console.log("This is much cleaner than callback hell!");
  })
  .catch(error => {
    console.log("Something failed:", error);
  });

// Test the error - this should fail on purpose
getUserData(0)
  .then(user => console.log(user))
  .catch(error => console.log("I expected this error:", error));

Task 11.3: Promise Chaining 🟡

Time: 40 minutes

Exercise 1: Chain Promises

// After refactoring to Promises:
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
        console.error("Error:", error);
    });

Exercise 2: Promise.all

// Run multiple promises in parallel
const promise1 = getUserData(1);
const promise2 = getUserData(2);
const promise3 = getUserData(3);

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log("All users:", results);
        // results is an array [user1, user2, user3]
    })
    .catch(error => {
        // If ANY promise fails, this runs
        console.error("One failed:", error);
    });

Exercise 3: Promise.race

// First to complete wins
const fast = new Promise(resolve => setTimeout(() => resolve("Fast!"), 100));
const slow = new Promise(resolve => setTimeout(() => resolve("Slow!"), 500));

Promise.race([fast, slow])
    .then(result => {
        console.log("Winner:", result);  // "Fast!"
    });

Build: Fetch data for 3 users simultaneously and display them all at once.
Task 11.4: Async/Await 🔴

Time: 45 minutes

Exercise 1: Converting to Async/Await

// Promise chain version:
function getDataWithPromises() {
    return getUserData(1)
        .then(user => getUserPosts(user.id))
        .then(posts => getPostComments(posts[0].id))
        .then(comments => comments);
}

// Async/await version (much cleaner!):
async function getDataWithAsync() {
    const user = await getUserData(1);
    const posts = await getUserPosts(user.id);
    const comments = await getPostComments(posts[0].id);
    return comments;
}

// Using:
getDataWithAsync().then(comments => console.log(comments));

// Or inside another async function:
async function main() {
    const comments = await getDataWithAsync();
    console.log(comments);
}

Exercise 2: Error Handling with Try/Catch

async function fetchUserData(userId) {
    try {
        const user = await getUserData(userId);
        const posts = await getUserPosts(user.id);
        return { user, posts };
    } catch (error) {
        console.error("Failed to fetch:", error);
        throw error;  // Re-throw if needed
    }
}

Exercise 3: Parallel with Async/Await

async function getAllUsers() {
    // Sequential (slow):
    const user1 = await getUserData(1);
    const user2 = await getUserData(2);
    const user3 = await getUserData(3);
    // Total time: ~3 seconds
    
    // Parallel (fast):
    const [u1, u2, u3] = await Promise.all([
        getUserData(1),
        getUserData(2),
        getUserData(3)
    ]);
    // Total time: ~1 second
    
    return [u1, u2, u3];
}

Build: Rewrite the callback hell example using async/await.
Lesson 12 Tasks
Task 12.1: Fetch API Basics 🟢

Time: 30 minutes

Exercise 1: Your First Fetch

// Basic fetch
fetch("https://jsonplaceholder.typicode.com/users/1")
    .then(response => {
        console.log("Response object:", response);
        console.log("Status:", response.status);
        console.log("OK:", response.ok);
        return response.json();  // Parse JSON
    })
    .then(data => {
        console.log("User data:", data);
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

Exercise 2: Fetch with Async/Await

async function getUser(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}

// Use it — inside an async function. A top-level `await` only works in the
// DevTools Console or a <script type="module">; in a normal script file it is a SyntaxError.
async function main() {
    const user = await getUser(1);
    console.log(user);
}
main();

Practice: Fetch and display:

    A single user from JSONPlaceholder
    All users (https://jsonplaceholder.typicode.com/users)
    Posts for user 1 (https://jsonplaceholder.typicode.com/users/1/posts)

Task 12.2: Display API Data in DOM 🟡

Time: 45 minutes

Exercise: User Directory

Create HTML:

<div id="app">
    <h1>User Directory</h1>
    <div id="loading">Loading...</div>
    <div id="error" class="hidden"></div>
    <div id="users-container"></div>
</div>

JavaScript:

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");

async function loadUsers() {
    try {
        showLoading();
        
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        
        const users = await response.json();
        displayUsers(users);
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function showLoading() {
    loading.classList.remove("hidden");
    container.innerHTML = "";
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    errorDiv.textContent = `Error: ${message}`;
    errorDiv.classList.remove("hidden");
}

// innerHTML is acceptable here because the data comes from an API you chose and
// you are not inserting anything a visitor typed. Anything typed by a user → textContent (Week 5).
function displayUsers(users) {
    container.innerHTML = users.map(user => `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>📧 ${user.email}</p>
            <p>🏢 ${user.company.name}</p>
            <p>📍 ${user.address.city}</p>
        </div>
    `).join("");
}

// Initialize
loadUsers();

Task 12.3: POST Requests 🟡

Time: 30 minutes

Exercise: Creating Resources

async function createPost(title, body, userId) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            body,
            userId
        })
    });
    
    if (!response.ok) {
        throw new Error("Failed to create post");
    }
    
    return response.json();
}

// Use it — inside an async function (see Task 12.1)
async function demo() {
    const newPost = await createPost(
        "My First Post",
        "This is the content of my post.",
        1
    );
    console.log("Created:", newPost);
}
demo();

Build: Create a form that submits a new post and displays the result.
Task 12.4: Search & Filter 🔴

Time: 45 minutes

Exercise: Live Search

let allUsers = [];

async function init() {
    allUsers = await fetchUsers();
    displayUsers(allUsers);
    
    // Set up search
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allUsers.filter(user => 
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        displayUsers(filtered);
    });
}

Build: Add these features to the user directory:

    Search by name or email
    Sort by name (A-Z or Z-A)
    Filter by city (dropdown)

// ============ 12.1 FETCH API ============
async function getUser(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log("Failed to fetch user:", error);
  }
}
getUser(1).then(u => console.log("Single user (12.1):", u));
fetch("https://jsonplaceholder.typicode.com/users/1/posts").then(r => r.json()).then(p => console.log("Posts for user 1:", p));

// ============ 12.2 + 12.4 USER DIRECTORY (only runs if page has those IDs) ============
let allUsers = [];
const loadingEl = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const cityFilter = document.getElementById("city-filter");

async function loadUsers() {
  if (!container) return; // if this page is not the directory page, skip
  try {
    if (loadingEl) loadingEl.classList.remove("hidden");
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    allUsers = await response.json();
    console.log("All users:", allUsers);
    if (cityFilter) {
      let cities = [...new Set(allUsers.map(u => u.address.city))];
      cities.forEach(city => {
        let opt = document.createElement("option");
        opt.value = city; opt.textContent = city;
        cityFilter.appendChild(opt);
      });
    }
    displayUsers(allUsers);
  } catch (error) {
    if (errorDiv) { errorDiv.textContent = "Error: " + error.message; errorDiv.classList.remove("hidden"); }
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
  if (users.length === 0) container.innerHTML = "<p>No users found.</p>";
}

function applyFilters() {
  if (!container) return;
  let query = searchInput ? searchInput.value.toLowerCase() : "";
  let filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
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

// ============ 12.3 POST REQUEST ============
async function createPost(title, body, userId) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, userId })
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
}

let postForm = document.getElementById("post-form");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let title = document.getElementById("post-title").value;
    let body = document.getElementById("post-body").value;
    let result = document.getElementById("post-result");
    try {
      let newPost = await createPost(title, body, 1);
      console.log("Created:", newPost);
      result.textContent = "Created! New post ID: " + newPost.id + " - Title: " + newPost.title;
      e.target.reset();
    } catch (err) {
      result.textContent = "Failed: " + err.message;
    }
  });
}

loadUsers();
