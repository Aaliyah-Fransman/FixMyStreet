
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  ClipboardList,
  Lightbulb,
  Construction,
  Trash2,
  Road,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const categories = [
  {
    title: "Potholes",
    description: "Report dangerous potholes and damaged road surfaces.",
    icon: Construction,
  },
  {
    title: "Broken streetlights",
    description: "Help identify streetlights that are not working.",
    icon: Lightbulb,
  },
  {
    title: "Damaged roads",
    description: "Highlight roads that need maintenance and repairs.",
    icon: Road,
  },
  {
    title: "Illegal dumping",
    description: "Report illegal waste dumping in your community.",
    icon: Trash2,
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <MapPin size={16} />
                Your community. Your voice.
              </span>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                Together, we can build
                <span className="text-blue-400"> better streets.</span>
              </h1>

              <p className="text-slate-300 text-lg leading-8 mb-8 max-w-xl">
                FixMyStreet helps communities report local infrastructure
                problems and follow their progress in one central place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3.5 rounded-xl font-bold transition"
                >
                  Get Started <ArrowRight size={19} />
                </Link>

                <Link
                  to="/dashboard"
                  className="border border-slate-600 hover:bg-slate-800 px-6 py-3.5 rounded-xl font-semibold transition"
                >
                  View Reports
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85"
                alt="City streets and buildings"
                className="rounded-3xl shadow-2xl w-full h-[360px] md:h-[460px] object-cover"
              />
              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white text-slate-900 rounded-2xl shadow-xl p-5 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="font-bold">Community focused</p>
                    <p className="text-sm text-slate-500">
                      Better visibility of local issues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="text-blue-700 font-bold text-sm uppercase tracking-widest">
              How it works
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-5">
              Making community reporting easier
            </h2>

            <p className="text-slate-600 max-w-2xl mx-auto leading-7">
              Residents can view reported infrastructure problems and track
              their status, while administrators manage reports and updates.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-12 text-left">
              <div className="p-7 bg-slate-50 rounded-2xl border border-slate-100">
                <MapPin className="text-blue-700 mb-5" size={30} />
                <h3 className="font-bold text-xl mb-3">See local issues</h3>
                <p className="text-slate-600 leading-7">
                  View reports with their locations, descriptions and
                  categories.
                </p>
              </div>

              <div className="p-7 bg-slate-50 rounded-2xl border border-slate-100">
                <ClipboardList className="text-blue-700 mb-5" size={30} />
                <h3 className="font-bold text-xl mb-3">Track progress</h3>
                <p className="text-slate-600 leading-7">
                  Follow whether a reported issue is pending, in progress or
                  resolved.
                </p>
              </div>

              <div className="p-7 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck className="text-blue-700 mb-5" size={30} />
                <h3 className="font-bold text-xl mb-3">Manage reports</h3>
                <p className="text-slate-600 leading-7">
                  Administrators can organise reports and update their
                  progress.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-blue-700 font-bold text-sm uppercase tracking-widest">
                Report a problem
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
                What needs fixing?
              </h2>
              <p className="text-slate-600 mt-4">
                Infrastructure issues we want to make easier to report.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <div
                    key={category.title}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition"
                  >
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-xl w-fit mb-5">
                      <Icon size={26} />
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      {category.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-6">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-blue-700 py-16">
          <div className="max-w-5xl mx-auto px-6 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5">
              Your community deserves better.
            </h2>
            <p className="text-blue-100 mb-8 leading-7">
              Get involved and help make local infrastructure issues more
              visible.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition"
            >
              Create an account <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-bold text-white">FixMyStreet</p>
          <p className="text-sm">
            Community Infrastructure Reporting Platform · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
