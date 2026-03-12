import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

const PlayerPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [upNext, setUpNext] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    api.getMediaById(id).then((payload) => {
      setItem(payload.item);
      setUpNext(payload.upNext);
    });
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || !item) return;
      const progress = video.duration ? video.currentTime / video.duration : 0;
      api.saveProgress({ mediaId: item.id, currentTime: video.currentTime, progress }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [item]);

  if (!item) return <p className="pt-24 px-6">Loading player...</p>;

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-black px-4 pb-8 pt-20 md:grid-cols-[1fr_340px] md:px-8">
      <div>
        <video ref={videoRef} className="w-full rounded-lg bg-black" controls>
          <source src={`/media/${item.filePath}`} />
          {item.subtitlePath && <track kind="subtitles" src={`/subtitles/${item.subtitlePath}`} srcLang="en" label="English" default />}
        </video>
        <div className="mt-3 text-sm text-zinc-300">
          <p className="font-semibold">Playback tips: Use player controls for volume, speed, fullscreen and timeline.</p>
        </div>
      </div>
      <aside className="rounded-lg bg-zinc-950 p-4">
        <h3 className="mb-3 text-lg font-semibold">Up Next</h3>
        <div className="space-y-3">
          {upNext.map((next) => (
            <Link key={next.id} to={`/player/${next.id}`} className="flex gap-3 rounded bg-zinc-900 p-2 hover:bg-zinc-800">
              <img src={next.thumbnail} className="h-16 w-28 rounded object-cover" />
              <div>
                <p className="text-sm font-medium">{next.title}</p>
                <p className="text-xs text-zinc-400">{next.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default PlayerPage;
