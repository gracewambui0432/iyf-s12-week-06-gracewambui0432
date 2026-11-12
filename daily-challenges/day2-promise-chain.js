function taskOne() {
    return new Promise(resolve => {
        const time = Math.random() * 3000;

        setTimeout(() => {
            console.log("Task One completed");
            resolve("Result One");
        }, time);
    });
}

function taskTwo() {
    return new Promise(resolve => {
        const time = Math.random() * 3000;

        setTimeout(() => {
            console.log("Task Two completed");
            resolve("Result Two");
        }, time);
    });
}

function taskThree() {
    return new Promise(resolve => {
        const time = Math.random() * 3000;

        setTimeout(() => {
            console.log("Task Three completed");
            resolve("Result Three");
        }, time);
    });
}

console.time("Total Execution Time");

taskOne()
    .then(result => {
        console.log(result);
        return taskTwo();
    })
    .then(result => {
        console.log(result);
        return taskThree();
    })
    .then(result => {
        console.log(result);
        console.timeEnd("Total Execution Time");
    })
    .catch(error => {
        console.error("Error:", error);
    });
