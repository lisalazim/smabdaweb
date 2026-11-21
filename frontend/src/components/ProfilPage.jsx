import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  GraduationCap,
  Home,
  Library,
  Monitor,
  School,
  Target,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { mediaUrl } from "../utils/media";

const defaultLeaders = [
  {
    role: "Sambutan Pendiri",
    name: "KH. Fatchurrohman Tohir",
    title: "Muassi Pondok Pesantren Daarussaalaam Sempon",
    quote: "Pendidikan adalah jalan untuk membentuk insan berilmu, berakhlak, dan bermanfaat bagi umat dan bangsa."
  },
  {
    role: "Sambutan Ketua Yayasan",
    name: "KH. Muhammad A'lam, Lc.",
    title: "Ketua Yayasan Daarussaalaam Sempon",
    quote: "Kami berkomitmen menghadirkan pendidikan yang berakar pada nilai keislaman dan relevan dengan tantangan masa depan."
  },
  {
    role: "Sambutan Kepala Sekolah",
    name: "Muhamad Nur Affendi, S.Kep.",
    title: "Kepala Sekolah SMA Bastren Daarul Ahgaff Pabelan",
    quote: "SMA Bastren Daarul Ahgaff menjadi ruang tumbuh bagi generasi yang unggul dalam ilmu, kokoh dalam akhlak, dan siap menghadapi masa depan."
  }
];

const defaultIdentity = [
  ["Nama Sekolah", "SMA BASTREN DAARUL AHGAFF PABELAN"],
  ["NPSN", "70045356"],
  ["Status", "Swasta"],
  ["Jenjang", "SMA"],
  ["Alamat", "Gelangan RT 002 RW 001, Kadirejo, Kec. Pabelan, Kab. Semarang"],
  ["Tahun Berdiri", "2010"],
  ["Akreditasi", "A"],
  ["Jumlah Guru", "40+"],
  ["Jumlah Siswa", "500+"]
];

const defaultMissions = [
  "Menyelenggarakan pendidikan yang berkualitas dan berlandaskan nilai-nilai Islam.",
  "Membentuk karakter peserta didik yang berakhlak mulia dan berjiwa pemimpin.",
  "Mengembangkan potensi akademik, bahasa, dan keterampilan peserta didik.",
  "Menumbuhkan budaya belajar, disiplin, dan peduli lingkungan.",
  "Mempersiapkan lulusan yang siap melanjutkan pendidikan dan terjun di masyarakat."
];

const values = [
  {
    icon: BookOpen,
    title: "Keislaman",
    body: "Berpegang teguh pada ajaran Islam sebagai landasan berpikir, bersikap, dan bertindak."
  },
  {
    icon: GraduationCap,
    title: "Akademik",
    body: "Mengutamakan mutu pendidikan untuk menghasilkan prestasi yang gemilang."
  },
  {
    icon: UsersRound,
    title: "Karakter",
    body: "Membentuk pribadi yang jujur, disiplin, tangguh, dan berakhlak mulia."
  },
  {
    icon: School,
    title: "Kepemimpinan",
    body: "Melatih jiwa kepemimpinan dan kemandirian untuk menjadi generasi berwawasan luas."
  }
];

const facilities = [
  { icon: "Building2", name: "Masjid", image: "/assets/default.png" },
  { icon: "Monitor", name: "Lab Komputer", image: "/assets/default.png" },
  { icon: "Library", name: "Perpustakaan", image: "/assets/default.png" },
  { icon: "Home", name: "Asrama", image: "/assets/default.png" },
  { icon: "Target", name: "Lapangan", image: "/assets/default.png" }
];

const facilityIcons = {
  Building2,
  "building-2": Building2,
  building: Building2,
  Monitor,
  monitor: Monitor,
  Library,
  library: Library,
  Home,
  home: Home,
  Target,
  target: Target,
  School,
  school: School,
  BookOpen,
  "book-open": BookOpen,
  book: BookOpen,
  GraduationCap,
  "graduation-cap": GraduationCap,
  UsersRound,
  users: UsersRound
};

function getFacilityIcon(iconName) {
  return facilityIcons[iconName] || Building2;
}

function ReadMoreLink() {
  return (
    <a className="profile-read-link" href="#profil">
      Baca Selengkapnya
      <ArrowRight size={15} />
    </a>
  );
}

function LeaderCard({ leader }) {
  return (
    <article className="profile-leader-card">
      <div className="profile-leader-photo">
        <img src={mediaUrl(leader.photo)} alt={leader.name} />
      </div>
      <div className="profile-leader-content">
        <p>{leader.role}</p>
        <h2>{leader.name}</h2>
        <span>{leader.title}</span>
        <strong aria-hidden="true">“</strong>
        <blockquote>{leader.quote}</blockquote>
      </div>
    </article>
  );
}

