export function convertDurationToHMS(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  if (hours) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${minutes}:${pad(seconds)}`;
}

export function pad(num: number) {
  return `${num}`.padStart(2, "0");
}
