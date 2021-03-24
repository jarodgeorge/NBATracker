import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { CardActionArea, CardActions, CardHeader, Hidden } from '@material-ui/core';
import celtics from '../logos/Celtics.png'
import logoArr from './logos'
import Popup from './popup'



// figure out how many rows/cols
//add title etc

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignContent:'center',
    paddingLeft:"1%"

  },
  card:{
    background: "#f1f1f1",
    '&:hover': {
       transform: "scale3d(1.1, 1.1, 1.1)"
    },

  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  media: {
    paddingTop: '100%',
    // height:150,
    // weidth:150
  },
  header:{
    textAlign: 'center'

  }
}));



export default function TeamGrid() {
  //https://gist.github.com/jerhinesmith/258eab7a892c87769115
  //http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/bkn.png
  //sample CDN if we need to move from local images

  const handleClickOpen = (teamName) => {
    setOpen(true);
    selectedTeam=teamName;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  const teams = ["76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks", "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic", "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans", "Pistons", "Raptors", "Rockets", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers", "Warriors", "Wizards"];
  const teamMap = teams.map((t,i) => [t,logoArr[i]]);
  const [open, setOpen] = React.useState(false);
  let selectedTeam ="Bulls";
  const allTeams = teamMap.map(element =>(
    <>
    <Grid item xs={2}>
      <CardActionArea  className={classes.card} onClick={handleClickOpen}>
        
        <CardHeader className={classes.header}
        title={element[0]}
        />
        <CardMedia
          className={classes.media}
          image={element[1]}
        />
      </CardActionArea>
    </Grid>
    
    </>
  ));


  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid container item xs={12} spacing={3}>
          {allTeams}
        </Grid>
      </Grid>
      <Popup open={open} selectedTeam ={selectedTeam} onClose={handleClose} />
    </div>
  );
}
