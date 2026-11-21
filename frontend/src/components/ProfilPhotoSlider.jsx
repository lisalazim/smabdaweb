import { useEffect, useState } from "react";
import { profilePhotos } from "../data/siteData";

export default function ProfilPhotoSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % profilePhotos.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="intro-card photo-card profile-slider" aria-label="Foto tokoh sekolah">
      {profilePhotos.map((photo, index) => (
        <img
          className={index === activeIndex ? "active" : ""}
          src={photo.image}
          alt={photo.title}
          key={photo.title}
        />
      ))}
      <div className="profile-slider-dots" aria-hidden="true">
        {profilePhotos.map((photo, index) => (
          <span className={index === activeIndex ? "active" : ""} key={photo.title} />
        ))}
      </div>
    </div>
  );
}
