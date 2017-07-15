/**
 * Created by betterclever on 12/7/17.
 */
import * as L from "leaflet";

export class ResponseUI {

    constructor(private mainDiv: HTMLDivElement) {
    }

    public changeText(text: string): void {
        // TODO: Accept Parsed SUSI Response to show all the interactive results
        // Removing all children
        this.clear();
        this.mainDiv.className = "thin xlarge bright";
        const node = document.createTextNode(text);
        // Add a new Text Node
        this.mainDiv.appendChild(node);
    }

    public update(susiResponse: any): void {
        this.clear();
        const actions: Array<any> = susiResponse.answers[0].actions;
        for (const action of actions) {
            if (action.type === "answer") {
                this.mainDiv.className = "thin bright";
                this.mainDiv.setAttribute("style", "font-size: 2vw");
                const node = document.createTextNode(action.expression);
                this.mainDiv.appendChild(node);
            } else if (action.type === "map") {
                const mapDiv = document.createElement("div");
                mapDiv.setAttribute("style", "width:300px; height: 300px; margin: 0 auto");
                console.log(action);
                const latitude = parseFloat(action.latitude);
                const longitude = parseFloat(action.longitude);
                const map = L.map(mapDiv).setView([latitude, longitude], parseInt(action.zoom, 10));
                L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                    attribution: "",
                    maxZoom: parseInt(action.zoom, 10)
                }).addTo(map);
                this.mainDiv.appendChild(mapDiv);
            }
        }
    }

    public clear(): void {
        while (this.mainDiv.hasChildNodes()) {
            this.mainDiv.removeChild(this.mainDiv.lastChild);
        }
    }
}
