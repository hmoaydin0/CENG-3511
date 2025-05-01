let map = L.map('map').setView([51.505, -0.09], 13);
let start = null, end = null;
let graph;
let baseLayers = []; 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch("graph-data.json")
  .then(res => res.json())
  .then(data => {
    graph = data;

    for (let node of data.nodes) {
      const coord = data.coordinates[node];
      const marker = L.marker(coord).addTo(map).bindPopup(`Node ${node}`);
      marker.on('click', () => selectNode(node, coord));
      baseLayers.push(marker); 
    }
  });

function selectNode(node, coord) {
  if (!start) {
    start = node;
    document.getElementById("info").innerText = `Start: ${node}`;
  } else if (!end && node !== start) {
    end = node;
    document.getElementById("info").innerText += ` → End: ${node}`;
    calculatePath();
  }
}

function calculatePath() {
  clearPreviousPaths();
  compareAlgorithms();
}

function clearPreviousPaths() {
  map.eachLayer(layer => {
    if (!baseLayers.includes(layer) && !(layer instanceof L.TileLayer)) {
      map.removeLayer(layer);
    }
  });
}

function compareAlgorithms() {
  
  const startTimeD = performance.now();
  const resultD = dijkstra(graph, start, end);
  const endTimeD = performance.now();

  
  const startTimeA = performance.now();
  const resultA = astar(graph, start, end);
  const endTimeA = performance.now();

  
  const coordsD = resultD.path.map(n => graph.coordinates[n]);
  const coordsA = resultA.path.map(n => graph.coordinates[n]);

  
  L.polyline(coordsD, { color: 'blue', weight: 5, opacity: 0.7 }).addTo(map);
  L.polyline(coordsA, { color: 'red', weight: 3, opacity: 0.8, dashArray: '5, 10' }).addTo(map);

  
  console.log("Dijkstra path:", resultD.path);
  console.log(`Dijkstra distance: ${resultD.distance}, time: ${(endTimeD - startTimeD).toFixed(2)}ms`);

  console.log("A* path:", resultA.path);
  console.log(`A* distance: ${resultA.distance}, time: ${(endTimeA - startTimeA).toFixed(2)}ms`);

  
  document.getElementById("info").innerText +=
    `\nDijkstra ➤ ${resultD.distance.toFixed(2)} (⏱ ${(endTimeD - startTimeD).toFixed(2)} ms)` +
    `\nA* ➤ ${resultA.distance.toFixed(2)} (⏱ ${(endTimeA - startTimeA).toFixed(2)} ms)`;
}
function resetMap() {
  
  start = null;
  end = null;

  
  document.getElementById("info").innerText = "Seçim yapmak için iki noktaya tıklayın.";

  
  clearPreviousPaths();
}
