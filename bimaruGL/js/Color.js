//#####################################################
//#####################################################
/*
 * Abstract Color Construct
 * @author shamangeorge
 */
function Color(red, green, blue, alpha)
{
	this.red = red;
	this.green = green;
	this.blue = blue;
	this.alpha = ( typeof alpha == "undefined") ? 1 : alpha;
}

Color.prototype.getRGBA = function()
{
	var rgba = new Array();
	rgba[0] = this.red;
	rgba[1] = this.green;
	rgba[2] = this.blue;
	rgba[3] = this.alpha;
	return rgba;
};

Color.prototype.compareWith = function(otherColor)
{
	var otherColorRGBA = otherColor.getRGBA();
	var thisColorRGBA = this.color.getRGBA();
	if (otherColorRGBA[0] === thisColorRGBA[0] && otherColorRGBA[1] === thisColorRGBA[1] && otherColorRGBA[2] === thisColorRGBA[2] && otherColorRGBA[3] === thisColorRGBA[3])
	{
		return true;
	}
	return false;
};
