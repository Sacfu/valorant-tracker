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

  //Grabs basic player info from API
  async function searchForPlayer(event){
    var APICallString = "https://api.henrikdev.xyz/valorant/v1/account/" + searchText + "/" + playerTag;
     await axios.get(APICallString).then(function(response) {
   setPlayerData(response.data.data);
   getRankedData();
   //console.log(JSON.stringify(playerData) + "this is playerdata")
    }).catch(function(error){
      console.log(error);
    })
  }

  //Uses another API call to retrieve ranked history
  async function getRankedData(){
    var APIRankedData = "https://api.henrikdev.xyz/valorant/v1/mmr/na/"  + searchText + "/" + playerTag;
    await axios.get(APIRankedData).then(function(response){
      setRankedData(response.data.data);
      getMatchHistory();
      console.log(rankedData)
      console.log('ranked data above')
    }).catch(function(error){
      console.log(error);
    })
  }

  //API call for match history data
  async function getMatchHistory(){
    var APIMatchHistory = "https://api.henrikdev.xyz/valorant/v3/matches/na/"  + searchText + "/" + playerTag;
    await axios.get(APIMatchHistory).then(function(response){
      setMatchHistory(response.data.data);
     console.log(matchHistory)
     console.log('match history above')
    }).catch(function(error){
      console.log(error);
    })
  }
  console.log(matchHistory[0])
  
//Sorts info from players in a game to match the player that was
 var recentlyPlayedCharacter;
 var killsAmount;
 var deathsAmount;
 var characterImage;
 var redTeam = false;
 

 function lastPlayedGame(){
  
  const gameOneStats = matchHistory[0].players.all_players;
  console.log(gameOneStats)
  console.log('gameone stats above')
   const filterResults = gameOneStats.filter(element => {
    return element.puuid === playerData.puuid;
  });
  if(filterResults[0] === undefined){
    const filterResults = gameOneStats.filter(element => {
      return element.puuid === playerData.puuid;
    }); return filterResults;
  } else {
    recentlyPlayedCharacter = filterResults[0].character;
    killsAmount = filterResults[0].stats.kills;
    deathsAmount = filterResults[0].stats.deaths;
    characterImage = filterResults[0].assets.agent.full;
  }
  
  console.log(filterResults)
  console.log('filter results above')
 
  if (filterResults[0].team === 'Red'){
    redTeam = true;
  }
 
  console.log(redTeam)
  console.log(JSON.stringify(filterResults) + 'ffiiiii')
  console.log(characterImage + 'charr')
}

var filterTeammates = [];
var filterEnemies = [];


function showFriendlyTeam(){
  var gameOneStats = matchHistory[0].players.all_players;
  
    filterTeammates = gameOneStats.filter(element => {
    if(redTeam === true){
     if (element.team === 'Red'){
      return element.team
      //can change below if statement to show enemies
     } else if (element.team === 'Blue'){
      return;
     }
    }
    else if(redTeam === false){
      if(element.team === 'Blue'){
        return element.team === 'Blue';
      //can change below if statement to show enemies
    } else if(element.team === 'Red'){
      return;
    }
  }
});
  console.log(filterTeammates);
  console.log("filtered team above")
//traverse array to get info

//Grab specific info from friendly teammates


// console.log(mateNames)
// console.log("mate names above")
// console.log(mateTags)
// console.log("mate tags above")

}

// const mateNames = filterTeammates.map((a) => {
//   return {name:a.name}
// });
// const mateTags = filterTeammates.map((a) => {
//   return {tag:a.tag}
// });
// const mateCharacter = filterTeammates.map((a) => {
//   return {character:a.character}
// });
// const mateKills = filterTeammates.map((a) => {
//   return {kills:a.kills}
// });
// const mateDeaths = filterTeammates.map((a) => {
//   return {deaths:a.deaths}
// });




console.log((filterEnemies) + "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")





  return (
    <div className="App">
      <h4> Valorant Player Info </h4>
      <input type = 'text' placeholder="username" onChange = {e => setSearchText(e.target.value)}></input>
      <input type = 'text' placeholder='playertag' onChange = {e => setPlayerTag(e.target.value)}></input>
      <button onClick = {e => {searchForPlayer(e);}}>Search for Player</button>
      {(matchHistory) !== '[]' && (JSON.stringify(playerData) && JSON.stringify(rankedData) && JSON.stringify(matchHistory))  !== '{}' ? 
      
      <>
      {lastPlayedGame()}
      {showFriendlyTeam()}
      
      <p>{playerData.name}</p>
      <p>Account level: {playerData.account_level}</p>
      <img width="150" height = "300" src={playerData.card.large}></img>
      <img width="150" height = "150" src={rankedData.images.large}></img>
      <p>Last Played Game:</p> 
      <p>{matchHistory[0].metadata.map}</p>
      <p>{matchHistory[0].metadata.mode}</p>
      <h5> Recent Game Data: </h5>
      <p> Agent played: {JSON.stringify(recentlyPlayedCharacter)} </p>
      <img width="400" height = "400" src={characterImage}></img>
      <p>Kills: {killsAmount}</p>
      <p>Deaths: {deathsAmount}</p>
      
      <div className="container">  
        <h1> Team Composition </h1>  
     
        <table className="table table-bordered">  
            <tr>  
                <th>name</th>  
                <th>tag</th>  
                <th>character</th>  
                <th>kills</th>
                <th>deaths</th>
            </tr>  
    
            {filterTeammates.map((player, index) => (  
              <tr data-index={index}>  
                <td>{player.name}</td>  
                <td>{player.tag}</td>  
                <td>{player.character}</td>  
                <td>{player.stats.kills}</td>
                <td>{player.stats.deaths}</td>
              </tr>  
            ))}  
    
        </table>  
    
    </div>  

      </> : 
      <><p>No data available! Try another player.</p></>
      }

      
      
    </div>
    
 );

}

export default App;
