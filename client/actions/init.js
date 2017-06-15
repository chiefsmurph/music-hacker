import socketclient from "socket.io-client";

module.exports = {
  init: (state, actions) => {
    actions.initSocket();
    actions.getLocalPlaylists();
  },

  initSocket: (state, actions) => {
    console.log("initting socket connection")
    var socket = socketclient(window.location.origin);
    socket.on('connect', function(){
      console.log("connected")
    });

    socket.on('downloadLink', (data) => {
      actions.handleDlLink(data);
      console.log('download link', data);
    });

    socket.on('tracksUpdate', (playlistid, tracks) => {
      console.log('updating tracks for ' + playlistid, tracks);
      actions.updateCacheTracksForPlaylist(playlistid, tracks);
      actions.updateCurrentPlaylistIfNecessary({ playlistid, tracks });
    });

    socket.on('event', function(data){});
    socket.on('disconnect', function(){});
    return { socket };
  },

  connectToPlaylistRooms: (state, actions, playlistIds) => {
    console.log('playlist ids ', playlistIds);
    state.socket.emit('initRooms', playlistIds);
  },

  getLocalPlaylists: (state, actions) => {
    var localPlaylists = localStorage.getItem('playlists');
    localPlaylists = JSON.parse(localPlaylists);
    if (localPlaylists) {
      var playlistIds = localPlaylists.map(pl => pl.playlistid);
      actions.connectToPlaylistRooms(playlistIds);
      return {
        playlists: localPlaylists
      };
    }
  }


};
