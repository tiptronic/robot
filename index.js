// Dynamically load the correct binary based on platform and architecture
var robotjs;
var platform = process.platform;
var arch = process.arch;

try {
    if (platform === 'win32') {
        // Windows builds
        robotjs = require('./build/Release/robotjs.win64.node');
    } else if (platform === 'darwin') {
        // macOS builds
        if (arch === 'arm64') {
            robotjs = require('./build/Release/robotjs.arm64.node');
        } else if (arch === 'x64') {
            robotjs = require('./build/Release/robotjs.x64.node');
        } else {
            // Fallback for other architectures
            robotjs = require('./build/Release/robotjs.node');
        }
    } else {
        // Linux and other platforms - fallback to default
        robotjs = require('./build/Release/robotjs.node');
    }
} catch (error) {
    // If the platform-specific binary doesn't exist, try the default
    try {
        robotjs = require('./build/Release/robotjs.node');
    } catch (fallbackError) {
        throw new Error(`Failed to load robotjs binary for platform ${platform} (${arch}). Make sure the appropriate binary is built.`);
    }
}

module.exports = robotjs;

module.exports.screen = {};

function bitmap(width, height, byteWidth, bitsPerPixel, bytesPerPixel, image) 
{
    this.width = width;
    this.height = height;
    this.byteWidth = byteWidth;
    this.bitsPerPixel = bitsPerPixel;
    this.bytesPerPixel = bytesPerPixel;
    this.image = image;

    this.colorAt = function(x, y)
    {
        return robotjs.getColor(this, x, y);
    };

}

module.exports.screen.capture = function(x, y, width, height)
{
    //If coords have been passed, use them.
    if (typeof x !== "undefined" && typeof y !== "undefined" && typeof width !== "undefined" && typeof height !== "undefined")
    {
        b = robotjs.captureScreen(x, y, width, height);
    }
    else 
    {
        b = robotjs.captureScreen();
    }

    return new bitmap(b.width, b.height, b.byteWidth, b.bitsPerPixel, b.bytesPerPixel, b.image);
};
