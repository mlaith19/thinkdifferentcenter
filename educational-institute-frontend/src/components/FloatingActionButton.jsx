// src/components/FloatingActionButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

const FloatingActionButton = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        component={Link}
        to="/institutes/create"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{
          borderRadius: "28px",
          padding: "12px 24px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          textTransform: "none",
          fontSize: "16px",
        }}
      >
        Add Institution
      </Button>
    </div>
  );
};

export default FloatingActionButton;