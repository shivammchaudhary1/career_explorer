import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

import { background, leftPannelAuth, Logo } from "../assets/assest.js";
import FormField from "../components/FormField";
import { notify } from "../redux/slices/alertSlice.js";
import { forgetPassVerify } from "../redux/slices/authSlice";
import loginStyles from "../styles/Login.module.css";
import { fonts } from "../utility/fonts.js";
import { checkPassStrength } from "../utility/validate";

const CreateNewPassword = () => {
  const dispatchToRedux = useDispatch();
  const navigate = useNavigate();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmNewPassword) {
      return dispatchToRedux(notify({ type: "warning", message: "Please fill all the fields" }));
    }

    if (!checkPassStrength(formData.newPassword)) {
      return dispatchToRedux(notify({ type: "warning", message: "Password is too weak" }));
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      return dispatchToRedux(notify({ type: "warning", message: "Passwords do not match" }));
    }
    const searchParams = new URLSearchParams(location.search);
    const user = searchParams.get("user");
    const token = searchParams.get("token");

    try {
      setIsButtonLoading(true);
      const response = await dispatchToRedux(
        forgetPassVerify({
          password: formData.newPassword,
          confirmPassword: formData.confirmNewPassword,
          userId: user,
          token,
        }),
      );

      if (response.payload.ok) {
        dispatchToRedux(
          notify({
            type: "success",
            message: "Password reset successfully, login to continue",
          }),
        );
        navigate("/login");
      }
      setIsButtonLoading(false);
    } catch (error) {
      setIsButtonLoading(false);
      dispatchToRedux(notify({ type: "error", message: error.data.message }));
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: { xs: "90vh", md: "100vh" },
          backgroundImage: `url(${background})`,
        }}
      >
        {/* Left and Right */}
        <Box sx={{ display: "flex", width: "100%", height: "100%" }} className={loginStyles.container}>
          <Box
            sx={{
              height: "100vh",
              width: "50%",
              marginLeft: "5rem",
              display: { xs: "none", md: "block" },
            }}
            className={loginStyles.left}
          >
            <img src={leftPannelAuth} alt="Login Hero" height={"100%"} />
          </Box>
          {/* Right */}
          <Box
            sx={{
              width: { xs: "100%", md: "476px" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto", // Center the box horizontally
              boxSizing: "border-box",
              marginBottom: { xs: "3rem", md: "0" },
            }}
            className={loginStyles.right}
          >
            <Link to="/">
              <Box marginBottom={"1rem"}>
                <img src={Logo} alt="Logo" width={"210px"} className={loginStyles.logo} />
              </Box>
            </Link>
            <Box
              sx={{
                backgroundColor: "#ffffff",
                width: { xs: "90%", md: "476px" },
                borderRadius: "29px",
                alignItems: "center",
                boxShadow: "0px 14px 44px 0px #0000001A",
                paddingBottom: "2rem",
                paddingTop: "1rem",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingTop: "2rem",
                  fontFamily: fonts.poppins,
                }}
              >
                Welcome back!
              </Typography>
              <Typography
                variant="p"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "#787878",
                  fontSize: "16px",
                  fontFamily: fonts.poppins,
                }}
              >
                Don&apos;t worry, we&apos;ve got you covered!
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  padding: "2rem",
                }}
                className={loginStyles.formPadding}
              >
                <FormField label="Email" name="email" type="email" onChange={handleChange} width="100%" />
                <FormField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  width="100%"
                  onChange={handleChange}
                />
                <FormField
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type="password"
                  width="100%"
                  onChange={handleChange}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className={loginStyles.keepMeLoginSection}
                ></Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {isButtonLoading ? (
                    <Button
                      variant="contained"
                      sx={{
                        background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
                        width: "50%",
                        "&:hover": {
                          background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
                        },
                        borderRadius: "2rem",
                        padding: "10px 0px",
                        fontWeight: "bold",
                        marginTop: "1rem",
                      }}
                    >
                      <CircularProgress size={25} color="inherit" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      disabled={isButtonLoading}
                      sx={{
                        background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
                        width: "50%",
                        "&:hover": {
                          background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
                        },
                        borderRadius: "2rem",
                        padding: "10px 0px",
                        fontWeight: "bold",
                        marginTop: "1rem",
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <Typography sx={{ fontFamily: fonts.poppins, color: "#787878" }}>
                      Don&apos;t have an account?
                    </Typography>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                      <Typography
                        sx={{
                          fontWeight: "600",
                          color: "#FF8A00",
                          fontFamily: fonts.poppins,
                        }}
                      >
                        Sign Up
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CreateNewPassword;
