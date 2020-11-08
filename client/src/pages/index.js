import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { AppBar, Toolbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import Canvas from '../components/canvas/canvas'
import Brush from "../canvas-tools/brush";

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  canvas: {
    position: 'fixed',
  }
});

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.tools = {
      brush: new Brush()
    }
  }

  componentWillMount = () => {
    this.setState({tool: this.tools.brush})
  }

  state = {
    tool: undefined,
    open: false,
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Toolbar>
            <Typography variant='h6' color='inherit'>
              Pernt.
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Canvas className={classes.canvas} tool={this.state.tool}/>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
