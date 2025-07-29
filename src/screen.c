#include "screen.h"
#include "os.h"
#include <stdio.h>

// Debug logging macros
#ifdef DEBUG
#define DEBUG_LOG(fmt, ...) fprintf(stderr, "[DEBUG] %s:%d: " fmt "\n", __FILE__, __LINE__, ##__VA_ARGS__)
#else
#define DEBUG_LOG(fmt, ...) ((void)0)
#endif

#if defined(IS_MACOSX)
	#include <ApplicationServices/ApplicationServices.h>
#elif defined(USE_X11)
	#include <X11/Xlib.h>
	#include "xdisplay.h"
#elif defined(IS_WINDOWS)
	#include <windows.h>
	
	// Global variables for monitor enumeration
	static int g_monitorIndex = 0;
	static MMSignedRect *g_monitorRects = NULL;
	static int g_monitorCount = 0;
	
	// Callback function for EnumDisplayMonitors
	BOOL CALLBACK MonitorEnumProc(HMONITOR hMonitor, HDC hdcMonitor, LPRECT lprcMonitor, LPARAM dwData) {
		if (g_monitorIndex < g_monitorCount) {
			g_monitorRects[g_monitorIndex] = MMSignedRectMake(
				(int32_t)lprcMonitor->left,
				(int32_t)lprcMonitor->top,
				(int32_t)(lprcMonitor->right - lprcMonitor->left),
				(int32_t)(lprcMonitor->bottom - lprcMonitor->top)
			);
			g_monitorIndex++;
		}
		return TRUE;
	}
#endif

MMSignedSize getMainDisplaySize(void)
{
	DEBUG_LOG("getMainDisplaySize called");
	
#if defined(IS_MACOSX)
	CGDirectDisplayID displayID = CGMainDisplayID();
	DEBUG_LOG("macOS: displayID = %u", (unsigned int)displayID);
	MMSignedSize size = MMSignedSizeMake(CGDisplayPixelsWide(displayID),
	                  CGDisplayPixelsHigh(displayID));
	DEBUG_LOG("macOS: size = %dx%d", size.width, size.height);
	return size;
#elif defined(USE_X11)
	Display *display = XGetMainDisplay();
	const int screen = DefaultScreen(display);
	DEBUG_LOG("X11: screen = %d", screen);

	MMSignedSize size = MMSignedSizeMake((int32_t)DisplayWidth(display, screen),
	                  (int32_t)DisplayHeight(display, screen));
	DEBUG_LOG("X11: size = %dx%d", size.width, size.height);
	return size;
#elif defined(IS_WINDOWS)
	MMSignedSize size = MMSignedSizeMake((int32_t)GetSystemMetrics(SM_CXSCREEN),
	                  (int32_t)GetSystemMetrics(SM_CYSCREEN));
	DEBUG_LOG("Windows: size = %dx%d", size.width, size.height);
	return size;
#endif
}

int getMainDisplayID(void)
{
#if defined(IS_MACOSX)
	return (int)CGMainDisplayID();
#elif defined(USE_X11)
	Display *display = XGetMainDisplay();
	return DefaultScreen(display);
#elif defined(IS_WINDOWS)
	// On Windows, the primary monitor is typically the one at (0,0)
	// We'll identify it by checking which monitor contains the origin
	HMONITOR primaryMonitor = MonitorFromPoint(POINT{0, 0}, MONITOR_DEFAULTTOPRIMARY);
	
	// We need to enumerate monitors to find the index of the primary one
	int monitorCount = GetSystemMetrics(SM_CMONITORS);
	MMSignedRect *monitorRects = malloc(monitorCount * sizeof(MMSignedRect));
	
	// Reset global variables for enumeration
	g_monitorIndex = 0;
	if (g_monitorRects) {
		free(g_monitorRects);
	}
	g_monitorRects = monitorRects;
	g_monitorCount = monitorCount;
	
	// Enumerate monitors
	EnumDisplayMonitors(NULL, NULL, MonitorEnumProc, 0);
	
	// Find the primary monitor (the one at origin)
	int primaryIndex = 0;
	for (int i = 0; i < monitorCount && i < g_monitorIndex; i++) {
		if (monitorRects[i].origin.x == 0 && monitorRects[i].origin.y == 0) {
			primaryIndex = i;
			break;
		}
	}
	
	// Clean up
	free(monitorRects);
	g_monitorRects = NULL;
	
	return primaryIndex;
#endif
}

