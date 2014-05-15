package pyalot.heatmap.opengl;


public class Node {

	private int width;
	private int height;
	private Texture texture;
	private Framebuffer fbo;
	
	public Node(final int width, final int height) {
		this.width = width;
		this.height = height;
		try {
// TODO:
			this.texture = new Texture(null, null);
			this.texture.bind(Main.BIND_ZERO).setSize(this.width, this.height).nearest().clampToEdge();
//			String floatExt =  this.gl.getFloatExtension({
//				require: ['renderable']
//			});
//			this.texture = new Texture(floatExt.type).bind(0).setSize(this.width, this.height).nearest().clampToEdge();
			this.fbo = new Framebuffer();
			this.fbo.bind().color(this.texture).unbind();
		} catch (RuntimeException e) {
			e.printStackTrace();
		}
	}

	public void use() {
		this.fbo.bind();
	}	
	
	public void bind(final int unit) {
		try {
			this.texture.bind(unit);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}	

	public void end() {
		this.fbo.unbind();
	}

	public void resize(final int width, final int height) {
		this.width = width;
		this.height = height;
		try {
			this.texture.bind(0).setSize(this.width, this.height);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
