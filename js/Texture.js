var Texture;

Texture = (function() {
  function Texture(gl) {
    this.gl = gl;
    this.channels = this.gl.RGBA;
	this.type = this.gl.UNSIGNED_BYTE;
    this.target = this.gl.TEXTURE_2D;
    this.handle = this.gl.createTexture();
  }

  Texture.prototype.destroy = function() {
    return this.gl.delteTexture(this.handle);
  };

  Texture.prototype.bind = function(unit) {
    if (unit > 15) {
      throw 'Texture unit too large: ' + unit;
    }
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.target, this.handle);
    return this;
  };

  Texture.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
    this.gl.texImage2D(this.target, 0, this.channels, this.width, this.height, 0, this.channels, this.type, null);
    return this;
  };

  Texture.prototype.nearest = function() {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    return this;
  };

  Texture.prototype.clampToEdge = function() {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    return this;
  };

  return Texture;

})();
