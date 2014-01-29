/*
 * Class Board
 * Defines our Game board and its methods
 * @author shamangeorge
 */
function Board(size, startX, startY, boardSize)
{
	// size of board
	this.size = ( typeof size == "undefined") ? 53 : size;
	this.boardSize = ( typeof size == "undefined") ? 9 : boardSize;
	// array buffer of rectangles on the board
	this.rectangleBuffer = new Array();
	// these are the rows of rectangles within the array buffer
	// this guy is a private class variable used for ease
	this.rectangleBufferRow = new Array();
	// Basic blue color for board (the ocean)
	this.cyanColor = new Color(0.0, 0.9, 1.0, 1.0);
	// Starting position x
	this.startX = ( typeof startX == "undefined") ? 60 : startX;
	// Starting position y
	this.startY = ( typeof startY == "undefined") ? 60 : startY;
	this.solution = [];
	if (Math.random() < 0.5)
	{
		this.solution = [["S", "~", "~", "~", "~", "S", "~", "S", "3"], ["~", "~", "~", "~", "~", "S", "~", "S", "2"], ["~", "~", "~", "~", "~", "~", "~", "~", "0"], ["S", "S", "~", "S", "S", "S", "~", "S", "6"], ["~", "~", "~", "~", "~", "~", "~", "S", "1"], ["S", "~", "~", "~", "~", "~", "~", "S", "2"], ["~", "~", "S", "S", "S", "S", "~", "~", "4"], ["S", "~", "~", "~", "~", "~", "~", "S", "2"], ["4", "1", "1", "2", "2", "4", "0", "6", "0"]];
	}
	else
	{
		this.solution = [["S", "~", "S", "~", "~", "~", "S", "~", "3"], ["S", "~", "S", "~", "S", "~", "~", "~", "3"], ["~", "~", "~", "~", "~", "~", "~", "S", "1"], ["S", "~", "~", "~", "~", "~", "~", "S", "2"], ["~", "~", "~", "~", "~", "~", "~", "S", "1"], ["S", "~", "S", "S", "S", "S", "~", "~", "5"], ["S", "~", "~", "~", "~", "~", "~", "~", "1"], ["~", "~", "S", "~", "S", "S", "S", "~", "4"], ["5", "0", "4", "1", "3", "2", "2", "3", "0"]];
	}
}

Board.prototype.draw = function()
{
	for ( i = 0; i < this.boardSize; i++)
	{
		this.rectangleBufferRow = [];
		for ( j = 0; j < this.boardSize; j++)
		{
			var x1 = this.startX + i * this.size;
			var y1 = this.startY - j * this.size;
			var x2 = x1 + this.size;
			var y2 = y1 - this.size;
			var rectangle = new Rectangle(new Point(x1, y1), new Point(x2, y2), i, j);
			this.rectangleBufferRow.push(rectangle);
			rectangle.draw(gl, shaderProgram.vertexPositionLoc, shaderProgram.vertexColorLoc);
		}
		this.rectangleBuffer.push(this.rectangleBufferRow);
	}
};
/*
 * This is a debbuging board in case you wanna see the different
 * rectangles
 */
Board.prototype.drawChecker = function()
{
	for ( i = 0; i < this.boardSize; i++)
	{
		for ( j = 0; j < this.boardSize; j++)
		{
			var x1 = this.startX + i * this.size;
			var y1 = this.startY - j * this.size;
			var x2 = x1 + this.size;
			var y2 = y1 - this.size;
			var color = (i + j) % 2 ? new Color(0.0, 0.2, 1.0, 1.0) : this.cyanColor;
			var rectangle = new Rectangle(new Point(x1, y1), new Point(x2, y2), i, j);
			rectangle.setColor(color);
			rectangle.draw(gl, shaderProgram.vertexPositionLoc, shaderProgram.vertexColorLoc);
		}
	}
};

/*
 * This draws the Solution Board which should be attached to an
 * eventlistener
 */
