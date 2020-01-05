import React, { Component, Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import { mainListItems } from './Sidebar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx'
import { connect } from 'react-redux'
import { signIn, signOut } from '../../store/actions/authActions'
import { updateValues } from '../../store/actions/valueActions'
import {withRouter} from 'react-router-dom'

const drawerWidth = 240;

const styles = (theme) => ({

  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },

})

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: {
        anchorEl: null
      },
      drawerOpen: false
    };
  }


  openMenu = (event) => {
    const anchorEl = event.currentTarget;

    this.setState({
      menu: {
        anchorEl
      }
    });
  };

  closeMenu = () => {
    this.setState({
      menu: {
        anchorEl: null
      }
    });
  };

  handleSignInClick = () => {
    this.props.signIn();
  };

  handleSignOutClick = () => {
    this.closeMenu();
    this.props.signOut();
    this.props.history.push('/');
  };


  handleDrawerOpen = () => {
    this.setState({
      drawerOpen: true
    })
  };
  handleDrawerClose = () => {
    this.setState({
      drawerOpen: false
    })
  };

  render() {
    // Properties
    const { title, isSignedIn, user } = this.props;

    //UI
    const { menu, drawerOpen } = this.state;
    const { classes } = this.props

    return (
      <Fragment>
        <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            {isSignedIn &&
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Menu"
              onClick={this.handleDrawerOpen}
              className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}>
              <MenuIcon />
            </IconButton>
            }
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              {title}
            </Typography>
            {!isSignedIn &&
              <Fragment>
                <Button className={classes.button} color="secondary" variant="contained" onClick={this.handleSignInClick}>
                  Login with Google
            </Button>
              </Fragment>
            }
            {isSignedIn &&
              <Fragment>
                <IconButton color="inherit"  onClick={this.openMenu}>
                  {user.photoURL ? <Avatar alt="Avatar" src={user.photoURL} /> : <PersonIcon />}
                </IconButton>

                <Menu anchorEl={menu.anchorEl} open={Boolean(menu.anchorEl)} onClose={this.closeMenu}>
                  <MenuItem  onClick={this.handleSignOutClick}>Sign out</MenuItem>
                  <MenuItem  onClick={this.props.updateValues}>Update values</MenuItem>
                </Menu>
              </Fragment>
            }
          </Toolbar>
        </AppBar>
        {isSignedIn &&
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
          }}
          open={drawerOpen}>
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List onClick={this.handleDrawerClose}>{mainListItems}</List>
        </Drawer>
        }
         <div className={classes.appBarSpacer} />
      </Fragment>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: () => dispatch(signIn()),
    signOut: () => dispatch(signOut()),
    updateValues: () => dispatch(updateValues())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(withStyles(styles)(Header)));
