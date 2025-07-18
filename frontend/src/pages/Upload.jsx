import { useState } from "react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

function Upload({ onClose }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selected.type === "application/vnd.ms-excel")
    ) {
      setFile(selected);
      setStatus("");
    } else {
      setFile(null);
      setStatus("❌ Only .xls or .xlsx files are allowed.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("❌ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    try {
      setLoading(true);
      setStatus("");

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/uploads`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStatus("✅ File uploaded successfully!");
      console.log("Upload response:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("❌ Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-popup-overlay">
      <div className="upload-popup">
        <div className="upload-popup-header">
          <h2>📤 Upload Excel File (Only .xls or .xlsx files allowed)</h2>
          <div className="close-btn" onClick={onClose}><RxCross2 /></div>
        </div>

        <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="custom-file-input" />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        <p className={`upload-status ${status.startsWith("❌") ? "error" : "success"}`}>{status}</p>
      </div>
    </div>
  );
}

export default Upload;
