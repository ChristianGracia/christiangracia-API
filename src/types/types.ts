export type Song = {
  progress?: number;
  duration?: number;
  artist?: string;
  name?: string;
  images?: string[];
  preview?: string;
  artistUrl?: string;
  songUrl?: string;
  albumUrl?: string;
  playedAt?: string;
  progressString?: string;
  durationString?: string;
  isPlaying?: Boolean;
};
