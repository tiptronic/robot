#include "screen.h"
#include "os.h"
#include <stdlib.h>

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
#if defined(IS_MACOSX)
	CGDirectDisplayID displayID = CGMainDisplayID();
	MMSignedSize size = MMSignedSizeMake(CGDisplayPixelsWide(displayID),
	                  CGDisplayPixelsHigh(displayID));
	return size;
#elif defined(USE_X11)
	Display *display = XGetMainDisplay();
	const int screen = DefaultScreen(display);

	MMSignedSize size = MMSignedSizeMake((int32_t)DisplayWidth(display, screen),
	                  (int32_t)DisplayHeight(display, screen));
	return size;
#elif defined(IS_WINDOWS)
	MMSignedSize size = MMSignedSizeMake((int32_t)GetSystemMetrics(SM_CXSCREEN),
	                  (int32_t)GetSystemMetrics(SM_CYSCREEN));
	return size;
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
