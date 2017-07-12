/**
 * Created by betterclever on 12/7/17.
 */

export class ResponseUI {

    constructor(private mainDiv: HTMLDivElement) {
    }

    public update(text: string): void {
        // TODO: Accept Parsed SUSI Response to show all the interactive results
        // Removing all children
        this.clear();
        this.mainDiv.className = "thin xlarge bright";
        const node = document.createTextNode(text);
        // Add a new Text Node
        this.mainDiv.appendChild(node);
    }

    public clear(): void {
        while (this.mainDiv.hasChildNodes()) {
            this.mainDiv.removeChild(this.mainDiv.lastChild);
        }
    }
}
