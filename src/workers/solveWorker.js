self.onmessage = async function (event) {
    const { day, inputs, part, example, differentExamples } = event.data
    let example1 = example, example2 = example
    if(differentExamples) [example1, example2] = example
    console.log(example1, example2, example, differentExamples)
    try {
        const solverModule = await import(`../components/days/${day}/solve.js`)
        const { solvePart1, solvePart2 } = solverModule
        if (part === 1) {
            self.postMessage({ result: [solvePart1(...inputs), null], example: [solvePart1(...example1), null] })
        }
        else if (part === 2) self.postMessage({ result: [null, solvePart2(...inputs)], example: [null, solvePart2(...example2)] })
        else if (part === null) self.postMessage({
            result: [solvePart1(...inputs), solvePart2(...inputs)], example: [solvePart1(...example1), solvePart2(...example2)]
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
