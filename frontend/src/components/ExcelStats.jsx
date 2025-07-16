import { useEffect, useState } from "react";
import axios from "axios";
import Chart2D from "./Chart2D";
import Chart3D from "./Chart3D";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./Loader";

function ExcelStats() {
    const [fileData, setFileData] = useState(null);
    const [xAxis, setXAxis] = useState("");
    const [yAxis, setYAxis] = useState("");
    const [chartType, setChartType] = useState("bar");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFileData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/uploads/stats/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setFileData(res.data);
                setXAxis(res.data.chartPreferences?.xAxis || "");
                setYAxis(res.data.chartPreferences?.yAxis || "");
                setChartType(res.data.chartPreferences?.chartType || "bar");
            } catch (err) {
                console.error("Failed to fetch file stats", err);
            }
        };

        fetchFileData();
    }, [id]);

    const savePreferences = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/uploads/${id}/preferences`, {
                xAxis,
                yAxis,
                chartType,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert("Preferences saved!");
        } catch (err) {
            console.error("Failed to save preferences", err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/uploads/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert("File deleted!");
            navigate("/files");
        } catch (err) {
            alert("Failed to delete file.");
        }
    };

    if (!fileData) return <Loader />;

    const { originalName, uploadDate, parsedData: data } = fileData;
    const columnNames = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="excelstats-bg">
            <div className="excelstats-card">
                <h2>
                    📊 Stats for: <span className="excelstats-filename">{originalName}</span>
                </h2>
                <p className="excelstats-info">
                    🕒 Uploaded: <span>{new Date(uploadDate).toLocaleString()}</span>
                </p>

                <div className="mb-8">
                    <h3>Select Columns &amp; Chart Type</h3>
                    <div className="excelstats-dropdowns">
                        <select
                            onChange={(e) => setXAxis(e.target.value)}
                            value={xAxis}
                        >
                            <option value="">Select X-axis</option>
                            {columnNames.map((col) => (
                                <option key={col} value={col}>{col}</option>
                            ))}
                        </select>

                        <select
                            onChange={(e) => setYAxis(e.target.value)}
                            value={yAxis}
                        >
                            <option value="">Select Y-axis</option>
                            {columnNames.map((col) => (
                                <option key={col} value={col}>{col}</option>
                            ))}
                        </select>

                        <select
                            onChange={(e) => setChartType(e.target.value)}
                            value={chartType}
                        >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                            <option value="3d-bar">3D Bar Chart</option>
                            <option value="3d-scatter">3D Scatter Plot</option>
                        </select>
                    </div>
                    <button
                        onClick={savePreferences}
                        className="excelstats-save-btn"
                    >
                        💾 Save Chart Preferences
                    </button>
                </div>

                <button
                    className="delete-btn excelstats-save-btn"
                    onClick={handleDelete}
                    style={{ marginBottom: "1rem" }}
                >
                    Delete File
                </button>

                <div className="excelstats-chart-section">
                    <h4>Chart Preview</h4>
                    <div className="excelstats-chart-area">
                        {xAxis && yAxis && !chartType.startsWith("3d") && (
                            <Chart2D data={data} xAxis={xAxis} yAxis={yAxis} type={chartType} />
                        )}
                        {xAxis && yAxis && chartType.startsWith("3d") && (
                            <Chart3D data={data} xAxis={xAxis} yAxis={yAxis} type={chartType} />
                        )}
                        {(!xAxis || !yAxis) && (
                            <span className="excelstats-chart-placeholder">Select X and Y axes to preview chart.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExcelStats;