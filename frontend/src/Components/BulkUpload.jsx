import { useState } from "react";
import axios from "axios";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a JSON file");
      return;
    }

    try {
      setLoading(true);
      setStatus("Reading file...");

      const text = await file.text();
      const data = JSON.parse(text);

      setStatus("Uploading products...");

      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_LINK}/api/admin/bulkAdd`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStatus("✅ Products uploaded successfully");
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px" }}>
      <h2>Bulk Product Upload</h2>

      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
      />

      <br /><br />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#c36522",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload JSON"}
      </button>

      <p style={{ marginTop: "15px" }}>{status}</p>
    </div>
  );
};

export default BulkUpload;