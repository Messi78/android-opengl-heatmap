var Heights;

Heights = (function() {
  function Heights(heatmap, gl, width, height) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.shader = new Shader(this.gl, {
      vertex: "attribute vec4 position, intensity;		\n" +
			"varying vec2 off, dim;						\n" +
			"varying float vIntensity;					\n" +
			"uniform vec2 viewport;						\n" +
			"											\n" +
			"void main(){								\n" +
			"    dim = abs(position.zw);				\n" +
			"    off = position.zw;						\n" +
			"    vec2 pos = position.xy + position.zw;	\n" +
			"    vIntensity = intensity.x;				\n" +
			"    gl_Position = vec4((pos/viewport)*2.0-1.0, 0.0, 1.0);\n" +
			"}",
      fragment: "#ifdef GL_FRAGMENT_PRECISION_HIGH			\n" +
			"    precision highp int;					\n" +
			"    precision highp float;					\n" +
			"#else										\n" +
			"    precision mediump int;					\n" +
			"    precision mediump float;				\n" +
			"#endif										\n" +
			"varying vec2 off, dim;						\n" +
			"varying float vIntensity;					\n" +
			"void main(){								\n" +
			"    float falloff = (1.0 - smoothstep(0.0, 1.0, length(off/dim)));\n" +
			"    float intensity = falloff*vIntensity;	\n" +
			"    gl_FragColor = vec4(intensity);		\n" +
			"}"
    });
    this.nodeBack = new Node(this.gl, this.width, this.height);
    this.nodeFront = new Node(this.gl, this.width, this.height);
    this.vertexBuffer = this.gl.createBuffer();
    var vertexSize = 8;
    this.vertexBufferData = new Float32Array(vertexSize * 6);	
    this.bufferIndex = 0;
    this.pointCount = 0;
  }

  Heights.prototype.update = function() {
    if (this.pointCount > 0) {
      this.gl.enable(this.gl.BLEND);
      this.nodeFront.use();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexBufferData, this.gl.STREAM_DRAW);
//      var positionLoc = this.shader.attribLocation('position');
//      var intensityLoc = this.shader.attribLocation('intensity');
      this.gl.enableVertexAttribArray(1);
      this.gl.vertexAttribPointer(0, 4, this.gl.FLOAT, false, 8 * 4, 0 * 4);
      this.gl.vertexAttribPointer(1, 4, this.gl.FLOAT, false, 8 * 4, 4 * 4);
      this.shader.use().vec2('viewport', this.width, this.height);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.pointCount * 6);
      this.gl.disableVertexAttribArray(1);
      this.pointCount = 0;
      this.bufferIndex = 0;
      this.nodeFront.end();
      return this.gl.disable(this.gl.BLEND);
    }
  };

  Heights.prototype.clear = function() {
    this.nodeFront.use();
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    return this.nodeFront.end();
  };

  Heights.prototype.swap = function() {
    var tmp = this.nodeFront;
    this.nodeFront = this.nodeBack;
    return this.nodeBack = tmp;
  };

  Heights.prototype.addVertex = function(x, y, xs, ys, intensity) {
    this.vertexBufferData[this.bufferIndex++] = x;
    this.vertexBufferData[this.bufferIndex++] = y;
    this.vertexBufferData[this.bufferIndex++] = xs;
    this.vertexBufferData[this.bufferIndex++] = ys;
    this.vertexBufferData[this.bufferIndex++] = intensity;
    this.vertexBufferData[this.bufferIndex++] = intensity;
    this.vertexBufferData[this.bufferIndex++] = intensity;
    return this.vertexBufferData[this.bufferIndex++] = intensity;
  };

  Heights.prototype.addPoint = function(x, y, size, intensity) {
    if (this.pointCount >= 1) {
      this.update();
    }
    y = this.height - y;
    var s = size / 2;
    this.addVertex(x, y, -s, -s, intensity);
    this.addVertex(x, y, +s, -s, intensity);
    this.addVertex(x, y, -s, +s, intensity);
    this.addVertex(x, y, -s, +s, intensity);
    this.addVertex(x, y, +s, -s, intensity);
    this.addVertex(x, y, +s, +s, intensity);
    return this.pointCount += 1;
  };

  return Heights;

})();