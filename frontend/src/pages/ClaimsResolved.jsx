import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut, FiBell, FiPhone } from "react-icons/fi";
import "./Dashboard.css";
import "./ClaimsResolved.css";

import logoIcon    from "../assets/logo-icon.png";
import walletImg   from "../assets/brown_wallet.jpg";
import backpackImg from "../assets/black_bagpack.jpg";
import bottleImg   from "../assets/silver_water_bottle.jpg";
import umbrellaImg from "../assets/blue_umbrella.jpg";
import flaskImg    from "../assets/flask.avif";
import chargerImg  from "../assets/charger.avif";
import headphoneImg from "../assets/headphone.avif";

// ── Avatar Component ──
function Avatar({ name, size = 40 }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#4B2FA0", "#F59E0B", "#14B8A6", "#e53e3e", "#8b5cf6", "#059669"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, display: "flex", alignItems: "center",
      justifyContent: "center", color: "#fff",
      fontSize: size * 0.33, fontWeight: 700,
      fontFamily: "Poppins, sans-serif", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ── TEMPORARY DATA ──
const TEMP_RESOLVED = [
  { id: 1, img: bottleImg,    name: "Water Bottle",  category: "Sports & Fitness", location: "Library, 2nd Floor", reporter: { name: "Rahim Ahmed",  id: "22101015" }, date: "May 27, 2025", time: "11:20 AM", outcome: "Approved", resolutionDays: 1, resolutionHours: 3 },
  { id: 2, img: walletImg,    name: "Wallet",        category: "Accessories",      location: "Cafeteria",          reporter: { name: "Nusrat Jahan", id: "22104567" }, date: "May 26, 2025", time: "4:30 PM",  outcome: "Approved", resolutionDays: 2, resolutionHours: 1 },
  { id: 3, img: flaskImg,     name: "Flask",         category: "Others",           location: "Main Gate 2",        reporter: { name: "Fahim Rahman", id: "22103211" }, date: "May 25, 2025", time: "8:15 AM",  outcome: "Rejected", resolutionDays: 3, resolutionHours: 2 },
  { id: 4, img: backpackImg,  name: "Pencil Pouch",  category: "Stationery",       location: "Building 5, FAZ",    reporter: { name: "Samia Islam",  id: "22101987" }, date: "May 24, 2025", time: "10:45 AM", outcome: "Approved", resolutionDays: 1, resolutionHours: 5 },
  { id: 5, img: umbrellaImg,  name: "Blue Umbrella", category: "Accessories",      location: "Library Entrance",   reporter: { name: "Mehedi Hasan", id: "22100346" }, date: "May 23, 2025", time: "3:10 PM",  outcome: "Approved", resolutionDays: 2, resolutionHours: 4 },
  { id: 6, img: chargerImg,   name: "Charger",       category: "Electronics",      location: "Building 3, FA1",    reporter: { name: "Rahim Ahmed",  id: "22101015" }, date: "May 22, 2025", time: "9:00 AM",  outcome: "Rejected", resolutionDays: 4, resolutionHours: 2 },
  { id: 7, img: headphoneImg, name: "Headphone",     category: "Electronics",      location: "Auditorium",         reporter: { name: "Nusrat Jahan", id: "22104567" }, date: "May 21, 2025", time: "2:30 PM",  outcome: "Approved", resolutionDays: 1, resolutionHours: 6 },
];

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function ClaimsResolved() {
  const navigate = useNavigate();
  const [resolved,        setResolved]        = useState(TEMP_RESOLVED);
  const [search,          setSearch]          = useState("");
  const [statusFilter,    setStatusFilter]    = useState("All");
  const [categoryFilter,  setCategoryFilter]  = useState("All");
  const [locationFilter,  setLocationFilter]  = useState("All");
  const [sortBy,          setSortBy]          = useState("newest");
  const [selectedItem,    setSelectedItem]    = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetch(`${API_BASE}/claims/my?status=resolved`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((r) => r.json())
  .then((data) => {
    if (Array.isArray(data.claims) && data.claims.length > 0) {
      setResolved(
        data.claims.map((claim, i) => ({
          id: claim.id,

          img:
            claim.FoundItem?.imageUrl ||
            TEMP_RESOLVED[i % TEMP_RESOLVED.length].img,

          name:
            claim.FoundItem?.itemName || "Unknown Item",

          category:
            claim.FoundItem?.Category?.categoryName || "Unknown",

          location:
            claim.FoundItem?.Location?.locationName || "Unknown",

          reporter: {
            name:
              claim.FoundItem?.User?.fullName ||
              TEMP_RESOLVED[i % TEMP_RESOLVED.length].reporter.name,

            id:
              claim.FoundItem?.User?.matrixId ||
              TEMP_RESOLVED[i % TEMP_RESOLVED.length].reporter.id,
          },

          date: claim.createdAt,

          time: new Date(claim.createdAt).toLocaleTimeString(),

          outcome:
            claim.status
              ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1)
              : "Approved",

          resolutionDays: 1,
          resolutionHours: 1,
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

  const categories = ["All", ...new Set(TEMP_RESOLVED.map(c => c.category))];
  const locations  = ["All", ...new Set(TEMP_RESOLVED.map(c => c.location))];

  const filtered = resolved
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) ||
                 c.reporter.name.toLowerCase().includes(search.toLowerCase()) ||
                 c.reporter.id.includes(search))
    .filter(c => statusFilter   === "All" || c.outcome  === statusFilter)
    .filter(c => categoryFilter === "All" || c.category === categoryFilter)
    .filter(c => locationFilter === "All" || c.location === locationFilter)
    .sort((a, b) => sortBy === "newest" ? b.id - a.id : a.id - b.id);

  // ── Sidebar (same 5 icons) ──
  const Sidebar = () => (
    <aside className="dash-sidebar">
      <div className="sidebar-logo">
        <img src={logoIcon} alt="CampusFind" className="sidebar-logo-img" />
      </div>
      <div className="sidebar-divider" />
      <nav className="sidebar-nav">
        <button className="sidebar-btn" onClick={() => navigate("/dashboard")} title="Dashboard">
          <HiHome size={22} color="#aaa" />
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/lost-items")} title="Lost Items">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/found-items")} title="Found Items">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12,2 15.5,4.5 15.5,9.5 12,12 8.5,9.5 8.5,4.5"/>
            <polygon points="6,12 9.5,14.5 9.5,19.5 6,22 2.5,19.5 2.5,14.5"/>
            <polygon points="18,12 21.5,14.5 21.5,19.5 18,22 14.5,19.5 14.5,14.5"/>
          </svg>
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/claims")} title="Claims">
          <span className="icon-stack">
            <BsBoxSeam size={20} color="#F59E0B" />
            <HiMiniMagnifyingGlass size={10} color="#F59E0B" className="icon-overlay" />
          </span>
        </button>
        <button className="sidebar-btn sidebar-btn--active" title="Claims Resolved">
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
  );

  return (
    <div className="dash-layout">
      <Sidebar />

      <main className="dash-main">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="claims-title">Claims Resolved</h1>
            <p className="dash-subtitle">Review all completed claim requests and their final outcomes.</p>
          </div>
          <button className="dash-bell" title="Notifications">
            <FiBell size={22} color="#555" />
          </button>
        </div>

        {/* Search + Filters */}
        <div className="resolved-toolbar">
          <div className="claims-search-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by item name, location, or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select className="filter-btn" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">Resolution Status</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select className="filter-btn" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="All">Category</option>
            {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
          </select>

          <select className="filter-btn" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            <option value="All">Location</option>
            {locations.filter(l => l !== "All").map(l => <option key={l}>{l}</option>)}
          </select>

          <select className="filter-btn filter-btn--active" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Sort By: Newest</option>
            <option value="oldest">Sort By: Oldest</option>
          </select>

          <span className="claims-count">{filtered.length} resolved claims</span>
        </div>

        {/* Table */}
        <div className="resolved-table-wrap">
          <table className="resolved-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Reported By</th>
                <th>Resolution Date</th>
                <th>Outcome</th>
                <th>Resolution Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="resolved-empty">No resolved claims found.</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="resolved-row">

                  {/* Item */}
                  <td>
                    <div className="resolved-item-cell">
                      <img src={item.img} alt={item.name} className="resolved-item-img" />
                      <div>
                        <p className="resolved-item-name">{item.name}</p>
                        <p className="resolved-item-meta">
                          <CategoryIcon /> {item.category}
                        </p>
                        <p className="resolved-item-meta">
                          <LocationIcon /> {item.location}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Reporter */}
                  <td>
                    <div className="resolved-person-cell">
                      <Avatar name={item.reporter.name} size={40} />
                      <div>
                        <p className="person-name">{item.reporter.name}</p>
                        <p className="person-id">ID: {item.reporter.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td>
                    <p className="resolved-date"><CalendarIcon /> {item.date}</p>
                    <p className="resolved-time"><ClockIcon /> {item.time}</p>
                  </td>

                  {/* Outcome */}
                  <td>
                    <span className={`resolved-badge ${item.outcome === "Approved" ? "resolved-badge--approved" : "resolved-badge--rejected"}`}>
                      <span className="badge-dot" /> {item.outcome}
                    </span>
                  </td>

                  {/* Resolution Time */}
                  <td>
                    <p className="res-time">{item.resolutionDays} {item.resolutionDays === 1 ? "Day" : "Days"}</p>
                    <p className="res-time">{item.resolutionHours} {item.resolutionHours === 1 ? "Hour" : "Hours"}</p>
                  </td>

                  {/* Actions */}
                  <td>
                    {item.outcome === "Approved" ? (
                      <button className="contact-btn" onClick={() => setSelectedItem(item)}>
                        <FiPhone size={14} /> Contact
                      </button>
                    ) : (
                      <button className="view-details-btn" onClick={() => navigate(`/claims/resolved/${item.id}`)}>
                        👁 View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── CONTACT POPUP MODAL ── */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>

            {/* Success icon */}
            <div className="modal-success-icon">
              <div className="modal-confetti">🎉</div>
              <div className="modal-check">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>

            <h2 className="modal-title">Congratulations!</h2>
            <p className="modal-subtitle">You can now contact with the finder of your item.</p>

            {/* Reporter Info */}
            <div className="modal-person-card">
              <Avatar name={selectedItem.reporter.name} size={52} />
              <div className="modal-person-info">
                <h4>{selectedItem.reporter.name}</h4>
                <p>CSE Student, IIUC</p>
              </div>
              <div className="modal-contact-info">
                <p><FiPhone size={13} /> +880 1765-432109</p>
                <p>✉ {selectedItem.reporter.name.toLowerCase().replace(" ", ".")}@iiuc.ac.bd</p>
                <p>📍 {selectedItem.location}</p>
              </div>
            </div>

            {/* Item Info */}
            <div className="modal-item-card">
              <img src={selectedItem.img} alt={selectedItem.name} className="modal-item-img" />
              <div className="modal-item-info">
                <h4>{selectedItem.name}</h4>
                <p><CategoryIcon /> {selectedItem.category}</p>
                <p><LocationIcon /> {selectedItem.location}</p>
              </div>
              <div className="modal-item-dates">
                <p><CalendarIcon /> Claim Resolved On &nbsp; <strong>{selectedItem.date}</strong></p>
                <p><ClockIcon /> Resolved In &nbsp; <strong>{selectedItem.resolutionDays} Day {selectedItem.resolutionHours} Hours</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LocationIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}