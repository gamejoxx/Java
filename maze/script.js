// script.js

document.addEventListener('DOMContentLoaded', generateMap);

function generateMap() {
  const canvas = document.getElementById('dungeonCanvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Dungeon parameters
  const roomCount = 15;
  const minSize = 5;
  const maxSize = 15;
  const mapWidth = 100;
  const mapHeight = 100;
  
  // Generate rooms
  let rooms = [];
  for (let i = 0; i < roomCount; i++) {
    let room = {};
    room.width = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    room.height = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    room.x = Math.floor(Math.random() * (mapWidth - room.width));
    room.y = Math.floor(Math.random() * (mapHeight - room.height));
    rooms.push(room);
  }
  
  // Draw rooms
  rooms.forEach(room => {
    ctx.fillStyle = '#656565'; // Room color
    ctx.fillRect(room.x * 10, room.y * 10, room.width * 10, room.height * 10); // Scale up room size
  });

  // Draw corridors
  for (let i = 0; i < roomCount - 1; i++) {
    let roomA = rooms[i];
    let roomB = rooms[i + 1];
    if (Math.random() > 0.5) {
      // Horizontal then vertical
      ctx.fillRect(roomA.x * 10, roomA.y * 10, (roomB.x - roomA.x) * 10, 10); // Horizontal
      ctx.fillRect(roomB.x * 10, roomA.y * 10, 10, (roomB.y - roomA.y) * 10); // Vertical
    } else {
      // Vertical then horizontal
      ctx.fillRect(roomA.x * 10, roomA.y * 10, 10, (roomB.y - roomA.y) * 10); // Vertical
      ctx.fillRect(roomA.x * 10, roomB.y * 10, (roomB.x - roomA.x) * 10, 10); // Horizontal
    }
  }
}
