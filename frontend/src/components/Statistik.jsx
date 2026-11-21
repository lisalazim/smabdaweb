import { useEffect, useState } from "react";
import { stats } from "../data/siteData";
import { API_BASE_URL } from "../utils/api";

export default function Statistik() {
  const [settings, setSettings] = useState({});
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function loadStats() {
      try {
        const [settingsResponse, profileResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/site-settings`),
          fetch(`${API_BASE_URL}/school-profile`),
        ]);
        const settingsResult = await settingsResponse.json();
        const profileResult = await profileResponse.json();

        setSettings(settingsResult.data || {});
        setProfile(profileResult.data || {});
      } catch {
        setSettings({});
        setProfile({});
      }
    }

    loadStats();
  }, []);

  const values = {
    Santri: profile.students_count || settings.students_count,
    "Guru & Staff": profile.teachers_count || settings.teachers_count,
    Prestasi: settings.achievements_count,
    Kampus: settings.campuses_count,
  };

  return (
    <section className="stats" aria-label="Statistik sekolah">
      {stats.map(({ icon: Icon, value, label }) => (
        <div className="stat" key={label}>
          <Icon size={42} strokeWidth={1.7} />
          <div>
            <strong>{values[label] || value}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
