import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Image from '../../assets/home.jpg'

const useStyles = makeStyles(theme => ({
  main: {
    position: 'relative',
    marginBottom: theme.spacing(4),
    color: theme.palette.common.white,
    backgroundImage: `url(${Image})`,
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: "100%"
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    marginTop: theme.spacing(10),
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
    marginBottom: theme.spacing(40)
  },
}));


export default function Home() {
  const classes = useStyles();

  return (
    <React.Fragment>
        <main>
          {/* Main featured post */}
          <Paper className={classes.main}>
            <div className={classes.overlay} />
            <Grid container>
              <Grid item md={6}>
                <div className={classes.mainFeaturedPostContent}>
                  <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                    Manage different asset classes in one place
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>        
        </main>
    </React.Fragment>
  );
}