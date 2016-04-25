/**
 * main.js - Main JS Code for Drawing
 * @author Kevin Holland
 *
 *
 * DESIGN PATTERNS:
 * - Listener/Observer: used throughout, click listeners
 *      - See line 51 for example
 * - Command: Undo manager
 *      - See line 102
 * - Strategy Pattern: Drawing tools
 *      - See line 228
 */

//globals, TODO refactor this, this is bad news bears
var stage, size, color;
var shape;
var selectedTool;
var selectedWeight;
var selectedColor;
var undone = [];
var tools;

/**
 * Init called on body load
 */
function init() {
    //selectable tools: associated button and strategy for each
    tools = {
        brush: {
            button: $("#brush"),
            strategy: new Brush()
        },
        lines: {
            button: $("#lines"),
            strategy: new Lines()
        },
        polygon: {
            button: $("#polygon"),
            strategy: new Polygon()
        },
        fill: {
            button: $("#fill"),
            strategy: new Fill()
        },
        eraser: {
            button: $("#eraser"),
            strategy: new Eraser()
        }
    };
    selectedTool = tools.brush; //brush selected by default

    //bind all menu tool button click listeners
    $(".mt-btn").click(function() {
        if (this.id == selectedTool.button.attr("id")) {
            return;
        }
        $(this).addClass("btn-large");
        selectedTool.strategy.cancel();
        selectedTool.button.removeClass("btn-large");
        selectedTool = tools[this.id];
        stage.update();
    });

    //bind weight tool click listener
    $("#weight").click(function() {
        var select = $("#weight-select");
        if (select.is(":visible")) {
            select.fadeOut();
        } else {
            select.fadeIn();
        }
    });

    //bind all line weight spec listeners
    $(".line-weight-spec").click(function() {
        size = $(this).attr("weight");
        var je = $("#w" + $(this).attr("weight"));
        selectedWeight.removeClass("darken-4");
        je.addClass("darken-4");
        selectedWeight = je;
    });

    //TODO determine if I want this functionality... if you click on the document it closes any open menus
    //$(document).on("mousedown", function(e) {
    //    closeMenus();
    //});

    //bind all preset color buttons
    $(".pcolor").click(function() {
        color = $(this).children("i").css("color");
        $("#currentColor").css("color", color);
        $("#modal1").closeModal();
        selectedColor.removeClass("xlarge");
        selectedColor = $(this).children("i");
        selectedColor.addClass("xlarge");
    });
    //default default selected color
    selectedColor = $(".pred");
    selectedColor.addClass("xlarge");

    //COMMAND PATTERN
    //bind undo button
    $("#undo").click(function() {
        var shape = stage.getChildAt(stage.getNumChildren() - 1);
        stage.removeChild(shape);
        stage.update();
        undone.push(shape);
        selectedTool.strategy.undo();
    });
    //bind redo button
    $("#redo").click(function() {
        stage.addChild(undone.pop());
        stage.update();
        selectedTool.strategy.redo();
    });

    //bind share button
    $("#share").click(sharePernting);

    //init all modals
    $('.modal-trigger').leanModal();

    //START EASELJS INIT
    stage = new createjs.Stage("paintCanvas");
    //enable touch devices
    createjs.Touch.enable(stage);
    var navbarHeight = $("nav")[0].offsetHeight;
    stage.canvas.style.top = navbarHeight + "px";
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight - navbarHeight;

    //get loaded canvas (this comes from a shared pernting)
    var loadedCanvas = $("#loadedCanvas")[0];
    //if exists, scale and load the pernting
    if (loadedCanvas.height > 0) {
        var scaledCanvas = $("#scaledCanvas")[0];
        scaledCanvas.height = stage.canvas.height;
        scaledCanvas.width = stage.canvas.width;
        //scale pernting using context
        var ctx = scaledCanvas.getContext("2d");
        ctx.drawImage(loadedCanvas, 0, 0, loadedCanvas.width, loadedCanvas.height,
                0, 0, scaledCanvas.width, scaledCanvas.height);
        //draw using bitmap
        var bitmap = new createjs.Bitmap(scaledCanvas);
        stage.addChild(bitmap);
    }

    //set up drawing defaults
    size = 10;
    selectedWeight = $("#w" + size);
    color = selectedColor.css("color");
    $("#currentColor").css("color", color);

    // add handlers for stage mouse events
    stage.on("stagemousedown", function(event) {
        //if (event.nativeEvent.button == 0) { //left click only
        selectedTool.strategy.mouseDown(event);
        //}
    });
    stage.on("stagemouseup", function(event) {
        selectedTool.strategy.mouseUp(event);
    });
    stage.on("stagemousemove",function(event) {
        selectedTool.strategy.mouseMove(event);
    });
    stage.on("dblclick", function(event) {
        selectedTool.strategy.doubleClick(event);
    });

    //update stage after init for loaded canvas
    stage.update();
}

/**
 * Sends pernting to database, gets uuid for url creation
 */
function sharePernting() {
    var dataURL = stage.canvas.toDataURL();
    var HTTP = "http://";
    var PATH = "/pernting/";
    var url = HTTP + location.host + PATH;

    //REST call to server to save pernting
    //returns uuid
    $.post({
        url: "/svprnt",
        data: {
            imageDataURL: dataURL,
            imageWidth: stage.canvas.width,
            imageHeight: stage.canvas.height
        },
        success: function(data) {
            //update URL field with server response
            //ex. http://pernt.xyz/pernting/880c087f-ba4f-4620-845d-b9186c4340cc
            $("#shareUrl").val(url + data);
        }
    });
}

/**
 * Close all menus
 */
