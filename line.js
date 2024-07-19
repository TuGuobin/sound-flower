class Line {
    constructor(startX, startY, endX, endY, color = 'black', width = 0.5, opacity = 1) {
        this.color = color;
        this.width = width;
        this.opacity = opacity;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width * dpr;
        ctx.globalAlpha = this.opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.closePath();
    }

    set(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
}