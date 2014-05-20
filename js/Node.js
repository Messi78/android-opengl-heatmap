var Node;

Node = (function() {
  function Node(gl, width, height) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.texture = new Texture(this.gl).bind(0).setSize(this.width, this.height).nearest().clampToEdge();
    this.fbo = new Framebuffer(this.gl).bind().color(this.texture).unbind();
  }

  Node.prototype.use = function() {
    return this.fbo.bind();
  };

  Node.prototype.bind = function(unit) {
    return this.texture.bind(unit);
  };

  Node.prototype.end = function() {
    return this.fbo.unbind();
  };

  return Node;

})();