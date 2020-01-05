import React, { Component } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import ShowChartIcon from '@material-ui/icons/ShowChart'
import { getChart } from '../../store/actions/positionActions'

const styles = (theme) => ({
  iconUp: {
    paddingTop: theme.spacing(1.2),
    color: '#4caf50'
  },
  iconDown: {
    paddingTop: theme.spacing(1.2),
    color: '#f44336'
  },
})

class PositionRow extends Component {
  constructor(props) {
    super(props);
    this.state = { openDialog: false };
  }

  getData() {
    let data = []
    let totalCatAmount = 0
    let weekDiff = 0, weekDiffPerc = 0, yearDiff = 0, yearDiffPerc = 0
    const { category, positions, dates, values, yearIndex } = this.props
    if (positions && values && dates) {
      let positionIds = positions.reduce((ids, position) => {
        if (position.category === category) {
          ids.push(position.id);
        }
        return ids;
      }, []);

      dates.forEach((date) => {
        let valuesFil = values.filter(value => value.date.seconds === date.seconds)
        valuesFil = valuesFil.filter(value => positionIds.includes(value.positionId))
        let valuesFilAmount = valuesFil.reduce((a, b) => (a + b.amount * b.quote), 0)
        let dateDate = new Date(date.seconds * 1000)
        let dataElement = {
          name: dateDate.toLocaleDateString(("en-AU"), { day: 'numeric', month: 'short', year: 'numeric' }),
          value: Math.round(valuesFilAmount)
        }
        data.push(dataElement)
      });
      totalCatAmount = data[data.length - 1].value
      //change since last run
      weekDiff = (totalCatAmount - data[data.length - 2].value)
      weekDiffPerc = Math.round((weekDiff / data[data.length - 2].value) * 10000) / 100

      //change since last year
      yearDiff = (totalCatAmount - data[yearIndex].value)
      yearDiffPerc = Math.round((yearDiff / data[yearIndex].value) * 10000) / 100

      //change sign for short positions
      if (category === 'Stock Short') {
        yearDiffPerc = yearDiffPerc * -1
        weekDiffPerc = weekDiffPerc * -1
      }
    }
    return ({
      data: data,
      totalCatAmount: totalCatAmount,
      weekDiff: weekDiff,
      yearDiff: yearDiff,
      weekDiffPerc: weekDiffPerc,
      yearDiffPerc: yearDiffPerc
    })
  }

  getCell(diff, diffPerc, classes) {
    if (diff >= 0) {
      return <TableCell align="right" style={{ color: '#4caf50' }}>
        <ArrowUpward className={classes.iconUp} />
        ${diff.toLocaleString()} ({diffPerc}%)</TableCell>
    } else {
      return <TableCell align="right" style={{ color: '#f44336' }}>
        <ArrowDownward className={classes.iconDown} />
        ${diff.toLocaleString()} ({diffPerc}%)</TableCell>
    }
  }



  render() {
    const { category, totalAmount, classes } = this.props
    const { data, totalCatAmount, weekDiff, weekDiffPerc, yearDiff, yearDiffPerc } = this.getData()
    return (
      <TableRow key={category} classes={classes.positve}>
        <TableCell><IconButton aria-label="delete" className={classes.margin} onClick={() => this.props.getChart(category,data)}>
          <ShowChartIcon fontSize="large" />
        </IconButton></TableCell>
        <TableCell
          component="th"
          scope="row" >
          {category}
        </TableCell>
        <TableCell align="right">
          ${totalCatAmount.toLocaleString()} ({Math.round((totalCatAmount / totalAmount) * 100)}%)
          </TableCell>
        {this.getCell(weekDiff, weekDiffPerc, classes)}
        {this.getCell(yearDiff, yearDiffPerc, classes)}
      </TableRow>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    positions: state.position.positions,
    dates: state.position.dates,
    values: state.position.values,
    yearIndex: state.position.yearIndex
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getChart: (name,data) => dispatch(getChart(name,data)),
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(PositionRow));