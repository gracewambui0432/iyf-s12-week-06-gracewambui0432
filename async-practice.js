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
