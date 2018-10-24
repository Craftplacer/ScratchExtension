(function(ext) {

    ext._shutdown = function() {};
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };
    ext._stop = function() {
        for (var sound in sounds) {
            sound.pause();
            sound.currentTime = 0;
        }
    };

    var ls = window.localStorage;
    function loadLSVariables() {
      var lsItem = ls['ceVariables'];
      if (lsItem) {
        try {
          return JSON.parse(lsItem);
        } catch (e) {
          ls.removeItem('ceVariables');
        }
      }
      return {};
    }
    function saveLSVariables() {
      var json = JSON.stringify(localStorageVariables);
      ls['ceVariables'] = json;
    }

    var variables = {};
    var localStorageVariables = loadLSVariables();

    var sounds = {};
    var images = {};

    var offscreenCanvas;
    function getCanvas() {
        var canvas = document.getElementById('scratchCanvas');
        if (canvas == null) {
            canvas = document.createElement('canvas');
            canvas.id = 'scratchCanvas';
            canvas.style.position = 'absolute';
            canvas.style.zIndex = 1;
            canvas.style.left = '6px';
            canvas.style.top = '72px';
            canvas.width = 480;
            canvas.height = 360;
            canvas.style.pointerEvents = 'none';
            document.getElementsByClassName('page-scratch')[0].appendChild(canvas);
        }
        return canvas;
    }
    function getContext() {
      return getCanvas().getContext('2d');
    }
    function getOffscreenCanvas() {
      if (offscreenCanvas == null) {
          offscreenCanvas = document.createElement('canvas');
          offscreenCanvas.width = 480;
          offscreenCanvas.height = 360;
      }
      return offscreenCanvas;
    }
    function getOffscreenContext() {
      return getOffscreenCanvas().getContext('2d');
    }

    ext.httpGet = function(method, url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(method, url, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    };
    ext.operation = function(input1,op,input2) {
             if (op == '==')    { return input1 == input2; }
        else if (op == '!=')    { return input1 != input2; }
        else if (op == '>')     { return input1 >  input2; }
        else if (op == '>=')    { return input1 >= input2; }
        else if (op == '<')     { return input1 <  input2; }
        else if (op == '<=')    { return input1 <= input2; }
        else                    { return false; }
    };

    ext.variableGet = function(type, name) {
      if (type == '🐱') {
        return variables[name];
      }
      else if (type == '💾') {
        return localStorageVariables[name];
      }
      return null;
    };
    ext.variableGetBoolean = function(type, name) {
      return ext.variableGet(type, name) == true;
    }
    ext.variableSet = function(type, name, value) {
      if (type == '🐱') {
        variables[name] = value;
      }
      else if (type == '💾') {
        localStorageVariables[name] = value;
        saveLSVariables();
      }
    };
    ext.variableOpertion = function (type, name, op, input) {
        var value = ext.variableGet(type, name);

        //Gurantees de-/incremention of a numeric variable.
        if (!isNaN(value))    { value = parseInt(value); }
        if (!isNaN(input))    { input = parseInt(input); }

        if (op == '++') {
          value = value + input;
        } else if (op == '--') {
          value = value - input;
        }

        ext.variableSet(type,name,value);
    };
    ext.variableDelete = function(type, name) {
      if (type == '🐱') {
        delete variables[name];
      }
      else if (type == '💾') {
        delete localStorageVariables[name];
        saveLSVariables();
      }
    };
    ext.variableExists = function(type, name) {
      if (type == '🐱') {
        return name in variables;
      }
      else if (type == '💾') {
        return name in localStorageVariables;
      }
    };

    ext.inputToBoolean = function (input) {
        input = input.toLowerCase();
        if (input == '1' || input == 'true') {
            return true;
        }
        else {
            return false;
        }
    };
    ext.stringOperation = function(input1, op, input2) {
        if (op == 'ends with')
        {
            return input1.endsWith(input2);
        }
        else if (op == 'contains')
        {
            return input1.includes(input2);
        }
        else if (op == 'starts with')
        {
            return input1.startsWith(input2);
        }
        else
        {
            return null;
        }
    };

    ext.youtube = function(id) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://www.youtube.com/embed/' + id  + '?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1');

        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.zIndex = '2';
        iframe.id = 'scratchYouTubePlayer';

        var element = document.getElementsByClassName('page-scratch')[0];
        element.appendChild(iframe);
        var closeButton = document.createElement('button');
        closeButton.style.position = 'absolute';
        closeButton.style.zIndex = '2';
        closeButton.style.borderBottomRightRadius= '50%';
        closeButton.onclick = function() {
            iframe.parentNode.removeChild(iframe);
            closeButton.parentNode.removeChild(closeButton);
        };
        closeButton.textContent = 'X';
        element.appendChild(closeButton);
    };

    ext.loadSound = function(url, name) {
        if (name in sounds)
        {
            sounds[name].pause();
        }
        sounds[name] = new Audio(url);
    };
    ext.playSound = function(name) {
        sounds[name].play();
    };
    ext.pauseSound = function(name) {
        sounds[name].pause();
    };
    ext.stopSound = function(name) {
        sounds[name].pause();
        sounds[name].currentTime = 0;
    };
    ext.setVolumeSound = function(name, volume) {
        sounds[name].volume = volume / 100;
    };
    ext.getVolumeSound = function(name) {
        return sounds[name].volume * 100;
    };

    ext.loadImage = function(url, name) {
      images[name] = new Image();
      images[name].src = url;
    };
    ext.drawImageCanvas = function(image, x,y) {
      getOffscreenCanvas().drawImage(images[image], x, y);
    };
    ext.drawImageSizeCanvas = function(image,x,y,w,h) {
      getOffscreenContext().drawImage(images[image], x, y, w, h);
    };
    ext.drawFilledRectangleCanvas = function(x,y,w,h) {
      getOffscreenContext().fillRect(x,y,w,h);
    };
    ext.destroyCanvas = function() {
        var canvas = getCanvas();
        canvas.parentElement.removeChild(canvas);
        canvas = getOffscreenCanvas();
        canvas.parentElement.removeChild(canvas);
    };
    ext.clearCanvas = function() {
      var canvas = getOffscreenCanvas();
      getOffscreenContext().clearRect(0, 0, canvas.width, canvas.height);
    };
    //I peeked in to the source code of the HTML5 canvas extension for this,
    //pls don't be mad <3 uwu. - Craftplacer
    ext.refreshCanvas = function (){
      var canvas = getCanvas();
      getContext().clearRect(0,0,canvas.width, canvas.height);
      getContext().drawImage(getOffscreenCanvas(), 0, 0);
    };
    ext.convertXCanvas = function(x) {
      return x + 240;
    };
    ext.convertYCanvas = function (y) {
      return y * -1 + 180;
    };
    ext.setColorCanvas = function (color) {
      getOffscreenContext().fillStyle = color;
    };
    ext.valueIf = function(boolean, trueValue,falseValue) {
      if (boolean) {
        return trueValue;
      }
      return falseValue;
    };
    ext.specialCharacter = function(chr) {
      if (chr == 'new line') {
        return String.fromCharCode(10);
      }
    }

    ext.fdialog = function(callback) {
        var element = document.createElement('input');
        try {
          element.type = 'file';
          element.onchange = function() {
            callback(this.files[0]);
          };
          element.click();
        } catch (e) {
          console.error(e);
        }
return "end";
    }

    var descriptor = {
        blocks: [
            // Block type, block name, function name, param1 default value, param2 default value
            ['s', '✔️ BOOLEANS -----------------------','splitter'],
            ['b', '%m.boolean', 'valueBoolean', true],
            ['b', '%m.boolean', 'valueBoolean', false],
            ['b', '%s %m.operation %s', 'operation', 1,'==',1],
            ['b', '%s', 'inputToBoolean','true'],
            ['--'],
            ['--'],
            ['s', '🔤 STRINGS ------------------------','splitter'],
            ['b', '%s %m.stringOperation %s', 'stringOperation', 'hello', 'starts with', 'he'],
            ['--'],
            ['--'],
            ['s', '🎨 IMAGES -------------------------','splitter'],
            [' ', 'load %s as %s', 'loadImage'],
            ['--'],
            ['--'],
            ['s', '🎨 CANVAS -------------------------','splitter'],
            [' ', 'destroy canvas', 'destroyCanvas'],
            [' ', 'clear canvas', 'clearCanvas'],
            [' ', 'refresh canvas', 'refreshCanvas'],
            ['--'],
            [' ', 'set color to %s', 'setColorCanvas', 'red'],
            [' ', 'draw image %s x: %n y: %n', 'drawImageCanvas'],
            [' ', 'draw image %s x: %n y: %n w: %n h: %n', 'drawImageSizeCanvas'],
            [' ', 'draw filled rectangle %s x: %n y: %n w: %n h: %n', 'drawFilledRectangleCanvas'],
            ['--'],
            ['r', 'convert %n to canvas X', 'convertXCanvas'],
            ['r', 'convert %n to canvas Y', 'convertYCanvas'],
            ['--'],
            ['--'],
            ['s', '🔊 SOUNDS -------------------------','splitter'],
            [' ', '📥 load %s as %s', 'loadSound', 'url', 'sound'],
            [' ', '▶️ play %s', 'playSound', 'sound'],
            [' ', '❚❚ pause %s', 'pauseSound', 'sound'],
            [' ', '■ stop %s', 'stopSound', 'sound'],
            [' ', '🔊 set %s s volume to %n%', 'setVolumeSound', 'sound',10],
            ['r', '🔊 volume of %s', 'getVolumeSound', 'sound'],
            ['--'],
            ['--'],
            ['s', '📚 VARIABLES ----------------------','splitter'],
            ['r', 'get %m.variableType %s', 'variableGet', '🐱','variable'],
            ['b', 'get %m.variableType %s', 'variableGetBoolean', '🐱','variable'],
            [' ', 'set %m.variableType %s to %s', 'variableSet', '🐱','variable', 'value'],
            [' ', '%m.variableType %s %m.variableOperation %s', 'variableOpertion', '🐱','variable', '++',1],
            [' ', 'delete %m.variableType %s', 'variableDelete', '🐱','variable'],
            ['b', '%m.variableType %s exist?', 'variableExists', '🐱','variable'],
            ['--'],
            ['--'],
            ['s', '⋯ MISC ------------------------------','splitter'],
            ['r', 'if %b then %s else %s', 'valueIf', true, 'yes','no'],
            ['r', '%m.httpMethod %s', 'httpGet', 'GET', 'example.org'],
            [' ', 'play youtube video from id %s', 'youtube'],
            ['r', '%m.specialCharacters', 'specialCharacter', 'new line'],
            ['R', 'open file dialog test', 'fdialog']
        ],
        menus: {
            httpMethod: ['GET', 'POST', 'PUT','DELETE','CONNECT','OPTIONS','TRACE','PATCH'],
            operation: ['==','!=','>','>=','<','<='],
            stringOperation: ['starts with', 'contains','ends with'],
            boolean: [true,false],
            specialCharacters: ['new line'],
            variableOperation: ['++','--'],
            variableType: ['🐱','💾'],
        }
    };

    ScratchExtensions.register('Craftplacer'+String.fromCharCode(39)+'s Extension', descriptor, ext);
})({});
