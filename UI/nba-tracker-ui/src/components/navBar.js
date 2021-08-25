import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding:'2%',
    offset: theme.mixins.toolbar,
    
  },
  appBar:{
    backgroundColor: theme.navBarColor,
    background:"transparent",
    color: 'white',
    
    
  },
  menuButton: {
    marginRight: theme.spacing(2),
    autoWidth:'false'
  },
  title: {
    flexGrow: 1,
    textAlign: "center"
  }
}));

export default function NavBar(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} style ={{backgroundColor:props.navBarColor}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title} >
            NBA Tracker 
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
