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

import $ from 'jquery';
import M from 'materialize-css'
import 'latest-createjs'
import '../css/main.css'

let stage;
let size;
let color;
let shape;
let selectedTool;
let selectedWeight;
let selectedColor;
let tools;
let undone = [];
let cursorOnScreen = false;

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
        if (this.id === selectedTool.button.attr("id")) {
            return;
        }
        cursorOnScreen = false;
        $(this).addClass("btn-large");
        selectedTool.strategy.cancel();
        selectedTool.button.removeClass("btn-large");
        selectedTool = tools[this.id];
        stage.update();

        const tip = $(this).attr("data-tip");
        if (tip) {
            M.toast({html: tip, displayLength: 3000});
        }
    });

    //bind weight tool click listener
    $("#weight").click(function() {
        const select = $("#weight-select");
        if (select.is(":visible")) {
            select.fadeOut();
        } else {
            select.fadeIn();
        }
    });

    //bind all line weight spec listeners
    $(".line-weight-spec").click(function() {
        size = $(this).attr("weight");
        const je = $("#w" + $(this).attr("weight"));
        selectedWeight.removeClass("darken-4");
        je.addClass("darken-4");
        selectedWeight = je;
    });

    $("#clear-canvas").click(function() {
        clearCanvas()
    });

    //bind all preset color buttons
    $(".pcolor").click(function() {
        color = $(this).children("i").css("color");
        $("#currentColor").css("color", color);
        M.Modal.getInstance($("#modal1")[0]).close();
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
        let i = 1;
        if (cursorOnScreen) {
            i = 2;
        }
        const shape = stage.getChildAt(stage.getNumChildren() - i);
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
    $('.modal').modal();
    M.FloatingActionButton.init($('.fixed-action-btn'), {direction: 'left', hoverEnabled: false});

    //START EASELJS INIT
    stage = new createjs.Stage("paintCanvas");
    //enable touch devices
    createjs.Touch.enable(stage);
    const navbarHeight = $("nav")[0].offsetHeight;
    stage.canvas.style.top = navbarHeight + "px";
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight - navbarHeight;

    //get loaded canvas (this comes from a shared pernting)
    const loadedCanvas = $("#loadedCanvas")[0];
    //if exists, scale and load the pernting
    if (loadedCanvas.height > 0) {
        const scaledCanvas = $("#scaledCanvas")[0];
        scaledCanvas.height = stage.canvas.height;
        scaledCanvas.width = stage.canvas.width;
        //scale pernting using context
        const ctx = scaledCanvas.getContext("2d");
        ctx.drawImage(loadedCanvas, 0, 0, loadedCanvas.width, loadedCanvas.height,
                0, 0, scaledCanvas.width, scaledCanvas.height);
        //draw using bitmap
        const bitmap = new createjs.Bitmap(scaledCanvas);
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
    const dataURL = stage.canvas.toDataURL();
    const HTTP = "http://";
    const PATH = "/pernting/";
    const url = HTTP + location.host + PATH;

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
    M.FloatingActionButton.getInstance($('.fixed-action-btn')).close();
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
    tools.fill.strategy = new Fill();
    tools.eraser.strategy = new Eraser();
}

//STRATEGY PATTERN ----
/**
 * Brush tool
 * @constructor default
 */
function Brush() {
    let oldX, oldY;
    let mouseDown = false;
    let cursor;

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

    this.mouseUp = function() {
        mouseDown = false
    };

    this.mouseMove = function(event) {
        if (cursor) {
            stage.removeChild(cursor);
        }
        cursor =  new createjs.Shape();
        cursor.graphics.setStrokeStyle(1)
            .beginStroke("#000000")
            .drawCircle(0,0,size/2);
        cursor.x = event.stageX;
        cursor.y = event.stageY;
        stage.addChild(cursor);
        cursorOnScreen = true;

        if (oldX && mouseDown) {
            shape.graphics.beginStroke(color)
                .setStrokeStyle(size, "round")
                .moveTo(oldX, oldY)
                .lineTo(event.stageX, event.stageY);
        }
        oldX = event.stageX;
        oldY = event.stageY;

        stage.update();

    };

    this.doubleClick = function(event) {
    };
    this.cancel = function() {
        stage.removeChild(cursor);
        stage.update();
    };
}

/**
 * Line tool
 * @constructor default
 */
function Lines() {
    let oldX, oldY;
    let trace;
    let cursor;

    this.mouseDown = function(event) {
        if (Math.abs(oldX - event.stageX) < size / 2 && Math.abs(oldY - event.stageY) < size / 2) {
            this.reset();
            return;
        } else {
            undone = [];

            trace = undefined;

            if (cursor !== undefined) {
                stage.removeChild(cursor);
            }
            cursor = new createjs.Shape();
            cursor.graphics.setStrokeStyle(1)
                .beginStroke("#000000")
                .drawCircle(0,0,size);
            cursor.x = event.stageX;
            cursor.y = event.stageY;
            stage.addChild(cursor);

            stage.update();
        }
        oldX = event.stageX;
        oldY = event.stageY;
    };
    this.mouseUp = function(event) {
    };
    this.mouseMove = function(event) {
        if (oldX) {
            if (trace !== undefined) {
                stage.removeChild(trace);
            }
            trace = new createjs.Shape();
            stage.addChild(trace);

            trace.graphics.beginStroke(color)
                .setStrokeStyle(size, "round")
                .moveTo(oldX, oldY)
                .lineTo(event.stageX, event.stageY);


            cursor.x = event.stageX;
            cursor.y = event.stageY;
            stage.update();
        }
    };
    this.doubleClick = function() {
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
        stage.removeChild(cursor);
        stage.update();
    };
    this.cancel = function() {
        this.reset();
    }
}


/**
 * Fill tool
 * @constructor default
 */
function Fill() {
    this.mouseDown = function() {
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
    let white = "#fff";
    let oldX, oldY;
    let mouseDown = false;

    this.mouseDown = function(event) {
        shape = new createjs.Shape();
        stage.addChild(shape);

        shape.graphics.beginFill(white)
            .drawCircle(event.stageX, event.stageY, size/2);
        stage.update();

        mouseDown = true;
        undone = []; //kill 'redo' stack
    };

    this.mouseUp = function() {
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

    this.doubleClick = function(event) {};

    this.cancel = function() {};
}
//---------

$(document).ready(() => {
    init()
});
