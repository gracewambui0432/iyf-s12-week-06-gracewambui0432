function getUser() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id: 1,
                name: "John"
            });
        }, 1000);
    });
}

async function main() {
    try {
        const user = await getUser();

        console.log("User:", user);

    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
