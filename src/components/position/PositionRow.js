import React, { Component } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class PositionRow extends Component {
    
    render() {
        const position = this.props.position
        return (
            <TableRow key={position.id}>
            <TableCell 
              component="th" 
              scope="row" >
              {position.category}
            </TableCell>
            <TableCell size='small'>{position.item}</TableCell>
            <TableCell align="right">{position.amount}</TableCell>
            <TableCell>{position.location}</TableCell>
          </TableRow>
        );
    }
}

export default PositionRow;