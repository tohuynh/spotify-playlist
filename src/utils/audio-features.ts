import { PlaylistTrack } from "../server/router/output-types";

function average(nums: number[]) {
  const sum = nums.reduce((acc, curr) => acc + curr);
  return sum / nums.length;
}

export function calculateAverageAudioFeatures(tracks: PlaylistTrack[]) {
  const danceability = Math.floor(
    average(tracks.map((track) => track.danceability))
  );
  const instrumentalness = Math.floor(
    average(tracks.map((track) => track.instrumentalness))
  );
  const valence = Math.floor(average(tracks.map((track) => track.valence)));
  const energy = Math.floor(average(tracks.map((track) => track.energy)));
  return {
    danceability,
    instrumentalness,
    valence,
    energy,
  };
}
