/**
 * Created by betterclever on 7/4/17.
 */

export class SusiVisualizer {

    private drawingContext: CanvasRenderingContext2D;
    private delta = 0;
    private animationRate = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.drawingContext = canvas.getContext("2d");
    }

    public start(): void {
        this.draw();
    }

    public setMode(type: NotificationType): void {
        switch (type) {
            case "idle":
                this.animationRate = 0.0;
                break;
            case "speak":
                this.animationRate = 0.01;
                break;
            case "busy":
                this.animationRate = 0.01;
                break;
            case "recognized":
                this.animationRate = 0.02;
                break;
            case "listening":
                this.animationRate = 0.01;
                break;
        }
    }

    private draw(): void {

        const canvas = this.drawingContext.canvas;
        const ctx = this.drawingContext;

        this.drawingContext.clearRect(0, 0, this.drawingContext.canvas.width,
            this.drawingContext.canvas.height);

        this.delta += this.animationRate;

        ctx.fillStyle = "#FFF";

        for (let i = 0; i < 40; i++) {
            const x = canvas.width / 2 + Math.sin(i / 40 * 2 * Math.PI + this.delta) * 100;
            const y = 160 + Math.cos(i / 40 * 2 * Math.PI + this.delta) * 100;
            ctx.beginPath();
            if (parseInt((this.delta * 20).toString(), 1) % 40 === i) {
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
            } else {
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
            }
            ctx.fill();
            ctx.closePath();
        }
        requestAnimationFrame(this.draw.bind(this));
    }
}
