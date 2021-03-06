import React /*, { useState, useEffect } */from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Typography, Tooltip, Zoom } from '@material-ui/core';
import uuid from 'uuid/v1';

import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  hidden: {
    display: 'none'
  },
  tableRow: {
    overflow: 'hidden',
    lineHeight: 0,
    borderBottom: '1px solid #E6E6E6',
    width: '30px'
  },
  tableHead: {
    minHeight: '50px',
    minWidth: '30px',
    display: 'inline-block',
    borderRight: '1px solid #E6E6E6'
  },
  popover: {
    pointerEvents: 'none'
  },
  paper: {
    padding: theme.spacing(1),
    boxShadow: 'none'
  }
}));

const CustomTooltip = withStyles({
  tooltip: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 12,
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)'
  }
})(Tooltip);

// CalendarRow shows visual dates for specific sample schedule in the calendar
export default function CalendarRow(props) {
  const classes = useStyles();
  //const [hidden, setHidden] = useState();

  const getStyle = () => {
    if (props.parentID == null) {
      return props.openRows.includes(props.id)
        ? classes.root
        : `${classes.hidden} ${classes.root}`;
    } else {
      return props.openRows.includes(props.id) &&
        props.openRows.includes(props.parentID)
        ? classes.root
        : `${classes.hidden} ${classes.root}`;
    }
  };

  const getStatusColor = (status, estimateValid) => {
    if (estimateValid) {
      return '#C9C9C9'; // Grey
    } else if (status === 'done') {
      return '#4CAF50'; // Green
    } else if (status === 'pending') {
      return '#FFC164'; // Yellow
    } else if (status === 'error') {
      return '#FF0000'; // Red
    } else if (status === 'waiting') {
      return '#800080'; // Purple
    } else if (status === 'planning') {
      return '#FFC164'; // Yellow
    } else if (status === 'delayed') {
      return 'blue'; // Yellow
    } else {
      return '#C9C9C9'; // Grey
    }
  };

  /*useEffect(() => {
    setHidden(props.openRows.includes(props.id));
  }, [props.id, props.openRows]);*/

  // Render the specific day block for the row
  const getDay = (day, operation) => {
    // Checks if estimate dates have been entered
    let estimatedStart = null;
    let estimatedEnd = null;
    if (operation.estimatedTimes) {
      console.log(operation);
      estimatedStart = moment(operation.estimatedTimes.startEstimate);
      estimatedEnd = moment(operation.estimatedTimes.endEstimate);
    }

    const currentDay = day.format('MM/DD/YYYY');
    let start = operation.initialize ? moment(operation.initialize) : null;
    let end =
      operation.complete || operation.aborted
        ? moment(operation.complete || operation.aborted)
        : null;

    let estimateValid = false;
    if (estimatedStart && estimatedEnd) {
      if (
        (estimatedStart.format('MM/DD/YYYY') <= currentDay &&
          estimatedEnd.format('MM/DD/YYYY') >= currentDay &&
          start.format('MM/DD/YYYY') > currentDay) ||
        end.format('MM/DD/YYYY') < currentDay
      ) {
        estimateValid = true;
        start = estimatedStart;
        end = estimatedEnd;
      }
    }
    if (estimateValid) {
      console.log(estimateValid);
    }

    // Checks if the operation has a valid date
    if (
      start &&
      end &&
      start.format('MM/DD/YYYY') <= currentDay &&
      end.format('MM/DD/YYYY') >= currentDay
    ) {
      return (
        <CustomTooltip
          TransitionComponent={Zoom}
          title={
            <React.Fragment key={operation.id + currentDay}>
              <Typography>
                <b>Name: </b>
                {props.name}
              </Typography>
              <Typography>
                <b>Status: </b>
                {operation.status}
              </Typography>
              <Typography>
                {estimateValid ? (
                  <Typography>
                    <b>Estimated Start: </b>
                    {start.format('MM/DD/YYYY')}{' '}
                  </Typography>
                ) : (
                  <Typography>
                    <b>Started: </b>
                    {start.format('LLL')}
                  </Typography>
                )}
              </Typography>
              <Typography>
                {estimateValid ? (
                  <Typography>
                    <b>Estimated Finish: </b>
                    {end.format('MM/DD/YYYY')}{' '}
                  </Typography>
                ) : (
                  <Typography>
                    <b>Finished: </b>
                    {end.format('LLL')}
                  </Typography>
                )}
              </Typography>
            </React.Fragment>
          }
        >
          <tr
            className={classes.tableRow}
            style={{
              backgroundColor: getStatusColor(operation.status, estimateValid)
            }}
          >
            <th className={classes.tableHead}></th>
          </tr>
        </CustomTooltip>
      );
    } else {
      return (
        <tr className={classes.tableRow} key={operation.id + currentDay}>
          <th className={classes.tableHead}></th>
        </tr>
      );
    }
  };

  // Render the row
  const row = props.daysInMonth.map(day => {
    return getDay(day, props.operation);
  });

  return (
    <tbody className={getStyle()} key={uuid()}>
      {/* <tbody className={getStyle()}> */}
      {row}
    </tbody>
  );
}
