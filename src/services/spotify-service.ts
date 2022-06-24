import { Song } from '../classes/song';
import { utilService } from './util-service';
const imageUrlStringReduceLength = 24;
const previewUrlStringReduceLength = 30;

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
      progress_ms: progress_ms / 1000,
      duration_ms: duration_ms / 1000,
      progress_time_string: utilService.formatHHMMString(progress_ms),
      duration_time_string: utilService.formatHHMMString(duration_ms),
      artist: artists[0].name,
      name,
      preview_url: preview_url.substr(previewUrlStringReduceLength) ?? '',
      images:
        [images[images.length - 1]['url'].substr(imageUrlStringReduceLength)] ??
        [],
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
        progress_ms: 0,
        duration_ms: 30,
        progress_time_string: '00:00',
        duration_time_string: '00:30',
        artist: artists[0]?.name ?? '',
        name,
        played_at: utilService.formatDateAndTime(played_at),
        preview_url: preview_url.substr(previewUrlStringReduceLength) ?? '',
        images:
          [album.images[0]['url'].substr(imageUrlStringReduceLength)] ?? [],
      });
    });
  },
};
