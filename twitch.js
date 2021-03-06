//Twitch API fetch
//Get your Tokens and clientID generated by https://twitchtokengenerator.com/
//***NOTE: Some features are only available if you've added the corresponding token scopes for greater access***
var accessToken = "";
var refreshToken = "";
var clientID = "";


function showTab(id, tabId) {
	for (element of document.getElementsByClassName("titleTabs")) {
		if (element.id == id) {
			document.getElementById(tabId).style.display = "block";
			document.getElementById(id).style.backgroundColor = "red";
		} else {
			document.getElementById(element.id).style.backgroundColor = "transparent";
			document.getElementById(element.id + "Tab").style.display = "none";
		}
	}
}

var channelName = "xfoofoo";
function fetchBasicInfo(channelName) {

	fetch("https://api.twitch.tv/helix/search/channels?query=" + channelName, {

		method: "GET",
		headers: {
			"Accept": "application/json",
            "client-id": clientID,
            "Authorization": "Bearer " + accessToken,
		}
	})
		.then((response) => { return response.json() })
		.then(data => {
            let inject = "";
            data.data.forEach((channel) => {
                if (channel.display_name.toLowerCase() == channelName){
                    inject += channel.display_name + "<br>"
                    + '<img class="Picture" src=' + '"' + channel.thumbnail_url + '" ' + 'alt="Gif not displaying correctly" />' + "<br>"
                    + "Live Now? " + channel.is_live.toString().toUpperCase() + "<br>";

                    document.getElementById("homeTab").innerHTML = inject;
                }	
            })
        })
}

var cheerCount = "100";
var period = "all";
var user_id = "";
/*Expand the tier as the channel grows, these are in increasing order */
var bitsAmount = [1, 100, 1000, 5000, 10000];
var bitsBadge = ["https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/1", "https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/1", 
"https://static-cdn.jtvnw.net/badges/v1/0d85a29e-79ad-4c63-a285-3acd2c66f2ba/1", "https://static-cdn.jtvnw.net/badges/v1/57cd97fc-3e9e-4c6d-9d41-60147137234e/1", 
"https://static-cdn.jtvnw.net/badges/v1/68af213b-a771-4124-b6e3-9bb6d98aa732/1"];

function fetchBitLeaderboard(cheerCount, period, user_id) {

	fetch("https://api.twitch.tv/helix/bits/leaderboard?count=" + cheerCount + "&period=" + period + "&user_id=" + user_id, {

		method: "GET",
		headers: {
			"Accept": "application/json",
            "client-id": clientID,
            "Authorization": "Bearer " + accessToken,
		}
	})
		.then((response) => { return response.json() })
		.then(data => {

            let inject = "";
            let bitsBadgeURL = "";
            data.data.forEach((user) => {
                var i;
                for (i = 0; i < bitsAmount.length - 1 ; i++){
                    //need to compare with the next tier, otherwise assign current tier
                    if (user.score < bitsAmount[i+1]){
                        bitsBadgeURL = bitsBadge[i];
                        break;
                    } 
                }
                if (user.score > Math.max(bitsAmount)){
                    bitsBadgeURL = bitsBadge[-1];
                }

                inject += "<tr>"
                + "<td>" + user.rank + "</td>"
                + "<td>" + user.user_name + "</td>"
                + "<td>" + user.score + ' <img class="smallImage" src="' + bitsBadgeURL + '"></td>'
                + "</tr>";
                })	
                /*may have problems where the injection keeps adding on the initial header in the html */
                document.getElementById("leaderboardsTable").innerHTML += inject;
                document.getElementById("resultsReturned").innerHTML = "Top " + data.total + " Cheerers";
            })
            
}



function startUpFunctions() {
    showTab("home", "homeTab");
	fetchBasicInfo(channelName);
    fetchBitLeaderboard(cheerCount, period, user_id);
}
window.onload = startUpFunctions();