import { PlaylistTrack } from "../server/router/output-types";

function average(nums: number[]) {
  const sum = nums.reduce((acc, curr) => acc + curr);
  return sum / nums.length;
}

export function calculateAverageAudioFeatures(tracks: PlaylistTrack[]) {
  const danceability = Math.floor(
    average(tracks.map((track) => track.danceability || 0))
  );
  const tempo = Math.floor(average(tracks.map((track) => track.tempo || 0)));
  const valence = Math.floor(
    average(tracks.map((track) => track.valence || 0))
  );
  const energy = Math.floor(average(tracks.map((track) => track.energy || 0)));
  return {
    danceability,
    tempo,
    valence,
    energy,
  };
}
