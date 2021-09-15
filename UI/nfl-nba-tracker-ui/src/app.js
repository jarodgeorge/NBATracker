import React from 'react';
import TeamGrid from './components/teamGrid.js'
import NavBar from './components/navBar.js'

//add hover
// figure out how many rows/cols
//add title etc

export default function App() {
  const [navBarColor,setNavBarColor] = React.useState("blue");
  const [league,setLeague] = React.useState("NFL");
  return (
    <>
    <NavBar navBarColor={navBarColor} league={league} setLeague={setLeague}  />
    <TeamGrid navBarColor={navBarColor} setNavBarColor={setNavBarColor} league={league}  />
    </>
  );
}
