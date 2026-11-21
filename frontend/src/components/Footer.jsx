import { Camera, CirclePlay, Mail, MapPin, Phone, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import Logo from "./common/Logo";

const defaultSettings = {
  school_name: "SMA Bastren Daarul Ahgaff Pabelan",
  footer_description:
    "SMA Bastren Daarul Ahgaff Pabelan merupakan sekolah berbasis pesantren yang berkomitmen mencetak generasi berilmu, berakhlak, dan berwawasan global.",
  address: "Kompleks Pondok Pesantren Daarussalaam Sempon, Kec. Pabelan, Kab. Semarang, Jawa Tengah 50771",
  phone: "+62 856-7890-1012",
  email: "smabda.pabelan@gmail.com",
  instagram_url: "#kontak",
  youtube_url: "#kontak",
};

export default function Footer() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch(`${API_BASE_URL}/site-settings`);
        const result = await response.json();

        setSettings({ ...defaultSettings, ...(result.data || {}) });
      } catch {
        setSettings(defaultSettings);
      }
    }

    loadSettings();
  }, []);

  return (
    <footer className="footer" id="kontak">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>{settings.footer_description}</p>
          <div className="socials" aria-label="Media sosial">
            <a href={settings.instagram_url || "#kontak"} aria-label="Instagram">
              <Camera size={20} />
            </a>
            <a href={settings.youtube_url || "#kontak"} aria-label="YouTube">
              <Play size={20} />
            </a>
            <a href={settings.youtube_url || "#kontak"} aria-label="Video sekolah">
              <CirclePlay size={20} />
            </a>
            <a href={`mailto:${settings.email}`} aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
        <div>
          <h3>Pintasan</h3>
          <a href="#profil">Profil Sekolah</a>
          <a href="#program-unggulan">Program Unggulan</a>
          <a href="#berita">Berita</a>
          <a href="#ppdb">PPDB</a>
          <a href="#kontak">Kontak</a>
        </div>
        <div>
          <h3>Tautan</h3>
          <a href="#kontak">E-Learning</a>
        </div>
        <div className="contact">
          <h3>Hubungi Kami</h3>
          <p>
            <MapPin size={18} />
            {settings.address}
          </p>
          <p>
            <Phone size={18} />
            {settings.phone}
          </p>
          <p>
            <Mail size={18} />
            {settings.email}
          </p>
        </div>
      </div>
      <div className="copyright">&copy; 2024 {settings.school_name}. All rights reserved.</div>
    </footer>
  );
}
