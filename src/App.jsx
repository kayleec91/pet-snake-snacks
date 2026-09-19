import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  Snowflake,
  Store,
  X,
} from "lucide-react";

const PHONE_DISPLAY = "(469) 300-0685";
const PHONE_DIGITS = "14693000685";
const FACEBOOK_URL = "https://www.facebook.com/PetSnakeSnacks/";

const mice = [
  { size: "Small pinks", live: true, frozen: true, age: "1 day", weight: "1 to 2 g", length: "0.5 to 1 in" },
  { size: "Large pinks", live: true, frozen: true, age: "2 to 4 days", weight: "2 to 3 g", length: "0.5 to 1 in" },
  { size: "Fuzzies", live: true, frozen: true, age: "5 to 9 days", weight: "4 to 6 g", length: "1.25 to 1.5 in" },
  { size: "Hoppers", live: true, frozen: true, age: "11 to 18 days", weight: "7 to 12 g", length: "1.5 to 2 in" },
  { size: "Smalls", live: false, frozen: true, age: "21 to 25 days", weight: "13 to 18 g", length: "2 to 2.5 in" },
  { size: "Adults", live: true, frozen: true, age: "30+ days", weight: "19 to 29 g", length: "2.5 to 3 in" },
  { size: "Jumbos", live: true, frozen: true, age: "6 months", weight: "30 to 50 g", length: "3 to 3.75 in" },
];

const rats = [
  { size: "Pinkies", live: true, frozen: true, age: "1 to 4 days", weight: "3 to 9 g", length: "1.5 to 2 in" },
  { size: "Fuzzies", live: true, frozen: true, age: "9 to 12 days", weight: "10 to 19 g", length: "2 to 2.5 in" },
  { size: "Pups", live: true, frozen: true, age: "13 to 19 days", weight: "20 to 34 g", length: "2.5 to 3 in" },
  { size: "Weans", live: true, frozen: true, age: "20 to 24 days", weight: "35 to 49 g", length: "3.5 to 4.5 in" },
  { size: "Smalls", live: true, frozen: true, age: "25 to 30 days", weight: "50 to 89 g", length: "4.5 to 6 in" },
  { size: "Mediums", live: true, frozen: true, age: "32 to 40 days", weight: "90 to 140 g", length: "6 to 8 in" },
  { size: "Larges", live: true, frozen: true, age: "42 to 60 days", weight: "180 to 279 g", length: "8 to 9 in" },
  { size: "Jumbos", live: true, frozen: true, age: "6 to 8 months", weight: "280 to 399 g", length: "11 to 13 in" },
  { size: "Colossals", live: true, frozen: true, age: "6 to 8 months", weight: "400 to 750 g", length: "11 to 13 in" },
];

const otherFeeders = [
  { name: "Rabbits", note: "Available by weight" },
  { name: "Frozen guinea pigs", note: "Available as stocked" },
  { name: "Chicks", note: "Small and bulk quantities" },
  { name: "Quail", note: "Extra small, small, medium, and large" },
];

const faqs = [
  {
    q: "Do you ship feeders?",
    a: "Not at this time. Feeders are available for pickup at the reptile expos listed on this website. Shop pickup in Irving, Texas is also available by request for orders over $30.",
  },
  {
    q: "Can I preorder feeders?",
    a: "Large live orders may be preordered for pickup at the next reptile show. Text us early so we can confirm availability.",
  },
  {
    q: "Are prices listed online?",
    a: "No. Availability and pricing can change. Text us for current details before the show.",
  },
  {
    q: "How do I choose the right feeder size?",
    a: "Use the age, weight, and length guide as a starting point, then confirm the best fit for your reptile with an experienced keeper or veterinarian.",
  },
];

const formatDate = (value) => {
  if (!value) return "Date to be announced";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
};

