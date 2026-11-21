import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Feather,
  Megaphone,
  Newspaper,
  Play,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { mediaUrl } from "../utils/media";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

function detailLink(item) {
  return `#berita-detail/${item.slug}`;
}

function ArticleCard({ item, label = "Berita" }) {
  return (
    <article className="news-page-card">
      <img src={mediaUrl(item.cover_image)} alt={item.title} />
      <div>
        <span className="news-page-label">{label}</span>
        <p className="news-page-meta">
          <CalendarDays size={15} />
          {formatDate(item.published_at)}
        </p>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
      </div>
    </article>
  );
}

function SectionTitle({ icon: Icon, title, body, action }) {
  return (
    <div className="news-page-section-title">
      <div>
        <span>
          <Icon size={27} />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
      </div>
      {action && (
        <a href="#berita">
          {action}
          <ArrowRight size={16} />
        </a>
      )}
    </div>
  );
}

export default function BeritaPage() {
  const [featured, setFeatured] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [studentWorks, setStudentWorks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const [featuredResponse, newsResponse, worksResponse, announcementsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/posts/featured`),
          fetch(`${API_BASE_URL}/posts?type=berita&limit=3`),
          fetch(`${API_BASE_URL}/posts?type=karya_santri&limit=4`),
          fetch(`${API_BASE_URL}/posts?type=pengumuman&limit=3`),
        ]);

        const [featuredResult, newsResult, worksResult, announcementsResult] = await Promise.all([
          featuredResponse.json(),
          newsResponse.json(),
          worksResponse.json(),
          announcementsResponse.json(),
        ]);

        setFeatured(featuredResult.data || null);
        setLatestNews(newsResult.data || []);
        setStudentWorks(worksResult.data || []);
        setAnnouncements(announcementsResult.data || []);
      } catch {
        setFeatured(null);
        setLatestNews([]);
        setStudentWorks([]);
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, []);

  const mainWork = studentWorks[0];
  const sideWorks = studentWorks.slice(1);

  if (isLoading) {
    return (
      <main className="news-page">
        <section className="news-page-section">
          <p className="admin-muted">Memuat berita...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="news-page">
      {featured && (
        <section className="news-page-hero">
          <div className="news-page-hero-copy">
            <span className="news-page-label">Berita Utama</span>
            <h1>{featured.title}</h1>
            <p className="news-page-meta">
              <CalendarDays size={16} />
              {formatDate(featured.published_at)}
              <User size={16} />
              {featured.author || "Tim Redaksi"}
            </p>
            <p>{featured.excerpt}</p>
            <a href={detailLink(featured)}>
              Baca Selengkapnya
              <ArrowRight size={17} />
            </a>
          </div>
          <img src={mediaUrl(featured.cover_image)} alt={featured.title} />
        </section>
      )}

      <section className="news-page-section">
        <SectionTitle
          icon={BookOpen}
          title="Berita Terbaru"
          body="Kabar kegiatan, prestasi, dan aktivitas terbaru dari lingkungan SMA Bastren Daarul Ahgaff."
          action="Lihat Semua Berita"
        />
        <div className="news-page-grid">
          {latestNews.map((item) => (
            <a className="news-page-card-link" href={detailLink(item)} key={item.id}>
              <ArticleCard item={item} />
            </a>
          ))}
        </div>
      </section>

      <section className="news-page-section news-page-works">
        <SectionTitle
          icon={Feather}
          title="Karya Santri"
          body="Ruang publikasi karya tulis, cerpen, puisi, dan opini para santri."
          action="Lihat Semua Karya"
        />
        {mainWork ? (
          <div className="news-page-work-layout">
            <article className="news-page-feature-work">
              <img src={mediaUrl(mainWork.cover_image)} alt={mainWork.title} />
              <div>
                <span className="news-page-label">Karya Santri</span>
                <p className="news-page-meta">
                  <CalendarDays size={15} />
                  {formatDate(mainWork.published_at)}
                </p>
                <h3>{mainWork.title}</h3>
                <p>{mainWork.excerpt}</p>
                <a href={detailLink(mainWork)}>
                  Baca Selengkapnya
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
            <div className="news-page-work-list">
              {sideWorks.map((item) => (
                <a href={detailLink(item)} key={item.id}>
                  <img src={mediaUrl(item.cover_image)} alt={item.title} />
                  <div>
                    <span className="news-page-label">Karya</span>
                    <p className="news-page-meta">
                      <CalendarDays size={14} />
                      {formatDate(item.published_at)}
                    </p>
                    <h3>{item.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="admin-muted">Belum ada karya santri.</p>
        )}
      </section>

      <section className="news-page-section">
        <SectionTitle
          icon={Megaphone}
          title="Pengumuman"
          body="Informasi penting untuk siswa, wali santri, dan masyarakat."
          action="Lihat Semua Pengumuman"
        />
        <div className="news-page-grid">
          {announcements.map((item) => (
            <a className="news-page-card-link" href={detailLink(item)} key={item.id}>
              <ArticleCard item={item} label="Pengumuman" />
            </a>
          ))}
        </div>
      </section>

      <section className="news-page-social">
        <div>
          <p>Ikuti Kegiatan dan Informasi Kami</p>
          <h2>Follow Our Social Media</h2>
          <span>Dapatkan update terbaru kegiatan, prestasi, dan informasi penting dari SMA Bastren Daarul Ahgaff Pabelan.</span>
        </div>
        <a href="#berita">
          <Newspaper size={24} />
          @smabastrendaarulahgaffsempon
        </a>
        <a href="#berita">
          <Play size={24} />
          SMA Bastren Daarul Ahgaff
        </a>
      </section>
    </main>
  );
}
