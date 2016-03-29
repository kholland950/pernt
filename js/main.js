var stage, drawing, shape, oldX, oldY, size, color;

// 43C59E

var mode;

function init() {
    $('.modal-trigger').leanModal();

    stage = new createjs.Stage("paintCanvas");
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight - $("nav")[0].offsetHeight;
    stage.enableDOMEvents(true);

    shape = new createjs.Shape();
    stage.addChild(shape);
    // set up our defaults:
    color = "#0FF";
    size = 10;

    // add handler for stage mouse events:
    stage.on("stagemousedown", function(event) {
        drawing = true
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