bool pointVisibleOnMainDisplay(MMSignedPoint point)
{
	MMSignedSize displaySize = getMainDisplaySize();
	return point.x < displaySize.width && point.y < displaySize.height;
}

int getScreensCount(void)
{
#if defined(IS_MACOSX)
	uint32_t displayCount = 0;
	CGGetActiveDisplayList(0, NULL, &displayCount);
	return (int)displayCount;
#elif defined(USE_X11)
	Display *display = XGetMainDisplay();
	return ScreenCount(display);
#elif defined(IS_WINDOWS)
	return GetSystemMetrics(SM_CMONITORS);
#endif
}

void getScreensInfo(MMSignedRect *screens, int count)
{
#if defined(IS_MACOSX)
	uint32_t displayCount = (uint32_t)count;
	CGDirectDisplayID *displayIDs = malloc(displayCount * sizeof(CGDirectDisplayID));
	
	if (CGGetActiveDisplayList(displayCount, displayIDs, &displayCount) == kCGErrorSuccess) {
		for (int i = 0; i < count && i < (int)displayCount; i++) {
			CGRect bounds = CGDisplayBounds(displayIDs[i]);
			screens[i] = MMSignedRectMake(
				(int32_t)bounds.origin.x,
				(int32_t)bounds.origin.y,
				(int32_t)bounds.size.width,
				(int32_t)bounds.size.height
			);
		}
	}
	
	free(displayIDs);
#elif defined(USE_X11)
	Display *display = XGetMainDisplay();
	for (int i = 0; i < count && i < ScreenCount(display); i++) {
		screens[i] = MMSignedRectMake(
			0, 0,
			(int32_t)DisplayWidth(display, i),
			(int32_t)DisplayHeight(display, i)
		);
	}
#elif defined(IS_WINDOWS)
	// Reset global variables for new enumeration
	g_monitorIndex = 0;
	if (g_monitorRects) {
		free(g_monitorRects);
	}
	g_monitorRects = malloc(count * sizeof(MMSignedRect));
	g_monitorCount = count;
	
	// Enumerate monitors
	EnumDisplayMonitors(NULL, NULL, MonitorEnumProc, 0);
	
	// Copy results to output array
	for (int i = 0; i < count && i < g_monitorIndex; i++) {
		screens[i] = g_monitorRects[i];
	}
	
	// Clean up
	free(g_monitorRects);
	g_monitorRects = NULL;
#endif
}

void getScreensInfoWithIDs(MMSignedRect *screens, int *displayIDs, int count)
{
#if defined(IS_MACOSX)
	uint32_t displayCount = (uint32_t)count;
	CGDirectDisplayID *cgDisplayIDs = malloc(displayCount * sizeof(CGDirectDisplayID));
	
	if (CGGetActiveDisplayList(displayCount, cgDisplayIDs, &displayCount) == kCGErrorSuccess) {
		for (int i = 0; i < count && i < (int)displayCount; i++) {
			CGRect bounds = CGDisplayBounds(cgDisplayIDs[i]);
			screens[i] = MMSignedRectMake(
				(int32_t)bounds.origin.x,
				(int32_t)bounds.origin.y,
				(int32_t)bounds.size.width,
				(int32_t)bounds.size.height
			);
			displayIDs[i] = (int)cgDisplayIDs[i];
		}
	}
	
	free(cgDisplayIDs);
#elif defined(USE_X11)
	Display *display = XGetMainDisplay();
	for (int i = 0; i < count && i < ScreenCount(display); i++) {
		screens[i] = MMSignedRectMake(
			0, 0,
			(int32_t)DisplayWidth(display, i),
			(int32_t)DisplayHeight(display, i)
		);
		displayIDs[i] = i;
	}
#elif defined(IS_WINDOWS)
	// Reset global variables for new enumeration
	g_monitorIndex = 0;
	if (g_monitorRects) {
		free(g_monitorRects);
	}
	g_monitorRects = malloc(count * sizeof(MMSignedRect));
	g_monitorCount = count;
	
	// Enumerate monitors
	EnumDisplayMonitors(NULL, NULL, MonitorEnumProc, 0);
	
	// Copy results to output array
	for (int i = 0; i < count && i < g_monitorIndex; i++) {
		screens[i] = g_monitorRects[i];
		displayIDs[i] = i;
	}
	
	// Clean up
	free(g_monitorRects);
	g_monitorRects = NULL;
#endif
}
