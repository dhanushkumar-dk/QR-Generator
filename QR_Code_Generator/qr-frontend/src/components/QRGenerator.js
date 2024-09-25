import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import './QRGenerator.css';

const QRGenerator = () => {
  const [text, setText] = useState("");
  const canvasRef = useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (text) {
      // Generate QR Code on the canvas whenever the text changes
      QRCode.toCanvas(canvasRef.current, text, { errorCorrectionLevel: 'H' }, function (error) {
        if (error) console.error(error);
      });
    }
  }, [text]);

  const downloadQRAsBinary = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      const binaryData = atob(dataURL.split(",")[1]);

      const byteNumbers = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteNumbers[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: "image/png" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "qr-code.png";
      link.click();
    } else {
      console.error("Canvas not found.");
    }
  };

  const uploadQRToBackend = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      const binaryData = atob(dataURL.split(",")[1]);

      const byteNumbers = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteNumbers[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: "image/png" });

      const formData = new FormData();
      formData.append("qrCode", blob, "qr-code.png");

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          alert("QR code saved successfully on the server.");
        } else {
          alert("Failed to save QR code.");
        }
      } catch (error) {
        console.error("Error uploading QR code:", error);
      }
    } else {
      console.error("Canvas not found.");
    }
  };

  return (
    <div className="qr-container">
      <h1>QR Code Generator</h1>
      <input
        className="qr-input"
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text"
      />
      {text && (
        <div className="qr-code">
          <canvas ref={canvasRef} /> {/* Render QR code on canvas */}
        </div>
      )}
      {text && (
        <>
          <button className="qr-download-button" onClick={downloadQRAsBinary}>
            Download QR as Binary
          </button>
          <button className="qr-download-button" onClick={uploadQRToBackend}>
            Upload QR to Server
          </button>
        </>
      )}
    </div>
  );
};

export default QRGenerator;
