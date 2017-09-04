const spotifyApp = {};
const canadaTop = "37i9dQZEVXbKj23U1GF4IR";
const canadaViral = "37i9dQZEVXbKfIuOAZrk7G";
const globalTop = "37i9dQZEVXbMDoHDwVN2tF";
const globalViral = "37i9dQZEVXbLiRSasKsNU9";
// const spotifyFont = `<i class="fa fa-spotify" aria-hidden="true"></i>`
spotifyApp.albumInfo = {};
let headers;
let defaultList = canadaTop;
spotifyApp.trackList ="";
//init
spotifyApp.init = function(){
	spotifyApp.tokenRequest();
	spotifyApp.playListListener();
	$(".main__holder").css("display","none");
	$("#splashText").css("display","none");
	$("#splashText").text(`Canada Top 50`)
	$("#splashText").fadeIn(1000);
	spotifyApp.overlayNav();
}

spotifyApp.tokenRequest = function(){
	$.ajax({//proxy
		url: 'https://proxy.hackeryou.com',
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
	let anchors = "";
	$(".imgHolder").click(function(e){
		let contentId = $(this).attr("id");//targeting DOM ID
		selectedAlbum = spotifyApp.albumInfo[contentId];
		//clear previous data
		$("#splashText").css("display","none");
		$(".main__holder").fadeIn();
		$("#splash").empty();//get hero img
		$("#splash").append(`<img src = ${selectedAlbum.imageSrcSplash}>`)
		console.log((spotifyApp.albumInfo[contentId]))
		//ajax for get album info
		if (selectedAlbum.albumType === "album"){
			spotifyApp.getAlbumtById(contentId,selectedAlbum.redirectLink,true);
		}else{//if albun, show lsit
			spotifyApp.getAlbumtById(contentId,selectedAlbum.redirectLink);
		}//clear previous data
		$("#info").empty();
		$('#populateList').empty();
		spotifyApp.trackList=""; // remember to clear the list
		$("#info").append(`<div class="track__name"><h2>${selectedAlbum.trackName}</h2></div>`)
		$("#info").append(`<h3 id="artist__name"></h3>`);
		for (let i = 0; i < Object.keys(selectedAlbum.artists).length; i++){
			anchors += `<a href="https://open.spotify.com/artist/${Object.values(selectedAlbum.artists)[i]}">
				${Object.keys(selectedAlbum.artists)[i]}</a>,`
		}
		$("#artist__name").html((spotifyApp.removeLastComma(anchors)));
		anchors = "";//clear
		$("#info").append(`
			<div class="button__set">
				<span><i class="fa fa-clock-o" aria-hidden="true"></i> ${selectedAlbum.duration}</span>
				<span><i class="fa fa-star" aria-hidden="true"></i> ${selectedAlbum.popularity}</span>
				<span>${selectedAlbum.albumType}</span>
			</div>`)
		$("#info").append(`<div class="album__name"><h4>Album: ${selectedAlbum.albumName}</h4></div>`)
		if (selectedAlbum.explicit === true) {
			$(".button__set").append(`<span id="censorship">explicit</span>`)
		} 
	});
}

spotifyApp.getAlbumtById = function(album, linkUrl, notsingle){
	$.ajax({//https://developer.spotify.com/web-api/console/get-track/?id=3n3Ppam7vgaVa1iaRUc9Lp
		url:`https://api.spotify.com/v1/albums/${album}`, //album_id
		method: 'GET',
		dataType: 'json',
		headers,
	}).then((data) => {
		data.tracks.items.forEach(function(element, index) {
			index = index+1;
			spotifyApp.trackList += ("<p>"+ index + ". " + element.name + "</p>");
		}); 
		// $("#info").append(`<span>${data.tracks.items.length}</span>`)
		$("#info").append(`<p>Released: ${data.release_date}</p>`)
		$("#info").append(`<p>Record Label: ${data.label}</p>`)
		$("#info").append(`<a href ="${linkUrl}">Listen on Spotify <i class="fa fa-play-circle" aria-hidden="true"></i></a>`)
		if (notsingle){
			$("#info").append(`<div id="viewtracklist"><a id="myBtn" href ="">Track list <i class="fa fa-list" aria-hidden="true"></i></a><div>`)
			spotifyApp.popWindow();
		}
	});
}

//li listener
spotifyApp.playListListener = function(){
	$(".cdnTop").click(function(e){
		e.preventDefault();
		spotifyApp.emptyPage();
		defaultList = canadaTop;
		$("#splashText").text(`Canada Top 50`)
		spotifyApp.chartsPlaylist(canadaTop);
	});
	$(".globalTop").click(function(e){
		e.preventDefault();
		spotifyApp.emptyPage();
		defaultList = globalTop;
		$("#splashText").text(`Global Top 50`)
		spotifyApp.chartsPlaylist(globalTop);
	});
	$(".cdnViral").click(function(e){
		e.preventDefault();
		spotifyApp.emptyPage();
		defaultList = canadaViral;
		$("#splashText").text(`Canada Viral 50`)
		spotifyApp.chartsPlaylist(canadaViral);
	});
	$(".globalViral").click(function(e){
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
/* Credit: remove hover effects on touch screen devices
https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices
*/
spotifyApp.removeHover = function(){
	try { // prevent exception on browsers not supporting DOM styleSheets properly
		for (let si in document.styleSheets) {
			let styleSheet = document.styleSheets[si];
			if (!styleSheet.rules) continue;
			//iterates stylesheets
			for (let ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
				if (!styleSheet.rules[ri].selectorText) continue;
				if (styleSheet.rules[ri].selectorText.match(':hover')) {
					styleSheet.deleteRule(ri);
				}
			}
		}
	} catch (ex) {}
}
/*credit: pure css/html/js pop up window
https://www.w3schools.com/howto/howto_css_modals.asp
*/
spotifyApp.popWindow = function(){
	//document.getElementById('populateList').append addes as string...
	$('#populateList').append(spotifyApp.trackList);//jquery append as markup
	// Get the modal and span
	let modal = document.getElementById('myModal');
	let btn = document.getElementById("myBtn");
	let span = document.getElementsByClassName("close")[0];
	btn.onclick = function(e) {
		e.preventDefault();
		modal.style.display = "block";
	}// When the user clicks on the button, open the modal,ow close 
	$(".close").click(function(){
		modal.style.display = "none";
	});
	window.onclick = function(e) {
		if (e.target === modal) {
			modal.style.display = "none";
		}
	}
}

spotifyApp.overlayNav = function(){
	$("#hamburger").click(function(){
		document.getElementById("overlay").style.width = "290px";
		let overlay = document.getElementById('overlay');
		window.onclick = function(e) {
			if (e.target === overlay) {
				document.getElementById("overlay").style.width = "0";
			}
		}
	});
	$(".close").click(function(){
		document.getElementById("overlay").style.width = "0";
	});
}

spotifyApp.removeLastComma = function(input){
	let lastIndex = input.lastIndexOf(",");
	return input.substring(0, lastIndex);
}

$(function(){
	spotifyApp.init();
	if ($(window).width() < 789) {
		spotifyApp.removeHover();
	}
});