const dateRange = (start, end) => {
  if (!start) return "Date to be announced";
  if (!end || start === end) return formatDate(start);
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
  if (sameMonth) {
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(startDate);
    return `${month} ${startDate.getDate()} to ${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  return `${formatDate(start)} to ${formatDate(end)}`;
};

function Availability({ yes }) {
  return yes ? <span className="available"><Check size={15} /> Available</span> : <span className="unavailable">Not offered</span>;
}

function FeederTable({ title, subtitle, rows }) {
  return (
    <article className="menu-card">
      <div className="menu-card-heading">
        <div>
          <p className="eyebrow">Feeder guide</p>
          <h3>{title}</h3>
        </div>
        <p>{subtitle}</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Size</th><th>Live</th><th>Frozen</th><th>Age</th><th>Weight</th><th>Length</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.size}>
                <th scope="row">{row.size}</th>
                <td><Availability yes={row.live} /></td>
                <td><Availability yes={row.frozen} /></td>
                <td>{row.age}</td><td>{row.weight}</td><td>{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsState, setEventsState] = useState("loading");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const endpoint = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    if (!endpoint) {
      setEventsState("setup");
      return;
    }
    const scheduleUrl = `${endpoint}${endpoint.includes("?") ? "&" : "?"}action=petSnakeSnacksEvents`;
    fetch(scheduleUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Schedule request failed");
        return response.json();
      })
      .then((data) => {
        setEvents(Array.isArray(data) ? data : data.events || []);
        setEventsState("ready");
      })
      .catch(() => setEventsState("error"));
  }, []);

  const upcomingEvents = useMemo(() => events.filter((event) => event.status !== "hidden"), [events]);
  const textHref = `sms:+${PHONE_DIGITS}&body=${encodeURIComponent("Hi! I would like to ask about a large live feeder preorder for pickup at your next reptile show.")}`;

  return (
    <>
      <div className="topbar">Texas family owned since 2002 <span>•</span> Text preferred: {PHONE_DISPLAY}</div>
      <header>
        <a className="brand" href="#top" aria-label="Pet Snake Snacks home">
          <img src="/pss-logo-000.jpg" alt="Pet Snake Snacks" />
          <span><strong>Pet Snake Snacks</strong><small>Nourishing dinners for reptiles</small></span>
        </a>
        <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
          <a href="#menu" onClick={() => setMenuOpen(false)}>Feeder menu</a>
          <a href="#shows" onClick={() => setMenuOpen(false)}>Expo schedule</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">Facebook</a>
          <a className="nav-cta" href={textHref}>Text about a large live order</a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow light">Trusted by Texas reptile keepers</p>
            <h1>Better feeders.<br /><em>Healthier reptiles.</em></h1>
            <p className="hero-lead">Quality live and frozen feeders from the family behind Texas reptile meals since 2002.</p>
            <div className="hero-actions">
              <a className="button primary" href="#menu">Browse feeder menu</a>
              <a className="button ghost" href="#shows">Find us at a show</a>
            </div>
            <div className="trust-row">
              <span><strong>24+</strong> Years serving</span>
              <span><strong>Live + frozen</strong> Feeder options</span>
              <span><strong>Texas</strong> Expo pickup</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="logo-halo"><img src="/pss-logo-000.jpg" alt="Pet Snake Snacks logo" /></div>
            <div className="show-chip"><CalendarDays size={20} /><span>Meet us at the next expo</span></div>
          </div>
        </section>

        <section className="section menu-section" id="menu">
          <div className="section-heading">
            <div><p className="eyebrow">The feeder menu</p><h2>The right meal, every time.</h2></div>
            <p>Use this guide to compare sizes. Inventory changes by show, so text before traveling if you need something specific.</p>
          </div>
          <FeederTable title="Mice" subtitle="Live and frozen options for hatchlings through adults." rows={mice} />
          <FeederTable title="Rats" subtitle="A full range of feeder sizes for growing reptiles." rows={rats} />
          <article className="other-card">
            <div><p className="eyebrow">More choices</p><h3>Other feeders</h3><p>Availability varies by expo. Text us before the show to confirm.</p></div>
            <div className="other-grid">
              {otherFeeders.map((item) => <div key={item.name}><ShieldCheck size={21} /><span><strong>{item.name}</strong><small>{item.note}</small></span></div>)}
            </div>
          </article>
          <div className="notice-row">
            <span><Snowflake size={18} /> Frozen feeders packed for transport</span>
            <span><MessageCircle size={18} /> Large live orders may be preordered by text</span>
            <span><Store size={18} /> Irving shop pickup by request for orders over $30</span>
          </div>
        </section>

        <section className="section shows-section" id="shows">
          <div className="section-heading light-heading">
            <div><p className="eyebrow light">Expo pickup</p><h2>Catch us around Texas.</h2></div>
            <p>Show dates and attendance can change. Text before traveling to confirm Pet Snake Snacks will be there.</p>
          </div>
          <div className="event-grid">
            {eventsState === "loading" && <p className="schedule-message">Loading upcoming shows…</p>}
            {eventsState === "setup" && <p className="schedule-message">Upcoming show dates will appear here once the Google Sheet is connected.</p>}
            {eventsState === "error" && <p className="schedule-message">The show schedule is temporarily unavailable. Please text us for the next pickup date.</p>}
            {eventsState === "ready" && upcomingEvents.length === 0 && <p className="schedule-message">New show dates are coming soon. Text us for the latest schedule.</p>}
            {upcomingEvents.map((event) => (
              <article className="event-card" key={event.id || `${event.name}-${event.startDate}`}>
                {event.featured && <span className="event-badge">Featured show</span>}
                <h3>{event.name}</h3>
                <p className="event-date"><CalendarDays size={19} /> {dateRange(event.startDate, event.endDate)}</p>
                <p><MapPin size={19} /><span><strong>{event.venue}</strong><small>{event.address || `${event.city}, ${event.state || "TX"}`}</small></span></p>
                <div className="event-actions">
                  {event.address && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`} target="_blank" rel="noreferrer">Open address</a>}
                  {event.ticketLink && <a href={event.ticketLink} target="_blank" rel="noreferrer">Event details</a>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story section" id="story">
          <div className="story-photo-wrap">
            <img className="story-photo" src="/otis-meleah-expo.webp" alt="Otis and Meleah of Pet Snake Snacks at a Texas reptile expo" />
            <div className="story-stat"><strong>’02</strong><span>Serving reptiles since</span></div>
          </div>
          <div>
            <p className="eyebrow">Our family story</p>
            <h2>Meet Otis and Meleah.</h2>
            <p>For more than two decades, Otis and Meleah have made Pet Snake Snacks a familiar name at reptile shows across Texas. What started as a family commitment to better feeder quality became a trusted stop for keepers who value consistency, honest guidance, and a friendly face behind the table.</p>
            <p>From first time snake owners to longtime breeders, they help customers compare feeder sizes and plan ahead for expo pickup. Shop pickup in Irving is also available by request for orders over $30.</p>
            <a className="facebook-link" href={FACEBOOK_URL} target="_blank" rel="noreferrer">Follow Pet Snake Snacks on Facebook</a>
          </div>
        </section>

        <section className="preorder section">
          <div><p className="eyebrow light">Planning a large live order?</p><h2>Reserve it before the next show.</h2><p>Large live feeder orders may be preordered for expo pickup. Shop pickup in Irving is available by request for orders over $30. Text is preferred, and we will confirm availability and pickup details with you directly.</p></div>
          <a className="button primary" href={textHref}><MessageCircle size={20} /> Text {PHONE_DISPLAY}</a>
        </section>

        <section className="faq section" id="faq">
          <div className="section-heading"><div><p className="eyebrow">Good to know</p><h2>Feeder FAQ.</h2></div></div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <article className={openFaq === index ? "open" : ""} key={item.q}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                  {item.q}<ChevronDown />
                </button>
                {openFaq === index && <p>{item.a}</p>}
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><img src="/pss-logo-000.jpg" alt="" /><span><strong>Pet Snake Snacks</strong><small>Nourishing dinners for reptiles</small></span></div>
        <div><a href="#menu">Feeders</a><a href="#shows">Shows</a><a href={textHref}>Text us</a><a href={FACEBOOK_URL} target="_blank" rel="noreferrer">Facebook</a></div>
        <p>© 2026 Pet Snake Snacks. Family owned in Texas.<br />Show dates and stock are subject to confirmation.</p>
      </footer>
    </>
  );
}

export default App;
