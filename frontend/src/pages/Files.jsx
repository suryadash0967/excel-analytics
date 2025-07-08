import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Files() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchUploads();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading your uploads...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Uploaded Excel Files</h2>
      {uploads.length === 0 ? (
        <p>You haven't uploaded any files yet.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
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
                  <button onClick={() => navigate(`/files/${file._id}`)}>View Stats</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Files;
