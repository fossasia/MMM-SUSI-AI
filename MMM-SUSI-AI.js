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

        const visualizerCanvas = document.createElement("canvas");
        visualizerCanvas.width = 400;
        visualizerCanvas.height = 400;
        moduleWrapper.appendChild(visualizerCanvas);

        const userQueryDiv = document.createElement("div");
        const userTextNode = document.createTextNode("");
        userTextNode.className = "userQueryText";
        userQueryDiv.appendChild(userTextNode);
        moduleWrapper.appendChild(userQueryDiv);

        const susiResponseDiv = document.createElement("div");
        susiResponseDiv.setAttribute("id", "responseDiv");
        susiResponseDiv.className = "thin xlarge bright";
        susiResponseDiv.setAttribute("style","margin: 50px; width: 1000px");
        moduleWrapper.appendChild(susiResponseDiv);

        susiMirror = new SusiService.SusiMirror(moduleWrapper, visualizerCanvas, userTextNode, susiResponseDiv, this.config, (event, payload) => {
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
