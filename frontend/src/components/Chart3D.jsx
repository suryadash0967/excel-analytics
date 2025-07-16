import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

function Box({ x, y, height, color }) {
  return (
    <mesh position={[x, height / 2, y]}>
      <boxGeometry args={[0.5, height, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Point({ x, y, z, color }) {
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

const Chart3D = ({ data, xAxis, yAxis, type }) => {
  const canvasRef = useRef();
  const location = useLocation();

  const xValues = data.map((row) => row[xAxis]);
  const yValues = data.map((row) => Number(row[yAxis]));

  const points = xValues.map((x, i) => ({
    label: x,
    x: i,
    y: yValues[i],
  }));

  const downloadAsImage = async () => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer) return;

    const canvas = await html2canvas(canvasContainer);
    const link = document.createElement("a");
    link.download = `${type}-3d-chart.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const downloadAsPDF = async () => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer) return;

    const canvas = await html2canvas(canvasContainer);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
    pdf.save(`${type}-3d-chart.pdf`);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={canvasRef} className="chart-box-wrapper">
        <Canvas>
          <PerspectiveCamera makeDefault position={[5, 10, 10]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          <OrbitControls />
          {type === "3d-bar" &&
            points.map((p, i) => (
              <Box key={i} x={p.x} y={0} height={p.y} color="skyblue" />
            ))}
          {type === "3d-scatter" &&
            points.map((p, i) => (
              <Point key={i} x={p.x} y={p.y} z={Math.random() * 3} color="orange" />
            ))}
        </Canvas>
      </div>

      {location.pathname !== "/dashboard" && (
  <div className="download-buttons">
    <button onClick={downloadAsImage} className="download-btn">Download PNG</button>
    <button onClick={downloadAsPDF} className="download-btn">Download PDF</button>
  </div>
)}
    </div>
  );
};

export default Chart3D;
