import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./LostItems.css";

import logo      from "../assets/logo-full.png";
import lostImg1  from "../assets/lost-item-1.jpg";
import lostImg2  from "../assets/lost-item-2.jpg";
import lostImg3  from "../assets/lost-item-3.jpg";
import lostImg4  from "../assets/lost-item-4.jpg";
import foundImg1 from "../assets/found-item-1.jpg";
import foundImg2 from "../assets/found-item-2.jpg";
import foundImg3 from "../assets/found-item-3.jpg";
import foundImg4 from "../assets/found-item-4.jpg";
import airpods   from "../assets/AirPods.webp";
import calc      from "../assets/calculator.jpg";
import charger   from "../assets/charger.avif";
import flask     from "../assets/flask.avif";
import headphone from "../assets/headphone.avif";

const allItems = [
  { id: 1,  img: lostImg1,  name: "Poncho",        location: "Building 3, FA1",  time: "1 hour ago",   category: "Clothing",     status: "Lost"  },
  { id: 2,  img: lostImg2,  name: "Helmet",         location: "Parking Area",     time: "3 hours ago",  category: "Accessories",  status: "Lost"  },
  { id: 3,  img: lostImg3,  name: "Pencil Bag",     location: "Library, Block B", time: "5 hours ago",  category: "Stationery",   status: "Lost"  },
  { id: 4,  img: lostImg4,  name: "Scissors",       location: "Cafeteria",        time: "2 days ago",   category: "Stationery",   status: "Lost"  },
  { id: 5,  img: foundImg1, name: "Wallet",         location: "Building 2, FA3",  time: "30 mins ago",  category: "Accessories",  status: "Found" },
  { id: 6,  img: foundImg2, name: "Bracelet",       location: "Building 7, FA4",  time: "2 hours ago",  category: "Accessories",  status: "Found" },
  { id: 7,  img: foundImg3, name: "Water Bottle",   location: "Building 5, FA2",  time: "4 hours ago",  category: "Others",       status: "Found" },
  { id: 8,  img: foundImg4, name: "Leather Jacket", location: "Building 1, FA1",  time: "1 day ago",    category: "Clothing",     status: "Found" },
  { id: 9,  img: airpods,   name: "AirPods",        location: "Block C, Room 12", time: "2 hours ago",  category: "Electronics",  status: "Lost"  },
  { id: 10, img: calc,      name: "Calculator",     location: "Building 4, FA2",  time: "6 hours ago",  category: "Electronics",  status: "Lost"  },
  { id: 11, img: charger,   name: "Charger",        location: "Library, Block A", time: "1 day ago",    category: "Electronics",  status: "Lost"  },
  { id: 12, img: flask,     name: "Flask",          location: "Cafeteria",        time: "3 hours ago",  category: "Others",       status: "Lost"  },
  { id: 13, img: headphone, name: "Headphone",      location: "Building 6, FA1",  time: "5 hours ago",  category: "Electronics",  status: "Lost"  },
];
function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function LostItems() {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date,     setDate]     = useState("");
  const [status,   setStatus]   = useState("");

  const filtered = allItems.filter((item) => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? item.category === category : true;
    const matchStatus   = status   ? item.status   === status   : true;
    const matchLocation = location ? item.location.includes(location) : true;
    return matchSearch && matchCategory && matchStatus && matchLocation;
  });

  const handleReset = () => {
    setSearch(""); setCategory(""); setLocation(""); setDate(""); setStatus("");
  };

  return (
    <div className="li-page">

      {/* ── TOP NAVBAR ── */}
      <nav className="li-navbar">
        <img src={logo} alt="CampusFind" className="li-nav-logo" />
        <div className="li-nav-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search for object..." />
        </div>
        <div className="li-nav-icons">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <div className="li-nav-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="li-header">
        <h1>Lost Items</h1>
        <p>Browse all reported lost items on campus</p>
      </div>

      {/* ── SEARCH + FILTER ROW ── */}
      <div className="li-searchrow">
        <div className="li-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search for object..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="li-filter-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M8 12h8M11 18h2"/>
          </svg>
          Filter
        </button>
      </div>

      {/* ── BODY ── */}
      <div className="li-body">

        {/* SIDEBAR */}
        <aside className="li-sidebar">
          <div className="li-filter-group">
            <label>Category</label>
            <div className="li-select-wrap">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select an option</option>
                <option value="Stationery">Stationery</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <div className="li-filter-group">
            <label>Location</label>
            <div className="li-select-wrap">
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">Select an option</option>
                <option value="Building 1, FA1">Building 1, FA1</option>
                <option value="Building 2, FA3">Building 2, FA3</option>
                <option value="Building 3, FA1">Building 3, FA1</option>
                <option value="Building 4, FA2">Building 4, FA2</option>
                <option value="Building 5, FA2">Building 5, FA2</option>
                <option value="Building 7, FA4">Building 7, FA4</option>
                <option value="Parking Area">Parking Area</option>
                <option value="Library, Block B">Library, Block B</option>
                <option value="Cafeteria">Cafeteria</option>
              </select>
            </div>
          </div>
          <div className="li-filter-group">
            <label>Date</label>
            <div className="li-select-wrap li-date-wrap">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="li-filter-group">
            <label>Status</label>
            <div className="li-select-wrap">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select an option</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
          </div>
          <button className="li-reset-btn" onClick={handleReset}>Reset Filters</button>
        </aside>

        {/* GRID */}
        <main className="li-main">
          {filtered.length === 0 ? (
            <p className="li-empty">No items match your filters.</p>
          ) : (
            <div className="li-grid">
              {filtered.map((item) => (
                <div className="li-card" key={item.id}>
                  <div className="li-card-img">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="li-card-info">
                    <h4>{item.name}</h4>
                    <p><LocationIcon /> {item.location}</p>
                    <p><ClockIcon /> {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="li-footer">
        <div className="li-footer-left">
          <img src={logo} alt="CampusFind" className="li-footer-logo" />
        </div>
        <div className="li-footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={() => navigate("/lost-items")}>Lost Items</li>
            <li onClick={() => navigate("/found-items")}>Found Items</li>
            <li onClick={() => navigate("/about")}>About</li>
            <li onClick={() => navigate("/faq")}>FAQ</li>
          </ul>
        </div>
        <div className="li-footer-social">
          <h4>Follow us</h4>
          <div className="li-social-icons">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LostItems;