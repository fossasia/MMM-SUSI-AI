/**
 * Created by betterclever on 12/7/17.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {MapView} from "./components/map-view";
import {IRssProps} from "./components/rss-card";
import {RSSFeed} from "./components/rss-feed";
import {TableView} from "./components/table-view";

export class ResponseUI {

    public mainDiv: HTMLDivElement;

    constructor(mainDiv: HTMLDivElement) {
        this.mainDiv = mainDiv;
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

        if (susiResponse === null) {
            this.mainDiv.className = "thin bright";
            const node = document.createTextNode("Sorry! I couldn't recognize. Please try again.");
            this.mainDiv.appendChild(node);
            return;
        }

        const actions: Array<any> = susiResponse.answers[0].actions;
        for (const action of actions) {

            if (action.type === "answer") {

                this.mainDiv.className = "thin bright";
                const filteredText = this.removeLinks(action.expression);
                const node = document.createTextNode(filteredText);
                this.mainDiv.appendChild(node);

            } else if (action.type === "map") {

                const mapDiv = document.createElement("div");
                mapDiv.className = "map-div";
                this.mainDiv.appendChild(mapDiv);
                ReactDOM.render(<MapView longitude={parseFloat(action.longitude)}
                                         latitude={parseFloat(action.latitude)}
                                         zoom={parseInt(action.zoom, 10)}/>, mapDiv);

            } else if (action.type === "rss") {

                const rssFeeds = this.getRSSFeed(susiResponse.answers[0].data);
                const rssDiv = document.createElement("rssDiv");
                this.mainDiv.appendChild(rssDiv);
                ReactDOM.render(<RSSFeed feeds={rssFeeds}/>, rssDiv);

            } else if (action.type === "table") {
                const tableData = this.getTableData(susiResponse.answers[0].data, action.columns);
                const tableDiv = document.createElement("tableDiv");
                this.mainDiv.appendChild(tableDiv);
                ReactDOM.render(<TableView data={tableData} columns={action.columns}/>, tableDiv);
            }
        }
    }

    public showError(): void {
        this.clear();
        this.mainDiv.className = "thin bright";
        const node = document.createTextNode("There seems to be some problem. Ask me later.");
        this.mainDiv.appendChild(node);
    }

    public clear(): void {
        while (this.mainDiv.hasChildNodes()) {
            this.mainDiv.removeChild(this.mainDiv.lastChild);
        }
    }

    private getRSSFeed(data: Array<any>): Array<IRssProps> {
        return data.map((datum) => {
            return {title: datum.title, description: datum.description, link: datum.link};
        });
    }

    private getTableData(data: Array<any>, columns: any): Array<any> {
        const allowed = Object.keys(columns);
        console.log("allowed", allowed);
        return data.map((datum) => {
            return Object.keys(datum)
                .filter((key) => allowed.includes(key))
                .reduce((obj, key) => {
                    obj[key] = datum[key];
                    return obj;
                }, {});
        });
    }

    private removeLinks(text: string): string {
        return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
    }
}
