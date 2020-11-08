let createjs = require('createjs')

class Brush {
  constructor() {
    this.reset()
  }

  reset = () => {
    this.oldX = undefined
    this.oldY = undefined
    this.cursor = undefined
    this.mouseDown = false
    this.shape = undefined
  }

  mouseDown = (event, stage, size, color) => {
    this.shape = new createjs.Shape()
    stage.addChild(this.shape)

    this.shape.graphics.beginFill(color)
      .drawCircle(event.stageX, event.stageY, size / 2)
    stage.update()

    this.oldX = event.stageX
    this.oldY = event.stageY

    this.mouseDown = true
    // undone = [] //kill 'redo' stack
  }
  mouseDown = (event, stage, size, color) => {}

  mouseUp = (event, stage, size, color) => {
    this.mouseDown = false
  }

  mouseMove = (event, stage, size, color) => {
    if (this.cursor) {
      stage.removeChild(this.cursor)
    }
    this.cursor = new createjs.Shape()
    this.cursor.graphics.setStrokeStyle(1)
      .beginStroke("#000000")
      .drawCircle(0, 0, size / 2)
    this.cursor.x = event.stageX
    this.cursor.y = event.stageY
    stage.addChild(this.cursor)
    // cursorOnScreen = true

    if (this.oldX && this.mouseDown) {
      this.shape.graphics.beginStroke(color)
        .setStrokeStyle(size, "round")
        .moveTo(this.oldX, this.oldY)
        .lineTo(event.stageX, event.stageY)
    }
    this.oldX = event.stageX
    this.oldY = event.stageY

    stage.update()
  }

  doubleClick = (event, stage, size, color) => {}

  cancel = (event, stage, size, color) => {
    stage.removeChild(this.cursor)
    stage.update()
  }
}
export default Brush