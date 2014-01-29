//#####################################################
//#####################################################
/*
 * Abstract Point Construct
 * @author shamangeorge
 */
function Point(x, y, z)
{
	this.x = ( typeof x == "undefined") ? 0 : x;
	this.y = ( typeof y == "undefined") ? 0 : y;
	this.z = ( typeof z == "undefined") ? 0 : z;
}

Point.prototype.getCoords = function()
{
	var pointCoords = new Array();
	pointCoords[0] = this.x;
	pointCoords[1] = this.y;
	pointCoords[2] = this.z;
	return pointCoords;
}; 