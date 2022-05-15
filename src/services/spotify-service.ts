export const spotifyService = {
  /**
   * format spotify data for current song
   * @param { * } song - current song data
   */
  formatCurrentSong: (song: any): any => {
    const { progress_ms: progress, item } = song;
    const {
      duration_ms: duration,
      album,
      name,
      preview_url: previewUrl,
    } = item;
    return [
      {
        progress,
        duration,
        artist: album.artists[0].name,
        name,
        images: [album.images[0]['url']] ?? [],
        previewUrl,
      },
    ];
  },

  /**
   * format songs
   * @param { * } songs - recently played song data array
   */
  formatRecentlyPlayed: (songs: any): any => {
    return songs.map((song) => {
      const { track, played_at: playedAt } = song;
      const { artists, name, album, preview_url: previewUrl } = track;
      return {
        artist: artists[0].name,
        name,
        playedAt,
        previewUrl,
        images: [album.images[0]['url']] ?? [],
      };
    });
  },
};
