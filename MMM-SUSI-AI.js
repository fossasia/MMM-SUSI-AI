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
        visualizerCanvas.height = 300;
        moduleWrapper.appendChild(visualizerCanvas);

        const userQueryDiv = document.createElement("div");
        const userTextNode = document.createTextNode("");
        userTextNode.className = "userQueryText";
        userQueryDiv.appendChild(userTextNode);
        moduleWrapper.appendChild(userQueryDiv);

        const susiResponseDiv = document.createElement("div");
        susiResponseDiv.setAttribute("id", "responseDiv");
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
            "https://unpkg.com/leaflet@1.1.0/dist/leaflet.css",
        ];
    },

    socketNotificationReceived: function (notification, payload) {
        susiMirror.receivedNotification(notification, payload);
    },

    notificationReceived: function(notification, payload, sender) {
        console.log(this.name,notification,payload,sender);
        if (sender) {
            if(sender.name === "MMM-Facial-Recognition"){
                if(notification === "CURRENT_USER"){
                    console.log(this.name,notification,payload,sender);
                    if(payload === "None"){
                        this.sendSocketNotification("CURRENT_USER","anonymous");
                    } else {
                        this.sendSocketNotification("CURRENT_USER",payload)
                    }
                }
            }
        } else {
            Log.log(this.name + " received a system notification: " + notification);
        }
    }
});
