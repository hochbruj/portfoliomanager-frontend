import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import layoutConfig from './config/layoutConfig';
import { connect } from 'react-redux'

//Material UI
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';

//Snackbar Icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';


//Components
import Header from './components/layout/Header'
import Dashboard from './components/dashboard/Dashboard'
import Home from './components/layout/Home'
import Positions from './components/position/Positions'
import { resetValues } from './store/actions/valueActions';
import Allocation from './components/allocation/Allocation';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: layoutConfig.theme.primaryColor.main
    },
    secondary: {
      main: layoutConfig.theme.secondaryColor.main
    }
  }
});

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
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
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,

      user: null,
    }
  }

  getSnackbarIcon(variant, classes) {
    if (variant === 'success') {
      return <CheckCircleIcon className={clsx(classes.icon, classes.iconVariant)} />
    } else {
      return <ErrorIcon className={clsx(classes.icon, classes.iconVariant)} />
    }
  }


  render() {
    const { user, updateRun, classes, closeSnackbar } = this.props
    const isSignedIn = !user.isEmpty
    return <Router>
      <div className={classes.root}>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <Header
            title={layoutConfig.title}
            isSignedIn={isSignedIn}
            user={user} />
          <main className={classes.content}>
            <Switch>
              <Route path="/positions" exact render={() => (<Positions user={user} isSignedIn={isSignedIn} />)} />
              <Route path="/dashboard" exact render={() => (<Dashboard user={user} isSignedIn={isSignedIn} />)} />
              <Route path="/allocation" exact render={() => (<Allocation user={user} isSignedIn={isSignedIn} />)} />
              <Route path="/" exact render={() => (<Home />)} />
            </Switch>
          </main>
          {updateRun && <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={updateRun != null}
          >
            <SnackbarContent
              className={clsx(classes[updateRun.type], classes.margin)}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message}>
                  {this.getSnackbarIcon(updateRun.type,classes)}
                  {updateRun.message}
                </span>
              }
              action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={closeSnackbar}>
                  <CloseIcon className={classes.icon} />
                </IconButton>,
              ]}
            />
          </Snackbar>}
        </MuiThemeProvider>
      </div>
    </Router>
  }

}

const mapStateToProps = (state) => {
  return {
    user: state.firebase.auth,
    authError: state.auth.authError,
    positions: state.position.positions,
    dates: state.position.dates,
    updateRun: state.position.updateRun
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeSnackbar: () => dispatch(resetValues()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));