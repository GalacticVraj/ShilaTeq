import "./contact.css";

const PEOPLE = [
  { name: "Vraj Talati", display: "+91 70437 65580", number: "917043765580" },
  { name: "Lakshya Jain", display: "+91 8078 686 994", number: "918078686994" },
];
const EMAIL = "shilateq@gmail.com";
const WA_TEXT = encodeURIComponent("Hi ShilaTeq, I'd like to know more about StoneX.");

/** Direct contact, the same on every page: call or WhatsApp a person, or email. */
export function Contact() {
  return (
    <section className="x-contact" aria-labelledby="x-contact-title">
      <p className="x-label x-contact__kicker">Contact</p>
      <h2 id="x-contact-title" className="x-contact__title">
        Talk to us directly.
      </h2>
      <ul className="x-contact__list">
        {PEOPLE.map((p) => (
          <li key={p.number} className="x-contact__card">
            <p className="x-contact__name">{p.name}</p>
            <p className="x-contact__line">{p.display}</p>
            <div className="x-contact__do">
              <a href={`tel:+${p.number}`} className="x-contact__btn">
                Call<span className="sr-only"> {p.name}</span>
              </a>
              <a
                href={`https://wa.me/${p.number}?text=${WA_TEXT}`}
                className="x-contact__btn x-contact__btn--wa"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp<span className="sr-only"> {p.name}</span>
              </a>
            </div>
          </li>
        ))}
        <li className="x-contact__card">
          <p className="x-contact__name">Email</p>
          <p className="x-contact__line">{EMAIL}</p>
          <div className="x-contact__do">
            <a href={`mailto:${EMAIL}`} className="x-contact__btn">
              Email us
            </a>
          </div>
        </li>
      </ul>
    </section>
  );
}
