import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Upload from "./Upload";

function Files() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/uploads", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUploads(res.data);
    } catch (err) {
      console.error("Failed to fetch uploads", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClose = () => {
    setShowUploadPopup(false);
    fetchUploads(); // Refresh list after modal closes
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading your uploads...</p>;

  return (
    <div className="files-page">
      <div className="files-header">
        <h2>Your Uploaded Excel Files</h2>
        <button className="upload-trigger" onClick={() => setShowUploadPopup(true)}>+ Upload File</button>
      </div>

      {showUploadPopup && (
        <div className="custom-popup-overlay">
          <div className="custom-popup">
            <Upload onClose={handleUploadClose} />
          </div>
        </div>
      )}


      {uploads.length === 0 ? (
        <p className="no-uploads-msg">You haven't uploaded any files yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="uploads-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Uploaded On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((file) => (
                <tr key={file._id}>
                  <td>{file.originalName}</td>
                  <td>{new Date(file.uploadDate).toLocaleString()}</td>
                  <td>
                    <button className="view-btn" onClick={() => navigate(`/files/${file._id}`)}>View Stats</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>


  );
}

export default Files;
