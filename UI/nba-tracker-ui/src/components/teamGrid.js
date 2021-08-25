import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import { CardActionArea, CardHeader } from '@material-ui/core';
import logoArr from './logos'
import Popup from './popup'
import SnackBar from './snackBar'


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
    textAlign: 'center',
    overflow:"hidden"

  }
}));



export default function TeamGrid(props) {
  //https://gist.github.com/jerhinesmith/258eab7a892c87769115
  //http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/bkn.png
  //sample CDN if we need to move from local images

  const changeColor = (color) =>{
    props.setNavBarColor(color);
  }
  const handleClickOpen = (teamName) => {
    setOpen(true);
    setTeam(teamName);

  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleOpenSnack = () => {
    setOpenSnack(true);
  };
  const handleCloseSnack = () => {
    setOpenSnack(false);
  };



  const classes = useStyles();
  const teams = ["76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks", "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic", "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans", "Pistons", "Raptors", "Rockets", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers", "Warriors", "Wizards"];
  const colorMap = {"76ers":"#006bb6", "Bucks":"#00471b", "Bulls":"#ce1141", "Cavaliers":"#ffb81c ", "Celtics":"#008000", "Clippers":"#061922", "Grizzlies":"#12173f", "Hawks":"#e03a3e", "Heat":"#98002e", "Hornets":"#1d1160", "Jazz":"#0d2240", "Kings":"#5b2b82", "Knicks":"#f58426", "Lakers":"#fdb927", "Magic":"#0b77bd", "Mavericks":"#1d428a", "Nets":"#000000", "Nuggets":"#0d2240", "Pacers":"#fdbb30", "Pelicans":"#b4975a", "Pistons":"#1d428a", "Raptors":"#a1a1a4", "Rockets":"#ce1141", "Spurs":"#c4ced4", "Suns":"#1d1160", "Thunder":"#002d62", "Timberwolves":"#0c2340", "Trail Blazers":"#cf0a2c", "Warriors":"#fdb927", "Wizards":"#e31837"};
  const teamMap = teams.map((t,i) => [t,logoArr[i]]);
  const [open, setOpen] = React.useState(false);
  const [team, setTeam] = React.useState("Selected Team");
  const [openSnack, setOpenSnack] = React.useState(false);
  //https://www.youtube.com/watch?v=GYTN5JdkLSQ&ab_channel=TheNetNinja

  const allTeams = teamMap.map(element =>(
    <Grid key={element[0]} item xs={4} sm ={4}  md={2}>
      <CardActionArea  key={element[0]} className={classes.card} onClick={() => handleClickOpen(element[0])} onMouseEnter={() => changeColor(colorMap[element[0]])} >
        
        <CardHeader className={classes.header}
        title={element[0]}
        />
        <CardMedia
          className={classes.media}
          image={element[1]}
        />
      </CardActionArea>
    </Grid>
  ));


  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid container item xs={12} spacing={3}>
          {allTeams}
        </Grid>
      </Grid>
      <Popup open={open} selectedTeam={team} onClose={handleClose} onOpenSnack={handleOpenSnack}/>
      <SnackBar openSnack={openSnack} onCloseSnack={handleCloseSnack} selectedTeam={team}/>
    </div>
  );
}
