function DrawUtils() {
}

DrawUtils.drawRect = function (p1, p2, c, gl, pLoc, cLoc) {
	var vertices = [
		p1.x, p1.y, 0,
		p1.x, p2.y, 0,
		p2.x, p1.y, 0,
		p2.x, p2.y, 0
	];
	
	var itemSize = 3;
	var numItems = 4;
	
	var posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);	
	gl.vertexAttribPointer(pLoc, itemSize, gl.FLOAT, false, 0, 0);
	
	var colors = [];
	
	for (var i = 0; i < 4; i++) {
		colors.push(c.r, c.g, c.b, c.a);
	}
	
	itemSize = 4;
	
	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);	
	gl.vertexAttribPointer(cLoc, itemSize, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numItems);
}
