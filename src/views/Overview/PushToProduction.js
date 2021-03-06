import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#FAFAFA'
  },
  content: {
    padding: theme.spacing(1)
  }
}));

const options = ['All', 'Protein Design', 'Strain Construction'];

function PushToProduction({ customer, className, ...rest }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Grid container>
        <Grid item xs={10}>
          <CardHeader title="Push To Production" />
        </Grid>
        <Grid item xs>
          <IconButton onClick={handleClick}>
            <FilterListIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {options.map(option => (
              <MenuItem
                key={option}
                selected={option === 'All'}
                onClick={handleClose}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>
      <Divider />
      <CardContent className={classes.content}></CardContent>
    </Card>
  );
}

export default PushToProduction;
