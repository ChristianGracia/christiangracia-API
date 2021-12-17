export const spotifyService = {
  /**
   * format spotify data for current song
   * @param { * } song - current song data
   */
  formatCurrentSong: (song: any): any => {
    return [
      {
        progress: song.progress_ms,
        duration: song.item.duration_ms,
        artist: song.item.album.artists[0].name,
        name: song.item.name,
        images: song.item.album.images.map((imgArr) => imgArr['url']),
        previewUrl: song.item.preview_url,
      },
    ];
  },

  /**
   * format songs
   * @param { * } songs - recently played song data array
   */
   formatRecentlyPlayed: (songs: any): any => {
       return songs.map((song) =>  {
          return {
            artist: song.track.artists[0].name,
            name: song.track.name,
            playedAt: song.played_at,
            images: song.track.album.images,
            previewUrl: song.track.preview_url,
          };
       })
    }
};
