'use strict';

const testHashMap = {
  'A': {'B': 5, 'D': 5, 'E': 7},
  'B': {'C': 4},
  'C': {'D': 8, 'E': 2},
  'D': {'C': 8, 'E': 6},
  'E': {'B': 3}
};

/**
 * To init the map, define a '_visited' property on the node, which is writable but not enumerable.
 */
function initHashMap() {
  const keys = Object.keys(testHashMap);
  keys.forEach((key) => {
    Object.defineProperty(testHashMap[key], "_visited", {value: false, enumerable: false, writable: true});
  });
}

/**
 * To reset the map state.
 */
function resetTestHashMap() {
  const keys = Object.keys(testHashMap);
  keys.forEach((key) => {
    testHashMap[key]._visited = false;
  });
}

/**
 * Return the distance when given an array of special nodes
 * ex: nodes = ['A', 'B', 'C']
 * @param nodes
 * @returns {*}
 */
function distanceByRoute(nodes) {
  if (nodes.length < 2) return 0;

  let distance = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    if (testHashMap.hasOwnProperty(nodes[i]) && testHashMap[nodes[i]].hasOwnProperty(nodes[i + 1])) {
      distance += testHashMap[nodes[i]][nodes[i + 1]];
    } else {
      // throw new Error("NO SUCH ROUTE");
      return "NO SUCH ROUTE";
    }
  }

  return distance;
}

/**
 * Find the amount of possible of routes when given a maxStops.
 * @param start
 * @param end
 * @param currentDepth
 * @param maxStops
 * @returns {number}
 */
function numberOfTrips(start, end, currentDepth = 0, maxStops = 1) { //todo
  let routes = 0;

  if (testHashMap.hasOwnProperty(start)) {
    currentDepth++;
    if (currentDepth > maxStops) { //end of the recursion
      return 0;
    }
    testHashMap[start]._visited = true;
    const nextNodes = Object.keys(testHashMap[start]);
    nextNodes.forEach((keyOfNextNode) => {
      if (keyOfNextNode === end) {
        routes++;
      } else {
        routes += numberOfTrips(keyOfNextNode, end, currentDepth, maxStops); //recursion
      }
    });
  } else {
    throw new Error("NO SUCH ROUTE");
  }
  testHashMap[start]._visited = false;

  return routes;
}

/**
 * Find the shortest route by given the start and the end node.
 * @param start
 * @param end
 * @param currentDistance
 * @param minRoute
 * @returns {number}
 */
function lengthOfShortestRoute(start, end, currentDistance = 0, minRoute = 0) {
  // console.log('start:'+start+',end:'+end+',currentDistance:'+currentDistance+',minRoute:'+minRoute);
  if (testHashMap.hasOwnProperty(start)) {
    testHashMap[start]._visited = true;
    const nextNodes = Object.keys(testHashMap[start]);
    nextNodes.forEach((keyOfNextNode) => {
      const newDistance = currentDistance + testHashMap[start][keyOfNextNode];

      //If it reach the end of the recursion
      if (keyOfNextNode === end) {
        testHashMap[start]._visited = false;
        if (newDistance < minRoute || minRoute === 0) minRoute = newDistance;
        return minRoute;
      } else if (!testHashMap[keyOfNextNode]._visited) {
        minRoute = lengthOfShortestRoute(keyOfNextNode, end, newDistance, minRoute); //recursion
      }
    });
  } else {
    throw new Error("NO SUCH ROUTE");
  }
  return minRoute;
}

/**
 * To calculate the number of routes with a max distance.
 * @param start
 * @param end
 * @param currentDistance
 * @param maxDistance
 * @returns {number}
 */
function numberOfRoutes(start, end, currentDistance = 0, maxDistance = 0) {
  let routes = 0;

  if (testHashMap.hasOwnProperty(start)) {
    const nextNodes = Object.keys(testHashMap[start]);
    nextNodes.forEach((keyOfNextNode) => {
      const newDistance = currentDistance + testHashMap[start][keyOfNextNode];
      if (newDistance >= maxDistance) { //end of the recursion
        return 0;
      }

      if (keyOfNextNode === end) {
        routes++;
      }
      //even though touched the target of the point, can still continue
      routes += numberOfRoutes(keyOfNextNode, end, newDistance, maxDistance);
    });
  } else {
    throw new Error("NO SUCH ROUTE");
  }

  return routes;
}

/***********************
 * TEST EXAMPLES
 ***********************/
initHashMap();

// 1. The distance of the route A-B-C.
// Output #1: 9
console.log(distanceByRoute(['A', 'B', 'C']));

// 2. The distance of the route A-D.
// Output #2: 5
console.log(distanceByRoute(['A', 'D']));

// 3. The distance of the route A-D-C.
// Output #3: 13
console.log(distanceByRoute(['A', 'D', 'C']));

// 4. The distance of the route A-E-B-C-D.
// Output #4: 22
console.log(distanceByRoute(['A', 'E', 'B', 'C', 'D']));

// 5. The distance of the route A-E-D.
// Output #5: NO SUCH ROUTE
console.log(distanceByRoute(['A', 'E', 'D']));

// 6. The number of trips starting at C and ending at C with a maximum of 3 stops. In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops).
// Output #6: 2
resetTestHashMap();
console.log(numberOfTrips('C', 'C', 0, 3));

// 7. The number of trips starting at A and ending at C with max 4 stops.
// Output #7: 4
resetTestHashMap();
console.log(numberOfTrips('A', 'C', 0, 4));

// 8. The length of the shortest route (in terms of distance to travel) from A to C.
// Output #8: 9
resetTestHashMap();
console.log(lengthOfShortestRoute('A', 'C'));

// 9. The length of the shortest route (in terms of distance to travel) from B to B.
// Output #9: 9
resetTestHashMap();
console.log(lengthOfShortestRoute('B', 'B'));

// 10. The number of different routes from C to C with a distance of less than 30. In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC, CEBCEBC, CEBCEBCEBC.
// Output #10: 7
console.log(numberOfRoutes('C', 'C', 0, 30));
