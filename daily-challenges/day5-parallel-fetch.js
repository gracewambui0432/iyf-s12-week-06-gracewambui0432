async function fetchData() {
    const urls = [
        "https://jsonplaceholder.typicode.com/users",
        "https://jsonplaceholder.typicode.com/posts",
        "https://jsonplaceholder.typicode.com/comments"
    ];

    const promises = urls.map(async (url) => {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
    });

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            console.log(`API ${index + 1} successful:`);
            console.log(result.value);
        } else {
            console.error(
                `API ${index + 1} failed:`,
                result.reason
            );
        }
    });
}

fetchData();
