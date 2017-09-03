const spotifyApp = {};
const canadaTop = "37i9dQZEVXbKj23U1GF4IR";
const canadaViral = "37i9dQZEVXbKfIuOAZrk7G";
const globalTop = "37i9dQZEVXbMDoHDwVN2tF";
const globalViral = "37i9dQZEVXbLiRSasKsNU9";
// const spotifyFont = `<i class="fa fa-spotify" aria-hidden="true"></i>`
spotifyApp.albumInfo = {};
let headers;
let defaultList = canadaTop;
//init
spotifyApp.init = function(){
	spotifyApp.tokenRequest();
	spotifyApp.playListListener();
	$(".main__holder").css("display","none");
	$("#splashText").css("display","none");
	$("#splashText").text(`Canada Top 50`)
	$("#splashText").fadeIn(1000);
}

spotifyApp.tokenRequest = function(){
	$.ajax({//proxy
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
		spotifyApp.chartsPlaylist(defaultList);
	});
}//end of tokenRequest

spotifyApp.chartsPlaylist = function(playlist){// geting toplist by category
	spotifyApp.topFifty = $.ajax({//https://developer.spotify.com/web-api/console/get-playlist/
		url:`https://api.spotify.com/v1/users/spotifycharts/playlists/${playlist}`,
		method: 'GET',
		dataType: 'json',
		headers,
	});
	$.when(spotifyApp.topFifty).then(function(data){
		let totalTrack = data.tracks.items;
		let albumId,imageSrc,imageSrcSplash;
		for (let i = 0; i < totalTrack.length; i++){
			let trackInfo = {};
			let artistsInfo = {};
			//populate DOM gallery
			albumId = totalTrack[i].track.album.id;
			imageSrc = totalTrack[i].track.album.images[1].url;
			imageSrcSplash = totalTrack[i].track.album.images[0].url;
			let cardImage = `<div class="imageTile"><img class="imageTile__img" src=${imageSrc}></div>`
			let cardWrapper = $('<div class="imgHolder">').attr('id', `${albumId}`).append(cardImage);
			$("#gallery").append(cardWrapper);

			//pushing information, rearrange only the needed info
			trackInfo.trackName = totalTrack[i].track.name;
			trackInfo.duration = spotifyApp.transformMills(totalTrack[i].track.duration_ms);
			for (let k = 0; k < totalTrack[i].track.artists.length; k++){
				artistsInfo[totalTrack[i].track.artists[k].name] = totalTrack[i].track.artists[k].id
			}
			trackInfo.artists = artistsInfo;
			trackInfo.imageSrcSplash = imageSrcSplash;
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
spotifyApp.galleryListener = function(){
	let selectedAlbum;
	$(".imgHolder").click(function(e){
		$("#splashText").css("display","none");
		$(".main__holder").fadeIn();
		let contentId = $(this).attr("id");//targeting DOM ID
		selectedAlbum = spotifyApp.albumInfo[contentId];
		$("#splash").empty();//get hero img
		$("#splash").append(`<img src = ${selectedAlbum.imageSrcSplash}>`)
		console.log((spotifyApp.albumInfo[contentId]))
		//ajax for get album info
		spotifyApp.getAlbumtById(contentId,selectedAlbum.redirectLink);
		$("#info").empty();
		$("#info").append(`<div class="track__name"><h2>${selectedAlbum.trackName}</h2></div>`)
		$("#info").append(`<h3 id="artist__name"></h3>`);
		for (let i = Object.keys(selectedAlbum.artists).length - 1; i>=0; i--){
			$("#artist__name").text(`${Object.keys(selectedAlbum.artists)}`)
		}
		$("#info").append(`
			<div class="button__set">
				<span><i class="fa fa-clock-o" aria-hidden="true"></i>${selectedAlbum.duration}</span>
				<span><i class="fa fa-star" aria-hidden="true"></i>${selectedAlbum.popularity}</span>
				<span>${selectedAlbum.albumType}</span>
			</div>`)
		$("#info").append(`<div class="album__name"><h4>Album: ${selectedAlbum.albumName}</h4></div>`)
		if (selectedAlbum.explicit === true) {
			$(".button__set").append(`<span id="censorship">explicit</span>`)
		} 
	});
}

spotifyApp.getAlbumtById = function(album, linkUrl){
	$.ajax({//https://developer.spotify.com/web-api/console/get-track/?id=3n3Ppam7vgaVa1iaRUc9Lp
		url:`https://api.spotify.com/v1/albums/${album}`, //album_id
		method: 'GET',
		dataType: 'json',
		headers,
	}).then((data) => {
		data.tracks.items.forEach(function(element, index) {
			console.log(index+1 + ". " + element.name);
		});
		// $("#info").append(`<span>${data.tracks.items.length}</span>`)
		$("#info").append(`<p>Released: ${data.release_date}</p>`)
		$("#info").append(`<p>Record Label: ${data.label}</p>`)
		$("#info").append(`<a href ="${linkUrl}">Listen it on Spotify<i class="fa fa-play-circle" aria-hidden="true"></i></a>`)
	});
}

spotifyApp.playListListener = function(){
	$("#cdnTop").click(function(e){
		e.preventDefault();
		spotifyApp.emptyPage();
		defaultList = canadaTop;
		$("#splashText").text(`Canada Top 50`)
		spotifyApp.chartsPlaylist(canadaTop);
	});
	$("#globalTop").click(function(e){
		e.preventDefault();
		spotifyApp.emptyPage();
		defaultList = globalTop;
		$("#splashText").text(`Global Top 50`)
		spotifyApp.chartsPlaylist(globalTop);
	});
	$("#cdnViral").click(function(e){
		e.preventDefault();
		spotifyApp.emptyPage();
		defaultList = canadaViral;
		$("#splashText").text(`Canada Viral 50`)
		spotifyApp.chartsPlaylist(canadaViral);
	});
	$("#globalViral").click(function(e){
		e.preventDefault();
		spotifyApp.emptyPage();
		defaultList = globalViral;
		$("#splashText").text(`Global Viral 50`)
		spotifyApp.chartsPlaylist(globalViral);
	});
}
/* helper functions */

spotifyApp.transformMills = function(millis) {
	let minutes = Math.floor(millis / 60000);
	let seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

spotifyApp.emptyPage = function(){
	$("#splash").empty();
	$("#info").empty();
	$("#gallery").empty();
	$(".main__holder").css("display","none");
	$("#splashText").css("display","none");
	$("#splashText").fadeIn();
}

$(function(){
	spotifyApp.init();
	$( "#gallery" ).draggable({
		axis: "x"
	});
});
