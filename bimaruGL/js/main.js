//* @author shamangeorge

/*
* Globals
*/
//Colors
var CYAN = new Color(0.0, 1.0, 1.0, 1.0), WHITE = new Color(1.0, 1.0, 1.0, 1.0), BLACK = new Color(0.0, 0.0, 0.0, 1.0);
// the canvas
var canvas = document.getElementById("webgl_canvas");
canvas.width = 500;
canvas.height = 500;
//board parameters
var size = 53.2, startX = 10, startY = 490, boardSize = 9;
//9x9 board (room for hints)
var board = new Board(size, startX, startY, boardSize);
// Starting GL context
var gl = WebGLUtils.setupWebGL(canvas);
if (!gl)
{
	alert("NO WEBGL SUPPORT, SORRY");
}
gl.clearColor(0.0, 1.0, 1.0, 1.0);
gl.viewportWidth = canvas.width;
gl.viewportHeight = canvas.height;

// Matrix dunno what is does yet but it works so not touching for now
// more details later
var tmpMatrix = ortho(0, gl.viewportWidth, 0, gl.viewportHeight, -1, 1, pMatrix);
var pMatrix = mat4toArray(tmpMatrix);
pMatrix[3] = 0;
pMatrix[7] = 0;
pMatrix[12] = -1;
pMatrix[13] = -1;
// Get shaders compile them the rest is vague to me still
// more details later
var shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
gl.useProgram(shaderProgram);
shaderProgram.vertexPositionLoc = gl.getAttribLocation(shaderProgram, "aVertexPosition");
gl.enableVertexAttribArray(shaderProgram.vertexPositionLoc);
shaderProgram.vertexColorLoc = gl.getAttribLocation(shaderProgram, "aVertexColor");
gl.enableVertexAttribArray(shaderProgram.vertexColorloc);
shaderProgram.pMatrixLoc = gl.getUniformLocation(shaderProgram, "uPMatrix");
var rectangleBuffer = board.getRectangleBuffer();
//initTexture(gl);

board.drawRowHints();
board.drawColumnHints();
/*
 * Rendering Function
 */
function render()
{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.uniformMatrix4fv(shaderProgram.pMatrixLoc, false, pMatrix);
	board.draw();
}
/*
 * Updates the board based on
 * user interaction
 */
function reRender()
{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.uniformMatrix4fv(shaderProgram.pMatrixLoc, false, pMatrix);
	board.reDraw();
}

var solutionClick = false;
function showSolution()
{
	if (!solutionClick)
	{
		solutionClick = !solutionClick;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.uniformMatrix4fv(shaderProgram.pMatrixLoc, false, pMatrix);
		board.drawSolution();
	}
	else
	{
		solutionClick = !solutionClick;
		reRender();
	}
}

var mistakeClick = false;
function showMistakes()
{
	if (!mistakeClick)
	{
		mistakeClick = !mistakeClick;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.uniformMatrix4fv(shaderProgram.pMatrixLoc, false, pMatrix);
		board.drawMistakes();
	}
	else
	{
		mistakeClick = !mistakeClick;
		reRender();
	}
}

//Callling to render
render();

var button = document.getElementById("show_solution");
button.onclick = function(evt)
{
	showSolution();
};
var button = document.getElementById("show_mistakes");
button.onclick = function(evt)
{
	showMistakes();
};
/*
 * All user interaction here
 */
canvas.addEventListener('click', function(event)
{
	if (event)
	{
		var canvasRect = canvas.getBoundingClientRect();
		var X = event.x - canvasRect.left;
		var Y = event.y - canvasRect.top;
		//console.log("Offset Point: (" + X + ", " + Y + ")");

		// Make event coords and Webgl coords
		// isomorphism
		var xTransform = X;
		var yTransform = -Y - canvasRect.top + 530;
		// Creates abstract point based on the
		// above coords (for event tracking)
		var clickPoint = new Point(xTransform, yTransform);
		// get the array buffer of rectangles currently on
		// the board
		//console.log("Transformed Point: (" + clickPoint.x + ", " + clickPoint.y + ")");
		//console.log("Actual Point: (" + event.x + ", " + event.y + ")");

		//rectangleBuffer = board.getRectangleBuffer();
		// This is our basic game-user interaction
		// i.e switching color per click
		for (var i = 0; i < rectangleBuffer.length - 1; i++)
		{
			for (var j = 0; j < rectangleBuffer.length - 1; j++)
			{
				tmpRect = rectangleBuffer[i][j];
				if (tmpRect.containsPoint(clickPoint))
				{
					//console.log("bingo");
					tmpRect.switchColor();
					reRender();
				}
			}
		}
	}
}, false);