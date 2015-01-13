// Primitive rect object. Trying to emulate pygame rect as I like it
function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.orientation = 0;
}

Rect.prototype = {
  center: function() {
    return {
      'x': this.centerx(),
      'y': this.centery()
    }
  },

  centerx: function() {
    return this.x + this.width / 2
  },

  centery: function() {
    return this.y + this.height / 2
  },

  left: function() {
    return this.x;
  },

  right: function() {
    return this.x + this.width;
  },

  top: function() {
    return this.y;
  },

  bottom: function() {
    return this.y + this.height;
  },

  topleft: function() {
    return {
      'x': this.x,
      'y': this.y
    }
  },

  bottomleft: function() {
    return {
      'x': this.x,
      'y': this.bottom()
    }
  },

  topright: function() {
    return {
      'x': this.right(),
      'y': this.y
    }
  },

  bottomright: function() {
    return {
      'x': this.right(),
      'y': this.bottom
    }
  },
  
  draw: function(ctx) {
    /**
     * primative draw function.
     */
    // 
  }
};