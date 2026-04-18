export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getYouTubeThumb(url: string, quality: 'maxres' | 'hq' | 'sd' = 'maxres'): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const map = { maxres: 'maxresdefault', hq: 'hqdefault', sd: 'sddefault' };
  return `https://i.ytimg.com/vi/${id}/${map[quality]}.jpg`;
}
