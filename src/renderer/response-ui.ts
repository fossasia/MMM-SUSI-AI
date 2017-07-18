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
                this.mainDiv.setAttribute("style", "font-size: 2vw; margin: 40px");
                const filteredText = this.removeLinks(action.expression);
                const node = document.createTextNode(filteredText);
                this.mainDiv.appendChild(node);
            } else if (action.type === "map") {
                const mapDiv = document.createElement("div");
                mapDiv.setAttribute("style", "width:300px; height: 300px; margin: 0 auto");
                this.mainDiv.appendChild(mapDiv);
                const latitude = parseFloat(action.latitude);
                const longitude = parseFloat(action.longitude);
                const map = L.map(mapDiv).setView([latitude, longitude], parseInt(action.zoom, 10));
                L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                    attribution: "",
                    maxZoom: parseInt(action.zoom, 10)
                }).addTo(map);
                L.marker([51.5, -0.09]).addTo(map)
                    .bindPopup("Here")
                    .openPopup();
            }
        }
    }

    public clear(): void {
        while (this.mainDiv.hasChildNodes()) {
            this.mainDiv.removeChild(this.mainDiv.lastChild);
        }
    }

    private removeLinks(text: string): string {
        return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
    }
}
