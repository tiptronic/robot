var robot = require("../index.js");

describe("Enhanced getScreenSize", () => {
    test("getScreenSize() should return virtual screen bounds", () => {
        const virtualScreen = robot.getScreenSize();
        
        expect(virtualScreen).toBeTruthy();
        expect(virtualScreen).toHaveProperty('width');
        expect(virtualScreen).toHaveProperty('height');
        expect(virtualScreen).toHaveProperty('minX');
        expect(virtualScreen).toHaveProperty('minY');
        expect(virtualScreen).toHaveProperty('maxX');
        expect(virtualScreen).toHaveProperty('maxY');
        
        expect(typeof virtualScreen.width).toBe('number');
        expect(typeof virtualScreen.height).toBe('number');
        expect(typeof virtualScreen.minX).toBe('number');
        expect(typeof virtualScreen.minY).toBe('number');
        expect(typeof virtualScreen.maxX).toBe('number');
        expect(typeof virtualScreen.maxY).toBe('number');
        
        expect(virtualScreen.width).toBeGreaterThan(0);
        expect(virtualScreen.height).toBeGreaterThan(0);
        
        console.log("Virtual screen:", virtualScreen);
    });
    
    test("getScreenSize(0) should return virtual screen bounds", () => {
        const virtualScreen = robot.getScreenSize(0);
        
        expect(virtualScreen).toBeTruthy();
        expect(virtualScreen).toHaveProperty('width');
        expect(virtualScreen).toHaveProperty('height');
        expect(virtualScreen).toHaveProperty('minX');
        expect(virtualScreen).toHaveProperty('minY');
        expect(virtualScreen).toHaveProperty('maxX');
        expect(virtualScreen).toHaveProperty('maxY');
    });
    
    test("getScreenSize(1) should return first monitor size", () => {
        const monitor1 = robot.getScreenSize(1);
        
        expect(monitor1).toBeTruthy();
        expect(monitor1).toHaveProperty('width');
        expect(monitor1).toHaveProperty('height');
        expect(monitor1).toHaveProperty('x');
        expect(monitor1).toHaveProperty('y');
        
        expect(typeof monitor1.width).toBe('number');
        expect(typeof monitor1.height).toBe('number');
        expect(typeof monitor1.x).toBe('number');
        expect(typeof monitor1.y).toBe('number');
        
        expect(monitor1.width).toBeGreaterThan(0);
        expect(monitor1.height).toBeGreaterThan(0);
        
        console.log("Monitor 1:", monitor1);
    });
    
    test("getScreenSize(2) should return second monitor size if available", () => {
        const screens = robot.getScreens();
        const monitor2 = robot.getScreenSize(2);
        
        if (screens.length >= 2) {
            expect(monitor2).toBeTruthy();
            expect(monitor2).toHaveProperty('width');
            expect(monitor2).toHaveProperty('height');
            expect(monitor2).toHaveProperty('x');
            expect(monitor2).toHaveProperty('y');
            
            console.log("Monitor 2:", monitor2);
        } else {
            expect(monitor2).toBeNull();
        }
    });
    
    test("getScreenSize(-1) should return null", () => {
        const result = robot.getScreenSize(-1);
        expect(result).toBeNull();
    });
    
    test("getScreenSize(999) should return null for non-existent monitor", () => {
        const result = robot.getScreenSize(999);
        expect(result).toBeNull();
    });
    
    test("Virtual screen should encompass all monitors", () => {
        const virtualScreen = robot.getScreenSize();
        const screens = robot.getScreens();
        
        // Virtual screen should be at least as large as the largest individual screen
        let maxWidth = 0;
        let maxHeight = 0;
        
        screens.forEach(screen => {
            if (screen.width > maxWidth) maxWidth = screen.width;
            if (screen.height > maxHeight) maxHeight = screen.height;
        });
        
        expect(virtualScreen.width).toBeGreaterThanOrEqual(maxWidth);
        expect(virtualScreen.height).toBeGreaterThanOrEqual(maxHeight);
    });
    
    test("Individual monitor should match getScreens data", () => {
        const screens = robot.getScreens();
        
        for (let i = 1; i <= screens.length; i++) {
            const monitor = robot.getScreenSize(i);
            const screen = screens[i - 1];
            
            expect(monitor.width).toBe(screen.width);
            expect(monitor.height).toBe(screen.height);
            expect(monitor.x).toBe(screen.x);
            expect(monitor.y).toBe(screen.y);
        }
    });
}); 