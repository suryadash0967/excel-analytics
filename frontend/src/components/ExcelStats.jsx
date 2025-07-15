import { useEffect, useState } from "react";
import axios from "axios";
import Chart2D from "./Chart2D";
import Chart3D from "./Chart3D";
import { useParams } from "react-router-dom";


function ExcelStats() {
    const [fileData, setFileData] = useState(null);
    const [xAxis, setXAxis] = useState("");
    const [yAxis, setYAxis] = useState("");
    const [chartType, setChartType] = useState("bar");
    const { id } = useParams();


    useEffect(() => {
        const fetchFileData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/uploads/stats/${id}`, {
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
            await axios.patch(`http://localhost:5000/api/uploads/${id}/preferences`, {
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


    if (!fileData) return <p>Loading...</p>;

    const { originalName, uploadDate, preview, data } = fileData;

    const columnNames = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📊 Stats for: {originalName}</h2>
            <p>🕒 Uploaded: {new Date(uploadDate).toLocaleString()}</p>

            <h3>🎛️ Select Columns & Chart Type</h3>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <select onChange={(e) => setXAxis(e.target.value)} value={xAxis}>
                    <option value="">Select X-axis</option>
                    {columnNames.map((col) => (
                        <option key={col} value={col}>{col}</option>
                    ))}
                </select>

                <select onChange={(e) => setYAxis(e.target.value)} value={yAxis}>
                    <option value="">Select Y-axis</option>
                    {columnNames.map((col) => (
                        <option key={col} value={col}>{col}</option>
                    ))}
                </select>

                <select onChange={(e) => setChartType(e.target.value)} value={chartType}>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="3d-bar">3D Bar Chart</option>
                    <option value="3d-scatter">3D Scatter Plot</option>
                </select>
                <button onClick={savePreferences}>💾 Save Chart Preferences</button>

            </div>

            {xAxis && yAxis && chartType.startsWith("3d") === false && (
                <Chart2D data={data} xAxis={xAxis} yAxis={yAxis} type={chartType} />
            )}

            {xAxis && yAxis && chartType.startsWith("3d") && (
                <Chart3D data={data} xAxis={xAxis} yAxis={yAxis} type={chartType} />
            )}


            {/* 3D chart rendering will go here later */}
        </div>
    );
}

export default ExcelStats;
