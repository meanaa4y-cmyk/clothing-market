import { useEffect, useState } from "react";
import { ANNOUNCEMENTS } from "../data/catalog";

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const go = (delta) => setIndex((i) => (i + delta + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);

  return (
    <div className="announce">
      <button className="arrow left" onClick={() => go(-1)}>‹</button>
      <span dangerouslySetInnerHTML={{ __html: ANNOUNCEMENTS[index] }} />
      <button className="arrow right" onClick={() => go(1)}>›</button>
    </div>
  );
}
