function heuristic(coord1, coord2) {
  // Basit düzlemde öklid mesafesi
  const dx = coord1[0] - coord2[0];
  const dy = coord1[1] - coord2[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function astar(graph, start, end) {
  const openSet = new Set([start]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const coords = graph.coordinates;

  for (let node of graph.nodes) {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  }

  gScore[start] = 0;
  fScore[start] = heuristic(coords[start], coords[end]);

  while (openSet.size > 0) {
    let current = [...openSet].reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === end) {
      const path = [];
      while (cameFrom[current]) {
        path.unshift(current);
        current = cameFrom[current];
      }
      path.unshift(start);
      return { path, distance: gScore[end] };
    }

    openSet.delete(current);

    for (let neighbor of graph.edges[current]) {
      const tentative_gScore = gScore[current] + neighbor.weight;
      if (tentative_gScore < gScore[neighbor.node]) {
        cameFrom[neighbor.node] = current;
        gScore[neighbor.node] = tentative_gScore;
        fScore[neighbor.node] = gScore[neighbor.node] + heuristic(coords[neighbor.node], coords[end]);
        openSet.add(neighbor.node);
      }
    }
  }

  return { path: [], distance: Infinity };
}
