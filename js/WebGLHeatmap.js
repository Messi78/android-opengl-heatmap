var WebGLHeatmap;

WebGLHeatmap = (function() {
  function WebGLHeatmap(_arg) {
    this.canvas = _arg.canvas;
    try {
      this.gl = this.canvas.getContext('experimental-webgl', {
        depth: false,
        antialias: false
      });
      if (this.gl === null) {
        this.gl = this.canvas.getContext('webgl', {
          depth: false,
          antialias: false
        });
        if (this.gl === null) {
          throw 'WebGL not supported';
        }
      }
    } catch (_error) {
      throw 'WebGL not supported';
    }
    this.gl.enableVertexAttribArray(0);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
    var getColorFun =
				"vec3 getColor(float intensity){\n" +
				"    vec3 blue   = vec3(0.0, 0.0, 1.0);\n" +
				"    vec3 cyan   = vec3(0.0, 1.0, 1.0);\n" +
				"    vec3 green  = vec3(0.0, 1.0, 0.0);\n" +
				"    vec3 yellow = vec3(1.0, 1.0, 0.0);\n" +
				"    vec3 red    = vec3(1.0, 0.0, 0.0);\n" +
				"    \n" +
				"    vec3 color = (\n" +
				"        fade(-0.25, 0.25, intensity)*blue +\n" +
				"        fade(  0.0,  0.5, intensity)*cyan +\n" +
				"        fade( 0.25, 0.75, intensity)*green +\n" +
				"        fade(  0.5,  1.0, intensity)*yellow +\n" +
				"        smoothstep(0.75, 1.0, intensity)*red\n" +
				"    );\n" +
				"    return color;\n" +
				"}";
	var output = 
		"vec4 alphaFun(vec3 color, float intensity){\n" +
		"    float alpha = smoothstep(0.0, 1.0, intensity);\n" +
		"    return vec4(color*alpha, alpha);\n" +
		"}";
    this.shader = new Shader(this.gl, {
      vertex: vertexShaderBlit,
      fragment: fragmentShaderBlit + (
				"float linstep(float low, float high, float value){\n" +
				"    return clamp((value-low)/(high-low), 0.0, 1.0);\n" +
				"}\n" +
				"\n" +
				"float fade(float low, float high, float value){\n" +
				"    float mid   = (low+high)*0.5;\n" +
				"    float range = (high-low)*0.5;\n" +
				"    float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);\n" +
				"    return smoothstep(0.0, 1.0, x);\n}\n" +
				"\n" + getColorFun + "\n" + output + "\n" +
				"\n" +
				"void main(){\n" +
				"    float intensity = smoothstep(0.0, 1.0, texture2D(source, texcoord).r);\n" +
				"    vec3 color = getColor(intensity);\n" +
				"    gl_FragColor = alphaFun(color, intensity);\n" +
				"}")
    });
    if (this.width == null) {
      this.width = this.canvas.offsetWidth || 2;
    }
    if (this.height == null) {
      this.height = this.canvas.offsetHeight || 2;
    }
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.gl.viewport(0, 0, this.width, this.height);
    this.quad = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad);
    var quad = new Float32Array([-1, -1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 0, 1, 1, 1, 0, 1]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, quad, this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.heights = new Heights(this, this.gl, this.width, this.height);
  }

  WebGLHeatmap.prototype.display = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad);
    this.gl.vertexAttribPointer(0, 4, this.gl.FLOAT, false, 0, 0);
    this.heights.nodeFront.bind(0);
    this.shader.use().int('source', 0);
    return this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  };

  WebGLHeatmap.prototype.update = function() {
    return this.heights.update();
  };

  WebGLHeatmap.prototype.clear = function() {
    return this.heights.clear();
  };

  WebGLHeatmap.prototype.addPoint = function(x, y, size, intensity) {
    return this.heights.addPoint(x, y, size, intensity);
  };

  return WebGLHeatmap;

})();