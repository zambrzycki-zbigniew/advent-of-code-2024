self.onmessage = async function (event) {
    const { day, inputs, part } = event.data
    try {
        const solverModule = await import(`../components/days/${day}/solve.js`)
        const { solvePart1, solvePart2 } = solverModule
        if (part === 1) self.postMessage({ result: [solvePart1(...inputs), null] })
        else if (part === 2) self.postMessage({ result: [null, solvePart2(...inputs)] })
        else if (part === null) self.postMessage({
            result: [solvePart1(...inputs), solvePart2(...inputs)],
        });
        else self.postMessage({
            error: "Invalid part specified. Use 1 or 2.",
        })
    } catch (error) {
        console.error("Error loading solver module:", error);
        self.postMessage({
            error: `Failed to load solver for day ${day}: ${error.message}`,
        })
    }
}
