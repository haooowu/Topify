const spotifyApp = {};
const canadaTop = "37i9dQZEVXbKj23U1GF4IR";
const canadaViral = "37i9dQZEVXbKfIuOAZrk7G";
const globalTop = "37i9dQZEVXbMDoHDwVN2tF";
const globalViral = "37i9dQZEVXbLiRSasKsNU9";
//TODO: dynamically change option
spotifyApp.albumInfo = {};
let headers;
//init
spotifyApp.tokenRequest = function(){
	$.ajax({//poxy
		url: 'http://proxy.hackeryou.com',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},	//DOC: 4. Your application requests refresh and access tokens
		data: JSON.stringify({//https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
			reqUrl: 'https://accounts.spotify.com/api/token',
			params: {
				grant_type: 'client_credentials'
			},
			proxyHeaders: {// btoa()
				'Authorization': 'Basic MTY5Y2EwNGU1ODk5NGQwNWJhOWRmYzcxMjE5YzQ2NGQ6YmUwNWI1ZTc3NGE2NDVhMjllNWYzZjFiOTQyMDExMDI'
			}
		})
	}).then((data) => {
		headers = {'Authorization': `${data.token_type} ${data.access_token}`}
		spotifyApp.chartsPlaylist();
	});
}//end of tokenRequest

spotifyApp.chartsPlaylist = function(){// geting toplist by category
	spotifyApp.topFifty = $.ajax({//https://developer.spotify.com/web-api/console/get-playlist/
		url:`https://api.spotify.com/v1/users/spotifycharts/playlists/${canadaTop}`,
		method: 'GET',
		dataType: 'json',
		headers,
	});
	$.when(spotifyApp.topFifty).then(function(data){
		let totalTrack = data.tracks.items;
		let albumId,imageSrc;
		for (let i = 0; i < totalTrack.length; i++){
			let trackInfo = {};
			let artistsInfo = {};
			//populate DOM gallery
			albumId = totalTrack[i].track.album.id;
			imageSrc = totalTrack[i].track.album.images[1].url;
			let cardImage = `<img src=${imageSrc}>`;
			let cardWrapper = $('<div class="imgHolder">').attr('id', `${albumId}`).append(cardImage);
			$("#gallery").append(cardWrapper);

			//pushing information, rearrange only the needed info
			trackInfo.trackName = totalTrack[i].track.name;
			trackInfo.duration = spotifyApp.transformMills(totalTrack[i].track.duration_ms);
			for (let k = 0; k < totalTrack[i].track.artists.length; k++){
				artistsInfo[totalTrack[i].track.artists[k].name] = totalTrack[i].track.artists[k].id
			}
			trackInfo.artists = artistsInfo;
			trackInfo.popularity = totalTrack[i].track.popularity;
			trackInfo.redirectLink = totalTrack[i].track.external_urls.spotify;
			trackInfo.albumType = totalTrack[i].track.album.album_type;
			trackInfo.albumName = totalTrack[i].track.name;
			trackInfo.explicit = totalTrack[i].track.explicit;
			spotifyApp.albumInfo[albumId] = trackInfo;
		}//end for loop
		console.log(spotifyApp.albumInfo)
		spotifyApp.galleryListener();
	});
};

//onlick listener for album
spotifyApp.galleryListener =function(){
	let selectedAlbum;
	$(".imgHolder").click(function(e){
		let contentId = $(this).attr("id");//targeting DOM ID
		selectedAlbum = spotifyApp.albumInfo[contentId];

		console.log((spotifyApp.albumInfo[contentId]))
		//ajax for get album info
		spotifyApp.getAlbumtById(contentId);
		$("#info").empty()
		$("#info").append(`${Object.keys(selectedAlbum.artists)[0]}`)
		//add second/third/fourth... artist 
		$("#info").append(`<p>${selectedAlbum.albumName}</p>`)
		$("#info").append(`<p>${selectedAlbum.trackName}</p>`)
		$("#info").append(`<p>${selectedAlbum.duration}</p>`)
		$("#info").append(`<p>${selectedAlbum.popularity}</p>`)
		$("#info").append(`<p>${selectedAlbum.albumType}</p>`)
		$("#info").append(`<p>${selectedAlbum.explicit}</p>`)
		$("#info").append(`<a href ="${selectedAlbum.redirectLink}"></a>`)
	});
}

//genre always emtpy...
spotifyApp.getAlbumtById = function(album){
	$.ajax({//https://developer.spotify.com/web-api/console/get-track/?id=3n3Ppam7vgaVa1iaRUc9Lp
		url:`https://api.spotify.com/v1/albums/${album}`, //album_id
		method: 'GET',
		dataType: 'json',
		headers,
	}).then((data) => {
		console.log("emblum_popularity: " + data.popularity);
		console.log("release_date: " + data.release_date);
		console.log("label: " + data.label);
		console.log("total track: " + data.tracks.items.length);
		data.tracks.items.forEach(function(element, index) {
			console.log(index+1 + ". " + element.name);
		});
		$("#info").append(`<p>${data.popularity}</p>`)
		$("#info").append(`<p>${data.release_date}</p>`)
		$("#info").append(`<p>${data.label}</p>`)
		$("#info").append(`<p>${data.tracks.items.length}</p>`)
		//TODO: populate the info correspondingly
	});
}
/*
	helper functions
*/

//helper function
spotifyApp.transformMills = function(millis) {
	let minutes = Math.floor(millis / 60000);
	let seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

//TODO: helper function, conact string name, spereate by comma,clickable with each artists page
spotifyApp.pushArtists = function(list){
	//
}

$(function(){
	spotifyApp.tokenRequest();
});
