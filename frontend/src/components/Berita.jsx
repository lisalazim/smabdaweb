import { ArrowRight, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { mediaUrl } from "../utils/media";
import Ornament from "./common/Ornament";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export default function Berita() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      try {
        const response = await fetch(`${API_BASE_URL}/posts?type=berita&limit=3`);
        const result = await response.json();
        setNews(result.data || []);
      } catch {
        setNews([]);
      }
    }

    loadNews();
  }, []);

  return (
    <section className="section" id="berita">
      <h2 className="section-title">Berita SMABDA</h2>
      <Ornament />
      <div className="news-grid">
        {news.map((item) => (
          <article className="news-card" key={item.title}>
            <img src={mediaUrl(item.cover_image)} alt={item.title} />
            <div className="news-body">
              <p className="date">
                <CalendarDays size={14} />
                {formatDate(item.published_at)}
              </p>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <a href={`#berita-detail/${item.slug}`}>
                Baca selengkapnya <ArrowRight size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <a className="all-news" href="#berita">
        Lihat Semua Berita
        <ArrowRight size={17} />
      </a>
    </section>
  );
}
