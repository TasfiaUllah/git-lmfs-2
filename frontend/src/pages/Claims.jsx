import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut, FiBell } from "react-icons/fi";
import "./Dashboard.css";
import "./Claims.css";

import logoIcon     from "../assets/logo-icon.png";
import walletImg    from "../assets/brown_wallet.jpg";
import backpackImg  from "../assets/black_bagpack.jpg";
import headphoneImg from "../assets/headphone.avif";
import umbrellaImg  from "../assets/blue_umbrella.jpg";
import calcImg      from "../assets/calculator.jpg";
import chargerImg   from "../assets/charger.avif";
import flaskImg     from "../assets/flask.avif";

// ── TEMPORARY DATA ──
const TEMP_CLAIMS = [
  { id: 1, img: backpackImg,  name: "Pencil Pouch",   location: "Building 5, FAZ", category: "Stationery",    description: "Black and red pencil pouch with multiple compartments", status: "Pending", timeAgo: "3 hours ago",  date: "May 27, 2025", time: "10:45 AM" },
  { id: 2, img: walletImg,    name: "Wallet",          location: "Cafeteria",       category: "Accessories",   description: "Brown leather wallet with ID cards and cash",            status: "Pending", timeAgo: "Yesterday",    date: "May 26, 2025", time: "4:30 PM"  },
  { id: 3, img: headphoneImg, name: "Headphone",       location: "Library, 2nd Floor", category: "Electronics", description: "Black wireless headphone with case",                    status: "Pending", timeAgo: "2 days ago",   date: "May 25, 2025", time: "11:20 AM" },
  { id: 4, img: chargerImg,   name: "Charger",         location: "Main Gate 2",     category: "Electronics",   description: "White USB-C charger with cable",                         status: "Pending", timeAgo: "5 hours ago",  date: "May 27, 2025", time: "8:15 AM"  },
  { id: 5, img: umbrellaImg,  name: "Blue Umbrella",   location: "Building 3, FA1", category: "Accessories",   description: "Compact blue folding umbrella",                          status: "Approved", timeAgo: "3 days ago",  date: "May 24, 2025", time: "2:00 PM"  },
  { id: 6, img: flaskImg,     name: "Flask",           location: "Cafeteria",       category: "Sports & Fitness", description: "Steel flask with black lid",                          status: "Rejected", timeAgo: "4 days ago",  date: "May 23, 2025", time: "9:30 AM"  },
];

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function statusClass(status) {
  if (status === "Pending")  return "claim-badge--pending";
  if (status === "Approved") return "claim-badge--approved";
  return "claim-badge--rejected";
}

export default function Claims() {
  const navigate = useNavigate();
  const [claims,   setClaims]   = useState(TEMP_CLAIMS);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortBy,   setSortBy]   = useState("newest");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    fetch(`${API_BASE}/claims/my`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((r) => r.json())
  .then((data) => {
    if (Array.isArray(data.claims) && data.claims.length > 0) {
      setClaims(
        data.claims.map((claim, i) => ({
          id: claim.id,
          img:
            claim.FoundItem?.imageUrl ||
            TEMP_CLAIMS[i % TEMP_CLAIMS.length].img,

          name: claim.FoundItem?.itemName,
          location: claim.FoundItem?.Location?.locationName,
          category: claim.FoundItem?.Category?.categoryName,
          description: claim.FoundItem?.description,

          status: claim.status,
          timeAgo: "",
          date: claim.createdAt,
          time: claim.createdAt,
        }))
      );
    }
  })
  .catch(console.error);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const filtered = claims
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter(c => category === "All" || c.category === category)
    .filter(c => location === "All" || c.location.toLowerCase().includes(location.toLowerCase()))
    .filter(c => {
      if (dateFilter === "All") return true;
      if (dateFilter === "Today") return c.timeAgo.includes("hour") || c.timeAgo === "Today";
      if (dateFilter === "Yesterday") return c.timeAgo === "Yesterday";
      if (dateFilter === "This Week") return !c.timeAgo.includes("month");
      return true;
    })
    .sort((a, b) => sortBy === "newest" ? b.id - a.id : a.id - b.id);

  const categories = ["All", ...new Set(TEMP_CLAIMS.map(c => c.category))];
  const locations  = ["All", "Building 5, FAZ", "Cafeteria", "Library, 2nd Floor", "Main Gate 2", "Building 3, FA1"];

  return (
    <div className="dash-layout">

      {/* ── SIDEBAR ── */}
      <aside className="dash-sidebar">
        <div className="sidebar-logo">
          <img src={logoIcon} alt="CampusFind" className="sidebar-logo-img" />
        </div>
        <div className="sidebar-divider" />
        <nav className="sidebar-nav">
          <button className="sidebar-btn" onClick={() => navigate("/dashboard")} title="Dashboard">
            <HiHome size={22} color="#aaa" />
          </button>
          <button className="sidebar-btn sidebar-btn--active" title="Claims">
            <span className="icon-stack">
              <BsBoxSeam size={20} color="#F59E0B" />
              <HiMiniMagnifyingGlass size={10} color="#F59E0B" className="icon-overlay" />
            </span>
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/found-items")} title="Found Items">
            <span className="icon-stack">
              <BsBoxSeam size={20} color="#14B8A6" />
              <span className="icon-check">✓</span>
            </span>
          </button>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          <FiLogOut size={20} color="#e53e3e" />
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="dash-main">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="claims-title">Claims Submitted</h1>
            <p className="dash-subtitle">Think this items belong to you? Make sure you have solid proof!</p>
          </div>
          <button className="dash-bell" title="Notifications">
            <FiBell size={22} color="#555" />
          </button>
        </div>

        {/* Search */}
        <div className="claims-search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search for object..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="claims-filters">
          <select className="filter-btn" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <select className="filter-btn" value={location} onChange={e => setLocation(e.target.value)}>
            {locations.map(l => <option key={l}>{l}</option>)}
          </select>

          <select className="filter-btn" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option value="All">Date: All</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
          </select>

          <select className="filter-btn filter-btn--active" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Sorted by: Newest</option>
            <option value="oldest">Sorted by: Oldest</option>
          </select>

          <span className="claims-count">{filtered.length} items found</span>
        </div>

        {/* Claims List */}
        <div className="claims-list">
          {filtered.length === 0 ? (
            <div className="dash-empty">No claims found.</div>
          ) : filtered.map(item => (
            <div className="claim-row" key={item.id}>
              <img src={item.img} alt={item.name} className="claim-img" />
              <div className="claim-info">
                <h4>{item.name}</h4>
                <p className="claim-meta">
                  <LocationIcon /> {item.location}
                </p>
                <p className="claim-meta">
                  <CategoryIcon /> {item.category}
                </p>
                <p className="claim-meta">
                  <DescIcon /> {item.description}
                </p>
              </div>
              <div className="claim-right">
                <span className={`claim-badge ${statusClass(item.status)}`}>
                  <span className="badge-dot" /> {item.status}
                </span>
                <div className="claim-time">
                  <p className="time-ago"><ClockIcon /> {item.timeAgo}</p>
                  <p className="time-detail">{item.date} • {item.time}</p>
                </div>
                <button className="view-details-btn" onClick={() => navigate(`/claims/${item.id}`)}>
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

function DescIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}