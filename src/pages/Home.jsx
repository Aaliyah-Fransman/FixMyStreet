import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Search,
  MapPin,
  Construction,
  Lightbulb,
  Trash2,
  Route,
  Activity,
  ShieldCheck,
  Camera,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ReportCard from "../components/ReportCard";
import { apiRequest } from "../api";

const categories = [
  {
    name: "Potholes",
    desc: "Road surfaces that need attention",
    icon: Construction,
    num: "01",
  },
  {
    name: "Broken streetlights",
    desc: "Dark streets and faulty lighting",
    icon: Lightbulb,
    num: "02",
  },
  {
    name: "Damaged roads",
    desc: "Cracks, erosion and unsafe surfaces",
    icon: Route,
    num: "03",
  },
  {
    name: "Illegal dumping",
    desc: "Waste affecting public spaces",
    icon: Trash2,
    num: "04",
  },
];

const areas = [
  "Northcliff",
  "Randburg",
  "Sandton",
  "Rosebank",
  "Fourways",
];

export default function Home() {
  const [area, setArea] = useState("");
  const [searched, setSearched] = useState(false);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH PUBLIC REPORTS
  useEffect(() => {
    const fetchPublicReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest("/reports/public");

        const formattedReports = (response.reports || []).map(
          (report) => ({
            ...report,

            category:
              report.categories?.name || "General",

            location:
              report.location ||
              report.suburb ||
              "Location not specified",

            date: report.created_at
              ? new Date(report.created_at).toLocaleDateString(
                  "en-ZA",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "Date unavailable",
          })
        );

        setReports(formattedReports);
      } catch (err) {
        console.error("Explore reports error:", err);
        setError(
          "Unable to load community reports. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPublicReports();
  }, []);

  // SEARCH REPORTS BY AREA
  const matches = useMemo(() => {
    const searchTerm = area.trim().toLowerCase();

    if (!searchTerm) {
      return reports;
    }

    return reports.filter((report) => {
      const location = (report.location || "").toLowerCase();
      const suburb = (report.suburb || "").toLowerCase();

      return (
        location.includes(searchTerm) ||
        suburb.includes(searchTerm)
      );
    });
  }, [reports, area]);

  const search = () => {
    setSearched(true);
  };

  return (
    <>
      <Navbar />

      <main>

        {/* HERO SECTION */}

        <section className="hero-shell">
          <div className="hero-grid">

            <div className="hero-copy">

              <div className="eyebrow light">
                <span className="live-dot" />
                COMMUNITY ISSUE TRACKER
                <span className="eyebrow-line" />
              </div>

              <h1 className="display-title">
                The streets
                <br />
                are <span className="hero-highlight">ours.</span>
                <br />
                <span className="hero-outline">
                  Let's fix them.
                </span>
              </h1>

              <p className="hero-description">
                A clearer picture of what's happening in your
                neighbourhood. Report local infrastructure problems,
                share evidence and follow every update.
              </p>

              <div className="flex flex-wrap gap-3 mt-9">

                <Link to="/register" className="button-lime">
                  Report an issue
                  <ArrowUpRight size={18} />
                </Link>

                <a href="#area-search" className="button-ghost">
                  Explore your area
                  <ArrowDownRight size={17} />
                </a>

              </div>

              <div className="hero-footnote">
                <span>
                  <ShieldCheck size={15} />
                  Built around local voices
                </span>

                <span>
                  <Activity size={15} />
                  Track progress openly
                </span>
              </div>

            </div>

            <div className="hero-art">

              <div className="map-label">
                <span className="map-label-dot" />
                LIVE NEIGHBOURHOOD VIEW
                <span>GAUTENG / ZA</span>
              </div>

              <div className="map-visual">

                <div className="map-grid-lines" />

                <svg
                  viewBox="0 0 560 520"
                  className="map-svg"
                  role="img"
                  aria-label="Abstract street map with highlighted community report locations"
                >
                  <path
                    d="M-20 120 L160 200 290 90 590 190 M-20 330 L150 260 310 390 590 290 M80 -20 L190 140 150 300 260 540 M350 -20 L300 140 420 280 370 540 M500 -20 L430 130 500 300 470 540"
                    fill="none"
                    stroke="#465148"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />

                  <path
                    d="M-20 120 L160 200 290 90 590 190 M-20 330 L150 260 310 390 590 290 M80 -20 L190 140 150 300 260 540 M350 -20 L300 140 420 280 370 540 M500 -20 L430 130 500 300 470 540"
                    fill="none"
                    stroke="#879080"
                    strokeWidth="2"
                    strokeDasharray="5 9"
                  />

                  <path
                    d="M150 260 L310 390 420 280"
                    fill="none"
                    stroke="#c9f36a"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                  />
                </svg>

                {[
                  ["18%", "35%", "POTHOLE"],
                  ["62%", "27%", "LIGHTING"],
                  ["55%", "70%", "ROAD DAMAGE"],
                  ["28%", "76%", "DUMPING"],
                ].map(([x, y, label]) => (
                  <div
                    key={label}
                    className="map-pin"
                    style={{ left: x, top: y }}
                  >
                    <span className="pin-pulse" />
                    <span className="pin-dot" />
                    <span className="pin-label">
                      {label}
                    </span>
                  </div>
                ))}

                <div className="map-coordinates">
                  26°08' S&nbsp; 27°58' E
                  <br />
                  JOHANNESBURG
                </div>

              </div>

              <div className="map-caption">
                <span className="caption-index">
                  FIG. 01
                </span>

                <span>
                  Small observations can lead to meaningful change.
                </span>

                <ArrowUpRight size={17} />
              </div>

            </div>

          </div>

          <div className="hero-bottom">
            <span>LOCAL KNOWLEDGE. VISIBLE ACTION.</span>
            <span>SCROLL TO EXPLORE ↓</span>
            <span>01 — 04 / FIX WHAT MATTERS</span>
          </div>

        </section>

        {/* EXPLORE REPORTS */}

        <section
          id="area-search"
          className="area-section section-pad"
        >

          <div className="section-kicker">
            01 / YOUR NEIGHBOURHOOD
          </div>

          <div className="section-heading-row">

            <div>
              <h2 className="section-title">
                What's happening
                <br />
                <em>around you?</em>
              </h2>

              <p className="section-intro">
                Search your area to see reported issues nearby.
                Start with a suburb or neighbourhood.
              </p>
            </div>

            <div className="area-count">
              <strong>
                {String(reports.length).padStart(2, "0")}
              </strong>

              <span>
                COMMUNITY REPORTS
                <br />
                IN THE DIRECTORY
              </span>
            </div>

          </div>

          {/* SEARCH BAR */}

          <div className="area-search-box">

            <div className="search-icon">
              <Search size={21} />
            </div>

            <input
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setSearched(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") search();
              }}
              placeholder="Enter your area — e.g. Northcliff, Randburg, Sandton"
              aria-label="Search by area"
            />

            <button
              onClick={search}
              className="button-primary"
            >
              Find local reports
              <ArrowRight size={17} />
            </button>

          </div>

          {/* SUGGESTED AREAS */}

          <div className="suggested-areas">

            <span>TRY AN AREA</span>

            {areas.map((a) => (
              <button
                key={a}
                onClick={() => {
                  setArea(a);
                  setSearched(true);
                }}
              >
                {a}
              </button>
            ))}

            {area && (
              <button
                className="clear-area"
                onClick={() => {
                  setArea("");
                  setSearched(false);
                }}
              >
                Clear ×
              </button>
            )}

          </div>

          {/* REPORT RESULTS */}

          {searched && (
            <div className="mt-9">

              <div className="flex justify-between items-center mb-5">

                <h3 className="text-xl font-semibold">
                  {area
                    ? "Reports in " + area
                    : "All community reports"}
                </h3>

                <span className="text-sm text-[#777d70]">
                  {matches.length} result
                  {matches.length === 1 ? "" : "s"}
                </span>

              </div>

              {loading ? (
                <div className="empty-panel">
                  Loading community reports...
                </div>
              ) : error ? (
                <div className="empty-panel">
                  {error}
                </div>
              ) : matches.length > 0 ? (

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                  {matches.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                    />
                  ))}

                </div>

              ) : (

                <div className="empty-panel">
                  No community reports found for this area yet.
                  Try another suburb or{" "}
                  <button
                    onClick={() => {
                      setArea("");
                      setSearched(true);
                    }}
                  >
                    view all areas
                  </button>.
                </div>

              )}

            </div>
          )}

          {loading && !searched && (
            <p className="mt-6 text-sm text-[#777d70]">
              Community report directory is ready to search.
            </p>
          )}

          {error && !searched && (
            <p className="mt-6 text-sm text-red-600">
              {error}
            </p>
          )}

        </section>

        {/* MISSION SECTION */}

        <section
          id="about"
          className="mission-section section-pad"
        >

          <div className="section-kicker light">
            02 / WHY FIXMYSTREET
          </div>

          <div className="mission-layout">

            <h2 className="section-title light-title">
              A better street
              <br />
              starts with <em>being heard.</em>
            </h2>

            <div>

              <p className="mission-copy">
                When a streetlight goes dark or a pothole grows,
                the people who live there notice first.
                FixMyStreet gives those observations a place
                to be seen, organised and followed up.
              </p>

              <Link to="/login" className="text-link">
                Explore the report board
                <ArrowUpRight size={18} />
              </Link>

            </div>

          </div>

          <div className="steps-grid">

            <div className="step-card">
              <span>01</span>
              <Camera />
              <h3>Show what you see</h3>
              <p>
                Describe the issue and attach a photo to help
                others understand the problem.
              </p>
            </div>

            <div className="step-card">
              <span>02</span>
              <MapPin />
              <h3>Pinpoint the place</h3>
              <p>
                Add the suburb or street so reports are useful
                to the people nearby.
              </p>
            </div>

            <div className="step-card">
              <span>03</span>
              <CheckCircle2 />
              <h3>Follow the progress</h3>
              <p>
                See whether an issue is pending, being addressed
                or resolved.
              </p>
            </div>

          </div>

        </section>

        {/* CATEGORIES */}

        <section className="category-section section-pad">

          <div className="section-kicker">
            03 / WHAT NEEDS ATTENTION
          </div>

          <div className="section-heading-row">

            <h2 className="section-title">
              Four ways to
              <br />
              <em>make a difference.</em>
            </h2>

            <p className="section-intro">
              From the road you drive on to the park your children
              play in, every report helps build a clearer picture.
            </p>

          </div>

          <div className="category-grid">

            {categories.map(
              ({ name, desc, icon: Icon, num }) => (
                <Link
                  to="/login"
                  key={name}
                  className="category-item"
                >
                  <span className="category-number">
                    {num}
                  </span>

                  <Icon size={27} />

                  <h3>{name}</h3>

                  <p>{desc}</p>

                  <ArrowUpRight className="category-arrow" />
                </Link>
              )
            )}

          </div>

        </section>

        {/* CLOSING CTA */}

        <section className="closing-cta">

          <div className="section-kicker light">
            04 / TAKE PART
          </div>

          <h2 className="display-title">
            Your street.
            <br />
            <span className="hero-highlight">
              Your say.
            </span>
          </h2>

          <p>
            Notice something that needs fixing? Make it visible.
          </p>

          <Link
            to="/register"
            className="button-lime"
          >
            Join the community
            <ArrowUpRight size={18} />
          </Link>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="site-footer">

        <Link to="/" className="brand">

          <span className="brand-mark">
            <MapPin size={18} />
          </span>

          <span>
            fixmy<span className="brand-accent">street.</span>
          </span>

        </Link>

        <span>
          COMMUNITY INFRASTRUCTURE REPORTING PLATFORM · 2026
        </span>

        <span>
          MADE FOR THE STREETS WE SHARE.
        </span>

      </footer>

    </>
  );
}