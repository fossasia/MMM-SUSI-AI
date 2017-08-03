/**
 * Created by betterclever on 6/30/17.
 */

const fs = require("fs");
const NodeHelper = require("node_helper");
const Main = require("./dist/main/index.js");

let main;

process.env.CWD = `${process.env.PWD}/modules/MMM-SUSI-AI`;

module.exports = NodeHelper.create({

    start: function () {
        this.expressApp.get("/output.wav", function (req, res) {
            res.setHeader("Expires", new Date().toUTCString());
            const path = `${process.env.CWD}/temp/output.wav`;

            if (!fs.existsSync(path)) {
                const rstream = fs.createReadStream(`${process.env.CWD}/resources/problem.mp3`);
                rstream.pipe(res);
                return;
            }

            const rstream = fs.createReadStream(path);
            rstream.pipe(res);
        });

        this.expressApp.get("/problem.wav", function (req, res) {
            res.setHeader("Expires", new Date().toUTCString());

            const rstream = fs.createReadStream(`${process.env.CWD}/resources/problem.mp3`);
            rstream.pipe(res);
        });
    },

    // Because this.config is not accessible from node_helper for some reason. Need to pass from the js file.
    socketNotificationReceived: function (notification, payload) {
        if (notification === "CONFIG") {
            main = new Main(payload, (event, payload) => {
                this.sendSocketNotification(event, payload);
            }, this.socketNotificationReceived);
            return;
        }

        main.receivedNotification(notification, payload);
    },
});
