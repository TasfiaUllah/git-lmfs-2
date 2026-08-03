import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import "./ClaimsResolved.css";
import logoIcon from "../assets/logo-icon.png";

const TEMP_CLAIMS = [
  {
    id: 1,
    item: { name: "Water Bottle", category: "Sports & Fitness", location: "Library, 2nd Floor", img: null },
    claimant: { name: "Rahim Ahmed",  id: "22101015" },
    finder:   { name: "Samia Islam",  id: "22101987" },
    date: "May 27, 2025", time: "11:20 AM",
    outcome: "Approved",
    resolutionTime: "1 Day 3 Hours",
  },
  {
    id: 2,
    item: { name: "Wallet", category: "Accessories", location: "Cafeteria", img: null },
    claimant: { name: "Nusrat Jahan",  id: "22104567" },
    finder:   { name: "Fahim Rahman",  id: "22103211" },
    date: "May 26, 2025", time: "4:30 PM",
    outcome: "Approved",
    resolutionTime: "2 Days 1 Hour",
  },
  {
    id: 3,
    item: { name: "Keys", category: "Others", location: "Main Gate 2", img: null },
    claimant: { name: "Fahim Rahman",  id: "22103211" },
    finder:   { name: "Mehedi Hasan",  id: "22100876" },
    date: "May 25, 2025", time: "8:15 AM",
    outcome: "Rejected",
    resolutionTime: "3 Days 2 Hours",
  },
  {
    id: 4,
    item: { name: "Pencil Pouch", category: "Stationery", location: "Building 5, FAZ", img: null },
    claimant: { name: "Samia Islam",   id: "22101987" },
    finder:   { name: "Nusrat Jahan",  id: "22104567" },
    date: "May 24, 2025", time: "10:45 AM",
    outcome: "Approved",
    resolutionTime: "1 Day 5 Hours",
  },
  {
    id: 5,
    item: { name: "Wallet", category: "Accessories", location: "Cafeteria", img: null },
    claimant: { name: "Mehedi Hasan",  id: "22100876" },
    finder:   { name: "Rahim Ahmed",   id: "22101015" },
    date: "May 23, 2025", time: "3:10 PM",
    outcome: "Approved",
    resolutionTime: "2 Days 4 Hours",
  },
];

// নামের initials বের করার function
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// initials এর background color
function getAvatarColor(name) {
  const colors = ["#4B2FA0", "#7c5cbf", "#14B8A6", "#F59E0B", "#e53e3e", "#3b82f6"];
  let sum = 0;
  for (let c of name) sum += c.charCodeAt(0);
  return colors[sum % colors.length];
}

function Avatar({ name }) {
  return (
    <div className="cr-avatar" style={{ background: getAvatarColor(name) }}>
      {getInitials(name)}
    </div>
  );
}

function OutcomeBadge({ outcome }) {
  return (
    <span className={`cr-badge cr-badge--${outcome.toLowerCase()}`}>
      {outcome === "Approved" ? "✓" : "✗"} {outcome}
    </span>
  );
}

export default function ClaimsResolved() {
  const navigate  = useNavigate();
  const [search,  setSearch]  = useState("");
  const [outcome, setOutcome] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const filtered = TEMP_CLAIMS.filter(c => {
    const matchSearch  = c.item.name.toLowerCase().includes(search.toLowerCase()) ||
                         c.claimant.name.toLowerCase().includes(search.toLowerCase()) ||
                         c.finder.name.toLowerCase().includes(search.toLowerCase());
    const matchOutcome = outcome ? c.outcome === outcome : true;
    return matchSearch && matchOutcome;
  });

  return (
    <div className="cr-layout">

      {/* ── SIDEBAR ── */}
      <aside className="dash-sidebar">
        <div className="sidebar-logo">
          <img src={logoIcon} alt="CampusFind" className="sidebar-logo-img" />
        </div>
        <div className="sidebar-divider" />
        <nav className="sidebar-nav">
          <button className="sidebar-btn" onClick={() => navigate("/dashboard")} title="Dashboard">
            <HiHome size={22} color="#888" />
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/claims")} title="Claims">
            <span className="icon-stack">
              <BsBoxSeam size={20} color="#F59E0B" />
              <HiMiniMagnifyingGlass size={10} color="#F59E0B" className="icon-overlay" />
            </span>
          </button>
          {/* Claims Resolved — active */}
          <button className="sidebar-btn sidebar-btn--active" onClick={() => navigate("/claims-resolved")} title="Claims Resolved">
            <span className="icon-stack">
              <BsBoxSeam size={20} color="#4B2FA0" />
              <span className="icon-check" style={{color:"#4B2FA0"}}>✓</span>
            </span>
          </button>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          <FiLogOut size={20} color="#e53e3e" />
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="cr-main">

        {/* HEADER */}
        <div className="cr-header">
          <div>
            <h1 className="cr-title">Claims Resolved</h1>
            <p className="cr-subtitle">Review all completed claim requests and their final outcomes.</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="cr-filters">
          <div className="cr-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by item name, claimant, or finder..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="cr-select" value={outcome} onChange={e => setOutcome(e.target.value)}>
            <option value="">Resolution Status</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <span className="cr-count">{filtered.length} resolved claims</span>
        </div>

        {/* TABLE */}
        <div className="cr-table-wrap">
          <table className="cr-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Claimant</th>
                <th>Finder</th>
                <th>Resolution Date</th>
                <th>Outcome</th>
                <th>Resolution Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="cr-empty">No resolved claims found.</td></tr>
              ) : filtered.map(claim => (
                <tr key={claim.id} className="cr-row">
                  <td>
                    <div className="cr-item-cell">
                      <div className="cr-item-img-wrap">
                        <Avatar name={claim.item.name[0] + "I"} />
                      </div>
                      <div>
                        <p className="cr-item-name">{claim.item.name}</p>
                        <p className="cr-item-cat">
                          <CategoryIcon /> {claim.item.category}
                        </p>
                        <p className="cr-item-loc">
                          <LocationIcon /> {claim.item.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cr-person-cell">
                      <Avatar name={claim.claimant.name} />
                      <div>
                        <p className="cr-person-name">{claim.claimant.name}</p>
                        <p className="cr-person-id">ID: {claim.claimant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cr-person-cell">
                      <Avatar name={claim.finder.name} />
                      <div>
                        <p className="cr-person-name">{claim.finder.name}</p>
                        <p className="cr-person-id">ID: {claim.finder.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="cr-date"><CalendarIcon /> {claim.date}</p>
                    <p className="cr-time"><ClockIcon /> {claim.time}</p>
                  </td>
                  <td><OutcomeBadge outcome={claim.outcome} /></td>
                  <td className="cr-res-time">{claim.resolutionTime}</td>
                  <td>
                    <button className="cr-view-btn">
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

function CategoryIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}