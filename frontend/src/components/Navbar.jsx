import { useEffect, useState } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import { navItems } from "../data/siteData";
import Logo from "./common/Logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(window.location.hash || "#beranda");

  useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash || "#beranda");

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <header className={`site-header ${isMenuOpen ? "menu-open" : ""}`}>
      <Logo />
      <nav className="nav-links" aria-label="Navigasi utama">
        {navItems.map((item, index) => (
          <a
            className={activeHash === `#${item.toLowerCase().replaceAll(" ", "-")}` || (!activeHash && index === 0) ? "active" : ""}
            href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
            key={item}
            onClick={() => setIsMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </nav>
      <a className="ppdb-top" href="#ppdb">
        <CalendarDays size={18} />
        Informasi PPDB
      </a>
      <button
        className="menu-btn"
        type="button"
        aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>
    </header>
  );
}
