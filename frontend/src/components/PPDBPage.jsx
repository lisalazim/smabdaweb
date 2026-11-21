import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  Info,
  Mail,
  MapPin,
  Phone,
  Send,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";

const initialForm = {
  full_name: "",
  nisn: "",
  gender: "L",
  birth_place: "",
  birth_date: "",
  address: "",
  previous_school: "",
  parent_name: "",
  whatsapp: "",
};

const stats = [
  { icon: CalendarDays, title: "Tahun Ajaran", value: "2026/2027" },
  { icon: Clock, title: "Pendaftaran Dibuka", value: "Januari 2026" },
  { icon: UsersRound, title: "Kuota Terbatas", value: "Lebih awal, lebih baik" },
  { icon: MapPin, title: "Lokasi", value: "Pabelan, Kabupaten Semarang" }
];

const timeline = [
  ["Pendaftaran Online Dibuka", "Calon peserta dapat mengisi formulir pendaftaran secara online melalui website resmi.", "01 Januari 2026"],
  ["Batas Akhir Pendaftaran", "Batas akhir pengisian formulir dan unggah berkas pendaftaran.", "31 Maret 2026"],
  ["Seleksi Administrasi", "Verifikasi berkas oleh panitia PPDB.", "01 - 05 April 2026"],
  ["Pengumuman Seleksi Administrasi", "Pengumuman hasil seleksi administrasi.", "07 April 2026"],
  ["Tes / Wawancara", "Tes akademik dan wawancara calon peserta didik.", "12 - 14 April 2026"],
  ["Pengumuman Hasil Seleksi", "Pengumuman kelulusan calon peserta didik.", "18 April 2026"],
  ["Daftar Ulang", "Konfirmasi dan daftar ulang peserta yang diterima.", "19 - 25 April 2026"]
];

const requirements = [
  ["Fotokopi Akta Kelahiran", "1 lembar"],
  ["Fotokopi Kartu Keluarga (KK)", "1 lembar"],
  ["Fotokopi Ijazah / Surat Keterangan Lulus", "1 lembar"],
  ["Fotokopi Rapor Semester 1 s/d 5", "1 rangkap"],
  ["Pas Foto Berwarna 3x4", "4 lembar (latar belakang merah)"],
  ["Fotokopi KTP Orang Tua / Wali", "1 lembar"],
  ["Surat Keterangan Sehat", "Dari dokter / puskesmas"],
  ["Surat Keterangan Bebas Narkoba", "Dari instansi berwenang"],
  ["Surat Keterangan Kelakuan Baik", "Dari sekolah asal"],
  ["Map Plastik", "Warna hijau"]
];

const contacts = [
  { icon: Phone, title: "Telepon / WhatsApp", value: "0812-3456-7890" },
  { icon: Mail, title: "Email", value: "ppdb@smabda.sch.id" },
  { icon: MapPin, title: "Alamat", value: "Pabelan, Kabupaten Semarang, Jawa Tengah" },
  { icon: Clock, title: "Jam Layanan", value: "Senin - Sabtu 08.00 - 15.00 WIB" }
];
const defaultSettings = {
  phone: contacts[0].value,
  email: contacts[1].value,
  address: contacts[2].value,
  service_hours: contacts[3].value,
};
const defaultPpdbSettings = {
  academic_year: "2026/2027",
  registration_start: "",
  registration_end: "",
  quota_text: "Kuota terbatas",
  location: "Pabelan, Kabupaten Semarang",
  brochure_url: "",
  is_open: 0,
};

function PPDBButton({ variant = "solid", href = "#ppdb-form", children }) {
  return (
    <a className={`ppdb-page-button ${variant}`} href={href}>
      <Download size={22} />
      <span>{children}</span>
    </a>
  );
}

