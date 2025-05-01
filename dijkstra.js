function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const nodes = new Set(graph.nodes);

  for (let node of nodes) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  while (nodes.size > 0) {
    let current = Array.from(nodes).reduce((a, b) => distances[a] < distances[b] ? a : b);
    nodes.delete(current);

    if (current === end) break;

    for (let neighbor of graph.edges[current]) {
      let alt = distances[current] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = current;
      }
    }
  }

  const path = [];
  let u = end;
  while (previous[u]) {
    path.unshift(u);
    u = previous[u];
  }
  if (distances[end] !== Infinity) path.unshift(start);
  return { path, distance: distances[end] };
}
