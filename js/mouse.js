function Mouse() {
  // x,y coordinates of mouse relative to top left corner of canvas
  this.x = 0;
  this.y = 0;
  // x,y coordinates of mouse relative to top left corner of game map
  this.gameX = 0;
  this.gameY = 0;
  // game grid x,y coordinates of mouse 
  this.gridX = 0;
  this.gridY = 0;
  // whether or not the left mouse button is currently pressed
  this.buttonPressed = false;
  // whether or not the player is dragging and selecting with the left mouse button pressed
  this.dragSelect = false;
  // whether or not the mouse is inside the canvas region
  this.insideCanvas = false;
  this.eventQueue = {
    click:[],
    move:[],
    up:[]
  };
}

Mouse.prototype = {
  click: function(ev, rightClick) {
    console.log("in click");
    // console.log(this);
    // console.log(this.x);
    // console.log(this.y);
    console.log(rightClick);
    this.dragSelect = false;
    this.eventQueue.click.push([this.x, this.y]);
  },

  mouseMove: function(ev) {
    var offset = this.$mouseCanvas.offset();
    // offset is game world offset
    this.x = ev.pageX - offset.left;
    this.y = ev.pageY - offset.top;

    this.calculateGameCoordinates(0, 0);
    if (this.buttonPressed) {
      if ((Math.abs(this.dragX - this.gameX) > 4 || Math.abs(this.dragY - this.gameY) > 4)) {
        this.dragSelect = true
      }
    } else {
      this.dragSelect = false;
    }
  },

  mouseDown: function(ev) {
    if (ev.which == 1) {
      this.buttonPressed = true;
      this.dragX = this.gameX;
      this.dragY = this.gameY;
      ev.preventDefault();
    }
    return false;
  },

  mouseUp: function(ev) {
    var shiftPressed = ev.shiftKey;
    if (ev.which == 1) {
      //Left key was released                
      this.buttonPressed = false;
      this.dragSelect = false;
    }
    return false;
  },

  clearQueue : function(){
    this.eventQueue = {
      click:[],
      move:[],
      up:[]
    };
  },

  getMouseInfo: function() {
    /**
     * Returns the current state of the mouse
     */
    var queue = this.eventQueue;
    this.clearQueue()
    return queue;
  },

  draw: function(context) {
    if (this.dragSelect) {
      // console.
      var x = Math.min(this.gameX, this.dragX);
      var y = Math.min(this.gameY, this.dragY);
      var width = Math.abs(this.gameX - this.dragX)
      var height = Math.abs(this.gameY - this.dragY)
      context.strokeStyle = 'white';
      context.strokeRect(x, y, width, height);
    }
    context.strokeStyle = 'white';
    context.strokeRect(this.x, this.y, 5, 5);

  },

  calculateGameCoordinates: function(offsetX, offsetY) {
    // console.log(this);
    var gridSize = 20; // Grid size is just a way to get which tile you are on
    this.gameX = this.x + offsetX;
    this.gameY = this.y + offsetY;

    this.gridX = Math.floor((this.gameX) / gridSize); // do something with gridSize
    this.gridY = Math.floor((this.gameY) / gridSize);
  },

  init: function(canvasId, callback) {
    this.$mouseCanvas = $(canvasId);
    // console.log($mouseCanvas);
    var self = this; // Significantly faster than binding to this http://jsperf.com/bind-vs-closure-setup/6

    this.$mouseCanvas.mousemove(function(ev) {
      self.mouseMove(ev);
    });
    this.$mouseCanvas.click(function(ev) {
      self.click(ev, false);
      return false;
    });

    this.$mouseCanvas.mousedown(function(ev) {
      self.mouseDown(ev);
    });

    this.$mouseCanvas.bind('contextmenu', function(ev) {
      self.click(ev, true);
      return false;
    });

    this.$mouseCanvas.mouseup(function(ev) {
      self.mouseUp(ev);
    });

    // this.$mouseCanvas.mouseleave(function(ev) {
    //     mouse.insideCanvas = false;
    // });

    // $mouseCanvas.mouseenter(function(ev) {
    //     mouse.buttonPressed = false;
    //     mouse.insideCanvas = true;
    // });
  }
}