import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Chart2D from "../components/Chart2D";
import Chart3D from "../components/Chart3D";
import Loader from "../components/Loader";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalFiles: "...",
    totalCharts: "...",
    totalRows: "...",
    recentFiles: [],
  });
  const [loading, setLoading] = useState(true);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);

    // Get token from URL (if present)
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");

    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);
      window.history.replaceState({}, "", "/dashboard");
    }

    const token = tokenFromURL || localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);

      fetchDashboardData(token);
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/uploads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const uploads = await res.json();

      const recent = uploads.slice(0, 5);

      // Fetch parsed data for each recent file
      const recentFilesWithData = await Promise.all(
        recent.map(async (file) => {
          try {
            const statsRes = await fetch(`http://localhost:5000/api/uploads/stats/${file._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const statsData = await statsRes.json();
            return {
              ...file,
              parsedData: statsData.parsedData || [],
            };
          } catch (err) {
            console.error("Failed to fetch file stats:", file._id, err);
            return file;
          }
        })
      );

      let totalCharts = recentFilesWithData.filter((f) => f.chartPreferences?.chartType).length;
      let totalRows = recentFilesWithData.reduce((sum, f) => sum + (f.parsedData?.length || 0), 0);

      setStats({
        totalFiles: uploads.length,
        totalCharts,
        totalRows,
        recentFiles: recentFilesWithData,
      });
    } catch (err) {
      setStats({
        totalFiles: 0,
        totalCharts: 0,
        totalRows: 0,
        recentFiles: [],
      });
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFileCardClick = (fileId) => {
    navigate(`/files/${fileId}`);
  };

  const handleViewAllFiles = () => {
    navigate("/files");
  };

  return (
    <div className={`dashboard-container${animate ? " fade-in" : ""}`}>
      <header className="dashboard-header">
        <h1>
          <span role="img" aria-label="logo">
            📊
          </span>{" "}
          Excel Analytics Dashboard
        </h1>
        {/* <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button> */}
      </header>

      {user && (
        <section className="user-info card">
          <div>
            <h2>{user.name.toUpperCase()}</h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role === "user" ? "User" : "Admin"}
            </p>
          </div>
        </section>
      )}

      <section className="stats-grid">
        <div className="stat-card card slide-in">
          <h3>Total Files</h3>
          <p className="stat-value">{stats.totalFiles}</p>
        </div>
        <div className="stat-card card slide-in">
          <h3>Total Charts</h3>
          <p className="stat-value">{stats.totalCharts}</p>
        </div>
        <div className="stat-card card slide-in">
          <h3>Total Rows</h3>
          <p className="stat-value">{stats.totalRows}</p>
        </div>
      </section>

      <section className="recent-files">
        <div className="recent-files-header">
          <h2>Recent Files</h2>
          <button
            className="view-all-files-btn"
            onClick={handleViewAllFiles}
            aria-label="View all uploaded files"
          >
            View All Files
          </button>
        </div>
        <div className="file-grid">
          {loading ? (
            <Loader />
          ) : stats.recentFiles.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            stats.recentFiles.map((file) => (
              <div
                className="file-card card fade-in"
                key={file._id}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${file.originalName}`}
                onClick={() => handleFileCardClick(file._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleFileCardClick(file._id);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="file-meta">
                  <h4>{file.originalName}</h4>
                  <p>
                    <span role="img" aria-label="calendar">
                      📅
                    </span>{" "}
                    {new Date(file.uploadDate).toLocaleString()}
                  </p>
                </div>
                <div className="chart-preview">
                  {file.chartPreferences?.chartType &&
                    file.chartPreferences?.xAxis &&
                    file.chartPreferences?.yAxis &&
                    file.parsedData ? (
                    file.chartPreferences.chartType.startsWith("3d") ? (
                      <Chart3D
                        data={file.parsedData}
                        xAxis={file.chartPreferences.xAxis}
                        yAxis={file.chartPreferences.yAxis}
                        type={file.chartPreferences.chartType}
                      />
                    ) : (
                      <Chart2D
                        data={file.parsedData}
                        xAxis={file.chartPreferences.xAxis}
                        yAxis={file.chartPreferences.yAxis}
                        type={file.chartPreferences.chartType}
                      />
                    )
                  ) : (
                    <div className="no-chart">No chart preferences</div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
