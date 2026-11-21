import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock,
  Home,
  Link,
  MessageCircle,
  Quote,
  Tag,
  User,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { mediaUrl } from "../utils/media";

const categories = ["Semua Kategori", "Berita", "Pengumuman", "Karya Santri"];
const archives = ["Desember 2024", "November 2024", "Oktober 2024"];

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

function formatType(type) {
  return type === "karya_santri" ? "Karya Santri" : type.charAt(0).toUpperCase() + type.slice(1);
}

function paragraphs(content) {
  return String(content || "")
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function BeritaDetailPage({ slug }) {
  const [post, setPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true);
      setMessage("");

      try {
        const latestPromise = fetch(`${API_BASE_URL}/posts?limit=3`);
        const detailPromise = slug
          ? fetch(`${API_BASE_URL}/posts/${slug}`)
          : fetch(`${API_BASE_URL}/posts/featured`);
        const [detailResponse, latestResponse] = await Promise.all([detailPromise, latestPromise]);
        const [detailResult, latestResult] = await Promise.all([detailResponse.json(), latestResponse.json()]);

        if (!detailResponse.ok) {
          throw new Error(detailResult.message || "Konten tidak ditemukan");
        }

        setPost(detailResult.data || null);
        setLatestPosts(latestResult.data || []);
      } catch (error) {
        setPost(null);
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="news-detail-page">
        <p className="admin-muted">Memuat detail berita...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="news-detail-page">
        <nav className="news-detail-breadcrumb" aria-label="Breadcrumb">
          <a href="#beranda">
            <Home size={15} />
            Beranda
          </a>
          <ChevronRight size={15} />
          <a href="#berita">Berita</a>
        </nav>
        <section className="news-detail-widget">
          <h1>Konten tidak ditemukan</h1>
          <p className="admin-muted">{message || "Konten yang dicari belum tersedia."}</p>
          <a className="news-detail-widget-button" href="#berita">
            Kembali ke Berita
            <ArrowRight size={16} />
          </a>
        </section>
      </main>
    );
  }

  const bodyParagraphs = paragraphs(post.content);
  const readingMinutes = Math.max(1, Math.ceil((post.content || "").split(/\s+/).length / 180));

  return (
    <main className="news-detail-page">
      <nav className="news-detail-breadcrumb" aria-label="Breadcrumb">
        <a href="#beranda">
          <Home size={15} />
          Beranda
        </a>
        <ChevronRight size={15} />
        <a href="#berita">Berita</a>
        <ChevronRight size={15} />
        <span>{post.title}</span>
      </nav>

      <div className="news-detail-layout">
        <article className="news-detail-article">
          <div className="news-detail-cover">
            <img src={mediaUrl(post.cover_image)} alt={post.title} />
            <span className="news-page-label">{formatType(post.type)}</span>
          </div>

          <h1>{post.title}</h1>

          <div className="news-detail-meta">
            <span>
              <CalendarDays size={17} />
              {formatDate(post.published_at)}
            </span>
            <span>
              <User size={17} />
              {post.author || "Tim Redaksi"}
            </span>
            <span>
              <Clock size={17} />
              {readingMinutes} menit baca
            </span>
          </div>

          {post.excerpt && (
            <aside className="news-detail-highlight">
              <Quote size={24} />
              <p>{post.excerpt}</p>
            </aside>
          )}

          <div className="news-detail-body">
            {bodyParagraphs.length > 0 ? (
              bodyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>

          <div className="news-detail-bottom">
            <section className="news-detail-share">
              <h2>Bagikan Berita</h2>
              <div>
                <a className="wa" href="#berita-detail" aria-label="Bagikan ke WhatsApp">
                  <MessageCircle size={20} />
                </a>
                <a className="fb" href="#berita-detail" aria-label="Bagikan ke Facebook">f</a>
                <a className="tw" href="#berita-detail" aria-label="Bagikan ke X">
                  <X size={19} />
                </a>
                <a className="ln" href="#berita-detail" aria-label="Salin tautan">
                  <Link size={19} />
                </a>
              </div>
            </section>

            <section className="news-detail-nav">
              <a href="#berita">
                <ArrowLeft size={21} />
                <span>
                  <small>Kembali</small>
                  Semua Berita
                </span>
              </a>
              <a href="#ppdb">
                <span>
                  <small>Informasi</small>
                  PPDB SMA Bastren
                </span>
                <ArrowRight size={21} />
              </a>
            </section>
          </div>
        </article>

        <aside className="news-detail-sidebar">
          <section className="news-detail-widget">
            <div className="news-detail-widget-title">
              <BookOpen size={24} />
              <h2>Berita Terbaru</h2>
            </div>
            <div className="news-detail-latest">
              {latestPosts.map((item) => (
                <a href={`#berita-detail/${item.slug}`} key={item.id}>
                  <img src={mediaUrl(item.cover_image)} alt={item.title} />
                  <span>
                    <em>{formatType(item.type)}</em>
                    <small>{formatDate(item.published_at)}</small>
                    <strong>{item.title}</strong>
                  </span>
                </a>
              ))}
            </div>
            <a className="news-detail-widget-button" href="#berita">
              Lihat Semua Berita
              <ArrowRight size={16} />
            </a>
          </section>

          <section className="news-detail-widget">
            <div className="news-detail-widget-title">
              <Tag size={24} />
              <h2>Kategori</h2>
            </div>
            <div className="news-detail-category-list">
              {categories.map((category, index) => (
                <a className={index === 0 ? "active" : ""} href="#berita" key={category}>
                  {category}
                </a>
              ))}
            </div>
          </section>

          <section className="news-detail-widget">
            <div className="news-detail-widget-title">
              <Archive size={24} />
              <h2>Arsip Berita</h2>
            </div>
            <div className="news-detail-category-list">
              {archives.map((archive) => (
                <a href="#berita" key={archive}>{archive}</a>
              ))}
            </div>
            <a className="news-detail-widget-button" href="#berita">
              Lihat Semua Arsip
              <ArrowRight size={16} />
            </a>
          </section>
        </aside>
      </div>

      <section className="news-detail-cta">
        <div className="news-detail-cta-icon">
          <ClipboardList size={38} />
        </div>
        <div>
          <p>Bergabung Bersama</p>
          <h2>SMA Bastren Daarul Ahgaff</h2>
          <span>Jadilah bagian dari keluarga besar kami dan wujudkan masa depan yang gemilang bersama kami.</span>
        </div>
        <a href="#ppdb">
          Informasi PPDB 2026
          <ArrowRight size={16} />
        </a>
      </section>
    </main>
  );
}
