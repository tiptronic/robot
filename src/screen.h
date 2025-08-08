#pragma once
#ifndef SCREEN_H
#define SCREEN_H

#include "types.h"

#if defined(_MSC_VER)
	#include "ms_stdbool.h"
#else
	#include <stdbool.h>
#endif

#ifdef __cplusplus
extern "C" 
{
#endif

/* Returns the size of the main display. */
MMSignedSize getMainDisplaySize(void);

/* Returns the ID of the main display. */
int getMainDisplayID(void);

/* Convenience function that returns whether the given point is in the bounds
 * of the main screen. */
bool pointVisibleOnMainDisplay(MMSignedPoint point);

/* Returns the number of connected displays. */
int getScreensCount(void);

/* Fills the provided array with information about all connected displays.
 * The array must be large enough to hold count elements. */
void getScreensInfo(MMSignedRect *screens, int count);

/* Fills the provided arrays with information about all connected displays.
 * The arrays must be large enough to hold count elements.
 * displayIDs will contain the display IDs for each screen. */
void getScreensInfoWithIDs(MMSignedRect *screens, int *displayIDs, int count);

#ifdef __cplusplus
}
#endif

#endif /* SCREEN_H */
