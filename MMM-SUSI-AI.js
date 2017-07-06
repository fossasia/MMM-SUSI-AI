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
        const moduleWrapper = document.createElement("div");
        moduleWrapper.setAttribute("id", "wrapper");

        const susiVisualiserCanvas = document.createElement("canvas");
        susiVisualiserCanvas.width = 800;
        susiVisualiserCanvas.height = 500;
        moduleWrapper.appendChild(susiVisualiserCanvas);

        susiMirror = new SusiService.SusiMirror(moduleWrapper, susiVisualiserCanvas, this.config, (event, payload) => {
            this.sendSocketNotification(event, payload);
        });

        susiMirror.start();
        return moduleWrapper;
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
