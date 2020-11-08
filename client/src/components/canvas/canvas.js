import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

let createjs = require('createjs')

const styles = theme => ({
  canvas: {
    position: 'fixed',
  }
});

class Canvas extends React.Component {
  static propTypes = {
    tool: PropTypes.object,
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.canvas = undefined
    this.stage = undefined
  }

  componentDidMount = () => {
    this.stage = new createjs.Stage("paintCanvas");
    createjs.Touch.enable(this.stage);
    this.stage.canvas.width = window.innerWidth;
    this.stage.canvas.height = window.innerHeight;
  }

  onMouseDown = (event) => {
    this.props.tool.onMouseDown(event)
  }
  onMouseUp = (event) => {
    this.props.tool.onMouseUp(event)
  }
  onMouseMove = (event) => {
    this.props.tool.onMouseMove(event)
  }
  onDoubleClick = (event) => {
    this.props.tool.onDoubleClick(event)
  }
  onCancel = (event) => {
    this.props.tool.onCancel(event)
  }

  render() {
    const { classes } = this.props

    return (
      <canvas className={classes.canvas}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onDoubleClick={this.onDoubleClick}
        ref={ref => this.canvas = ref}/>
    );
  }
}

Canvas.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Canvas));
