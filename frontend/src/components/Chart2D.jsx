import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

function Chart2D({ data, xAxis, yAxis, type }) {
    const chartRef = useRef();

    const xValues = data.map((row) => row[xAxis]);
    const yValues = data.map((row) => Number(row[yAxis]));

    const chartData = {
        labels: xValues,
        datasets: [
            {
                label: `${yAxis} vs ${xAxis}`,
                data: yValues,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: `${type.toUpperCase()} Chart` },
        },
    };

    // Pie chart needs a different dataset format
    if (type === "pie") {
        chartData.datasets[0].backgroundColor = [
            "#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ];
        chartData.datasets[0].borderWidth = 0;
    }

    const downloadAsImage = async () => {
        const canvas = await html2canvas(chartRef.current);
        const link = document.createElement("a");
        link.download = `${type}-chart.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    const downloadAsPDF = async () => {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
        pdf.save(`${type}-chart.pdf`);
    };

    return (
        <div style={{ textAlign: "center" }}>
            <div ref={chartRef} style={{ width: "700px", margin: "auto" }}>
                {type === "bar" && <Bar data={chartData} options={options} />}
                {type === "line" && <Line data={chartData} options={options} />}
                {type === "pie" && <Pie data={chartData} options={options} />}
            </div>

            <div style={{ marginTop: "1rem" }}>
                <button onClick={downloadAsImage}>📸 Download PNG</button>
                <button onClick={downloadAsPDF} style={{ marginLeft: "1rem" }}>
                    🧾 Download PDF
                </button>
            </div>
        </div>
    );
}

export default Chart2D;
