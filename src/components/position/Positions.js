import React, { Component, Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CreatePosition from './CreatePosition'
import UpdatePosition from './UpdatePosition'
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getPositions, getValues } from '../../store/actions/positionActions'

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: 10,
    overflowX: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  table: {
    minWidth: 650,
    marginTop: 1
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
})


class Positions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createDialog: {
        open: false
      },
      updateDialog: {
        open: false
      },
      selectedPosition: null
    };
  }

  componentDidMount() {
    if (this.props.user.portfolioId) {
    this.props.getPositions(this.props.user.portfolioId)
    this.props.getValues(this.props.user.portfolioId)
    }
  }

  openCreateDialog = () => {
    this.setState({
      createDialog: {
        open: true
      }
    });
  };


  closeCreateDialog = (callback) => {
    this.setState({
      createDialog: {
        open: false
      }
    })
  };

  openUpdateDialog = (rowData) => {
    this.setState({
      updateDialog: {
        open: true
      },
      selectedPosition: rowData
    });
  };


  closeUpdateDialog = (callback) => {
    this.setState({
      updateDialog: {
        open: false
      }
    })
  };

  renderRedirect = () => {
    if (this.props.isSignedIn === false) {
      return <Redirect to='/' />
    }
  }


  render() {

    let { classes, positions } = this.props

    return (
      <Fragment>
        {this.renderRedirect()}
        <Container maxWidth="lg" className={classes.container}>
          <div className={classes.appBarSpacer} />
          <Paper className={classes.root}>
           {positions.length > 0 && <MaterialTable
              title="Positions"
              columns={[
                { title: 'Category', field: 'category' },
                { title: 'Ticker/Currency', field: 'item' },
                { title: 'Amount', field: 'amount',  type: 'numeric' },
                { title: 'Location', field: 'location' },
              ]}
              data={positions}
              options={{
                grouping: true
              }}
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Change amount',
                  onClick: (event, rowData) => this.openUpdateDialog(rowData)
                }
              ]}
            />
           }
          </Paper>
          <Fab className={classes.fab} color='primary' aria-label="Add" onClick={this.openCreateDialog}>
            <AddIcon />
          </Fab>
          <CreatePosition
            open={this.state.createDialog.open}
            onClose={this.closeCreateDialog} />
            <UpdatePosition
            open={this.state.updateDialog.open}
            onClose={this.closeUpdateDialog}
            position={this.state.selectedPosition} />
        </Container>
      </Fragment>
    )
  }
}

Positions.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.firebase.profile,
    positions: state.position.positions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPositions: (portfolioId) => dispatch(getPositions(portfolioId)),
    getValues: (portfolioId) => dispatch(getValues(portfolioId)),
  }
}


// export default compose(
//   connect(mapStateToProps),
//   firestoreConnect((props) => {
//     if (props.user.isEmpty) return []
//     return [{
//       collection: 'positions',
//       where: ['portfolioId', '==', props.user.portfolioId]
//     }]
//   })
// )(withStyles(styles)(Positions));

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Positions))