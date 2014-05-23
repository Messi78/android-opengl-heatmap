var vertexShaderBlit = 
		"attribute vec4 position;				\n" +
		"varying vec2 texcoord;					\n" +
		"void main(){							\n" +
		"    texcoord = position.xy*0.5+0.5;	\n" +
		"    gl_Position = position;			\n" +
		"}";	
var fragmentShaderBlit =
		"#ifdef GL_FRAGMENT_PRECISION_HIGH		\n" +
		"    precision highp int;				\n" +
		"    precision highp float;				\n" +
		"#else									\n" +
		"    precision mediump int;				\n" +
		"    precision mediump float;			\n" +
		"#endif									\n" +
		"uniform sampler2D source;				\n" +
		"varying vec2 texcoord;";	

var a;

window.createWebGLHeatmap = function(params) {
	a = new WebGLHeatmap(params)
  return a;
};