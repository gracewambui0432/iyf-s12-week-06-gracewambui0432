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
