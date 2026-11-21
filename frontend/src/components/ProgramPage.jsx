import {
  ArrowRight,
  BookOpen,
  Bot,
  Camera,
  CalendarDays,
  ChefHat,
  ClipboardList,
  Dumbbell,
  Feather,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Landmark,
  MessageCircle,
  Star,
  UserRoundCheck,
  UsersRound,
  Volleyball
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { mediaUrl } from "../utils/media";

const iconMap = {
  "book-open": BookOpen,
  BookOpen,
  bot: Bot,
  camera: Camera,
  "calendar-days": CalendarDays,
  "chef-hat": ChefHat,
  dumbbell: Dumbbell,
  feather: Feather,
  "flask-conical": FlaskConical,
  "graduation-cap": GraduationCap,
  "heart-handshake": HeartHandshake,
  landmark: Landmark,
  "message-circle": MessageCircle,
  star: Star,
  "user-round-check": UserRoundCheck,
  "users-round": UsersRound,
  volleyball: Volleyball,
};

function getIcon(name) {
  return iconMap[name] || BookOpen;
}

function ProgramMiniCard({ item }) {
  const Icon = getIcon(item.icon);

  return (
    <article className="program-page-mini-card">
      <div className="program-page-card-heading">
        <span>
          <Icon size={25} />
        </span>
        <h3>{item.title}</h3>
      </div>
      <img src={mediaUrl(item.image)} alt={item.title} />
      <p>{item.description}</p>
    </article>
  );
}

function AnnualCard({ item }) {
  return (
    <article className="program-page-annual-card">
      <img src={mediaUrl(item.image)} alt={item.title} />
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

function ActivityCard({ item }) {
  const Icon = getIcon(item.icon);

  return (
    <article className="program-page-activity-card">
      <img src={mediaUrl(item.image)} alt={item.title} />
      <div className="program-page-activity-body">
        <span>
          <Icon size={22} />
        </span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

export default function ProgramPage() {
  const [programs, setPrograms] = useState({
    kepesantrenan: [],
    tahunan: [],
    ekstrakurikuler: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const response = await fetch(`${API_BASE_URL}/programs`);
        const result = await response.json();
        const grouped = {
          kepesantrenan: [],
          tahunan: [],
          ekstrakurikuler: [],
        };

        (result.data || []).forEach((program) => {
          if (grouped[program.category]) {
            grouped[program.category].push(program);
          }
        });

        setPrograms(grouped);
      } catch {
        setPrograms({
          kepesantrenan: [],
          tahunan: [],
          ekstrakurikuler: [],
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadPrograms();
  }, []);

  return (
    <main className="program-page">
      <section className="program-page-hero">
        <img src="/assets/default.png" alt="Santri membaca kitab" />
        <div className="program-page-hero-overlay" />
        <div className="program-page-hero-copy">
          <p>Program Unggulan</p>
          <h1>Membentuk Generasi Berilmu, Berakhlak, dan Berwawasan</h1>
          <span>Berbagai program pilihan kami rancang untuk mengembangkan potensi akademik, spiritual, dan karakter peserta didik.</span>
        </div>
      </section>

      {isLoading ? (
        <section className="program-page-section">
          <p className="admin-muted">Memuat program...</p>
        </section>
      ) : (
        <>
          <section className="program-page-section">
            <div className="program-page-section-heading">
              <p>Program Kepesantrenan</p>
              <h2>Marhalah - Memperdalam Ilmu, Menghidupkan Tradisi</h2>
              <span>Program marhalah mempelajari kitab-kitab kuning secara mendalam di bawah bimbingan para asatidz berpengalaman.</span>
            </div>
            <div className="program-page-mini-grid">
              {programs.kepesantrenan.map((item) => (
                <ProgramMiniCard item={item} key={item.id} />
              ))}
            </div>
          </section>

          <section className="program-page-section program-page-annual-section">
            <div className="program-page-section-heading">
              <p className="program-page-icon-title">Kegiatan Tahunan</p>
              <span>Agenda tahunan yang menjadi bagian penting dalam pembentukan karakter dan pengalaman berharga.</span>
            </div>
            <div className="program-page-annual-grid">
              {programs.tahunan.map((item) => (
                <AnnualCard item={item} key={item.id} />
              ))}
            </div>
          </section>

          <section className="program-page-section program-page-featured-section">
            <div className="program-page-section-heading">
              <p>Ekstrakurikuler</p>
              <h2>Mengembangkan Bakat, Menguatkan Karakter</h2>
              <span>Ekstrakurikuler menjadi wadah untuk mengasah kemampuan, menemukan minat, dan membangun pengalaman berharga.</span>
            </div>
            <div className="program-page-activity-grid">
              {programs.ekstrakurikuler.map((item) => (
                <ActivityCard item={item} key={item.id} />
              ))}
            </div>
          </section>
        </>
      )}

      <section className="program-page-cta">
        <div className="program-page-cta-icon">
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
