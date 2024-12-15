import { Graphics } from 'pixi.js';

export class MapItem {
    constructor(id, x, y, color = 0xff0000) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(container, x, y, cellWidth, cellHeight) {
        const graphic = new Graphics();
        graphic.beginFill(this.color);
        // Rysujemy kwadrat reprezentujący obiekt w komórce mapy
        graphic.drawRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        graphic.endFill();

        container.addChild(graphic);
    }
}