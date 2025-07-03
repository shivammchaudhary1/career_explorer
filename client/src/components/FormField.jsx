import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import { fonts } from "../utility/fonts.js";

const FormField = ({ label, name, type = "text", onChange, width = "" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          // fontSize: "16px",
          fontSize: { xs: "14px", sm: "16px", md: "18px" },
          fontFamily: fonts.poppins,
        }}
      >
        {label}
        {<span style={{ color: "red" }}>*</span>}
      </Typography>
      <TextField
        required
        variant="standard"
        placeholder={label === "Password" ? "Enter Password" : label}
        sx={{
          width: width || "80%",
          margin: "auto",
          borderRadius: "10px",
          backgroundColor: "#F6F6F6",
          padding: 1.3,
          fontFamily: fonts.poppins,
        }}
        InputLabelProps={{
          shrink: false,
        }}
        InputProps={{
          disableUnderline: true,
          type: showPassword ? "text" : type, // Toggle between text and password
          endAdornment: (label === "Password" ||
            label === "New Password" ||
            label === "Confirm New Password") && (
            <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ marginRight: "10px" }}>
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          ),

          sx: {
            fontFamily: fonts.poppins, // Apply Poppins font to user-typed text
            "&::placeholder": {
              fontFamily: fonts.poppins, // Apply Poppins font to placeholder
            },
          },
        }}
        name={name}
        type={type}
        onChange={onChange}
      />
    </Box>
  );
};

export default FormField;
