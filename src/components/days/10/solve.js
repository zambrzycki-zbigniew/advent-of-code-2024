export function solvePart1({ topoMapDict, heightDict }) {
    let sum = 0
    const trailheads = heightDict['0']
    for (let trailhead of trailheads) {
        // sum += findPeaksForTrailhead(trailhead, topoMapDict, {})
        sum += findPeaksForTrailheadIterative(trailhead, topoMapDict)
    }
    return sum;
}

export function solvePart2({ topoMapDict, heightDict }) {
    let sum = 0
    const trailheads = heightDict['0']
    for (let trailhead of trailheads) {
        // sum += getCountOfValidTrailsFromTrailhead(trailhead, topoMapDict)
        sum += getCountOfValidTrailsFromTrailheadIterative(trailhead, topoMapDict)
    }
    return sum;
}

function getHigherNeighbours(topoMapDict, x, y) {
    return [
        `${x}:${y - 1}`,
        `${x + 1}:${y}`,
        `${x}:${y + 1}`,
        `${x - 1}:${y}`,
    ].filter(neighbour => parseInt(topoMapDict[neighbour]) === (parseInt(topoMapDict[`${x}:${y}`]) + 1))
}

function findPeaksForTrailhead(trailhead, topoMapDict, peaksFoundSoFar) {
    const [x, y] = trailhead.split(':').map(el => parseInt(el))
    let currentSpot = trailhead
    let higherNeighbours = getHigherNeighbours(topoMapDict, x, y)
    if (higherNeighbours.length > 0) return higherNeighbours.map(n => findPeaksForTrailhead(n, topoMapDict, peaksFoundSoFar)).reduce((sum, count) => sum + count, 0)
    if (topoMapDict[currentSpot] === '9' && !peaksFoundSoFar[currentSpot]) {
        peaksFoundSoFar[currentSpot] = true
        return 1
    }
    return 0
}

function getCountOfValidTrailsFromTrailhead(trailhead, topoMapDict) {
    const [x, y] = trailhead.split(':').map(el => parseInt(el))
    let currentSpot = trailhead
    let higherNeighbours = getHigherNeighbours(topoMapDict, x, y)
    if (higherNeighbours.length > 0) return higherNeighbours.map(n => getCountOfValidTrailsFromTrailhead(n, topoMapDict)).reduce((sum, count) => sum + count, 0)
    if (topoMapDict[currentSpot] === '9')
        return 1
    return 0
}

//while it's not strictly necessary to use iterative approach instead of recursive since the call stack total size
//is limited by the maximum trail length and number of uphill neighbours, there is never a good reason to use recursion
//when it's safer and faster to use iteration - especially with javascript, where browsers can throw an exception
//with just a few hundred invocations on a call stack

function findPeaksForTrailheadIterative(trailhead, topoMapDict) {
    //put every set of arguments on a stack, in order you'd call a recursive function with them
    let stack = [trailhead]
    const peaksFoundSoFar = new Set()
    while (stack.length > 0) {
        //as long as the stack isn't empty get the last item from it
        const current = stack.pop()
        const [x, y] = current.split(':').map(el => parseInt(el))
        let higherNeighbours = getHigherNeighbours(topoMapDict, x, y)
        //instead of calling the function again just put those arguments on top of the stack
        //so we can execute the function operations on them during the next iterations
        if (higherNeighbours.length > 0) stack.push(...higherNeighbours)
        else if (topoMapDict[current] === '9') peaksFoundSoFar.add(current)
    }
    return peaksFoundSoFar.size
}

function getCountOfValidTrailsFromTrailheadIterative(trailhead, topoMapDict) {
    let stack = [trailhead]
    let validTrails = 0
    while (stack.length > 0) {
        const current = stack.pop()
        const [x, y] = current.split(':').map(el => parseInt(el))
        let higherNeighbours = getHigherNeighbours(topoMapDict, x, y)
        if (higherNeighbours.length > 0) stack.push(...higherNeighbours)
        if (topoMapDict[current] === '9') validTrails++
    }
    return validTrails
}

//there is also a case where our stack get so large, it becomes an memory issue
//in that situation we can consider making stack processing asynchronious and parrarel
//we cam have it yelding to main process either immediately or after time dependent on the depth (the deeper the quicker)
//another thing to remember (not used here) is that we could store results for already visited nodes and if we encounter those nodes,
//then reuse the result of their processing instead of adding them to the stack

//in 2023 some puzzles caused those kinds of issues, so it's worth keeping in mind that
//there are multiple steps of optimization we can take after designing the first recursive algorithm