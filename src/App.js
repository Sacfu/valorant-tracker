import axios from 'axios';
import React,  {useState}  from 'react';
import './App.css';


//family#2501

function App() {
  const [searchText, setSearchText] = useState("");
  const [playerTag, setPlayerTag] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [rankedData, setRankedData] = useState({});
  const [matchHistory, setMatchHistory] = useState({});
  console.log(searchText)
  console.log(playerTag);

  async function searchForPlayer(event){
    var APICallString = "https://api.henrikdev.xyz/valorant/v1/account/" + searchText + "/" + playerTag;
     await axios.get(APICallString).then(function(response) {
   setPlayerData(response.data.data);
   getRankedData();
    }).catch(function(error){
      console.log(error);
    })
  }
  // console.log(playerData)

  async function getRankedData(){
    var APIRankedData = "https://api.henrikdev.xyz/valorant/v1/mmr/na/"  + searchText + "/" + playerTag;
    await axios.get(APIRankedData).then(function(response){
      setRankedData(response.data.data);
      getMatchHistory();
    }).catch(function(error){
      console.log(error);
    })
  }
  // console.log(rankedData);

  async function getMatchHistory(){
    var APIMatchHistory = "https://api.henrikdev.xyz/valorant/v3/matches/na/"  + searchText + "/" + playerTag;
    await axios.get(APIMatchHistory).then(function(response){
      setMatchHistory(response.data.data);
    }).catch(function(error){
      console.log(error);
    })
  }
  console.log(matchHistory[0])

  // var playerPuuid = {
  //   puuid: playerData.puuid,
  // }
  // var gameOneStats = matchHistory[0].players.all_players;
  
  // const filterResults = gameOneStats.filter(element => {

  //   //return element.id === playerPuuid;
  //   return element.puuid === '958f7239-83ba-5cdd-9d80-337b10b6a5ed'
  // });

  // console.log("hi " + JSON.stringify(filterResults) + "hi");

  return (
    <div className="App">
      <h4> Valorant Player Info </h4>
      <input type = 'text' placeholder="username" onChange = {e => setSearchText(e.target.value)}></input>
      <input type = 'text' placeholder='playertag' onChange = {e => setPlayerTag(e.target.value)}></input>
      <button onClick = {e => {searchForPlayer(e);}}>Search for Player</button>
      {(JSON.stringify(playerData) && JSON.stringify(rankedData) && JSON.stringify(matchHistory))  != '{}' ? 
      
      <>
      
      <p>{playerData.name}</p>
      <p>Account level: {playerData.account_level}</p>
      <img width="150" height = "300" src={playerData.card.large}></img>
      <img width="150" height = "150" src={rankedData.images.large}></img>
      <p>Last Played Game:</p> 
      <p>{matchHistory[0].metadata.map}</p>
      <p>{matchHistory[0].metadata.mode}</p>
      
      <p>{matchHistory[0].players.all_players[0].character}</p>
      
      
      </> : 
      <><p>No data available! Try another player.</p></>
      }

      <h5> Ranked Data </h5>
      
    </div>
    
 );

}

export default App;
