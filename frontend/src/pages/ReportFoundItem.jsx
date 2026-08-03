import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Tag, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import StepperHeader from "../components/StepperHeader";
import PhotoUploadStep from "../components/PhotoUploadStep";
import "./ReportFoundItem.css";

const STEPS = [
  { title: "Basic Information", subtitle: "Where & when you found it" },
  { title: "Item Details", subtitle: "Describe the item" },
  { title: "Photos", subtitle: "Add up to 4 images" },
];

const CURRENTLY_WITH_OPTIONS = [
  "With me",
  "Department Office",
  "Security Office",
  "Admin Office",
];

function ReportFoundItem() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dateFound: "",
    locationId: "",
    currentlyWith: "With me",
    categoryId: "",
    itemName: "",
    description: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setError("Could not load categories"));

    fetch("http://localhost:5000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data.locations || []))
      .catch(() => setError("Could not load locations"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const goNext = () => {
    if (currentStep === 1 && (!formData.dateLost || !formData.locationId)) {
        setError("Please fill in all required fields.");
        return;
    }
    if (currentStep === 2 && (!formData.categoryId || !formData.itemName || !formData.description)) {
        setError("Please fill in all required fields.");
        return;
    }
    setError("");
    setCurrentStep((s) => Math.min(s + 1, 3));
  };
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("itemName", formData.itemName);
      data.append("description", formData.description);
      data.append("dateFound", formData.dateFound);
      data.append("categoryId", formData.categoryId);
      data.append("locationId", formData.locationId);
      data.append("currentlyWith", formData.currentlyWith);
      photos.forEach((file) => data.append("images", file));

      const response = await fetch(
        "http://localhost:5000/api/items/found/report",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Something went wrong");
        setLoading(false);
        return;
      }

      navigate("/found-items");
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cf-report-page">
      <Navbar isLoggedIn={true} />

      <div className="cf-report-header">
        <div>
          <h1>Report Found Item</h1>
          <p>Help the owner get their item back by providing accurate details.</p>
        </div>
        <button className="cf-back-btn" onClick={() => navigate("/home")}>
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <StepperHeader steps={STEPS} currentStep={currentStep} />

      <div className="cf-report-body">
        <div className="cf-report-form">
          {error && <p className="cf-form-error">{error}</p>}

          {currentStep === 1 && (
            <div className="cf-form-section">
              <h3>1. Where & When Did You Find It?</h3>
              <div className="cf-form-row">
                <div className="cf-form-group">
                  <label>Date Found *</label>
                  <input
                    type="date"
                    name="dateFound"
                    value={formData.dateFound}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="cf-form-group">
                  <label>Location Found *</label>
                  <select
                    name="locationId"
                    value={formData.locationId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.locationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cf-form-group">
                <label>Currently With *</label>
                <div className="cf-radio-group">
                  {CURRENTLY_WITH_OPTIONS.map((option) => (
                    <label className="cf-radio-option" key={option}>
                      <input
                        type="radio"
                        name="currentlyWith"
                        value={option}
                        checked={formData.currentlyWith === option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="cf-form-section">
              <h3>2. Describe the Item</h3>
              <div className="cf-form-row">
                <div className="cf-form-group">
                  <label>Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="cf-form-group">
                  <label>Item Name / Type *</label>
                  <input
                    type="text"
                    name="itemName"
                    placeholder="e.g., Wallet, Water Bottle, Headphones"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="cf-form-group">
                <label>Additional Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe the item in detail."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={300}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="cf-form-section">
              <h3>3. Add Photos</h3>
              <PhotoUploadStep files={photos} onFilesChange={setPhotos} />
            </div>
          )}

          <div className="cf-form-actions">
            {currentStep > 1 && (
              <button className="cf-btn-outline" onClick={goBack}>
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button className="cf-btn-solid" onClick={goNext}>
                Next
              </button>
            ) : (
              <button
                className="cf-btn-solid"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            )}
          </div>
        </div>

        <aside className="cf-report-sidebar">
          <h4>Live Preview</h4>
          <div className="cf-preview-row">
            <Tag size={16} />
            <div>
              <span className="cf-preview-label">Item Name</span>
              <p>{formData.itemName || "Not provided"}</p>
            </div>
          </div>
          <div className="cf-preview-row">
            <Calendar size={16} />
            <div>
              <span className="cf-preview-label">Date Found</span>
              <p>{formData.dateFound || "Not provided"}</p>
            </div>
          </div>
          <div className="cf-preview-row">
            <MapPin size={16} />
            <div>
              <span className="cf-preview-label">Location</span>
              <p>
                {locations.find((l) => l.id === Number(formData.locationId))
                  ?.locationName || "Not provided"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ReportFoundItem;