import { programs } from "../data/siteData";
import Button from "./common/Button";
import Ornament from "./common/Ornament";

export default function ProgramUnggulan() {
  return (
    <section className="section" id="program-unggulan">
      <h2 className="section-title">Program Unggulan</h2>
      <Ornament />
      <div className="program-grid">
        {programs.map(({ icon: Icon, title, body, image }) => (
          <article className="program-card" key={title}>
            <div className="program-copy">
              <div className="circle-icon">
                <Icon size={30} />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <Button variant="outline">Selengkapnya</Button>
            </div>
            <img src={image} alt={title} />
          </article>
        ))}
      </div>
    </section>
  );
}
