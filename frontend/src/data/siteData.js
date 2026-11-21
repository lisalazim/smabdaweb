import {
  BookOpen,
  Building2,
  School,
  Trophy,
  UsersRound,
  UserRoundCheck
} from "lucide-react";

export const navItems = ["Beranda", "Profil", "Program Unggulan", "Berita", "Galeri"];

export const profilePhotos = [
  {
    title: "Pendiri Sekolah",
    image: "/assets/default.png"
  },
  {
    title: "Ketua Yayasan",
    image: "/assets/default.png"
  },
  {
    title: "Kepala Sekolah",
    image: "/assets/default.png"
  }
];

export const stats = [
  { icon: UsersRound, value: "500+", label: "Santri" },
  { icon: UserRoundCheck, value: "40+", label: "Guru & Staff" },
  { icon: Trophy, value: "20+", label: "Prestasi" },
  { icon: Building2, value: "1", label: "Kampus" }
];

export const programs = [
  {
    icon: School,
    title: "Kepesantrenan",
    body: "Program kepesantrenan yang kuat untuk membentuk generasi berakhlak mulia, fasih berbahasa, dan berwawasan luas.",
    image: "/assets/default.png"
  },
  {
    icon: BookOpen,
    title: "Keterampilan",
    body: "Mengembangkan potensi dan keterampilan santri melalui berbagai program kreatif dan inovatif untuk masa depan.",
    image: "/assets/default.png"
  }
];

export const news = [
  {
    date: "18 November 2024",
    title: "Semangat Pagi, Semangat Senam Bersama!",
    body: "Kegiatan senam bersama seluruh santri untuk menjaga kesehatan dan kebugaran.",
    image: "/assets/default.png"
  },
  {
    date: "12 Oktober 2024",
    title: "Mekteksa Cetak Santri Berkualitas Tinggi",
    body: "Kegiatan mekteksa rutin untuk meningkatkan kualitas belajar para santri.",
    image: "/assets/default.png"
  },
  {
    date: "25 September 2024",
    title: "Puskesmas Gelar Skrining di SMABDA",
    body: "Pemeriksaan kesehatan rutin bekerja sama dengan Puskesmas untuk santri SMABDA.",
    image: "/assets/default.png"
  }
];
