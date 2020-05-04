import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Divider } from '@material-ui/core';
import LibraryTab from './LibraryTab';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '2px'
  },
  taskList: {
    background: theme.palette.white.main,
    height: '80vh'
  },
  calendar: {
    background: theme.palette.white.main,
    height: '80vh'
  },
  topBar: {
    background: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '50px',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderTopLeftRadius: '3px',
    marginBottom: theme.spacing(0.2)
  }
}));

export default function Gantt(props) {
  const classes = useStyles();
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    const libraries = [];
    for (const list of props.data.libraries) {
      libraries.push({ ...list, items: [] });
    }
    setLibraries(libraries);
  }, []);

  const libraryTabs = libraries.map(library => (
    <LibraryTab library={library} />
  ));

  return (
    <Grid container className={classes.root}>
      <Grid item xs={3} className={classes.taskList}>
        <Grid container className={classes.topBar}>
          <Grid item>
            <Typography variant="h4">Library</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4">Owner</Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.libraries}>
          {libraryTabs}
        </Grid>
      </Grid>
      <Grid item xs={9} className={classes.calendar}>
        Calendar
      </Grid>
    </Grid>
  );
}
