var stage, size, color;

var shape;

//default select menu item is brush
var selectedTool;
var selectedWeight;
var selectedColor;

var undone = [];

var items;

function init() {
    items = {
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

    selectedTool = items.brush; //brush selected by default
    $(".mt-btn").click(function() {
        if (this.id == selectedTool.button.attr("id")) {
            return;
        }

        $(this).addClass("btn-large");
        selectedTool.button.removeClass("btn-large");
        selectedTool = items[this.id];
    });

    $("#weight").click(function() {
        var select = $("#weight-select");
        if (select.is(":visible")) {
            select.fadeOut();
        } else {
            select.fadeIn();
        }
    });

    $(".line-weight-spec").click(function() {
        size = $(this).attr("weight");
        var je = $("#w" + $(this).attr("weight"));
        selectedWeight.removeClass("darken-4");
        je.addClass("darken-4");
        selectedWeight = je;
    });

    $(document).on("mousedown", function(e) {
        closeMenus();
    });

    selectedColor = $(".pred");
    selectedColor.addClass("xlarge");
    $(".pcolor").click(function() {
        color = $(this).children("i").css("color");
        $("#currentColor").css("color", color);
        $("#modal1").closeModal();
        selectedColor.removeClass("xlarge");
        selectedColor = $(this).children("i");
        selectedColor.addClass("xlarge");
    });

    $("#undo").click(function() {
        var shape = stage.getChildAt(stage.getNumChildren() - 1);
        stage.removeChild(shape);
        stage.update();
        undone.push(shape);
        selectedTool.strategy.undo();
    });

    $("#redo").click(function() {
        stage.addChild(undone.pop());
        stage.update();
        selectedTool.strategy.redo();
    });

    $('.modal-trigger').leanModal();

    stage = new createjs.Stage("paintCanvas");
    createjs.Touch.enable(stage);
    var navbarHeight = $("nav")[0].offsetHeight;
    stage.canvas.style.top = navbarHeight + "px";
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight - navbarHeight;
    stage.enableDOMEvents(true);

    // set up our defaults:
    size = 10;
    selectedWeight = $("#w" + size);
    color = selectedColor.css("color");
    $("#currentColor").css("color", color);

    // add handler for stage mouse events:
    stage.on("stagemousedown", function(event) {
        selectedTool.strategy.mouseDown(event);
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

    stage.update();
}

function closeMenus() {
    $(".floating-menu").fadeOut();
    $('.fixed-action-btn').closeFAB();
}

function clearCanvas() {
    stage.removeAllChildren();
    stage.update();
    closeMenus();
    undone = [];
    //reset tools
    items.brush.strategy = new Brush();
    items.lines.strategy = new Lines();
    items.polygon.strategy = new Polygon();
    items.fill.strategy = new Fill();
    items.eraser.strategy = new Eraser();
}

//STRATEGY PATTERN ----

function Brush() {
    var oldX, oldY;
    var mouseDown = false;

    this.mouseDown = function(event) {
        shape = new createjs.Shape();
        stage.addChild(shape);

        shape.graphics.beginFill(color)
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

    }
}

function Lines() {
    var oldX, oldY;

    this.mouseDown = function(event) {
        if (Math.abs(oldX - event.stageX) > 3 || Math.abs(oldY - event.stageY) > 3) {
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
        oldX = undefined;
        oldY = undefined;
    };
    this.undo = function() {
        oldX = undefined;
        oldY = undefined;
    };
    this.redo = function() {
        oldX = undefined;
        oldY = undefined;
    }
}

function Polygon() {
    var lastX, lastY, startX, startY;
    var shape;

    this.mouseDown = function(event) {
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
        shape.graphics.beginStroke(color)
            .setStrokeStyle(size, "round")
            .moveTo(lastX, lastY)
            .lineTo(startX, startY);
        stage.update();

        reset();
    };
    this.undo = function() {
        reset();
    };
    this.redo = function() {
        reset();
    };

    function reset() {
        shape = undefined;
        shape = undefined;
        startX = undefined;
        startY = undefined;
        lastX = undefined;
        lastY = undefined;
    }
}

function Fill() {
    this.mouseDown = function(event) {

    };
    this.mouseUp = function(event) {

    };
    this.mouseMove = function(event) {

    };
    this.doubleClick = function(event) {

    }
}

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
}
//---------
