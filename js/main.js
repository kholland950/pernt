var stage, drawing, oldX, oldY, size, color;

var mode;

//default select menu item is brush
var selectedItem;
var selectedWeight;
var selectedColor;

var undone = [];

function menuClick(id) {
}

function init() {
    selectedItem = $("#brush");
    $(".mt-btn").click(function() {
        if (this.id == selectedItem[0].id) {
            return;
        }
        menuClick(this.id);
        je = $("#" + this.id);
        je.addClass("btn-large");
        selectedItem.removeClass("btn-large");
        selectedItem = je;
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
    });

    $("#redo").click(function() {
        stage.addChild(undone.pop());
        stage.update();
    });

    $('.modal-trigger').leanModal();

    stage = new createjs.Stage("paintCanvas");
    createjs.Touch.enable(stage);
    var navbarHeight = $("nav")[0].offsetHeight;
    stage.canvas.style.top = navbarHeight + "px";
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight - navbarHeight;
    stage.enableDOMEvents(true);

    var shape;

    // set up our defaults:
    size = 10;
    selectedWeight = $("#w" + size);
    color = selectedColor.css("color");
    $("#currentColor").css("color", color);

    // add handler for stage mouse events:
    stage.on("stagemousedown", function(event) {
        shape = new createjs.Shape();
        stage.addChild(shape);
        drawing = true;
        undone = []; //kill 'redo' stack
    });

    stage.on("stagemouseup", function(event) {
        drawing = false
    });

    stage.on("stagemousemove",function(evt) {
        if (oldX && drawing) {
            shape.graphics.beginStroke(color)
                .setStrokeStyle(size, "round")
                .moveTo(oldX, oldY)
                .lineTo(evt.stageX, evt.stageY);
            stage.update();
        }
        oldX = evt.stageX;
        oldY = evt.stageY;
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
}

//STRATEGY PATTERN ----

function Brush() {

}

function Lines() {

}

function Polygon() {

}

function Fill() {

}

function Eraser() {

}
//---------
