package pyalot.heatmap.opengl;

import java.util.HashMap;
import java.util.Map;

import android.opengl.GLES20;
import android.util.Log;

public class Shader {

//	private Map<String, Integer> attribCache;
	private Map<String, Integer> uniform_cache;
	private Map<String, Integer> value_cache;
	private int program;
	private int vs;
	private int fs;
	
	public Shader(final String vertex, final String fragment) throws RuntimeException {
		this.program = GLES20.glCreateProgram();
		this.vs = GLES20.glCreateShader(GLES20.GL_VERTEX_SHADER);
		//if (this.vs == 0) throw new RuntimeException("Error creating vertex shader.");
		this.fs = GLES20.glCreateShader(GLES20.GL_FRAGMENT_SHADER);
		//if (this.fs == 0) throw new RuntimeException("Error creating fragment shader.");
		GLES20.glAttachShader(this.program, this.vs);
		GLES20.glAttachShader(this.program, this.fs);
// Bind attributes
GLES20.glBindAttribLocation(this.program, 1, Main.VARIABLE_ATTRIBUTE_INTENSITY);
GLES20.glBindAttribLocation(this.program, 0, Main.VARIABLE_ATTRIBUTE_POSITION);

		this.compileShader(this.vs, vertex);
		this.compileShader(this.fs, fragment);
		this.link();
		this.value_cache = new HashMap<String, Integer>();
		this.uniform_cache = new HashMap<String, Integer>();
//		this.attribCache = new HashMap<String, Integer>();
	}

//	public int attribLocation(final String name) {
//		Integer location = this.attribCache.get(name);
//		if (location == null) {
//			location = GLES20.glGetAttribLocation(this.program, name);
//if (location <0 ) {
//	Log.e("attribLocation", "negative location: " + location);
//}
//			this.attribCache.put(name, location);
//		}
//		return location;
//	}

	void compileShader(int shader, String source) throws RuntimeException {
		GLES20.glShaderSource(shader, source);
		GLES20.glCompileShader(shader);
		int[] compileStatus = new int[1];
		GLES20.glGetShaderiv(shader, GLES20.GL_COMPILE_STATUS, compileStatus, 0);
		if (compileStatus[0] == 0) {
			throw new RuntimeException("Shader Compile Error: " + GLES20.glGetShaderInfoLog(shader));
		}
	}
	
	void link() throws RuntimeException {
		GLES20.glLinkProgram(this.program);
		int[] linkStatus = new int[1];
		GLES20.glGetProgramiv(this.program, GLES20.GL_LINK_STATUS, linkStatus, 0);
		if (linkStatus[0] == 0) {
			throw new RuntimeException("Shader Link Error: " + GLES20.glGetProgramInfoLog(this.program));
		}
	}
	
	public Shader use() {
		GLES20.glUseProgram(this.program);
		return this;
	}
	
	int uniformLoc(String name) {
		Integer location = this.uniform_cache.get(name);
		if (location == null) {
			location = GLES20.glGetUniformLocation(this.program, name);
if (location < 0) {
	Log.w("uniformLoc", "location negative:" + location);
}
			this.uniform_cache.put(name, location);
		}
		return location;
	}
	
	Shader _int(final String name, int value) {
		Integer cached = this.value_cache.get(name);
		if ((cached == null) || (cached != value)) {
			this.value_cache.put(name, value);
			int loc = this.uniformLoc(name);
			if (loc >= 0) {
				GLES20.glUniform1i(loc, value);
				//MyGLRenderer.checkGlError("glUniform1i");
			}
		}
		return this;
	}
	
	Shader vec2(String name, float a, float b) {
		int loc = this.uniformLoc(name);
		if (loc >= 0) {
			GLES20.glUniform2f(loc, a, b);
			//MyGLRenderer.checkGlError("glUniform2f");
		}
		return this;
	}
	
//	Shader _float(String name, float value) {
//		float cached = this.value_cache.get(name);
//		if (cached != value) {
//			this.value_cache.put(name, value);
//			Integer loc = this.uniformLoc(name);
//			if (loc != null) {
//				GLES20.glUniform1f(loc, value);
//			}
//		}
//		return this;
//	}
}
