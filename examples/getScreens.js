var robot = require("../index.js");

console.log("RobotJS getScreens Example");
console.log("==========================");

// Get information about all connected screens
const screens = robot.getScreens();

console.log(`Found ${screens.length} screen(s):`);
console.log("");

screens.forEach((screen, index) => {
    console.log(`Screen ${index + 1}:`);
    console.log(`  Position: (${screen.x}, ${screen.y})`);
    console.log(`  Size: ${screen.width} x ${screen.height}`);
    console.log(`  Area: ${screen.width * screen.height} pixels`);
    console.log(`  Main: ${screen.isMain ? 'Yes' : 'No'}`);
    console.log(`  Display ID: ${screen.displayId}`);
    console.log("");
});

// Compare with getScreenSize (which returns main screen)
const mainScreenSize = robot.getScreenSize();
console.log("Main screen size (from getScreenSize):");
console.log(`  Size: ${mainScreenSize.width} x ${mainScreenSize.height}`);
console.log("");

// Find the main screen in our list
const mainScreen = screens.find(screen => screen.isMain);

if (mainScreen) {
    console.log("Main screen found in getScreens list:");
    console.log(`  Position: (${mainScreen.x}, ${mainScreen.y})`);
    console.log(`  Size: ${mainScreen.width} x ${mainScreen.height}`);
} else {
    console.log("Warning: Main screen not found in getScreens list");
}

// Example: Move mouse to center of each screen
console.log("");
console.log("Moving mouse to center of each screen...");

screens.forEach((screen, index) => {
    const centerX = screen.x + Math.floor(screen.width / 2);
    const centerY = screen.y + Math.floor(screen.height / 2);
    
    console.log(`Moving to center of screen ${index + 1}: (${centerX}, ${centerY})`);
    robot.moveMouse(centerX, centerY);
    
    // Wait a bit before moving to next screen
    setTimeout(() => {}, 1000);
}); 