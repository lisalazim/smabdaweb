import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import Button from "./common/Button";

export default function InfoPPDB() {
  const [settings, setSettings] = useState({
    academic_year: "2026/2027",
    is_open: 0,
  });
  const isOpen = Number(settings.is_open) === 1;

  useEffect(() => {
    async function loadPpdbStatus() {
      try {
        const response = await fetch(`${API_BASE_URL}/ppdb`);
        const result = await response.json();

        setSettings((current) => ({ ...current, ...(result.data?.settings || {}) }));
      } catch {
        setSettings((current) => current);
      }
    }

    loadPpdbStatus();
  }, []);

  return (
    <article className="intro-card ppdb-card" id="ppdb">
      <div className="circle-icon">
        <GraduationCap size={34} />
      </div>
      <div>
        <h2>Penerimaan Peserta Didik Baru {settings.academic_year}</h2>
        <p>
          {isOpen
            ? `Telah dibuka pendaftaran peserta didik baru tahun ajaran ${settings.academic_year}.`
            : `PPDB tahun ajaran ${settings.academic_year} sedang ditutup. Informasi pembukaan berikutnya akan diumumkan melalui website resmi.`}
        </p>
        <Button>Selengkapnya</Button>
      </div>
    </article>
  );
}
