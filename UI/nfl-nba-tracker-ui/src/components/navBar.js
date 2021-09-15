import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {leagueLogoList} from './team-logos';



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
  },
  toolbar:{
    // flexGrow:1,
    alignContent:"center",
    align:"center",
    justifyContent:"center"
  },
  nbaButton:{
    // flexGrow:1,
    alignContent:"center",
    align:"center",
    justifyContent:"center",
    margin: theme.spacing(1),
    marginRight: theme.spacing(-3),
    marginLeft: theme.spacing(6),
    fontSize:"2em"
  },
  nflButton:{
    // flexGrow:1,
    alignContent:"center",
    align:"center",
    justifyContent:"center",
    margin: theme.spacing(1),
    marginRight: theme.spacing(6),
    marginLeft: theme.spacing(-3),
    fontSize:"2em"
  },
  logo: {

    // textAlign: 'center',
    maxWidth: '150px',
    maxHeight: '150px',
    
  },
}));

export default function NavBar(props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} style ={{backgroundColor:props.navBarColor}}>
        <Toolbar className={classes.toolbar}>
          <img src={leagueLogoList[0]} alt="logo" className={classes.logo}/>
          <Button variant="contained"  className={classes.nflButton} color={props.league==="NFL" ? "primary" :"default"}  align="center" onClick={() => props.setLeague("NFL")}>
          NFL
          </Button>
          <Button variant="contained" className={classes.nbaButton} color={ (props.league==="NBA") ? "primary" : "default"} onClick={() => props.setLeague("NBA")} >NBA</Button>
          <img src={leagueLogoList[1]} alt="logo" className={classes.logo}/>
        </Toolbar>
      </AppBar>
    </div>
  );
}
