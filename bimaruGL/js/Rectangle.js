//#####################################################
//#####################################################
/*
 * Abstract Rectangle Construct
 * @author shamangeorge
 *
 */
function Rectangle(p1, p2, i, j)
{
	// 1st point defined
	this.p1 = ( typeof p1 == "undefined") ? 0 : p1;
	// 1st points diagonal (2nd point)
	this.p2 = ( typeof p2 == "undefined") ? 0 : p2;
	// Rectangle color (cyan)
	this.color = new Color(0.0, 0.9, 1.0);
	// Give it an id
	this.id = "(" + i + ", " + j + ")";
	// Switch for clicks to change color
	this.colorSwitch = false;
};

/*
 * Returns the boundaries of our rectangle
 * (basically an array of 4 points)
 */
Rectangle.prototype.getCoords = function()
{
	// traversing the rectangle clockwise
	var rectCoords = new Array();
	var point1 = this.p1;
	var point2 = new Point(this.p2.x, this.p1.y);
	var point3 = this.p2;
	var point4 = new Point(this.p1.x, this.p2.y);
	rectCoords.push(point1, point2, point3, point4);
	return rectCoords;
};

/*
 * Returns the color of this
 * rectangle
 */
Rectangle.prototype.getColorRGBA = function()
{
	return this.color.getRGBA();
};
Rectangle.prototype.getColor = function()
{
	return this.color;
};
/*
 * Sets a new color for this
 * rectangle
 */
Rectangle.prototype.setColor = function(color)
{
	this.color = color;
};
Rectangle.prototype.switchColor = function()
{
	if (this.colorSwitch)
	{
		this.setColor(new Color(0.0, 0.9, 1.0, 1.0));
		this.colorSwitch = !this.colorSwitch;
		//console.log("1st case: " + this.colorSwitch);
	}
	else
	{
		this.setColor(new Color(0.0, 0.0, 0.0, 1.0));
		this.colorSwitch = !this.colorSwitch;
		//console.log("2nd case: " + this.colorSwitch);
	}
};

/*
 * Boolean to determine if a point
 * lies within THIS rectangle
 */
Rectangle.prototype.containsPoint = function(point)
{
	if (point.x > this.p1.x && point.x < this.p2.x && point.y < this.p1.y && point.y > this.p2.y)
	{
		return true;
	}
	else
	{
		return false;
	}
};

/*
 * Color Switch values
 *
 */
Rectangle.prototype.getColorSwitchValue = function()
{
	return this.colorSwitch;
};
Rectangle.prototype.setColorSwitchValue = function(boolian)
{
	this.colorSwitch = boolian;
};
/*
 * draw the Rectangle on the Canvas
 */
Rectangle.prototype.draw = function(gl, pLoc, cLoc)
{
	var vertices = [this.p1.x, this.p1.y, 0, this.p1.x, this.p2.y, 0, this.p2.x, this.p1.y, 0, this.p2.x, this.p2.y, 0];

	var itemSize = 3;
	var numItems = 4;

	var posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(pLoc, itemSize, gl.FLOAT, false, 0, 0);

	var colors = [];

	for (var i = 0; i < 4; i++)
	{
		colors.push(this.color.red, this.color.green, this.color.blue, this.color.alpha);
	}

	itemSize = 4;

	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.vertexAttribPointer(cLoc, itemSize, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numItems);
};
