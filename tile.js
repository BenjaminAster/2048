class Tile {
	constructor(uX, uY, startPowerOf2) {
		this.uX = uX;
		this.uY = uY;
		this.prevUX = this.uX;
		this.prevUY = this.uY;
		this.powerOf2 = startPowerOf2;
		//this.number = pow(2, this.powerOf2);
		this.changeNumber = false;
		this.animationState = 1.0;
		this.animationTime = game.animationTime;
		this.update();

		this.siblingTile = null;
	}

	isAnimationFinished() {
		return this.animationState == 1;
	}

	update() {
		this.pX = this.uX * game.tileSize;
		this.pY = this.uY * game.tileSize;
		this.pWid = game.tileSize;
		this.pHei = game.tileSize;

		this.borderThickness = game.border / 2;
	}

	move(uX, uY) {
		this.prevUX = this.uX;
		this.prevUY = this.uY;
		this.uX = uX;
		this.uY = uY;
		this.pX = this.uX * game.tileSize;
		this.pY = this.uY * game.tileSize;
		this.animationState = 0.0;
		//this.animationTime = dist(this.prevUX, this.prevUY, this.uX, this.uY) * game.animationTime;
	}

	show(layer) {
		if (layer == 0) {
			if (this.animationState != 1.0) {
				this.animationState += 1000 / frameRate() / this.animationTime;
				this.animationState = constrain(this.animationState, 0, 1);
				this.pX = lerp(this.prevUX, this.uX, this.animationState) * game.tileSize;
				this.pY = lerp(this.prevUY, this.uY, this.animationState) * game.tileSize;
			}
			noStroke();
			let p2 = this.powerOf2;
			colorMode(HSB, 255);
			fill(
				(this.powerOf2 * 32) % 256,
				155 + sin(p2 * 13472356) * 50,
				255
			);
			colorMode(RGB, 255);

			rect(this.pX + game.border,
				this.pY + game.border,
				this.pWid - game.border * 2,
				this.pHei - game.border * 2,
				game.borderRadius);
		}
		else if (layer == 1) {
			noStroke();
			fill(0x00);
			rect(this.pX + game.border + this.borderThickness,
				this.pY + game.border + this.borderThickness,
				this.pWid - (game.border + this.borderThickness) * 2,
				this.pHei - (game.border + this.borderThickness) * 2,
				game.borderRadius - this.borderThickness * 0.8);
		}
		else if (layer == 2) {
			noStroke();
			fill(0xff);
			textAlign(CENTER, CENTER);
			textStyle(BOLD);
			textSize(game.tileSize / 3);
			if (textWidth(pow(2, this.powerOf2)) > game.tileSize * 0.8) {
				textSize((game.tileSize * game.tileSize / 4) / textWidth(pow(2, this.powerOf2)));
			}
			text(pow(2, this.powerOf2), this.pX + game.tileSize / 2, this.pY + game.tileSize / 2);
		}
	}
}