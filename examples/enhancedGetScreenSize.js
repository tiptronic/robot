var robot = require("../index.js");

console.log("Enhanced RobotJS getScreenSize Example");
console.log("======================================");

// Get virtual screen bounds (all monitors combined)
console.log("1. Virtual Screen Bounds (all monitors combined):");
const virtualScreen = robot.getScreenSize();
console.log(`   Width: ${virtualScreen.width}px`);
console.log(`   Height: ${virtualScreen.height}px`);
console.log(`   Bounds: (${virtualScreen.minX}, ${virtualScreen.minY}) to (${virtualScreen.maxX}, ${virtualScreen.maxY})`);
console.log("");

// Get virtual screen bounds explicitly with parameter 0
console.log("2. Virtual Screen Bounds (explicit parameter 0):");
const virtualScreen2 = robot.getScreenSize(0);
console.log(`   Width: ${virtualScreen2.width}px`);
console.log(`   Height: ${virtualScreen2.height}px`);
console.log(`   Bounds: (${virtualScreen2.minX}, ${virtualScreen2.minY}) to (${virtualScreen2.maxX}, ${virtualScreen2.maxY})`);
console.log("");

// Get individual monitor sizes
const screens = robot.getScreens();
console.log(`3. Individual Monitor Sizes (${screens.length} monitors):`);

for (let i = 1; i <= screens.length; i++) {
    const monitor = robot.getScreenSize(i);
    console.log(`   Monitor ${i}:`);
    console.log(`     Size: ${monitor.width} x ${monitor.height}px`);
    console.log(`     Position: (${monitor.x}, ${monitor.y})`);
    console.log(`     Area: ${monitor.width * monitor.height} pixels`);
    console.log("");
}

// Test error cases
console.log("4. Error Cases:");
console.log(`   getScreenSize(-1): ${robot.getScreenSize(-1)}`);
console.log(`   getScreenSize(999): ${robot.getScreenSize(999)}`);
console.log("");

// Practical example: Move mouse to center of each monitor
console.log("5. Moving mouse to center of each monitor:");
for (let i = 1; i <= screens.length; i++) {
    const monitor = robot.getScreenSize(i);
    const centerX = monitor.x + Math.floor(monitor.width / 2);
    const centerY = monitor.y + Math.floor(monitor.height / 2);
    
    console.log(`   Moving to center of Monitor ${i}: (${centerX}, ${centerY})`);
    robot.moveMouse(centerX, centerY);
    
    // Wait a bit before moving to next monitor
    setTimeout(() => {}, 1000);
}

// Practical example: Check if a point is within virtual screen bounds
console.log("");
console.log("6. Virtual Screen Bounds Check:");
const testPoints = [
    { x: 0, y: 0, name: "Top-left corner" },
    { x: virtualScreen.maxX - 1, y: virtualScreen.maxY - 1, name: "Bottom-right corner" },
    { x: virtualScreen.maxX + 100, y: virtualScreen.maxY + 100, name: "Outside bounds" }
];

testPoints.forEach(point => {
    const isInBounds = point.x >= virtualScreen.minX && 
                      point.x < virtualScreen.maxX && 
                      point.y >= virtualScreen.minY && 
                      point.y < virtualScreen.maxY;
    
    console.log(`   Point ${point.name} (${point.x}, ${point.y}): ${isInBounds ? 'IN BOUNDS' : 'OUT OF BOUNDS'}`);
}); 