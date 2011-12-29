// Copyright 2011 Scott Sanbar.  See COPYRIGHT file for details
// Original Author:  Scott Sanbar - scott.sanbar@gmail.com

function rCG_initGlobals() {
    G_RCG_DELTA_MAX = 50.0;
    G_RCG_ORIGIN_X_MIN = 7;
    gRCGAllowAnimation = true;
    gRCGColorsHead = 0;
    gRCGDelta = 0;
    gRCGColors = new Array();
    for (var i = 0; i < 10; i++ ) {
        gRCGColors[i] = getRandomColor();
    }
    gRCGCanvas = document.
        getElementById("idRCGCanvas");
    gRCGStartStopUpdateCanvasButton = document.
        getElementById("idRCGStartStopUpdateCanvas");
    gRCGToggleGradientTypeButton = document.
        getElementById("idRCGToggleGradientTypeButton");
    gRCGContext = gRCGCanvas.getContext("2d");
    gRCGCanvasWidth = gRCGCanvas.width;
    gRCGCanvasHeight = gRCGCanvas.height;
    gRCGOriginX = 0;
    gRCGOriginY = gRCGCanvasHeight / 2.0;
    gRCGMouseDown = false;
}
function rCG_updateCanvas() {
    var loc = "::RandomColorGradient::rCG_updateCanvas()";
    if ((typeof gRCGColors != "undefined") &&
        (gRCGAllowAnimation)) {
        gRCGDelta++;
        if (gRCGDelta == G_RCG_DELTA_MAX) {
            gRCGDelta = 0;
            gRCGColorsHead--;
            if (gRCGColorsHead < 0) {
                gRCGColorsHead = gRCGColors.length - 1;
            }
            gRCGColors[gRCGColorsHead] =
                getRandomColor();
        }
    }
    try {
        if (gRCGToggleGradientTypeButton.value == "Radial") {
            var grd = gRCGContext.createLinearGradient
                (0, 0, gRCGCanvasWidth, 0);
        } else {
            grd = gRCGContext.createRadialGradient
                (gRCGOriginX, gRCGOriginY, 0, gRCGCanvasWidth,
                 gRCGOriginY, gRCGCanvasWidth);
        }        
        var originXFrac = gRCGOriginX / gRCGCanvasWidth;
        for (i = 0; i < gRCGColors.length; i++) {
            if (i == 0) {
            grd.addColorStop
                (0, gRCGColors[(gRCGColorsHead + i)
                        % gRCGColors.length]);
            } else if (i == gRCGColors.length - 1) {
                grd.addColorStop
                    (1, gRCGColors[(gRCGColorsHead + i)
                            % gRCGColors.length]);
            } else {
                var stopFrac = 1.0 / (gRCGColors.length - 2);
                var stopDeltaFrac = ((i - 1) * stopFrac)
                     + (gRCGDelta * stopFrac / G_RCG_DELTA_MAX);
                if (gRCGToggleGradientTypeButton.value == "Radial") {
//                    if (stopDeltaFrac < originXFrac) {
                        stopDeltaFrac *= 1 - originXFrac;
//                    } else {
//                        stopDeltaFrac *= 2 * Math.abs(stopDeltaFrac - originXFrac) / 0.000000001;
//                    }
                    if (stopDeltaFrac < 0) {
                        stopDeltaFrac = 0;
                    }
                }
                grd.addColorStop
                    (stopDeltaFrac, gRCGColors
                     [(gRCGColorsHead + i)
                             % gRCGColors.length]);
            }
        }
        gRCGContext.fillStyle = grd;
        gRCGContext.fillRect(0, 0, gRCGCanvasWidth, gRCGCanvasHeight);
    } catch (err) {
        exceptionAlert(loc, err);
    }
}
function rCG_startStopUpdateCanvas() {
    var loc = "::RandomCanvasGradient::rCG_startStopUpdateCanvas()"
    if (!isCanvasSupported()) {
        exceptionAlert(loc, null, stringNotSupported());
        return;
    }
    if (typeof gRCGColors == "undefined") {
        rCG_initGlobals();
    }
    try {
        if (gRCGStartStopUpdateCanvasButton.value == "Start") {
            gRCGIntervalID =
                setInterval(rCG_updateCanvas, 20)
            gRCGStartStopUpdateCanvasButton.value = "Stop";
        } else {
            clearInterval(gRCGIntervalID);
            gRCGStartStopUpdateCanvasButton.value = "Start";
        }
    } catch (e) {
        exceptionAlert(loc, e);
    }
}
function rCG_toggleGradientType() {
    var loc = "::RandomCanvasGradient::rCG_toggleGradientType()"
    if (!isCanvasSupported()) {
        exceptionAlert(loc, null, stringNotSupported());
        return;
    }
    if (typeof gRCGColors == "undefined") {
        rCG_initGlobals();
    }
    try {
        if (gRCGToggleGradientTypeButton.value == "Linear") {
            gRCGToggleGradientTypeButton.value = "Radial";
        } else {
            gRCGToggleGradientTypeButton.value = "Linear";
        }
        if (gRCGStartStopUpdateCanvasButton.value == "Start") {
            gRCGAllowAnimation = false;
            rCG_updateCanvas();
            gRCGAllowAnimation = true;
        }
    } catch (e) {
        exceptionAlert(loc, e);
    }
}
function rCG_canvasMouseUp() {
    gRCGMouseDown = false;
}
function rCG_canvasMouseOut() {
    gRCGMouseDown = false;
}

function rCG_canvasMouseDown(evt) {
    if (typeof gRCGColors == "undefined") {
        rCG_initGlobals();
    }
    gRCGOriginX = getMousePos(gRCGCanvas, evt).x
    if (gRCGOriginX < G_RCG_ORIGIN_X_MIN) {
        gRCGOriginY = gRCGCanvasHeight / 2;
        gRCGOriginX = 0;
        gRCGMouseDown = false;
    } else {
        gRCGOriginY = getMousePos(gRCGCanvas, evt).y
        gRCGMouseDown = true;
    }
    rCG_updateCanvas();
        
}

function rCG_canvasMouseMove(evt) {
    if (typeof gRCGColors == "undefined") {
        rCG_initGlobals();
    }
    if (gRCGMouseDown == false) {
      return;
    }
    gRCGOriginX = getMousePos(gRCGCanvas, evt).x
    gRCGOriginY = getMousePos(gRCGCanvas, evt).y

    if (gRCGOriginX < G_RCG_ORIGIN_X_MIN) {
        gRCGOriginY = gRCGCanvasHeight / 2;
        gRCGOriginX = 0;
        gRCGMouseDown = false;
    }
    rCG_updateCanvas();
}