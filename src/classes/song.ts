export type song = {
  progress_ms?: number;
  duration_ms?: number;
  artist?: string;
  name?: string;
  images?: string[];
  preview_url?: string;
  played_at?: string;
};
export class Song {
  public progress: number = 0;
  public duration: number = 0;
  public artist: string = '';
  public name: string = '';
  public images: string[] = [];
  public previewUrl: string = '';
  public playedAt: string = '';

  constructor(songData: song) {
    const {
      progress_ms,
      duration_ms,
      artist,
      name,
      images,
      preview_url,
      played_at,
    } = songData;

    this.progress = progress_ms;
    this.duration = duration_ms;
    this.artist = artist;
    this.name = name;
    this.images = images;
    this.previewUrl = preview_url;
    this.playedAt = played_at;
  }
}
