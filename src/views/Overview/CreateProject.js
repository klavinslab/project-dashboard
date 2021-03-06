/* eslint-disable react/display-name */
import React, { useState, forwardRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import uuid from 'uuid';
import { makeStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  IconButton
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import firebase from '../../firebase/firebase';
/*import {
  KeyboardDatePicker
} from '@material-ui/pickers';
import { repeat } from 'lodash';*/

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  title: {
    marginTop: theme.spacing(1),
    paddingBottom: 0
  },
  field: {
    marginTop: theme.spacing(3)
  },
  cancelButton: {
    marginLeft: 'auto'
  },
  confirmButton: {
    color: theme.palette.common.white,
    backgroundColor: '#065683',
    '&:hover': {
      backgroundColor: '#065683'
    },
    margin: theme.spacing(1)
  },
  closeIcon: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(30)
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none'
  },
  chip: {
    backgroundColor: '#bfbfbf'
  },
  formControl: {
    marginTop: theme.spacing(3),
    minWidth: '100%'
  }
}));

const CustomTypography = withStyles(theme => ({
  h3: {
    color: '#05486E'
  }
}))(Typography);

const defaultEvent = {
  title: 'Enter your project name',
  type: 'Enter your project type',
  desc: 'Enter your project description',
  direc: 'Choose your Aquarium project',
  start: moment(),
  end: moment(),
  dur: 'Project Duration',
  contr: 'Enter name',
  role: 'Select Role'
};

