import { useEffect, useState } from "react";
import AdminDashboardPage from "./components/AdminDashboardPage";
import AdminLoginPage from "./components/AdminLoginPage";
import Berita from "./components/Berita";
import BeritaDetailPage from "./components/BeritaDetailPage";
import BeritaPage from "./components/BeritaPage";
import Footer from "./components/Footer";
import GaleriPage from "./components/GaleriPage";
import Hero from "./components/Hero";
import InfoPPDB from "./components/InfoPPDB";
import Navbar from "./components/Navbar";
import ProfilPhotoSlider from "./components/ProfilPhotoSlider";
import ProfilPage from "./components/ProfilPage";
import ProfilSekolah from "./components/ProfilSekolah";
import PPDBPage from "./components/PPDBPage";
import ProgramPage from "./components/ProgramPage";
import ProgramUnggulan from "./components/ProgramUnggulan";
import Statistik from "./components/Statistik";

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const isProfilPage = hash === "#profil";
  const isProgramPage = hash === "#program-unggulan";
  const isBeritaPage = hash === "#berita";
  const isGaleriPage = hash === "#galeri";
  const isBeritaDetailPage = hash.startsWith("#berita-detail");
  const beritaSlug = hash.replace("#berita-detail/", "");
  const isPPDBPage = hash.startsWith("#ppdb");
  const isAdminLoginPage = hash === "#admin-login";
  const isAdminDashboardPage = hash === "#admin";

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <Navbar />
      {isAdminLoginPage ? (
        <AdminLoginPage />
      ) : isAdminDashboardPage ? (
        <AdminDashboardPage />
      ) : isProfilPage ? (
        <ProfilPage />
      ) : isProgramPage ? (
        <ProgramPage />
      ) : isBeritaDetailPage ? (
        <BeritaDetailPage slug={beritaSlug && beritaSlug !== "#berita-detail" ? beritaSlug : undefined} />
      ) : isPPDBPage ? (
        <PPDBPage />
      ) : isBeritaPage ? (
        <BeritaPage />
      ) : isGaleriPage ? (
        <GaleriPage />
      ) : (
        <main>

          <Hero />

          <section className="intro-wrap " id="profil-preview">
            <ProfilPhotoSlider />
            <ProfilSekolah />
            <InfoPPDB />
          </section>

          <Statistik />

          <ProgramUnggulan />

          <Berita />

        </main>
      )}
      <Footer />
    </>
  );
}
