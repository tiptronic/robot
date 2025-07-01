var robot = require('..');
var pixelColor, screenSize;

describe('Screen', () => {
  it('Get pixel color.', function()
  {
    expect(pixelColor = robot.getPixelColor(5, 5)).toBeTruthy();
    expect(pixelColor !== undefined).toBeTruthy();
    expect(pixelColor.length === 6).toBeTruthy();
    expect(/^[0-9A-F]{6}$/i.test(pixelColor)).toBeTruthy();

    expect(function()
    {
      robot.getPixelColor(9999999999999, 9999999999999);
    }).toThrowError(/outside the main screen/);

    expect(function()
    {
      robot.getPixelColor(-1, -1);
    }).toThrowError(/outside the main screen/);

    expect(function()
    {
      robot.getPixelColor(0);
    }).toThrowError(/Invalid number/);

    expect(function()
    {
      robot.getPixelColor(1, 2, 3);
    }).toThrowError(/Invalid number/);
  });

  it('Get screen size.', function()
  {
    expect(screenSize = robot.getScreenSize()).toBeTruthy();
    expect(screenSize.width !== undefined).toBeTruthy();
    expect(screenSize.height !== undefined).toBeTruthy();
  });

  it('Get mouse color.', function()
  {
    var mouseColor = robot.getMouseColor();
    expect(mouseColor).toBeTruthy();
    expect(mouseColor.x !== undefined).toBeTruthy();
    expect(mouseColor.y !== undefined).toBeTruthy();
    expect(mouseColor.r !== undefined).toBeTruthy();
    expect(mouseColor.g !== undefined).toBeTruthy();
    expect(mouseColor.b !== undefined).toBeTruthy();
    expect(mouseColor.hex !== undefined).toBeTruthy();
    expect(typeof mouseColor.x).toBe('number');
    expect(typeof mouseColor.y).toBe('number');
    expect(typeof mouseColor.r).toBe('number');
    expect(typeof mouseColor.g).toBe('number');
    expect(typeof mouseColor.b).toBe('number');
    expect(typeof mouseColor.hex).toBe('string');
    expect(/^#[0-9A-F]{6}$/i.test(mouseColor.hex)).toBeTruthy();
  });
});
