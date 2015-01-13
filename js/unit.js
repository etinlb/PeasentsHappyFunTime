function Unit() {
    this.color = "#FF0000";
    // this.rect = new Rect(x, y, width, height);
}

Unit.prototype = {

    click: function(ev, rightClick) {
        // Player clicked inside the canvas
    },

    draw: function(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    },

    update: function() {

    }
}

function Damageable() {}

Damageable.prototype = {
    damage: function(amount) {
        this.hp -= amount;
    }
}

function Attacker() {
    this.delay = 10; // number of frames to wait until able to attack again
    this.attackDistance = 20;
    this.safeDistance = 10; // distance to keep from the 
}

Attacker.prototype = {
    engageClosest: function(entities) {
        /**
         * Find closest entity and set it to the engaged target. Entities is an
         * array of Unit Objects
         */

        // TODO: check if has a proper length
        var closest = entities[0];
        var closestDistance = distance(this, closest);
        for (var i = entities.length - 1; i >= 0; i--) {
            var distance = distance(this, entities[i]);
            if (distance < closestDistance) {
                closest = entities[i];
                closestDistance = distance;
            }
        };
        this.engaged = closest;
    },

    engageSpecific: function(entity) {
        this.engaged = entity;
    },

    moveTowardsEngaged: function() {
        if(distance(this, this.engaged) > this.safeDistance)
            moveTowards(this, this.engaged);    
    },

    attack: function() {
        if (distance(this, this.engaged) < this.attackDistance &&
            this.attackTimer == this.delay) {
            // close enough to attack
            this.engaged.damage()
            this.attackerTimer = 0;
        }
        if (this.attackTimer < this.delay) {
            this.attackTimer++;
        }
    },

    update: function(){
        if(this.engaged){
            this.moveTowardsEngaged();
            this.attack();
        }
    }
}

function distance(point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2.centerx() - point1.centerx();
    xs = xs * xs;

    ys = point2.centery() - point1.centery();
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}

function moveTowards(obj, target) {
    var y = target.y - obj.y;
    var x = target.x - obj.x;
    var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var speed = 1;
    var fullCircle = Math.PI * 2;

    // what's the different between our orientation
    // and the angle we want to face in order to 
    // move directly at our target
    var angle = Math.atan2(y, x);
    var delta = angle - obj.orientation;
    var delta_abs = Math.abs(delta);

    // if the different is more than 180°, convert
    // the angle a corresponding negative value
    if (delta_abs > Math.PI) {
        delta = delta_abs - fullCircle;
    }
    var turnSpeed = 10000;
    // if the angle is already correct,
    // don't bother adjusting
    if (delta !== 0) {
        // do we turn left or right?
        var direction = delta / delta_abs;
        // update our orientation
        obj.orientation += (direction * Math.min(turnSpeed, delta_abs));
    }
    // constrain orientation to reasonable bounds
    obj.orientation %= fullCircle;

    // use orientation and speed to update our position
    obj.x += Math.cos(obj.orientation) * speed;
    obj.y += Math.sin(obj.orientation) * speed;
}