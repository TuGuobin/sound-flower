class Line {
    constructor(startX, startY, endX, endY, color = 'black', width = 1, endCircle = false, opacity = 1) {
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
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        if (this.endCircle) {
            ctx.arc(this.endX, this.endY, 2, 0, 2 * Math.PI);
            ctx.arc(this.startX, this.startY, 2, 0, 2 * Math.PI);
            ctx.fillStyle = '#0003';
            ctx.fill();
        }
        ctx.closePath();
    }

    set(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
}