const CreateProject = forwardRef((props, ref) => {
  const {
    show,
    setShow,
  } = props;
  const classes = useStyles();
  const session = useSelector(state => state.session);
  const projectTypes = [
    {
      value: 'Basic',
      label: 'Basic'
    },
    {
      value: 'Protein Design',
      label: 'Protein Design'
    },
    {
      value: 'Strain Construction',
      label: 'Strain Construction'
    }
  ];
  const [type, setType] = useState('Basic');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('Owner');
  const roleTypes = [
    {
      value: 'Owner',
      label: 'Owner'
    },
    {
      value: 'Manager',
      label: 'Manager'
    },
    {
      value: 'Contributor',
      label: 'Contributor'
    }
  ];
  const [folder, setFolder] = useState();
  const [contributor, setContributor] = useState('');
  const [chipData, setChipData] = useState([
    {
      key: 0,
      label: session.user.firstName + ' ' + session.user.lastName,
      role: 'Owner'
    }
  ]);
  const [title, setTitle] = useState('');
  //const [start, setStart] = useState(moment().format('MM/DD/YYYY'));
  //const [end, setEnd] = useState(moment().format('MM/DD/YYYY'));
  const [aquariumFolders, setAquariumFolders] = useState([]);
  const projectID = useState(uuid());

  const handleTypeChange = event => {
    setType(event.target.value);
  };

  /*const handleStartDate = event => {
    setStart(event.target.value);
  };

  const handleEndDate = event => {
    setEnd(event.target.value);
  };*/

  const handleContributorName = ({ target }) => {
    setContributor(target.value);
  };

  const handleRoleChange = event => {
    setRole(event.target.value);
  };

  const handleFolderChange = event => {
    setFolder(event.target.value);
  };

  const handleAddChip = () => {
    setChipData(chips => [
      ...chips,
      { key: chips.length + 1, label: contributor, role: role }
    ]);
  };

  const handleChipDelete = chipToDelete => () => {
    setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };

  const handleClose = () => {
    setShow(false);
  };

  /*const handleFieldChange = e => {
    e.persist();
    setValues(prevValues => ({
      ...prevValues,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };*/

  const handleProjectTitle = event => {
    setTitle(event.target.value);
  };

  const handleDescription = event => {
    setDescription(event.target.value);
  };

  const handleCreateProject = () => {
    firebase.db
      .collection('projects')
      .doc(projectID)
      .set({
        title: title,
        owner: session.user.firstName + ' ' + session.user.lastName,
        description: description,
        folder: folder,
        members: {
          // managers: chipData.map(chips =>
          //   chips.filter(chip => chip.role === 'Manager')
          // ),
          // collaborators: chipData.map(chips =>
          //   chips.filter(chip => chip.role === 'Collaborator')
          // )
        },
        type: type,
        status: 'pending',
        id: projectID
      })
      .then(() => {
        window.location.reload();
      })
      .catch(function(error) {
        console.error('Error creating project: ', error);
      });
    handleClose();
  };

  

  useEffect(() => {
    const fetchAquariumPlanFolders = async () => {
      const response = await fetch('http://localhost:4000/plans/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: session.user.aqLogin,
          password: session.user.aqPassword
        })
      });
      if (response.status === 200) {
        const folders = await response.json();
        setAquariumFolders(JSON.parse(folders.data));
      }
    };
    fetchAquariumPlanFolders();
  }, [session.user.aqLogin,session.user.aqPassword]);

  return (
    <Dialog open={show} onClose={handleClose} className={classes.root}>
      <form onSubmit={handleCreateProject}>
        <DialogTitle className={classes.title}>
          <Grid container spacing={20}>
            <Grid item md={6} xs={12}>
              <CustomTypography align="left" gutterBottom variant="h3">
                Create Project
              </CustomTypography>
            </Grid>
            <Grid item md={6} xs={12}>
              <IconButton
                className={classes.closeIcon}
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            className={classes.field}
            fullWidth
            label="Project Name"
            name="Project Name"
            onChange={handleProjectTitle}
            placeholder={defaultEvent.title}
            variant="outlined"
          />
          <TextField
            required={true}
            className={classes.field}
            fullWidth
            select
            SelectProps={{
              native: true
            }}
            label="Project Type"
            name="type"
            onChange={handleTypeChange}
            value={type}
            variant="outlined"
          >
            {projectTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            required={true}
            className={classes.field}
            fullWidth
            label="Project Description"
            name="desc"
            onChange={handleDescription}
            placeholder={defaultEvent.desc}
            value={description}
            variant="outlined"
          />
          <TextField
            required={true}
            className={classes.field}
            fullWidth
            select
            SelectProps={{
              native: true
            }}
            label="Aquarium Plan Folder"
            value={folder}
            onChange={handleFolderChange}
            placeholder={defaultEvent.direc}
            variant="outlined"
          >
            <option value="" />
            {aquariumFolders.map(folder =>
              folder != null ? <option value={folder}>{folder}</option> : null
            )}
          </TextField>
          {/* <TextField
            required={true}
            className={classes.field}
            defaultValue={moment().format('YYYY-MM-DD')}
            style={{ width: '35%', marginRight: 10 }}
            margin="normal"
            label="Project Start Date"
            name="start"
            onChange={handleStartDate}
            type="date"
            variant="outlined"
          />
          <TextField
            required={true}
            className={classes.field}
            defaultValue={moment().format('YYYY-MM-DD')}
            style={{ width: '35%', marginRight: 10 }}
            margin="normal"
            label="Projected End Date"
            name="end"
            onChange={handleEndDate}
            type="date"
            variant="outlined"
          />

          <TextField
            disabled
            className={classes.field}
            label="Project Duration(days)"
            name="dur"
            style={{ width: '25%', float: 'right' }}
            margin="normal"
            onChange={handleFieldChange}
            defaultValue={moment(end).diff(moment(start), 'days')}
            multiline
            variant="filled"
          /> */}
          <TextField
            className={classes.field}
            style={{ width: '40%', marginRight: 10 }}
            label="Project Contributors"
            name="contr"
            onChange={handleContributorName}
            placeholder={defaultEvent.contr}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            style={{ width: '40%', marginRight: 10 }}
            select
            SelectProps={{
              native: true
            }}
            label="Role"
            name="role"
            onChange={handleRoleChange}
            placeholder={role}
            variant="outlined"
          >
            {roleTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <Button
            className={classes.field}
            style={{
              width: '16%',
              padding: '15px'
            }}
            margin="normal"
            onClick={handleAddChip}
            variant="contained"
          >
            + Add
          </Button>
          <ul className={classes.chipList}>
            {chipData.map(data => {
              return (
                <li key={data.key} className={classes.field}>
                  <Chip
                    label={data.label + ' - ' + data.role}
                    onDelete={
                      data.role === 'Owner' ? undefined : handleChipDelete(data)
                    }
                    className={classes.chip}
                  />
                </li>
              );
            })}
          </ul>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            className={classes.cancelButton}
            onClick={handleClose}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            className={classes.confirmButton}
            type="submit"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

export default CreateProject;