export default function PPDBPage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState(defaultSettings);
  const [ppdbSettings, setPpdbSettings] = useState(defaultPpdbSettings);

  useEffect(() => {
    const targetId = window.location.hash.replace("#", "");
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [siteResponse, ppdbResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/site-settings`),
          fetch(`${API_BASE_URL}/ppdb`),
        ]);
        const siteResult = await siteResponse.json();
        const ppdbResult = await ppdbResponse.json();

        setSiteSettings({ ...defaultSettings, ...(siteResult.data || {}) });
        setPpdbSettings({ ...defaultPpdbSettings, ...(ppdbResult.data?.settings || {}) });
      } catch {
        setSiteSettings(defaultSettings);
        setPpdbSettings(defaultPpdbSettings);
      }
    }

    loadSettings();
  }, []);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitRegistration(event) {
    event.preventDefault();

    if (Number(ppdbSettings.is_open) !== 1) {
      setMessage("PPDB online sedang ditutup. Silakan pantau informasi pembukaan PPDB berikutnya.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setRegistrationNumber("");

    try {
      const response = await fetch(`${API_BASE_URL}/ppdb/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        const errors = result.errors ? Object.values(result.errors).join(" ") : "";
        throw new Error(errors || result.message || "Pendaftaran gagal dikirim");
      }

      setRegistrationNumber(result.data.registration_number);
      setMessage("Pendaftaran berhasil dikirim. Simpan nomor registrasi Anda.");
      setForm(initialForm);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const contactItems = [
    { icon: Phone, title: "Telepon / WhatsApp", value: siteSettings.phone },
    { icon: Mail, title: "Email", value: siteSettings.email },
    { icon: MapPin, title: "Alamat", value: siteSettings.address },
    { icon: Clock, title: "Jam Layanan", value: siteSettings.service_hours }
  ];
  const isPpdbOpen = Number(ppdbSettings.is_open) === 1;
  const academicYear = ppdbSettings.academic_year || "2026/2027";

  return (
    <main className="ppdb-page">
      <section className="ppdb-page-hero">
        <div className="ppdb-page-hero-copy">
          <span>PPDB {academicYear}</span>
          <h1>Penerimaan Peserta Didik Baru</h1>
          <h2>SMA Bastren Daarul Ahgaff Pabelan</h2>
          <p>Membentuk generasi berilmu, berakhlak mulia, dan berwawasan luas dengan landasan nilai-nilai pesantren dan pendidikan berkualitas.</p>
          <div className="ppdb-page-actions">
            {isPpdbOpen ? (
              <PPDBButton>Daftar Sekarang <small>Isi Formulir Pendaftaran</small></PPDBButton>
            ) : (
              <PPDBButton href="#ppdb-info">PPDB Ditutup <small>Informasi pembukaan menyusul</small></PPDBButton>
            )}
            <PPDBButton variant="outline" href={ppdbSettings.brochure_url || "#ppdb-info"}>Download Brosur <small>PPDB {academicYear}</small></PPDBButton>
          </div>
        </div>
        <img src="/assets/default.png" alt="PPDB SMA Bastren Daarul Ahgaff" />
      </section>

      <section className="ppdb-page-stats" id="ppdb-info">
        {[
          { icon: CalendarDays, title: "Tahun Ajaran", value: academicYear },
          { icon: Clock, title: "Status Pendaftaran", value: isPpdbOpen ? "Sedang dibuka" : "Sedang ditutup" },
          { icon: UsersRound, title: "Kuota", value: ppdbSettings.quota_text || "Kuota terbatas" },
          { icon: MapPin, title: "Lokasi", value: ppdbSettings.location || "Pabelan, Kabupaten Semarang" },
        ].map(({ icon: Icon, title, value }) => (
          <article key={title}>
            <span><Icon size={27} /></span>
            <div>
              <h3>{title}</h3>
              <p>{value}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="ppdb-page-main-grid">
        <article className="ppdb-page-panel">
          <div className="ppdb-page-panel-title">
            <CalendarDays size={28} />
            <h2>Timeline Pendaftaran</h2>
          </div>
          <div className="ppdb-page-timeline">
            {timeline.map(([title, body, date], index) => (
              <div className="ppdb-page-timeline-item" key={title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <time>{date}</time>
              </div>
            ))}
          </div>
          <div className="ppdb-page-note">
            <Info size={22} />
            <p>Jadwal dapat berubah sewaktu-waktu. Pantau informasi terbaru melalui website dan media sosial resmi kami.</p>
          </div>
        </article>

        <article className="ppdb-page-panel">
          <div className="ppdb-page-panel-title">
            <ClipboardList size={28} />
            <div>
              <h2>Syarat-Syarat Pendaftaran</h2>
              <p>Pastikan semua berkas telah lengkap sebelum melakukan pendaftaran.</p>
            </div>
          </div>
          <div className="ppdb-page-requirements">
            {requirements.map(([title, body], index) => (
              <div className="ppdb-page-requirement" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="ppdb-page-form-section" id="ppdb-form">
        <div className="ppdb-page-section-heading">
          <h2>{isPpdbOpen ? "Formulir Pendaftaran Online" : "PPDB Online Sedang Ditutup"}</h2>
          <p>
            {isPpdbOpen
              ? "Isi data calon peserta didik dengan benar. Data ini akan masuk ke dashboard admin PPDB."
              : "Pendaftaran tahun ini belum dibuka atau sudah ditutup. Informasi PPDB berikutnya akan diumumkan melalui website dan kontak resmi sekolah."}
          </p>
        </div>

        {registrationNumber && (
          <div className="ppdb-page-success">
            <CheckCircle2 size={28} />
            <div>
              <strong>Nomor Registrasi: {registrationNumber}</strong>
              <p>{message}</p>
            </div>
          </div>
        )}

        {message && !registrationNumber && <p className="ppdb-page-error">{message}</p>}

        {isPpdbOpen ? (
        <form className="ppdb-page-form" onSubmit={submitRegistration}>
          <label>
            <span>Nama Lengkap</span>
            <input value={form.full_name} onChange={(event) => updateField("full_name", event.target.value)} required />
          </label>
          <label>
            <span>NISN</span>
            <input value={form.nisn} onChange={(event) => updateField("nisn", event.target.value)} />
          </label>
          <label>
            <span>Jenis Kelamin</span>
            <select value={form.gender} onChange={(event) => updateField("gender", event.target.value)} required>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </label>
          <label>
            <span>Tempat Lahir</span>
            <input value={form.birth_place} onChange={(event) => updateField("birth_place", event.target.value)} />
          </label>
          <label>
            <span>Tanggal Lahir</span>
            <input type="date" value={form.birth_date} onChange={(event) => updateField("birth_date", event.target.value)} />
          </label>
          <label>
            <span>Asal Sekolah</span>
            <input value={form.previous_school} onChange={(event) => updateField("previous_school", event.target.value)} />
          </label>
          <label>
            <span>Nama Orang Tua / Wali</span>
            <input value={form.parent_name} onChange={(event) => updateField("parent_name", event.target.value)} required />
          </label>
          <label>
            <span>Nomor WhatsApp</span>
            <input value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} required />
          </label>
          <label className="ppdb-page-form-wide">
            <span>Alamat Lengkap</span>
            <textarea rows="4" value={form.address} onChange={(event) => updateField("address", event.target.value)} />
          </label>
          <button className="ppdb-page-submit" type="submit" disabled={isSubmitting}>
            <Send size={20} />
            {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
          </button>
        </form>
        ) : (
          <div className="ppdb-page-success">
            <Info size={28} />
            <div>
              <strong>PPDB {academicYear} sedang ditutup</strong>
              <p>Silakan hubungi panitia melalui kontak di bawah ini untuk informasi lebih lanjut.</p>
            </div>
          </div>
        )}
      </section>

      <section className="ppdb-page-contact">
        <div className="ppdb-page-section-heading">
          <h2>Informasi Lebih Lanjut</h2>
          <p>Hubungi kami untuk informasi seputar PPDB SMA Bastren Daarul Ahgaff Pabelan.</p>
        </div>
        <div className="ppdb-page-contact-grid">
          {contactItems.map(({ icon: Icon, title, value }) => (
            <article key={title}>
              <span><Icon size={26} /></span>
              <div>
                <h3>{title}</h3>
                <p>{value}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
