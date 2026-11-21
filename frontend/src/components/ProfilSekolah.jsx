import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import Button from "./common/Button";
import Ornament from "./common/Ornament";

export default function ProfilSekolah() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`${API_BASE_URL}/school-profile`);
        const result = await response.json();
        setProfile(result.data || null);
      } catch {
        setProfile(null);
      }
    }

    loadProfile();
  }, []);

  return (
    <article className="intro-card text-card">
      <h2>Profil Sekolah</h2>
      <Ornament />
      <p>{profile?.description || "SMA Bastren Daarul Ahgaff Pabelan merupakan sekolah berbasis pesantren yang mengintegrasikan pendidikan akademik dan pembinaan karakter islami."}</p>
      <Button variant="outline">Selengkapnya</Button>
    </article>
  );
}
