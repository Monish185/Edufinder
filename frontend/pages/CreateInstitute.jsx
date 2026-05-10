import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import API from "../services/api";

const categories = ["Engineering", "Medical", "Commerce", "Arts", "Science", "Law", "Management", "Coaching", "Programming","CUET","School Tuition","SSC","GATE","CAT","UPSC","JEE","NEET","JEE/NEET","Other"];

const InputField = ({ label, required, hint, children }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const CreateInstitute = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "", description: "", category: "", address: "", city: "", state: "", fees: "", rating: "", latitude: "", longitude: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); 

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(""); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB."); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { setError("Please upload an image."); return; }
    if (!formData.latitude || !formData.longitude) { setError("Please enter coordinates."); return; }
    setLoading(true); setError("");
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("image", image);
      await API.post("/institutes/create", data);
      setSuccess("Institute listed successfully! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create institute. Try again.");
    } finally { setLoading(false); }
  };

  const fieldClass = "w-full border border-gray-300 bg-gray-50 focus:bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition";

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">List an Institute</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new educational listing.</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${step >= s ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"}`}>{s}</div>
              <div className={`h-1 flex-1 rounded-full transition ${step > s ? "bg-indigo-600" : "bg-gray-200"}`} />
            </div>
          ))}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${step >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"}`}>✓</div>
        </div>
        <div className="flex gap-8 text-xs text-gray-400 mb-6 -mt-2">
          <span className={step >= 1 ? "text-indigo-600 font-semibold" : ""}>Basic Info</span>
          <span className={step >= 2 ? "text-indigo-600 font-semibold" : ""}>Location</span>
          <span className={step >= 3 ? "text-indigo-600 font-semibold" : ""}>Photo & Details</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-start gap-2" role="alert">
                <span className="flex-shrink-0">⚠️</span> {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                ✅ {success}
              </div>
            )}

            {/* Step 1 - Basic Info */}
            <div className="pb-5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-4">① Basic Information</h2>
              <div className="space-y-4">
                <InputField label="Institute Name" required>
                  <input type="text" name="name" placeholder="e.g. Aakash Institute Noida Sector 18" onChange={handleChange} required className={fieldClass} />
                </InputField>

                <InputField label="Description" hint="What subjects/courses are offered? What makes it unique?">
                  <textarea name="description" placeholder="Describe the institute, courses, achievements..." onChange={handleChange} rows={3} className={`${fieldClass} resize-none`} />
                </InputField>

                <InputField label="Category" required>
                  <select name="category" onChange={handleChange} required className={`${fieldClass} cursor-pointer`}>
                    <option value="">Select a category</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </InputField>
              </div>
            </div>

            {/* Step 2 - Location */}
            <div className="py-5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-4">② Location Details</h2>
              <div className="space-y-4">
                <InputField label="Full Address">
                  <input type="text" name="address" placeholder="e.g. Shop 45, Sector 18, Noida, UP 201301" onChange={handleChange} className={fieldClass} />
                </InputField>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="City" required>
                    <input type="text" name="city" placeholder="e.g. Noida" onChange={handleChange} required className={fieldClass} />
                  </InputField>
                  <InputField label="State">
                    <input type="text" name="state" placeholder="e.g. Uttar Pradesh" onChange={handleChange} className={fieldClass} />
                  </InputField>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-3 flex items-center gap-1">
                    💡 How to find coordinates: Open{" "}
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="underline">Google Maps</a>
                    → right click on location → copy "What's here?" coordinates
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Latitude" required hint="e.g. 28.5355">
                      <input type="number" name="latitude" placeholder="28.5355" step="any" onChange={handleChange} required className={fieldClass} />
                    </InputField>
                    <InputField label="Longitude" required hint="e.g. 77.3910">
                      <input type="number" name="longitude" placeholder="77.3910" step="any" onChange={handleChange} required className={fieldClass} />
                    </InputField>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Details & Image */}
            <div className="pt-5 space-y-4">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-4">③ Fees, Rating & Photo</h2>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Annual Fees (₹)" hint="Leave blank if unknown">
                  <input type="number" name="fees" placeholder="e.g. 50000" min="0" onChange={handleChange} className={fieldClass} />
                </InputField>
                <InputField label="Rating (0–5)" hint="Current aggregate rating">
                  <input type="number" name="rating" placeholder="e.g. 4.5" min="0" max="5" step="0.1" onChange={handleChange} className={fieldClass} />
                </InputField>
              </div>

              {/* Image upload */}
              <InputField label="Institute Photo" required hint="JPG or PNG, max 5MB. High-quality exterior or classroom photo recommended.">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-6 text-center cursor-pointer transition bg-gray-50 hover:bg-indigo-50"
                >
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="h-40 w-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <span className="text-white text-sm font-semibold">Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl block mb-2">📷</span>
                      <p className="text-sm text-gray-600 font-medium">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </InputField>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-indigo-200 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Publishing listing...
                  </span>
                ) : "🏫 Publish Institute Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInstitute;
