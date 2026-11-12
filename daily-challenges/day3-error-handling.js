async function fetchUser(userId) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );

        if (response.status === 404) {
            return {
                id: userId,
                name: "Default User",
                email: "default@example.com"
            };
        }

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        return await response.json();

    } catch (error) {
        console.error("Error:", error.message);

        return {
            id: userId,
            name: "Default User",
            email: "default@example.com"
        };
    }
}

async function main() {
    const user = await fetchUser(1);
    console.log("User:", user);

    const missingUser = await fetchUser(999);
    console.log("Missing User:", missingUser);
}

main();
