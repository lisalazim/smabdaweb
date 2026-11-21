import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { mediaUrl } from "../utils/media";
import Ornament from "./common/Ornament";

export default function Hero() {
  const [settings, setSettings] = useState({
    hero_image: "/assets/default.png",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch(`${API_BASE_URL}/site-settings`);
        const result = await response.json();

        setSettings((current) => ({ ...current, ...(result.data || {}) }));
      } catch {
        setSettings((current) => current);
      }
    }

    loadSettings();
  }, []);

  return (
    <section className="hero" id="beranda">
      <div className="hero-copy">
        <h1>
          Mapan <span>Intelektual,</span>
          <br />
          Kokoh <span>Spiritual</span>
        </h1>
        <Ornament />
        <p className="lead">
          Selamat datang di situs web SMA Bastren Daarul Ahgaff Pabelan. Mendukung kemudahan akses informasi untuk
          pendidikan berbasis pesantren yang mencetak generasi berilmu dan berakhlak mulia.
        </p>
        <a className="hero-btn" href="#ppdb">
          <CalendarDays size={18} />
          Informasi PPDB
        </a>
      </div>
      <div
        className="hero-media"
        aria-label="Santri di area sekolah"
        style={{ "--hero-image": `url("${mediaUrl(settings.hero_image || "/assets/default.png")}")` }}
      />
    </section>
  );
}
