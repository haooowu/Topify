
console.log("yall running np");
//https://github.com/hackeryou/json-proxy
var init = function(){
	$.ajax({//poxy
		url: 'http://proxy.hackeryou.com',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		data: JSON.stringify({//???
			//https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
			//4. Your application requests refresh and access tokens
			reqUrl: 'https://accounts.spotify.com/api/token',
			params: {
				grant_type: 'client_credentials'
			},
			proxyHeaders: {// btoa()
				'Authorization': 'Basic MTY5Y2EwNGU1ODk5NGQwNWJhOWRmYzcxMjE5YzQ2NGQ6YmUwNWI1ZTc3NGE2NDVhMjllNWYzZjFiOTQyMDExMDI'
			}
		})
	})//https://developer.spotify.com/web-api/search-item/
	.then((data) => {
		// console.log(data);
		headers = {'Authorization': `${data.token_type} ${data.access_token}`}
		console.log(headers);
		// getSpotifyToplist(); dayily top hits actually
		spotifyChartsTop();
	})
}//end of init

init()
// var getSpotifyToplist = function(){// geting toplist by category
// 	$.ajax({//https://developer.spotify.com/web-api/console/get-category-playlists/
// 		url:`https://api.spotify.com/v1/browse/categories/toplists/playlists`,
// 		method: 'GET',
// 		dataType: 'json',
// 		headers,
// 		data: {
// 			limit: 50
// 		}
// 	}).then((data) => {
// 		console.log(data.playlists.items[0]);
// 	});
// };// this can ultimately grab by owner_id: spotify && id:37i9dQZF1DXcBWIGoYBM5M

var spotifyChartsTop = function(){// geting toplist by category
	$.ajax({//https://developer.spotify.com/web-api/console/get-playlist/
		url:`https://api.spotify.com/v1/users/spotifycharts/playlists/37i9dQZEVXbKj23U1GF4IR`,
		method: 'GET',
		dataType: 'json',
		headers
	}).then((data) => {
		// console.log(data);
		// console.log(data.tracks);
		console.log(data.tracks.items);//50 daily tops objs
		console.log(data.tracks.items[0].track);
		console.log(data.tracks.items[0].track);
	});
};

var getTruckById = function(){
	$.ajax({//https://developer.spotify.com/web-api/console/get-track/?id=3n3Ppam7vgaVa1iaRUc9Lp
		url:`https://api.spotify.com/v1/users/spotifycharts/playlists/37i9dQZEVXbKj23U1GF4IR`,
		method: 'GET',
		dataType: 'json',
		headers
	}).then((data) => {
		console.log(data);
		console.log(data.tracks);
		console.log(data.tracks.items);//50 daily tops objs
		//console.log(data.tracks.items[0].track);
		//	**/.artist
		// 	**/.album
	});
}
