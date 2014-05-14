package pyalot.heatmap.opengl;

import org.example.heatmap.MyGLRenderer;

import android.opengl.GLES20;

public class Texture {

	private int channels;
	private int type;
//	private int chancount;
	int target;
	int[] handle;
	private int width;
	private int height;
	
	public Texture(Integer type, String channels) {
// TODO:
		this.channels = GLES20.GL_RGBA;
		//this.channels = this.gl[((_ref = params.channels) != null ? _ref : "rgba").toUpperCase()];
//		if (type != null) {
//			this.type = type;
//		} else {
//			this.type = this.gl[((_ref1 = params.type) != null ? _ref1 : "unsigned_byte").toUpperCase()];
			this.type = GLES20.GL_UNSIGNED_BYTE;
//		}
//	    switch (this.channels) {
//	      case GLES20.GL_RGBA:
//	        this.chancount = 4;
//	        break;
//	      case GLES20.GL_RGB:
//	        this.chancount = 3;
//	        break;
//	      case GLES20.GL_LUMINANCE_ALPHA:
//	        this.chancount = 2;
//	        break;
//	      default:
//	        this.chancount = 1;
//	    }
	    this.target = GLES20.GL_TEXTURE_2D;
	    this.handle = new int[Main.NUM_BUFFER];
	    GLES20.glGenTextures(Main.NUM_BUFFER, this.handle, Main.BUFFER_OFFSET);
	}
	
	void destroy() {
		GLES20.glDeleteTextures(Main.NUM_BUFFER, this.handle, Main.BUFFER_OFFSET);
	}
	
	Texture bind(final int unit) throws RuntimeException {
		if (unit > 15) {
			throw new RuntimeException("Texture unit too large: " + unit);
		}
		GLES20.glActiveTexture(GLES20.GL_TEXTURE0 + unit);
		GLES20.glBindTexture(this.target, this.handle[Main.BUFFER_OFFSET]);
		return this;
	}
	
	Texture setSize(final int width, final int height) {
		this.width = width;
	    this.height = height;
	    GLES20.glTexImage2D(this.target, Main.LEVEL, this.channels, this.width, this.height, 0, this.channels, this.type, null);
MyGLRenderer.checkGlError("glTexImage2D");
	    return this;
	}
	
//	Texture upload(MyData data) {
//		this.width = data.width;
//		this.height = data.height;
//		GLES20.glTexImage2D(this.target, Main.LEVEL, this.channels, this.width, this.height, 0, this.channels, this.type, data.data);
//		return this;
//	}
//	
//	Texture linex() {
//		GLES20.glTexParameteri(this.target, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR);
//		GLES20.glTexParameteri(this.target, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR);
//		return this;
//	}
	
	Texture nearest() {
		GLES20.glTexParameteri(this.target, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_NEAREST);
		GLES20.glTexParameteri(this.target, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_NEAREST);
	    return this;
	  };

	Texture clampToEdge() {
		GLES20.glTexParameteri(this.target, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE);
		GLES20.glTexParameteri(this.target, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE);
		return this;
	};
	
//	Texture repeat() {
//		GLES20.glTexParameteri(this.target, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_REPEAT);
//		GLES20.glTexParameteri(this.target, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_REPEAT);
//		return this;
//	};	
}
