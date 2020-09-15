import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Container, Tabs, Tab, Modal } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import TabPanel from '../../components/TabPanel';
import Overall from './Overall';
import Plan from './Plan';
import AddEditEvent from './AddFile';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles, lighten } from '@material-ui/core/styles';
import firebase from '../../firebase/firebase';
import { useHistory, useParams } from 'react-router';
import Gantt from '../../components/StrainGantt';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
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

function StrainConstructionProject() {
  const classes = useStyles();
  const session = useSelector(state => state.session);
  const [currentTab, setCurrentTab] = useState(0);
  const { id } = useParams();
  const history = useHistory();
  const [strainData, setStrainData] = useState();

  const handleChange = (event, newTab) => {
    setCurrentTab(newTab);
  };

  // Retrieves project data from Firebase
  const getProjectFromFirebase = async () => {
    var docRef = firebase.db.collection('projects').doc(id);
    await docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          getSamples(doc.data().folder);
        } else {
          history.push('/errors/error-404');
        }
      })
      .catch(function(error) {
        alert('Error getting project:', error);
        history.push('/overview');
      });
  };

  const getPlanTimeEstimate = plan => {
    const planID = plan.id + id;
    let planRef = firebase.db.collection('plans').doc(planID);
    planRef.get().then(doc => {
      if (doc.exists) {
        plan.estimatedTimes = doc.data();
      } else {
        plan.estimatedTimes = null;
      }
    });
  };

  // Retrieves Plan data from Aquarium
  const getSamples = async folder => {
    const response = await fetch('http://localhost:4000/plans/folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: session.user.aqLogin,
        password: session.user.aqPassword,
        folder: folder
      })
    });
    if (response.status === 200) {
      const data = await response.json();
      data.map(plan => {
        getPlanTimeEstimate(plan);
      });
      const result = data.reverse();
      console.log(data);
      setStrainData(data);
    } else {
      setStrainData([]);
    }
  };

  useEffect(() => {
    getProjectFromFirebase();
  }, []);

  return (
    <Page className={classes.root} title={'Strain Construction Project'}>
      <Container maxWidth={false}>
        <Header currentTab={currentTab} />
        <Tabs
          value={currentTab}
          onChange={handleChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
        >
          <Tab label="Strains" />
          {/* <Tab label="Plans" /> */}
        </Tabs>
        <TabPanel value={currentTab} index={0}>
          {strainData != null ? <Gantt data={strainData} /> : null}
        </TabPanel>
        {/* <TabPanel value={currentTab} index={1}>
          <Plan />
        </TabPanel> */}
      </Container>
    </Page>
  );
}

export default StrainConstructionProject;
