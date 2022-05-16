import { Song } from '../classes/song';

const imageUrlStringReduceLength = 24;
const previewUrlStringReduceLength = 24;

export const spotifyService = {
  /**
   * format spotify data for current song
   * @param { * } song - current song data
   */
  formatCurrentSong: (song: any): any => {
    const { progress_ms, item } = song;
    const { album, duration_ms, name, preview_url } = item;
    const { artists, images } = album;
    return new Song({
      progress_ms,
      duration_ms,
      artist: artists[0].name,
      name,
      images: [images[0]['url'].substr(imageUrlStringReduceLength)] ?? [],
      preview_url: preview_url.substr(previewUrlStringReduceLength),
    });
  },

  /**
   * format songs
   * @param { * } songs - recently played song data array
   */
  formatRecentlyPlayed: (songs: any[]): any => {
    return songs.map((song: any) => {
      const { track, played_at } = song;
      const { artists, name, album, preview_url } = track;

      return new Song({
        artist: artists[0]?.name ?? '',
        name,
        played_at,
        preview_url: preview_url.substr(previewUrlStringReduceLength),
        images:
          [album.images[0]['url'].substr(imageUrlStringReduceLength)] ?? [],
      });
    });
  },
};