Board.prototype.drawSolution = function()
{
	var black = new Color(0.0, 0.0, 0.0, 1.0);
	for ( i = 0; i < this.boardSize; i++)
	{
		for ( j = 0; j < this.boardSize; j++)
		{
			var x1 = this.startX + i * this.size;
			var y1 = this.startY - j * this.size;
			var x2 = x1 + this.size;
			var y2 = y1 - this.size;
			//var color = (i + j) % 2 ? new Color(0.4, 0.4, 0.8, 1.0) : this.cyanColor;
			var rectangle = new Rectangle(new Point(x1, y1), new Point(x2, y2), i, j);

			if (this.solution[i][j] == "S")
			{
				rectangle.setColor(black);

			}
			else
			{
				rectangle.setColor(this.cyanColor);
			}
			rectangle.draw(gl, shaderProgram.vertexPositionLoc, shaderProgram.vertexColorLoc);
		}
	}
};

/*
 * This draws the Current Board indicating the users
 * current mistakes
 */
Board.prototype.drawMistakes = function()
{
	var black = new Color(1.0, 0.0, 0.0, 1.0);
	for ( i = 0; i < this.boardSize; i++)
	{
		for ( j = 0; j < this.boardSize; j++)
		{
			var x1 = this.startX + i * this.size;
			var y1 = this.startY - j * this.size;
			var x2 = x1 + this.size;
			var y2 = y1 - this.size;
			//var color = (i + j) % 2 ? new Color(0.4, 0.4, 0.8, 1.0) : this.cyanColor;
			var rectangle = new Rectangle(new Point(x1, y1), new Point(x2, y2), i, j);

			if (this.solution[i][j] != "S" && this.rectangleBuffer[i][j].getColor().green == 0.0)
			{
				rectangle.setColor(black);

			}
			else
			{
				rectangle.setColor(this.cyanColor);
			}
			rectangle.draw(gl, shaderProgram.vertexPositionLoc, shaderProgram.vertexColorLoc);
		}
	}
};
/*
 * Redraws the board after interaction
 */
Board.prototype.reDraw = function()
{
	for ( i = 0; i < this.rectangleBuffer.length; i++)
	{
		for ( j = 0; j < this.rectangleBuffer.length; j++)
		{
			this.rectangleBuffer[i][j].draw(gl, shaderProgram.vertexPositionLoc, shaderProgram.vertexColorLoc);
		}
	}
};
Board.prototype.drawRowHints = function()
{
	var gameSection = document.getElementById("game");
	for (var i = 0; i < this.boardSize - 1; i++)
	{
		var canvas = document.createElement('canvas');
		canvas.id = "columnHint-" + i;
		canvas.className = "hints";
		var tmpVAR = 80 + i * this.size;
		canvas.style.left = tmpVAR + "px";
		canvas.style.top = "458px";
		gameSection.appendChild(canvas);
		var tmpText = this.solution[i][8];
		drawText(tmpText, canvas.id);
	}
};
Board.prototype.drawColumnHints = function()
{
	var gameSection = document.getElementById("game");
	for (var j = 0; j < this.boardSize - 1; j++)
	{
		var canvas = document.createElement('canvas');
		canvas.id = "rowHint-" + j;
		canvas.className = "hints";
		var tmpVAR = 32 + j * this.size;
		canvas.style.top = tmpVAR + "px";
		canvas.style.left = "506px";
		gameSection.appendChild(canvas);
		var tmpText = this.solution[8][j];
		drawText(tmpText, canvas.id);
	}
};
/*
 * Returns an array buffer with all the rectangles
 * that have been drawn on THIS board
 */
Board.prototype.getRectangleBuffer = function()
{
	return this.rectangleBuffer;
};
/*
 * Returns the rectangle at indexes (i, j) of the rectangle
 * buffer array
 */
Board.prototype.getRectangleAtPosition = function(i, j)
{
	return this.rectangleBuffer[i][j];
};
/*
 * Returns the color of the rectangle at index (i, j) of the
 *  rectangle buffer array
 */
