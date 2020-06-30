import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container, Tabs, Tab, Modal, Typography } from '@material-ui/core';
import Page from 'src/components/Page';
import KanbanBoard from '../../components/KanbanBoard';
import Gantt from '../../components/Gantt';
import Header from './Header';
import TabPanel from '../../components/TabPanel';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles, lighten } from '@material-ui/core/styles';
import kanbanData from './mockKanbanData';
import mockGanttData from './mockGanttData';
import PlanTable from 'src/components/Plans/PlanTable';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height: '100%'
  },
  progress: {
    margin: theme.spacing(2)
  },
  tabs: {
    height: '30px'
  },
  panel: {
    color: theme.palette.primary.main
  },
  addIcon: {
    marginRight: theme.spacing(1)
  }
}));

const CustomLinearProgress = withStyles(theme => ({
  root: {
    height: 5,
    backgroundColor: lighten(theme.palette.success.main, 0.5)
  },
  bar: {
    borderRadius: 20,
    backgroundColor: theme.palette.success.main
  }
}))(LinearProgress);

function ProteinDesignProject() {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventModal, setEventModal] = useState({
    open: false,
    event: null
  });
  const [progress, setProgress] = useState([80]);
  const [ganttData, setGanttData] = useState();

  const handleEventNew = () => {
    setEventModal({
      open: true,
      event: null
    });
  };

  const handleModalClose = () => {
    setEventModal({
      open: false,
      event: null
    });
  };

  const handleEventAdd = event => {
    setEvents(currentEvents => [...currentEvents, event]);
    setEventModal({
      open: false,
      event: null
    });
  };

  const handleChange = (event, newTab) => {
    setCurrentTab(newTab);
  };

  useEffect(() => {
    async function getSamples() {
      const response = await fetch('http://localhost:4000/testAPI/plans');
      const data = await response.json();
      setGanttData(data);
    }
    getSamples();
  }, []);

  // Conditional popup button action, rendered differently based on the respective action necessary for the project tab
  const getModal = () => {
    if (currentTab === 0) {
      return <Modal onClose={handleModalClose} open={eventModal.open}></Modal>;
    } else if (currentTab === 1) {
      return <Modal onClose={handleModalClose} open={eventModal.open}></Modal>;
    } else {
      return <Modal onClose={handleModalClose} open={eventModal.open}></Modal>;
    }
  };

  return (
    <Page className={classes.root} title="Strain Construction Project">
      <Container maxWidth={false}>
        <Header currentTab={currentTab} onEventAdd={handleEventNew} />
        <div className={classes.progress}>
          <Typography gutterBottom variant="h6">
            8 tasks completed out of 10
          </Typography>
          <CustomLinearProgress
            variant="determinate"
            value={progress}
            color="primary"
          />
        </div>

        <Tabs
          value={currentTab}
          onChange={handleChange}
          indicatorColor="primary"
        >
          <Tab label="Kanban" />
          <Tab label="Gantt" />
          <Tab label="Plans" />
        </Tabs>
        <TabPanel value={currentTab} index={0}>
          <KanbanBoard data={kanbanData} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Gantt data={mockGanttData} />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <PlanTable />
        </TabPanel>
        {getModal()}
      </Container>
    </Page>
  );
}

export default ProteinDesignProject;
