class Road {
  constructor(x, width, laneCount = 3) {
    //x: The center x position of the road.
    // width: The total width of the road.
    // laneCount: Number of lanes (default is 3 if not provided).

    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    // Calculates the left and right borders of the road based on the center position x and total width.
    this.left = x - width / 2;
    this.right = x + width / 2;

    // to make the road infinity (i used a big number because its better in drawing)
    const infinity = 1000000;
    // (Y) in computers grows downwards
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex) {
    // Calculates the width of each lane.
    const laneWidth = this.width / this.laneCount;
    return (
      this.left + // Start from the left edge of the road
      laneWidth / 2 + //Move to the center of the first lane
      Math.min(laneIndex, this.laneCount - 1) * laneWidth // Shift by lane index
    );
    // The Math.min ensures that if laneIndex is too large, it doesn't go beyond the rightmost lane.
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    // This loop calculates and draws vertical lines for both road borders and lane dividers.
    // i = 0: Draws the left border of the road.
    // i = this.laneCount: Draws the right border.
    // Values in between: Draw the lane dividers.
    for (let i = 1; i <= this.laneCount - 1; i++) {
      // Calculates the horizontal x position for each line.
      // lerp() (Linear Interpolation) finds the exact position between left and right based on t = i / this.laneCount.
      // ex: If laneCount = 3, i will go from 0 to 3:
      // i=0 → x = left (left border), i=1 → x = left + 1/3 width (1st divider), i=2 → x = left + 2/3 width (2nd divider), i=3 → x = right (right border)

      const x = lerp(this.left, this.right, i / this.laneCount);

      // Applies dashed lines **only to the internal lane dividers** (not the outer borders).
      // else` For `i = 0` (left border) and `i = this.laneCount` (right border), draw **solid lines**.

      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
