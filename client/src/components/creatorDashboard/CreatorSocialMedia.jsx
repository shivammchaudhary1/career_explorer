import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  TikTokIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../../assets/assest.js";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import {
  getSocialMediaLink,
  selectSocialMediaData,
  socialMediaLink,
} from "../../redux/slices/userDetailsSlice.js";
import creatorStyle from "../../styles/CreatorVideo.module.css";
import { colors } from "../../utility/color.js";
import { fonts } from "../../utility/fonts.js";

const CreatorSocialMedia = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const socialMediaDataInfo = useSelector(selectSocialMediaData);

  const sampleData = useMemo(
    () => [
      { icon: LinkedinIcon, name: "LinkedIn", link: "", isLoading: false },
      { icon: FacebookIcon, name: "Facebook", link: "", isLoading: false },
      { icon: InstagramIcon, name: "Instagram", link: "", isLoading: false },
      { icon: TikTokIcon, name: "TikTok", link: "", isLoading: false },
      { icon: TwitterIcon, name: "Twitter", link: "", isLoading: false },
      { icon: YoutubeIcon, name: "YouTube", link: "", isLoading: false },
      { icon: TelegramIcon, name: "Telegram", link: "", isLoading: false },
    ],
    [],
  );

  const [socialMediaLinks, setSocialMediaLinks] = useState(sampleData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatchToRedux(getSocialMediaLink({ userId, token })).unwrap();
      } catch (error) {
        dispatchToRedux(
          notify({ type: "error", message: error.message || "Failed to fetch social media links" }),
        );
      }
    };

    fetchData();
  }, [dispatchToRedux, userId, token]);

  useEffect(() => {
    if (socialMediaDataInfo?.length > 0) {
      const updatedLinks = sampleData.map((socialMedia) => {
        const existingLink = socialMediaDataInfo.find((link) => link.name === socialMedia.name);
        return {
          ...socialMedia,
          link: existingLink ? existingLink.link : "",
        };
      });
      setSocialMediaLinks(updatedLinks);
    }
  }, [socialMediaDataInfo, sampleData]);

  const handleSave = async (index) => {
    const formData = {
      name: socialMediaLinks[index].name,
      link: socialMediaLinks[index].link,
    };

    try {
      setSocialMediaLinks((prevLinks) => {
        const updatedLinks = [...prevLinks];
        updatedLinks[index] = { ...updatedLinks[index], isLoading: true };
        return updatedLinks;
      });

      await dispatchToRedux(socialMediaLink({ userId, formData, token }));

      setSocialMediaLinks((prevLinks) => {
        const updatedLinks = [...prevLinks];
        updatedLinks[index] = { ...updatedLinks[index], isLoading: false };
        return updatedLinks;
      });

      dispatchToRedux(notify({ type: "success", message: "Link Saved Successfully" }));
    } catch (error) {
      setSocialMediaLinks((prevLinks) => {
        const updatedLinks = [...prevLinks];
        updatedLinks[index] = { ...updatedLinks[index], isLoading: false };
        return updatedLinks;
      });

      dispatchToRedux(notify({ type: "error", message: "Something went wrong" }));
    }
  };

  const handleInputChange = (index, e) => {
    const newLinks = [...socialMediaLinks];
    newLinks[index].link = e.target.value; // Update link in state
    setSocialMediaLinks(newLinks); // Set the updated links in state
  };

  return (
    <>
      <Box
        sx={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: { xs: "0rem", sm: "0rem", md: "1rem" },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Social Channels
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: colors.white,
          padding: { xs: "1rem", sm: "1rem", md: "2rem" },
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          borderRadius: "1rem",
          boxShadow: "2px 2px 10px #77777732",
        }}
      >
        {socialMediaLinks.map((socialMedia, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0 .8rem",
                height: { xs: "2.75rem", sm: "2.75rem", md: "3.75rem" },
                borderRadius: "2rem",
                width: "100%",
                backgroundColor: "#F2F2F2",
              }}
            >
              <img src={socialMedia.icon} alt="Social Link" width="30px" height="30px" />
              <TextField
                fullWidth
                variant="standard"
                placeholder={socialMedia.name}
                value={socialMedia.link} // Bind the input value to state
                onChange={(e) => handleInputChange(index, e)} // Call input change handler
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    backgroundColor: "transparent",
                    paddingBottom: "0rem",
                    height: "3.75rem",
                  },
                }}
                sx={{
                  backgroundColor: "transparent",
                  fontFamily: fonts.sans,
                }}
              />
            </Box>
            {socialMedia.isLoading ? (
              <button
                style={{
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "black",
                  color: "white",
                  width: "6.875rem",
                  height: "2.7rem",
                  padding: "0.4rem 1.1rem",
                  borderRadius: "2.3rem",
                  border: "none",
                }}
                className={creatorStyle["navButton"]}
              >
                <CircularProgress size={20} color="inherit" />
              </button>
            ) : (
              <button
                style={{
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "black",
                  color: "white",
                  width: "6.875rem",
                  height: "2.7rem",
                  padding: "0.4rem 1.1rem",
                  borderRadius: "2.3rem",
                  border: "none",
                }}
                className={creatorStyle["navButton"]}
                onClick={() => handleSave(index)}
              >
                Save
              </button>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default CreatorSocialMedia;
