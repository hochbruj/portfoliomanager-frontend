import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TotalChart from './TotalChart';
import CategoriesRow from './CategoriesRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons';
import clsx from 'clsx';
import {
  getPositions,
  getValues,
  getChart,
} from '../../store/actions/positionActions';

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
    color: '#4caf50',
  },
  iconDown: {
    paddingTop: theme.spacing(1.2),
    color: '#f44336',
  },
});

class Positions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAmount: 0,
      date: '',
      weekDiff: 0,
      weekDiffPerc: 0,
      yearDiff: 0,
      yearDiffPerc: 0,
    };
  }

  componentDidMount() {
    if (this.props.user.portfolioId) {
      this.props.getPositions(this.props.user.portfolioId);
      this.props.getValues(this.props.user.portfolioId);
    }
  }

  componentDidUpdate() {
    if (this.props.positions.length > 0 && this.props.values.length > 0) {
      const {
        data,
        totalAmount,
        date,
        weekDiff,
        weekDiffPerc,
        yearDiff,
        yearDiffPerc,
      } = this.getSummary();
      if (this.state.totalAmount === 0) {
        this.setState({
          totalAmount,
          date,
          weekDiff,
          weekDiffPerc,
          yearDiff,
          yearDiffPerc,
        });
        this.props.getChart('Total Assets', data);
      }
    }
  }

  renderRedirect = () => {
    if (this.props.isSignedIn === false) {
      return <Redirect to='/' />;
    }
  };

  getSummary() {
    let data = [];
    let totalAmount = 0,
      weekDiff = 0,
      weekDiffPerc = 0,
      yearDiff = 0,
      yearDiffPerc = 0;
    let lastDate = '';

    const { dates, values, yearIndex } = this.props;
    if (dates && values) {
      dates.forEach((date) => {
        let valuesFil = values.filter(
          (value) => value.date.seconds === date.seconds
        );
        let valuesFilAmount = valuesFil.reduce(
          (a, b) => a + b.amount * b.quote,
          0
        );
        let dateDate = new Date(date.seconds * 1000);
        let dataElement = {
          name: dateDate.toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          value: Math.round(valuesFilAmount),
        };
        data.push(dataElement);
      });
      totalAmount = data[data.length - 1].value;
      lastDate = data[data.length - 1].name;
      //change since last run
      weekDiff = totalAmount - data[data.length - 2].value;
      weekDiffPerc =
        Math.round((weekDiff / data[data.length - 2].value) * 10000) / 100;

      //change since last year
      yearDiff = totalAmount - data[yearIndex].value;
      yearDiffPerc =
        Math.round((yearDiff / data[yearIndex].value) * 10000) / 100;
    }
    return {
      data: data,
      totalAmount: totalAmount,
      date: lastDate,
      yearDiff: yearDiff,
      yearDiffPerc: yearDiffPerc,
      weekDiff: weekDiff,
      weekDiffPerc: weekDiffPerc,
    };
  }

  getText(diff, diffPerc, classes) {
    if (diff >= 0) {
      return (
        <Typography style={{ color: '#4caf50' }}>
          <ArrowUpward className={classes.iconUp} />${diff.toLocaleString()} (
          {diffPerc}%)
        </Typography>
      );
    } else {
      return (
        <Typography style={{ color: '#f44336' }}>
          <ArrowDownward className={classes.iconDown} />${diff.toLocaleString()}{' '}
          ({diffPerc}%)
        </Typography>
      );
    }
  }

  render() {
    const { classes, positions, chart } = this.props;
    const {
      totalAmount,
      date,
      weekDiff,
      weekDiffPerc,
      yearDiff,
      yearDiffPerc,
    } = this.state;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (
      <Fragment>
        {this.renderRedirect()}
        <div className={classes.appBarSpacer} />
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                {chart && <TotalChart chart={chart} />}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Typography
                  component='h2'
                  variant='h6'
                  color='primary'
                  gutterBottom
                >
                  Current Value
                </Typography>
                <Typography component='p' variant='h4'>
                  ${totalAmount.toLocaleString()}
                </Typography>
                <Typography color='textSecondary'>on {date}</Typography>
                <Typography color='textSecondary'>Past week:</Typography>
                {this.getText(weekDiff, weekDiffPerc, classes)}
                <Typography color='textSecondary'>Past year:</Typography>
                {this.getText(yearDiff, yearDiffPerc, classes)}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography
                  component='h2'
                  variant='h6'
                  color='primary'
                  gutterBottom
                >
                  Assest by category
                </Typography>
                {positions && (
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align='right'>Amount</TableCell>
                        <TableCell align='right'>Weekly change</TableCell>
                        <TableCell align='right'>Yearly change</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.from(
                        new Set(positions.map((s) => s.category))
                      ).map((category) => (
                        <CategoriesRow
                          key={category}
                          category={category}
                          totalAmount={totalAmount}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Fragment>
    );
  }
}

Positions.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.firebase.profile,
    positions: state.position.positions,
    values: state.position.values,
    dates: state.position.dates,
    yearIndex: state.position.yearIndex,
    chart: state.position.chart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPositions: (portfolioId) => dispatch(getPositions(portfolioId)),
    getValues: (portfolioId) => dispatch(getValues(portfolioId)),
    getChart: (name, data) => dispatch(getChart(name, data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Positions));
