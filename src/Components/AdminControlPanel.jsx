import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminControlPanel = () => {
  const [inputs, setInputs] = useState([]);
  const [newInputLabel, setNewInputLabel] = useState("");

  useEffect(() => {
    fetchInputs();
  }, []);

  const fetchInputs = async () => {
    const res = await axios.get("https://oil-backend-maxf.vercel.app/inputs");
    setInputs(res.data);
  };

  const addInput = async () => {
    if (!newInputLabel.trim()) return;
    await axios.post("https://oil-backend-maxf.vercel.app/inputs", {
      label: newInputLabel,
      visible: true,
    });
    setNewInputLabel("");
    fetchInputs();
  };

  const toggleVisibility = async (id, currentVisibility) => {
    await axios.put(`https://oil-backend-maxf.vercel.app/inputs/${id}`, {
      visible: !currentVisibility,
    });
    fetchInputs();
  };

  const deleteInput = async (id) => {
    await axios.delete(`https://oil-backend-maxf.vercel.app/  inputs/${id}`);
    fetchInputs();
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        background: "#f4f4f4",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Admin Input Control Panel
      </h2>

      <div style={{ display: "flex", marginBottom: "20px", gap: "10px" }}>
        <input
          type="text"
          placeholder="New Input Label"
          value={newInputLabel}
          onChange={(e) => setNewInputLabel(e.target.value)}
          style={{
            flex: "1",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addInput}
          style={{
            padding: "10px 15px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Input
        </button>
      </div>

      {inputs.map((input) => (
        <div
          key={input._id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <span style={{ flex: 1, color: "#555" }}>{input.label}</span>
          <button
            onClick={() => toggleVisibility(input._id, input.visible)}
            style={{
              padding: "5px 10px",
              marginRight: "10px",
              backgroundColor: input.visible ? "#ffc107" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            {input.visible ? "Hide" : "Show"}
          </button>
          <button
            onClick={() => deleteInput(input._id)}
            style={{
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminControlPanel;