function closeMenus() {
    $(".floating-menu").fadeOut();
    $('.fixed-action-btn').closeFAB();
}

/**
 * Clear canvas and reset tools
 */
function clearCanvas() {
    stage.removeAllChildren();
    stage.update();
    closeMenus();
    undone = [];
    //reset tools
    tools.brush.strategy = new Brush();
    tools.lines.strategy = new Lines();
    tools.polygon.strategy = new Polygon();
    tools.fill.strategy = new Fill();
    tools.eraser.strategy = new Eraser();
}

//STRATEGY PATTERN ----
/**
 * Brush tool
 * @constructor default
 */
function Brush() {
    var oldX, oldY;
    var mouseDown = false;

    this.mouseDown = function(event) {
        shape = new createjs.Shape();
        stage.addChild(shape);

        shape.graphics.beginFill(color)
            .drawCircle(event.stageX, event.stageY, size/2);
        stage.update();

        oldX = event.stageX;
        oldY = event.stageY;

        mouseDown = true;
        undone = []; //kill 'redo' stack
    };

    this.mouseUp = function(event) {
        mouseDown = false
    };

    this.mouseMove = function(event) {
        if (oldX && mouseDown) {
            shape.graphics.beginStroke(color)
                .setStrokeStyle(size, "round")
                .moveTo(oldX, oldY)
                .lineTo(event.stageX, event.stageY);
            stage.update();
        }
        oldX = event.stageX;
        oldY = event.stageY;
    };

    this.doubleClick = function(event) {
    };
    this.cancel = function() {
    };
}

/**
 * Line tool
 * @constructor default
 */
function Lines() {
    var oldX, oldY;

    this.mouseDown = function(event) {
        if (Math.abs(oldX - event.stageX) < size / 2 && Math.abs(oldY - event.stageY) < size / 2) {
            this.reset();
            return;
        } else {
            shape = new createjs.Shape();
            undone = [];
            stage.addChild(shape);

            shape.graphics.beginStroke(color)
                .setStrokeStyle(size, "round")
                .moveTo(oldX, oldY)
                .lineTo(event.stageX, event.stageY);
            stage.update();
        }
        oldX = event.stageX;
        oldY = event.stageY;
    };
    this.mouseUp = function(event) {
    };
    this.mouseMove = function(event) {
    };
    this.doubleClick = function(event) {
        this.reset();
    };
    this.undo = function() {
        this.reset();
    };
    this.redo = function() {
        this.reset();
    };
    this.reset = function() {
        oldX = undefined;
        oldY = undefined;
    };
    this.cancel = function() {
        this.reset();
    }
}

/**
 * Polygon tool
 * @constructor default
 */
function Polygon() {
    var lastX, lastY, startX, startY;
    var shape;

    this.mouseDown = function(event) {
        if (Math.abs(event.stageX - lastX) < size / 2 &&
            Math.abs(event.stageY - lastY) < size / 2) {
            close();
            this.reset();
            return;
        }
        if (Math.abs(event.stageX - startX) < size / 2 &&
            Math.abs(event.stageY - startY) < size / 2) {
            close();
            this.reset();
            return;
        }
        if (shape == undefined) {
            shape = new createjs.Shape();
            undone = [];
            stage.addChild(shape);
            startX = event.stageX;
            startY = event.stageY;
        }

        shape.graphics.beginStroke(color)
            .setStrokeStyle(size, "round")
            .moveTo(lastX, lastY)
            .lineTo(event.stageX, event.stageY);
        stage.update();

        lastX = event.stageX;
        lastY = event.stageY;
    };
    this.mouseUp = function(event) {

    };
    this.mouseMove = function(event) {

    };
    this.doubleClick = function(event) {
        close();
        this.reset();
    };
    this.undo = function() {
        this.reset();
    };
    this.redo = function() {
        this.reset();
    };

    this.reset = function() {
        shape = undefined;
        shape = undefined;
        startX = undefined;
        startY = undefined;
        lastX = undefined;
        lastY = undefined;
    };

    this.cancel = function() {
        stage.removeChild(shape);
        this.reset();
    };

    function close() {
        shape.graphics.beginStroke(color)
            .setStrokeStyle(size, "round")
            .moveTo(lastX, lastY)
            .lineTo(startX, startY);
        stage.update();
    }
}

/**
 * Fill tool
 * @constructor default
 * TODO: IMPLEMENT
 */
function Fill() {
    this.mouseDown = function(event) {
        window.alert("This tool is not yet implemented, sorry!");
    };
    this.mouseUp = function(event) {

    };
    this.mouseMove = function(event) {

    };
    this.doubleClick = function(event) {

    };
    this.cancel = function() {
    }
}

/**
 * Eraser tool
 * @constructor default
 */
function Eraser() {
    var white = "#fff";
    var oldX, oldY;
    var mouseDown = false;

    this.mouseDown = function(event) {
        shape = new createjs.Shape();
        stage.addChild(shape);

        shape.graphics.beginFill(white)
            .drawCircle(event.stageX, event.stageY, size/2);
        stage.update();

        mouseDown = true;
        undone = []; //kill 'redo' stack
    };

    this.mouseUp = function(event) {
        mouseDown = false
    };

    this.mouseMove = function(event) {
        if (oldX && mouseDown) {
            shape.graphics.beginStroke(white)
                .setStrokeStyle(size, "round")
                .moveTo(oldX, oldY)
                .lineTo(event.stageX, event.stageY);
            stage.update();
        }
        oldX = event.stageX;
        oldY = event.stageY;
    };

    this.doubleClick = function(event) {

    }

    this.cancel = function() {
    }
}
//---------
