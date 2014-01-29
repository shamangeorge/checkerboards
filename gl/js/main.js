var gl;
var shaderProgram;
var pMatrix = mat4.create();

function initGL(canvas) {
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        return;
    }

    gl.clearColor(0.5, 0.5, 0.0, 1.0);

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    mat4.ortho(0, gl.viewportWidth, 0, gl.viewportHeight, -1, 1, pMatrix);
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;

    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }

        k = k.nextSibling;
    }

    var shader;

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionLoc = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionLoc);

    shaderProgram.vertexColorLoc = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorloc);

    shaderProgram.pMatrixLoc = gl.getUniformLocation(shaderProgram, "uPMatrix");
}

function checkerboard(size, startX, startY) {
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            var x1 = startX + i * size;
            var y1 = startY + j * size;
            var x2 = x1 + size;
            var y2 = y1 + size;
            var color = (i + j) % 2 ? new Color(0.8, 0.8, 0.8) : new Color(0.2, 0.2, 0.2);

            DrawUtils.drawRect(new Point(x1, y1), new Point(x2, y2), color, gl, shaderProgram.vertexPositionLoc, shaderProgram.vertexColorLoc);
        }
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(shaderProgram.pMatrixLoc, false, pMatrix);

    checkerboard(60, 10, 10);
}

function webGLStart() {
    var canvas = document.getElementById("webgl_canvas");
    initGL(canvas);
    initShaders();

    render();
}

webGLStart();