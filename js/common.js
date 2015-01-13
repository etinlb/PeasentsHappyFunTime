// Setup requestAnimationFrame and cancelAnimationFrame for use in the game code
(function() {
    var lastTime = 0;
    var vendors = ['ms', ';', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


var Loader = function(id) {
  this.loaded = true;
  this.loadedCount = 0;
  this.totalCount = 0;
  this.soundFileExtn = ".ogg";
  this.loadingScreenId = id
  // console.log(self);
}

Loader.prototype = {
  init: function() {
    var mp3Support, oggSupport;
    var audio = document.createElement('audio');
    if (audio.canPlayType) {
      mp3Support = "" != audio.canPlayType('audio/mpeg');
      oggSupport = "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
    } else {
      //The audio tag is not supported 
      mp3Support = false;
      oggSupport = false;
    }
    this.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
  },
  loadElement: function() {
    this.totalCount++;
    this.loaded = false;
    console.log("showing");
    $(this.loadingScreenId).show();
  },
  loadImage: function(url) {
    this.loadElement();
    var image = new Image();
    image.src = url;
    image.onload = this.itemLoaded.bind(this);
    return image
  },
  loadSound: function(url) {
    this.loadElement();
    var audio = new Audio();
    audio.src = url + loader.soundFileExtn;
    audio.addEventListener("canplaythrough", loader.itemLoaded, false);
    return audio;
  },
  itemLoaded: function() {
    this.loadedCount++;

    // console.log(this);
    $('#loadingmessage').html('Loaded ' + this.loadedCount + ' of ' + this.totalCount);
    if (this.loadedCount === this.totalCount) {
      this.loaded = true // finished loading
      $(this.loadingScreenId).hide();
      if (this.onload) {
        this.onload();
        this.onload = undefined;
      }
    }
  }
};