export default function ProfilPage() {
  const [profile, setProfile] = useState(null);
  const [leaders, setLeaders] = useState(defaultLeaders);
  const [schoolFacilities, setSchoolFacilities] = useState(facilities);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileResponse, leadersResponse, facilitiesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/school-profile`),
          fetch(`${API_BASE_URL}/profile-leaders`),
          fetch(`${API_BASE_URL}/school-facilities`),
        ]);
        const [profileResult, leadersResult, facilitiesResult] = await Promise.all([
          profileResponse.json(),
          leadersResponse.json(),
          facilitiesResponse.json(),
        ]);

        setProfile(profileResult.data || null);
        setLeaders(leadersResult.data?.length ? leadersResult.data : defaultLeaders);
        setSchoolFacilities(facilitiesResult.data?.length ? facilitiesResult.data : facilities);
      } catch {
        setProfile(null);
        setLeaders(defaultLeaders);
        setSchoolFacilities(facilities);
      }
    }

    loadProfile();
  }, []);

  const identity = [
    ["Nama Sekolah", profile?.school_name || defaultIdentity[0][1]],
    ["NPSN", profile?.npsn || defaultIdentity[1][1]],
    ["Status", profile?.status || defaultIdentity[2][1]],
    ["Jenjang", profile?.level || defaultIdentity[3][1]],
    ["Alamat", profile?.address || defaultIdentity[4][1]],
    ["Tahun Berdiri", profile?.founded_year || defaultIdentity[5][1]],
    ["Akreditasi", profile?.accreditation || defaultIdentity[6][1]],
    ["Jumlah Guru", profile?.teachers_count || defaultIdentity[7][1]],
    ["Jumlah Siswa", profile?.students_count || defaultIdentity[8][1]]
  ];
  const missions = String(profile?.mission || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const missionItems = missions.length > 0 ? missions : defaultMissions;

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <img src="/assets/default.png" alt="Gedung SMA Bastren Daarul Ahgaff Pabelan" />
        <div className="profile-hero-overlay" />
        <div className="profile-hero-copy">
          <p>Profil Sekolah</p>
          <h1>Membangun Generasi Berilmu, Berakhlak, dan Berwawasan</h1>
        </div>
      </section>

      <section className="profile-leaders">
        {leaders.map((leader) => (
          <LeaderCard leader={leader} key={leader.role} />
        ))}
      </section>

      <section className="profile-info-grid" id="tentang-sekolah">
        <article className="profile-panel profile-about">
          <p className="profile-eyebrow">Tentang Sekolah</p>
          <h2>{profile?.school_name || "SMA Bastren Daarul Ahgaff Pabelan"}</h2>
          <p>{profile?.description || "SMA Bastren Daarul Ahgaff Pabelan merupakan lembaga pendidikan yang memadukan kurikulum nasional dengan pembinaan karakter dan nilai-nilai keislaman."}</p>
          <img src="/assets/default.png" alt="Lingkungan sekolah" />
        </article>

        <article className="profile-panel profile-identity">
          <div className="profile-panel-title">
            <Building2 size={25} />
            <h2>Identitas Sekolah</h2>
          </div>
          <dl>
            {identity.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </section>

      <section className="profile-principles">
        <article className="profile-panel profile-vision">
          <div className="profile-panel-title">
            <Eye size={25} />
            <h2>Visi</h2>
          </div>
          <p>"{profile?.vision || "Terwujudnya generasi islami yang berilmu, berakhlak mulia, dan berwawasan global."}"</p>
        </article>

        <article className="profile-panel">
          <div className="profile-panel-title">
            <Target size={25} />
            <h2>Misi</h2>
          </div>
          <ul className="profile-check-list">
            {missionItems.map((mission) => (
              <li key={mission}>
                <CheckCircle2 size={18} />
                {mission}
              </li>
            ))}
          </ul>
        </article>

        <article className="profile-panel">
          <h2>Nilai Utama Kami</h2>
          <div className="profile-values">
            {values.map(({ icon: Icon, title, body }) => (
              <div className="profile-value-item" key={title}>
                <span>
                  <Icon size={23} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="profile-bottom-grid">
        <article className="profile-panel profile-structure">
          <p className="profile-eyebrow">Struktur Organisasi Sekolah</p>
          <div className="org-chart">
            <div className="org-node primary">
              <strong>Kepala Sekolah</strong>
              <span>Kim Namjoon, M.Pd</span>
            </div>
            <div className="org-branches">
              <div className="org-node">
                <strong>Waka. Kurikulum</strong>
                <span>Kim Jisoo, S.Pd</span>
              </div>
              <div className="org-node">
                <strong>Waka. Kesiswaan</strong>
                <span>Jeon Jungkook, S.S</span>
              </div>
              <div className="org-node">
                <strong>Waka. Sarpras</strong>
                <span>Min Yoongi, S.Sos</span>
              </div>
            </div>
            <div className="org-node staff">
              <strong>Guru & Staff</strong>
              <span>Pendidik, Tenaga Kependidikan, dan Administrasi</span>
            </div>
          </div>
        </article>

        <article className="profile-panel profile-facilities">
          <p className="profile-eyebrow">Fasilitas & Lingkungan</p>
          <div className="facility-grid">
            {schoolFacilities.map((facility) => {
              const Icon = getFacilityIcon(facility.icon);

              return (
              <div className="facility-item" key={facility.id || facility.name}>
                <img src={mediaUrl(facility.image)} alt={facility.name} />
                <span>
                  <Icon size={21} />
                </span>
                <p>{facility.name}</p>
              </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="profile-cta">
        <div className="profile-cta-icon">
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
