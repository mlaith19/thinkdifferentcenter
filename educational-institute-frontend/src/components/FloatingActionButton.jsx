// src/components/FloatingActionButton.jsx
import React from "react";
import { Button } from "@mui/material";

const FloatingActionButton = ({ onClick, icon, label }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={onClick} // Use the onClick prop
        variant="contained"
        color="primary"
        startIcon={icon} // Use the icon prop
        sx={{
          borderRadius: "28px",
          padding: "12px 24px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          textTransform: "none",
          fontSize: "16px",
        }}
      >
        {label} {/* Use the label prop */}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
