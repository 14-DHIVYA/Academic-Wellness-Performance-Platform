import React from "react";

const WellnessItem = ({ item, onDelete }) => {
  return (
    <div
      style={{
        background: "#1e1e1e",
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 10px 0" }}>{item.title}</h3>
        <p>📊 Stress Level: {item.stressLevel}</p>
        <p>😴 Sleep Hours: {item.sleepHours}</p>
        <p>😊 Mood: {item.mood}</p>
      </div>

      <button
        onClick={() => onDelete(item._id)}
        style={{
          background: "#ff4d4d",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
          color: "white",
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default WellnessItem;