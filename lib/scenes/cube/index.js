const primitives = require('primitives');

const vertices = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
].map((vertex) => vertex.map((comp) => comp - 0.5));

const edges = [
  [0, 1], [0, 4], [4, 5],
  [1, 2], [1, 5], [5, 6],
  [2, 3], [2, 6], [6, 7],
  [3, 0], [3, 7], [7, 4],
];

function render(pixels, t) {
  const yaw = t;
  const pitch = t / 2;
  const roll = t / 3;
  const sinA = Math.sin(yaw);
  const cosA = Math.cos(yaw);
  const sinB = Math.sin(pitch);
  const cosB = Math.cos(pitch);
  const sinG = Math.sin(roll);
  const cosG = Math.cos(roll);

  const rotMat = [
    cosA * cosB, cosA * sinB * sinG - sinA * cosG, cosA * sinB * cosG + sinA * sinG,
    sinA * cosB, sinA * sinB * sinG + cosA * cosG, sinA * sinB * cosG - cosA * sinG,
    -sinB, cosB * sinG, cosB * cosG
  ];

  const rotVertices = vertices.forEach((vertex) => [
    rotMat[0] * vertex[0] + rotMat[1] * vertex[1] + rotMat[2] * vertex[2],
    rotMat[3] * vertex[0] + rotMat[4] * vertex[1] + rotMat[5] * vertex[2],
    rotMat[6] * vertex[0] + rotMat[7] * vertex[1] + rotMat[8] * vertex[2]
  ]);

  edges.forEach((edge) => {
    const vert1 = rotVertices[edge[0]];
    const vert2 = rotVertices[edge[1]];

    primitives.line(pixels, vert1[0], vert1[1], vert2[0], vert2[1]);
  });
}

module.exports = {
  render
};
