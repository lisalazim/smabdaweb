import { ArrowRight, CalendarDays, Images } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { mediaUrl } from "../utils/media";

const categories = ["semua", "kegiatan", "pesantren", "ekstrakurikuler", "fasilitas", "tahunan"];

function formatLabel(value) {
  return value.replaceAll("_", " ");
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export default function GaleriPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGalleries() {
      setIsLoading(true);

      try {
        const query = activeCategory === "semua" ? "" : `?category=${activeCategory}`;
        const response = await fetch(`${API_BASE_URL}/galleries${query}`);
        const result = await response.json();

        setItems(result.data || []);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadGalleries();
  }, [activeCategory]);

  const featured = items[0];
  const galleryItems = useMemo(() => items.slice(featured ? 1 : 0), [items, featured]);

  return (
    <main className="gallery-page">
      <section className="gallery-hero">
        <img src={mediaUrl(featured?.image || "/assets/default.png")} alt={featured?.title || "Galeri SMA Bastren Daarul Ahgaff"} />
        <div className="gallery-hero-overlay" />
        <div className="gallery-hero-copy">
          <p>Galeri Sekolah</p>
          <h1>Ruang Dokumentasi Kegiatan dan Lingkungan SMABDA</h1>
          <span>Kumpulan momen pembelajaran, kepesantrenan, ekstrakurikuler, dan agenda sekolah.</span>
          <a href="#ppdb">
            Informasi PPDB 2026
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-heading">
          <div>
            <span>
              <Images size={27} />
            </span>
            <div>
              <h2>Dokumentasi Terbaru</h2>
              <p>Pilih kategori untuk melihat dokumentasi sesuai kegiatan.</p>
            </div>
          </div>
          <div className="gallery-filter" aria-label="Filter galeri">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? "active" : ""}
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
              >
                {formatLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="admin-muted">Memuat galeri...</p>
        ) : items.length === 0 ? (
          <p className="admin-muted">Belum ada galeri pada kategori ini.</p>
        ) : (
          <>
            {featured && (
              <article className="gallery-featured">
                <img src={mediaUrl(featured.image)} alt={featured.title} />
                <div>
                  <span>{formatLabel(featured.category)}</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.description}</p>
                  {featured.taken_at && (
                    <time>
                      <CalendarDays size={16} />
                      {formatDate(featured.taken_at)}
                    </time>
                  )}
                </div>
              </article>
            )}

            <div className="gallery-grid">
              {galleryItems.map((item) => (
                <article className="gallery-card" key={item.id}>
                  <img src={mediaUrl(item.image)} alt={item.title} />
                  <div>
                    <span>{formatLabel(item.category)}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.taken_at && (
                      <time>
                        <CalendarDays size={15} />
                        {formatDate(item.taken_at)}
                      </time>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
