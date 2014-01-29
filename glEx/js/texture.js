function getPowerOfTwo(value, pow)
{
	var pow = pow || 1;
	while (pow < value)
	{
		pow *= 2;
	}
	return pow;
}

function measureText(ctx, textToMeasure)
{
	return ctx.measureText(textToMeasure).width;
}

function createMultilineText(ctx, textToWrite, maxWidth, text)
{
	textToWrite = textToWrite.replace("\n", " ");
	var currentText = textToWrite;
	var futureText;
	var subWidth = 0;
	var maxLineWidth = 0;

	var wordArray = textToWrite.split(" ");
	var wordsInCurrent, wordArrayLength;
	wordsInCurrent = wordArrayLength = wordArray.length;

	while (measureText(ctx, currentText) > maxWidth && wordsInCurrent > 1)
	{
		wordsInCurrent--;
		var linebreak = false;

		currentText = futureText = "";
		for (var i = 0; i < wordArrayLength; i++)
		{
			if (i < wordsInCurrent)
			{
				currentText += wordArray[i];
				if (i + 1 < wordsInCurrent)
				{
					currentText += " ";
				}
			}
			else
			{
				futureText += wordArray[i];
				if (i + 1 < wordArrayLength)
				{
					futureText += " ";
				}
			}
		}
	}
	text.push(currentText);
	maxLineWidth = measureText(ctx, currentText);

	if (futureText)
	{
		subWidth = createMultilineText(ctx, futureText, maxWidth, text);
		if (subWidth > maxLineWidth)
		{
			maxLineWidth = subWidth;
		}
	}

	return maxLineWidth;
}

function drawText(someText, canvas)
{
	var canvasX, canvasY;
	var textX, textY;

	var text = [];
	var textToWrite = someText;

	var maxWidth = 10;

	var squareTexture = true;

	var textHeight = 16;
	var textAlignment = "center";
	var textColour = "black";
	var fontFamily = "monospace";

	var backgroundColour = "lightblue";

	var canvas = document.getElementById(canvas);
	var ctx = canvas.getContext('2d');

	ctx.font = textHeight + "px " + fontFamily;
	if (maxWidth && measureText(ctx, textToWrite) > maxWidth)
	{
		maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);
		canvasX = getPowerOfTwo(maxWidth);
	}
	else
	{
		text.push(textToWrite);
		canvasX = getPowerOfTwo(ctx.measureText(textToWrite).width);
	}
	canvasY = getPowerOfTwo(textHeight * (text.length + 1));
	if (squareTexture)
	{
		(canvasX > canvasY) ? canvasY = canvasX : canvasX = canvasY;
	}
	//document.getElementById('calculatedWidth').value = canvasX;
	//document.getElementById('calculatedHeight').value = canvasY;

	canvas.width = canvasX;
	canvas.height = canvasY;

	switch(textAlignment)
	{
		case "left":
			textX = 0;
			break;
		case "center":
			textX = canvasX / 2;
			break;
		case "right":
			textX = canvasX;
			break;
	}
	textY = canvasY / 2;

	ctx.fillStyle = backgroundColour;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.fillStyle = textColour;
	ctx.textAlign = textAlignment;

	ctx.textBaseline = 'middle';
	// top, middle, bottom
	ctx.font = textHeight + "px " + fontFamily;

	var offset = (canvasY - textHeight * (text.length + 1)) * 0.5;

	for (var i = 0; i < text.length; i++)
	{
		if (text.length > 1)
		{
			textY = (i + 1) * textHeight + offset;
		}
		ctx.fillText(text[i], textX, textY);
	}
}
function handleLoadedTexture(texture, textureCanvas)
{
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);

	gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture(gl)
{
	var canvasTexture;
	canvasTexture = gl.createTexture();
	handleLoadedTexture(canvasTexture, document.getElementById('textureCanvas'));
}