function Mouse () {
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
}

Mouse.prototype = {
    click:function(ev,rightClick){
        // Player clicked inside the canvas
    },

    draw:function(context){
        if(this.dragSelect){    
            // console.
            var x = Math.min(this.gameX,this.dragX);
            var y = Math.min(this.gameY,this.dragY);
            var width = Math.abs(this.gameX-this.dragX)
            var height = Math.abs(this.gameY-this.dragY)
            context.strokeStyle = 'white';
            context.strokeRect(x,y, width, height);
        }  
        context.strokeStyle = 'white';
        context.strokeRect(this.x, this.y, 5, 5);

    },
	calculateGameCoordinates:function(offsetX, offsetY){
        // console.log(this);
        var gridSize = 20; // Grid size is just a way to get which tile you are on
		this.gameX = this.x + offsetX ;
		this.gameY = this.y + offsetY;

		this.gridX = Math.floor((this.gameX) / gridSize); // do something with gridSize
		this.gridY = Math.floor((this.gameY) / gridSize);	
	},
    init:function(canvasId){
        var $mouseCanvas = $(canvasId);
        // console.log($mouseCanvas);
        var self = this; // 'save' context

        $mouseCanvas.mousemove(function(ev) {

            var offset = $mouseCanvas.offset();
            self.x = ev.pageX - offset.left;
            // co
            self.y = ev.pageY - offset.top;  
            // console.log(this);
            // console.log(self);
            
            self.calculateGameCoordinates(0, 0);
            if (self.buttonPressed){
                if  ((Math.abs(self.dragX - self.gameX) > 4 || Math.abs(self.dragY - self.gameY) > 4)){
                        self.dragSelect = true
                }
            } else {
                self.dragSelect = false;
            }                     
        });
        
        $mouseCanvas.click(function(ev) {
            self.click(ev,false);
            self.dragSelect = false;      
            return false;
        });
        
        $mouseCanvas.mousedown(function(ev) {
            if(ev.which == 1){
                self.buttonPressed = true;
                self.dragX = self.gameX;
                self.dragY = self.gameY;
                ev.preventDefault();
            }
            return false;
        });
        
        $mouseCanvas.bind('contextmenu',function(ev){
            self.click(ev,true);
            return false;
        });
        
        $mouseCanvas.mouseup(function(ev) {
            var shiftPressed = ev.shiftKey;
            if(ev.which==1){
                //Left key was released                
                self.buttonPressed = false;
                self.dragSelect = false;
            }
            return false;
        });
        
        // $mouseCanvas.mouseleave(function(ev) {
        //     mouse.insideCanvas = false;
        // });
        
        // $mouseCanvas.mouseenter(function(ev) {
        //     mouse.buttonPressed = false;
        //     mouse.insideCanvas = true;
        // });
    }
}
