import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
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
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    try {
      setLoading(true);
      setStatus("");

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
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
    <div className="upload-container">
      <div className="upload-box">
        <h2>📤 Upload Excel File</h2>
        <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        <p
          className={`upload-status ${
            status.startsWith("❌") ? "error" : status ? "success" : ""
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}

export default Upload;
