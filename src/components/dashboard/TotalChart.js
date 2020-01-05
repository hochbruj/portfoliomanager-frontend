import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer,Tooltip } from 'recharts';
import Typography from '@material-ui/core/Typography';


export default function TotalChart(props) {
    const chart = props.chart
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {chart.name} Performance
    </Typography>
      <ResponsiveContainer>
        <LineChart
          data={chart.data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis
            type="number"
            domain={['dataMin', 'dataMax']} >
          </YAxis>
          <Tooltip />
          
          <Line type="monotone" dataKey="value" stroke="#556CD6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}