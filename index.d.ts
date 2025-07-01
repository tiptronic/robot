export interface Bitmap {
  width: number
  height: number
  image: any
  byteWidth: number
  bitsPerPixel: number
  bytesPerPixel: number
  colorAt(x: number, y: number): string
}

export interface Screen {
  capture(x?: number, y?: number, width?: number, height?: number): Bitmap
}

export interface ScreenInfo {
  x: number
  y: number
  width: number
  height: number
  isMain: boolean
  displayId: number
}

export interface VirtualScreenSize {
  width: number
  height: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface MonitorSize {
  width: number
  height: number
  x: number
  y: number
}

export function setKeyboardDelay(ms: number) : void
export function keyTap(key: string, modifier?: string | string[]) : void
export function keyToggle(key: string, down: string, modifier?: string | string[]) : void
export function typeString(string: string) : void
export function typeStringDelayed(string: string, cpm: number) : void
export function setMouseDelay(delay: number) : void
export function updateScreenMetrics() : void
export function moveMouse(x: number, y: number) : void
export function moveMouseSmooth(x: number, y: number,speed?:number) : void
export function mouseClick(button?: string, double?: boolean) : void
export function mouseToggle(down?: string, button?: string) : void
export function dragMouse(x: number, y: number) : void
export function scrollMouse(x: number, y: number) : void
export function getMousePos(): { x: number, y: number }
export function getMouseColor(): { x: number, y: number, r: number, g: number, b: number }
export function getPixelColor(x: number, y: number, rgb?: boolean): string | { r: number, g: number, b: number }
export function getScreenSize(screenIndex?: number): VirtualScreenSize | MonitorSize | null
export function getScreens(): ScreenInfo[]
export function getVersion(): string

export var screen: Screen
