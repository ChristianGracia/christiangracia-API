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
        images: song.item.album.images,
      },
    ];
  },
};
