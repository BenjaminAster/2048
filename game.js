class Game {
	constructor() {
		this.gridUWid = 4;
		this.gridUHei = 4;
		this.grid = Array(this.gridUHei).fill().map(x => Array(this.gridUWid).fill(null));

		this.animationTime = 400;
		this.tileSet = false;
		this.deletedTiles = [];
		this.animationFinished = true;

		this.dirArray = [];
	}

	windowResized() {
		this.unit = width / 100;

		this.gridPHei = min(height, width * this.gridUHei / this.gridUWid);
		this.gridPWid = min(width, height * this.gridUWid / this.gridUHei);

		this.tileSize = this.gridPWid / this.gridUWid;
		this.border = this.tileSize / 20;
		this.borderRadius = this.tileSize / 14;

		for (let row in this.grid) {
			for (let clm in this.grid[0]) {
				if (this.grid[row][clm] != null) {
					this.grid[row][clm].update();
				}
			}
		}
	}

	newTile() {
		let emptySpots = 0;
		for (let row in this.grid) {
			for (let clm in this.grid[0]) {
				if (this.grid[row][clm] == null) {
					emptySpots++;
				}
			}
		}
		if (emptySpots == 0) {
			//console.log("game over");
			this.grid = Array(this.gridUHei).fill().map(x => Array(this.gridUWid).fill(null));
			this.newTile();
		} else {
			let randX, randY;
			do {
				randX = int(random(0, this.gridUWid));
				randY = int(random(0, this.gridUHei));
			} while (this.grid[randY][randX] != null)
			let startPowerOf2 = (random() < 0.5) ? 1 : 2;
			this.grid[randY][randX] = new Tile(randX, randY, startPowerOf2);
		}
	}

	draw() {
		background(0x00);

		noStroke();
		fill(0x00);
		rect(0, 0, this.gridPWid, this.gridPHei);

		for (let row in this.grid) {
			for (let clm in this.grid[0]) {
				noStroke();
				fill(0x11);
				rect(clm * this.tileSize + this.border,
					row * this.tileSize + this.border,
					this.tileSize - this.border * 2,
					this.tileSize - this.border * 2,
					this.borderRadius);
			}
		}

		this.animationFinished = true;

		for (let row in this.grid) {
			for (let clm in this.grid[0]) {
				if (this.grid[row][clm] != null) {
					this.grid[row][clm].show(0);
					this.animationFinished = this.grid[row][clm].isAnimationFinished() && this.animationFinished;
					if (this.grid[row][clm].isAnimationFinished() && this.grid[row][clm].changeNumber) {
						this.grid[row][clm].powerOf2++;
						this.grid[row][clm].changeNumber = false;
					}
				}
			}
		}

		for (let i = this.deletedTiles.length - 1; i >= 0; i--) {
			this.animationFinished = this.deletedTiles[i].isAnimationFinished() && this.animationFinished;
			if (this.deletedTiles[i].isAnimationFinished()) {
				this.deletedTiles.splice(i, 1);
			} else {
				this.deletedTiles[i].show(0);
			}
		}



		for (let row in this.grid) {
			for (let clm in this.grid[0]) {
				if (this.grid[row][clm] != null) {
					this.grid[row][clm].show(1);
				}
			}
		}
		for (let i in this.deletedTiles) {
			this.deletedTiles[i].show(1);
		}

		for (let row in this.grid) {
			for (let clm in this.grid[0]) {
				if (this.grid[row][clm] != null) {
					this.grid[row][clm].show(2);
				}
			}
		}
		for (let i in this.deletedTiles) {
			this.deletedTiles[i].show(2);
		}


		if (this.animationFinished && !this.tileAdded) {
			this.newTile();
			this.tileAdded = true;
		}
	}

	swipe(dir) {
		if (this.animationFinished) {
			let gridTiles;
			function updateGridTile(clm, row) {
				game.grid[row][clm].move(clm, row);
			}
			if (dir == "up" || dir == "down") {
				gridTiles = Array(this.gridUWid);

				for (let clm in this.grid[0]) {
					gridTiles[clm] = [];
					for (let row in this.grid) {
						if (this.grid[row][clm] != null) {
							gridTiles[clm].push(this.grid[row][clm]);
						}
					}
				}
				this.grid = Array(this.gridUHei).fill().map(x => Array(this.gridUWid).fill(null));
				for (let clm = 0; clm < gridTiles.length; clm++) {
					let prevPowerOf2 = 0;
					for (let row = gridTiles[clm].length - 1; row >= 0; row--) {
						if (gridTiles[clm][row].powerOf2 == prevPowerOf2) {
							this.deletedTiles.unshift(new Tile(gridTiles[clm][row].uX, gridTiles[clm][row].uY, gridTiles[clm][row].powerOf2));
							this.deletedTiles[0].siblingTile = gridTiles[clm][row + 1];
							gridTiles[clm].splice(row, 1);
							gridTiles[clm][row].changeNumber = true;
							prevPowerOf2 = 0;
						} else {
							prevPowerOf2 = gridTiles[clm][row].powerOf2;
						}
					}

					for (let row = 0; row < gridTiles[clm].length; row++) {
						if (dir == "up") {
							this.grid[row][clm] = gridTiles[clm][row];
							updateGridTile(clm, row);
						} else {
							this.grid[this.gridUHei - gridTiles[clm].length + row][clm] = gridTiles[clm][row];
							updateGridTile(clm, this.gridUHei - gridTiles[clm].length + row);
						}
					}

				}
			}

			if (dir == "left" || dir == "right") {
				gridTiles = Array(this.gridUHei);

				for (let row in this.grid) {
					gridTiles[row] = [];
					for (let clm in this.grid[0]) {
						if (this.grid[row][clm] != null) {
							gridTiles[row].push(this.grid[row][clm]);
						}
					}
				}
				this.grid = Array(this.gridUHei).fill().map(x => Array(this.gridUWid).fill(null));
				for (let row = 0; row < gridTiles.length; row++) {
					let prevPowerOf2 = 0;
					for (let clm = gridTiles[row].length - 1; clm >= 0; clm--) {
						if (gridTiles[row][clm].powerOf2 == prevPowerOf2) {
							this.deletedTiles.unshift(new Tile(gridTiles[row][clm].uX, gridTiles[row][clm].uY, gridTiles[row][clm].powerOf2));
							this.deletedTiles[0].siblingTile = gridTiles[row][clm + 1];
							gridTiles[row].splice(clm, 1);
							gridTiles[row][clm].changeNumber = true;
							prevPowerOf2 = 0;
						} else {
							prevPowerOf2 = gridTiles[row][clm].powerOf2;
						}
					}

					for (let clm = 0; clm < gridTiles[row].length; clm++) {
						if (dir == "left") {
							this.grid[row][clm] = gridTiles[row][clm];
							updateGridTile(clm, row);
						} else {
							this.grid[row][this.gridUWid - gridTiles[row].length + clm] = gridTiles[row][clm];
							updateGridTile(this.gridUWid - gridTiles[row].length + clm, row);
						}
					}
				}
			}

			for (let i in this.deletedTiles) {
				this.deletedTiles[i].move(this.deletedTiles[i].siblingTile.uX, this.deletedTiles[i].siblingTile.uY);
			}

			//console.log(gridTiles, dir);
			this.tileAdded = false;
		}
	}

	addDeleteRow(side, add) {
		if (side == "bottom") {
			if (add) {
				this.grid.push(Array(this.gridUWid).fill(null));
				this.gridUHei++;
			} else if (this.grid.length > 1) {
				this.grid.pop();
				this.gridUHei--;
			}
		} else if (side == "top") {
			for (let row of this.grid) {
				for (let tile of row) {
					if (tile && add) {
						tile.uY++;
						tile.prevUY++;
					} else if (tile && this.grid.length > 1) {
						tile.uY--;
						tile.prevUY--;
					}
				}
			}
			if (add) {
				this.grid.unshift(Array(this.gridUWid).fill(null));
				this.gridUHei++;
			} else if (this.grid.length > 1) {
				this.grid.shift();
				this.gridUHei--;
			}
		} else if (side == "right") {
			for (let row of this.grid) {
				add ? row.push(null) : row.pop();
			}
			add ? this.gridUWid++ : this.gridUWid--;
		} else if (side == "left") {
			for (let row of this.grid) {
				for (let tile of row) {
					if (tile) {
						add ? tile.uX++ : tile.uX--;
						add ? tile.prevUX++ : tile.prevUX--;
					}
				}
				add ? row.unshift(null) : row.shift();
			}
			add ? this.gridUWid++ : this.gridUWid--;
		}
		windowResized();
	}

	fillWithTiles() {
		let i = 0;
		for (let row in this.grid) {
			for (let clm in this.grid[0]) {
				let column = (row % 2 == 0) ? clm : this.gridUWid - 1 - clm; 
				this.grid[row][column] = new Tile(column, row, i);
				i++;
			}
		}
		this.grid[0][0] = new Tile(0, 0, 1);
	}

}

let game;