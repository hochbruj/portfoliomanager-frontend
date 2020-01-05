import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { getPositions, getValues } from '../../store/actions/positionActions'
import TotalChart from './TotalChart'
import CategoryChart from './CategoryChart'

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
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    iconUp: {
        paddingTop: theme.spacing(1.2),
        color: '#4caf50'
    },
    iconDown: {
        paddingTop: theme.spacing(1.2),
        color: '#f44336'
    },
})


class Allocation extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    };

    componentDidMount() {
        if (this.props.user.portfolioId) {
            this.props.getPositions(this.props.user.portfolioId)
            this.props.getValues(this.props.user.portfolioId)
        }
    }

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
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper className={classes.paper}>
                                <TotalChart />
                            </Paper>
                        </Grid>
                        {positions && Array.from(new Set(positions.map(s => s.category))).map(category => (
                            <Grid key={category} item xs={12} md={6} lg={6}>
                                <Paper key={category} className={classes.paper}>
                                    <CategoryChart key={category} category={category} />
                                </Paper>
                            </Grid>
                        ))}


                    </Grid>
                </Container>
            </Fragment>
        )
    }
}

Allocation.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        user: state.firebase.profile,
        positions: state.position.positions,
        values: state.position.values,
        dates: state.position.dates,
        yearIndex: state.position.yearIndex
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPositions: (portfolioId) => dispatch(getPositions(portfolioId)),
        getValues: (portfolioId) => dispatch(getValues(portfolioId)),
    }
}


export default
    connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Allocation));
