/* global Module */

/* Magic Mirror
 * Module: Susi Magic Mirror
 *
 * By FOSSASIA
 * LGPL v2.1 Licensed.
 */

let susiMirror;

Module.register("MMM-SUSI-AI", {


    start: function () {
		this.sendSocketNotification("CONFIG", this.config);
    },

    getDom: function () {
        const alexaWrapper = document.createElement("div");
        alexaWrapper.setAttribute("id", "wrapper");

        const susiVisualiserCanvas = document.createElement("canvas");
        susiVisualiserCanvas.width = 400;
        susiVisualiserCanvas.height = 300;
        alexaWrapper.appendChild(susiVisualiserCanvas);

        //TODO: Add Visualizations
        susiMirror = new SusiService.SusiMirror(alexaWrapper, susiVisualiserCanvas, this.config, (event, payload) => {
            this.sendSocketNotification(event, payload);
        });

        return alexaWrapper;
    },

    getScripts: function () {
        return [
            this.file("dist/bundle.js"),
        ];
    },

    getStyles: function () {
        return [
            this.file("styles/global.css"),
        ];
    },

    socketNotificationReceived: function (notification, payload) {
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        susiMirror.receivedNotification(notification, payload);
    },
});
