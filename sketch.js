


function setup() {
	createCanvas(windowWidth, windowHeight);

	game = new Game();

	windowResized();

	//frameRate(1);
}

function draw() {

	/*
	let randomDir = int(random(0, 20));
	if (randomDir == 0) {
		game.swipe("up");
	} else if (randomDir == 1) {
		game.swipe("down");
	} else if (randomDir == 2) {
		game.swipe("left");
	} else if (randomDir == 3) {
		game.swipe("right");
	}
	*/

	if (game.animationFinished && game.dirArray.length) {
		game.swipe(game.dirArray[0]);
		game.dirArray.shift();
	}

	game.draw();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	game.windowResized();
}

function keyPressed() {
	if (keyIsDown(CONTROL)) {
		let add = !keyIsDown(SHIFT);
		if (keyCode == UP_ARROW) {
			game.addDeleteRow("top", add);
		} else if (keyCode == DOWN_ARROW) {
			game.addDeleteRow("bottom", add);
		} else if (keyCode == LEFT_ARROW) {
			game.addDeleteRow("left", add);
		} else if (keyCode == RIGHT_ARROW) {
			game.addDeleteRow("right", add);
		}
	} else {
		if (keyCode == UP_ARROW) {
			game.dirArray.push("up");
		} else if (keyCode == DOWN_ARROW) {
			game.dirArray.push("down");
		} else if (keyCode == LEFT_ARROW) {
			game.dirArray.push("left");
		} else if (keyCode == RIGHT_ARROW) {
			game.dirArray.push("right");
		}
	}
}