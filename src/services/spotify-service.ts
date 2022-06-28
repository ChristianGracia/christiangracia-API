import { Song } from '../types/types';
import { utilService } from './util-service';
const imageUrlStringReduceLength = 24;
const previewUrlStringReduceLength = 30;

export const spotifyService = {
  /**
   * format spotify data for current song
   * @param { * } song - current song data
   */
  formatCurrentSong: (song: any): Song => {
    const { progress_ms, item } = song;
    const { album, duration_ms, name, preview_url } = item;
    const { artists, images } = album;
    return {
      progress: progress_ms / 1000,
      duration: duration_ms / 1000,
      progressString: utilService.formatHHMMString(progress_ms),
      durationString: utilService.formatHHMMString(duration_ms),
      artist: artists[0].name,
      name,
      preview: preview_url?.substr(previewUrlStringReduceLength) ?? '',
      images:
        [images[images.length - 1]['url'].substr(imageUrlStringReduceLength)] ??
        [],
    };
  },

  /**
   * format songs
   * @param { * } songs - recently played song data array
   */
  formatRecentlyPlayed: (songs: any[]): Song[] => {
    return songs.map((song: any) => {
      const { track, played_at } = song;
      const { artists, name, album, preview_url } = track;
      return {
        progress: 0,
        duration: 30,
        progressString: '00:00',
        durationString: '00:30',
        artist: artists[0]?.name ?? '',
        name,
        playedAt: utilService.formatDateAndTime(played_at),
        preview: preview_url?.substr(previewUrlStringReduceLength) ?? '',
        images:
          [album.images[0]['url']?.substr(imageUrlStringReduceLength)] ?? [],
      };
    });
  },
};
