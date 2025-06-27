var robot = require("../index.js");

describe("Screen Detection", () => {
    test("getScreens should return an array of screen information", () => {
        const screens = robot.getScreens();
        
        expect(Array.isArray(screens)).toBe(true);
        expect(screens.length).toBeGreaterThan(0);
        
        // Check that each screen has the required properties
        screens.forEach((screen, index) => {
            expect(screen).toHaveProperty('x');
            expect(screen).toHaveProperty('y');
            expect(screen).toHaveProperty('width');
            expect(screen).toHaveProperty('height');
            
            expect(typeof screen.x).toBe('number');
            expect(typeof screen.y).toBe('number');
            expect(typeof screen.width).toBe('number');
            expect(typeof screen.height).toBe('number');
            
            expect(screen.width).toBeGreaterThan(0);
            expect(screen.height).toBeGreaterThan(0);
            
            console.log(`Screen ${index}: x=${screen.x}, y=${screen.y}, width=${screen.width}, height=${screen.height}`);
        });
    });
    
    test("getScreens should return at least one screen", () => {
        const screens = robot.getScreens();
        expect(screens.length).toBeGreaterThan(0);
    });
    
    test("getScreens should return consistent results", () => {
        const screens1 = robot.getScreens();
        const screens2 = robot.getScreens();
        
        expect(screens1.length).toBe(screens2.length);
        
        for (let i = 0; i < screens1.length; i++) {
            expect(screens1[i]).toEqual(screens2[i]);
        }
    });
    
    test("getScreens should work with getScreenSize", () => {
        const screens = robot.getScreens();
        const mainScreenSize = robot.getScreenSize();
        
        // The main screen should be one of the detected screens
        const mainScreen = screens.find(screen => 
            screen.width === mainScreenSize.width && 
            screen.height === mainScreenSize.height
        );
        
        expect(mainScreen).toBeDefined();
    });
}); 