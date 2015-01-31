$(window).load(function() {
  this.game = new Game();
  game.init();
  game.play();
});

var settings = {
  // I'm a settings driven game design guy
  gameCanvasId: 'gamecanvas',
  mouseCanvasId: 'mousecanvas',
  debug: true,
};


function Game() {
  this.loader = new Loader('#loadingscreen')
  this.mouse = new Mouse();
  // this.menu = new Menu();s
  // The map is broken into square tiles of this size (20 pixels x 20 pixels)
  this.gridSize = 20;
  this.width = 800;
  this.height = 600;
  // Store whether or not the background moved and needs to be redrawn
  this.refreshBackground = true;
  // A control loop that runs at a fixed period of time 
  this.animationTimeout = 100; // 100 milliseconds or 10 times a second
  this.offsetX = 0; // X & Y panning offsets for the map
  this.offsetY = 0;
  this.panningThreshold = 60; // Distance from edge of canvas at which panning starts
  this.panningSpeed = 10; // 
  this.running = true;
  this.mapGrid = [];
  console.log(this.mapGrid);

  this.gameObjects = {};
  this.actionQueue = []
    // console.log(this.mouse);
};

Game.prototype = {
  init: function() {
    this.backgroundCanvas = document.getElementById(settings.gameCanvasId);
    this.foregroundCanvas = document.getElementById(settings.mouseCanvasId);
    this.backgroundcontext = this.backgroundCanvas.getContext('2d');
    this.foregroundcontext = this.foregroundCanvas.getContext('2d');
    this.loader.init();
    this.mouse.init('#' + settings.mouseCanvasId); // 
    $('.gamelayer').hide();
    $('#gamestartscreen').show();
    this.state = 0;
    this.running = true;

    // Bind this forever!!!
    this.drawLoop = _.bind(this.drawLoop, this);
    this.gameLoop = _.bind(this.gameLoop, this);
    if (settings.debug) {
      this.debugInit(); // Random function I shove shit in when I'm testing stuff
    }
  },

  gameLoop: function() {
    // do mouse stuff
    if (this.mouse.eventFlag) {
      var mouseEvents = this.mouse.getMouseInfo();
      console.log(mouseEvents);
      if (mouseEvents.drag.length > 0) {
        // should only need the last drag event
        this.selectedObjs = this.selectObjs(mouseEvents.drag[mouseEvents.drag.length - 1]);
      } else if (mouseEvents.rightClick.length > 0 && this.selectedObjs.length > 0) {
        var mouseGridPoint = mouseEvents.rightClick[mouseEvents.rightClick.length - 1];
        for (var i = this.selectedObjs.length - 1; i >= 0; i--) {
          this.selectedObjs[i].giveMoveCommand(mouseGridPoint, this);
        };
      } else if (mouseEvents.click.length > 0) {
        this.getGrid(mouseEvents.click[0]);

      }
    }
    callToNestedObject(this.gameObjects, 'update', this.foregroundcontext);
    // return;
    window.requestAnimationFrame(this.gameLoop); //.bind(this));  
    return;
  },

  drawLoop: function() {
    if (this.running) {

      // fast way to clear the foreground canvas
      this.foregroundCanvas.width = this.foregroundCanvas.width;

      // draw the game objects
      callToNestedObject(this.gameObjects, 'draw', this.foregroundcontext);
      if (settings.debug) {
        this.debugDraw();
      }

      this.mouse.draw(this.foregroundcontext);
      window.requestAnimationFrame(this.drawLoop); //.bind(this));  
    }
  },

  selectObjs: function(selectArea) {
    /**
     * Select any game objects in the selected area. Uses the center of the
     * unit to determine in in the selected area.
     */
    // make a rect to use the contains point function
    var rect = new Rect(selectArea.x, selectArea.y, selectArea.width, selectArea.height);
    var selectedObjs = [];
    for (var i = this.gameObjects['unit'].length - 1; i >= 0; i--) {
      if (rect.containsPoint(this.gameObjects['unit'][i].center())) {
        this.gameObjects['unit'][i].color = "#FF00FF";
        selectedObjs.push(this.gameObjects['unit'][i])
      }
    };
    // for (var i = this.gameObjects['building'].length - 1; i >= 0; i--) {
    //   if(rect.containsPoint(this.gameObjects['building'][i].center())){
    //     this.gameObjects['building'][i].color = "#FF00FF";
    //   }
    // };
    return selectedObjs;
  },

  play: function() {
    this.gameLoop();
    this.drawLoop();
  },
  getGrid: function(point) {
    /**
     * get the grid square of the point
     */
    var x = Math.floor(point.x / this.gridSize);
    var y = Math.floor(point.y / this.gridSize);
    return [x, y]
      // this.mapGrid[y][x] = 1;      
  },

  getCenterOfGrid: function(gridSquare) {
    /**
     * Opposite of getGrid
     */
    var rect = {
      x: 0,
      y: 0
    }
    rect.x = gridSquare.x * this.gridSize + this.gridSize / 2; // get the center
    rect.y = gridSquare.y * this.gridSize + this.gridSize / 2; // get the center
    return rect;
  },


  debugInit: function() {
    // var entity1 = this.createEntity({hp:10}, 
    //  [new Damageable(), new Rect(20, 20, 20, 20), new Unit(), new Attacker()]);
    var entity2 = new Building();
    var entity1 = new AttackUnit();
    var entity3 = new AttackUnit();
    entity3.x = entity1.x + 100;
    console.log(entity2);
    console.log(entity1);
    // entity1.engageSpecific(entity2);
    // this.mapGrid[25][22] = 0;
    var addOne;
    for (var y = 0; y < this.height / this.gridSize; y++) {
      this.mapGrid[y] = [];
      for (var x = 0; x < this.width / this.gridSize; x++) {
        addOne = _.random(0, 100);
        if (addOne > 90) {
          this.mapGrid[y][x] = 1;
        } else {
          this.mapGrid[y][x] = 0;
        }
        // this.mapGrid[y][x] = 0;
        addOne--;
      }
    }
    // var path = AStar(this.mapGrid, this.getGrid(entity1.center()), [35, 0], 'Euclidean');
    // for (var i = 0; i < path.length; i++) {
    //   this.mapGrid[path[i].y][path[i].x] = 2;
    // };
    // var building = new Unit(300, 300, 200, 200);
    // building.color = "#000077";
    this.gameObjects['unit'] = [entity1, entity3]; // entity2];
    this.gameObjects['building'] = [entity2];
    console.log(this.gameObjects)
      // console.log(rect.center());
  },

  debugDraw: function() {
    /**
     * Draw debug stuff.
     */
    for (var y = 0; y < this.mapGrid.length; y++) {
      for (var x = 0; x < this.mapGrid[y].length; x++) {
        this.backgroundcontext.fillStyle = "#ffffff"
        if (this.mapGrid[y][x] == 1) {
          this.backgroundcontext.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
        } else if (this.mapGrid[y][x] == 2) {
          this.backgroundcontext.fillStyle = "#777777"
          this.backgroundcontext.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
        } else {
          this.backgroundcontext.strokeRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
        }
      }
    };

  }



};