Board.prototype.getRectangleColor = function(i, j)
{
	return this.getRectangleAtPosition[i][j].getColor();
};
Board.prototype.getSolution = function()
{
	switch (this.boardSize)
	{
		case 7:
		{
			if (Math.random() < 0.5)
			{
				this.solution = [["S", "S", "~", "S", "~", "S", "4"], ["~", "~", "~", "~", "~", "~", "0"], ["S", "~", "~", "~", "~", "~", "1"], ["~", "~", "~", "~", "~", "~", "0"], ["S", "~", "~", "S", "S", "S", "4"], ["S", "~", "~", "~", "~", "~", "1"], ["4", "1", "0", "2", "1", "2", "0"]];
			}
			else
			{
				this.solution = [["S", "S", "S", "~", "S", "~", "4"], ["~", "~", "~", "~", "~", "~", "0"], ["S", "~", "~", "~", "~", "~", "1"], ["S", "~", "~", "~", "~", "~", "1"], ["~", "~", "~", "~", "~", "~", "0"], ["S", "~", "S", "~", "S", "S", "4"], ["4", "1", "2", "0", "2", "1", "0"]];
			}
		}
		case 9:
		{
			if (Math.random() < 0.5)
			{
				this.solution = [["S", "~", "~", "~", "~", "S", "~", "S", "3"], ["~", "~", "~", "~", "~", "S", "~", "S", "2"], ["~", "~", "~", "~", "~", "~", "~", "~", "0"], ["S", "S", "~", "S", "S", "S", "~", "S", "6"], ["~", "~", "~", "~", "~", "~", "~", "S", "1"], ["S", "~", "~", "~", "~", "~", "~", "S", "2"], ["~", "~", "S", "S", "S", "S", "~", "~", "4"], ["S", "~", "~", "~", "~", "~", "~", "S", "2"], ["4", "1", "1", "2", "2", "4", "0", "6", "0"]];
			}
			else
			{
				this.solution = [["S", "~", "S", "~", "~", "~", "S", "~", "3"], ["S", "~", "S", "~", "S", "~", "~", "~", "3"], ["~", "~", "~", "~", "~", "~", "~", "S", "1"], ["S", "~", "~", "~", "~", "~", "~", "S", "2"], ["~", "~", "~", "~", "~", "~", "~", "S", "1"], ["S", "~", "S", "S", "S", "S", "~", "~", "5"], ["S", "~", "~", "~", "~", "~", "~", "~", "1"], ["~", "~", "S", "~", "S", "S", "S", "~", "4"], ["5", "0", "4", "1", "3", "2", "2", "3", "0"]];
			}
		}
		case 11:
		{
			if (Math.random() < 0.5)
			{
				this.solution = [["~", "~", "~", "~", "~", "S", "~", "~", "~", "~", "1"], ["S", "~", "S", "S", "~", "~", "~", "~", "~", "~", "3"], ["S", "~", "~", "~", "~", "S", "S", "~", "S", "~", "4"], ["S", "~", "~", "S", "~", "~", "~", "~", "~", "~", "2"], ["~", "~", "~", "S", "~", "~", "~", "~", "~", "~", "1"], ["~", "~", "~", "S", "~", "~", "~", "~", "~", "S", "2"], ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~", "0"], ["~", "~", "~", "~", "~", "~", "S", "S", "~", "~", "2"], ["~", "~", "S", "~", "~", "~", "~", "~", "~", "~", "1"], ["~", "~", "~", "~", "~", "~", "S", "S", "S", "S", "4"], ["3", "0", "2", "4", "0", "2", "3", "2", "2", "2", "0"]];
			}
			else
			{
				this.solution = [["~", "~", "~", "~", "~", "S", "S", "S", "~", "~", "3"], ["~", "S", "S", "S", "~", "~", "~", "~", "~", "~", "3"], ["~", "~", "~", "~", "~", "~", "~", "~", "~", "S", "1"], ["S", "S", "~", "~", "~", "~", "S", "~", "~", "~", "3"], ["~", "~", "~", "~", "S", "~", "S", "~", "~", "~", "2"], ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~", "0"], ["S", "~", "~", "~", "~", "~", "~", "~", "S", "~", "2"], ["S", "~", "~", "~", "~", "~", "~", "~", "S", "~", "2"], ["~", "~", "~", "~", "~", "~", "~", "~", "S", "~", "1"], ["~", "S", "~", "S", "~", "~", "~", "~", "S", "~", "3"], ["3", "3", "1", "2", "1", "1", "3", "1", "4", "1", "0"]];
			}
		}
	}
	return this.solution;
};
