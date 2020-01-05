import React, { PureComponent, Fragment } from 'react';
import { PieChart, Pie, Sector } from 'recharts';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`$ ${value.toLocaleString()}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


class TotalChart extends PureComponent {

  state = {
    activeIndex: 0,
    data: []
  };

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  getData() {
    const { positions, dates, values} = this.props
    let data = []
    let shortAmount
    if (positions && values && dates) {
      let date = dates[dates.length - 1]
      // get all categories
      Array.from(new Set(positions.map(s => s.category))).forEach((category) => {
        let positionIds = positions.reduce((ids, position) => {
            if (position.category === category) {
              ids.push(position.id);
            }
            return ids;
          }, [])
  
        let valuesFil = values.filter(value => value.date.seconds === date.seconds)
        valuesFil = valuesFil.filter(value => positionIds.includes(value.positionId))
        let valuesFilAmount = valuesFil.reduce((a, b) => (a + b.amount * b.quote), 0)
        
        if (category === 'Stock Short') {
          shortAmount = Math.round(valuesFilAmount)
        } else {
          let dataElement = {
            name: category,
            value: Math.round(valuesFilAmount)
          }
          data.push(dataElement)
        }
        
      })       
    }

    //substract short from cash position
    data.forEach((e) => {
      if (e.name === 'Cash') {
        e.value = e.value + shortAmount
      }
    })

    return data       
  }

  render() {
    return (
      <Fragment>
        <Typography component="h2" variant="h6" color="primary">
          Total asset allocation
                      </Typography>
        <PieChart width={450} height={400} >
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.getData()}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#6200EE"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
          />
        </PieChart>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.firebase.profile,
    positions: state.position.positions,
    values: state.position.values,
    dates: state.position.dates,
    yearIndex: state.position.yearIndex
  }
}

export default
  connect(mapStateToProps)(TotalChart);