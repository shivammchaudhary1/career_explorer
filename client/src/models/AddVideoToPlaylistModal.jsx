import { Box, Button, CircularProgress, MenuItem, Modal, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { notify } from "../redux/slices/alertSlice.js";
import { addVideoToPlaylist, getUserPlaylist, selectAllPlaylistName } from "../redux/slices/playlistSlice.js";
import { fonts } from "../utility/fonts.js";

// open={openAddVideoToPlaylistModal}
// onClose={handleCloseAddVideoToPlaylistModal}
// videoId={selectedVideoId}
// userId={userId}
// authenticated={authenticated}
// token={token}

const AddVideoToPlaylistModal = ({ open, onClose, videoId, userId, token, authenticated }) => {
  const dispatchToRedux = useDispatch();
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const playlistNames = useSelector(selectAllPlaylistName);

  useEffect(() => {
    if (userId && authenticated) {
      dispatchToRedux(getUserPlaylist({ userId, token }));
    }
  }, [dispatchToRedux, userId]);

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) {
      dispatchToRedux(notify({ type: "error", message: "Please select a playlist" }));
      return;
    }

    try {
      setIsButtonLoading(true);
      const addingPlaylistResponse = await dispatchToRedux(
        addVideoToPlaylist({
          playlistId: selectedPlaylist,
          videoId,
          userId,
          token,
        }),
      );

      setIsButtonLoading(false);
      onClose();
      if (addingPlaylistResponse.payload.message) {
        dispatchToRedux(notify({ type: "success", message: "Video added to playlist" }));
      }
    } catch (error) {
      setIsButtonLoading(false);
      dispatchToRedux(notify({ type: "error", message: "Error adding video to playlist" }));
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: "1rem",
            fontFamily: fonts.sans,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Add to Playlist
        </Typography>
        <Select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          fullWidth
          displayEmpty
          sx={{
            marginBottom: "1rem",
            fontFamily: fonts.sans,
            border: "1px solid #ddd",
            borderRadius: "5px",
            "& .MuiSelect-select": {
              padding: "10px",
            },
          }}
        >
          <MenuItem value="" disabled>
            Select a Playlist
          </MenuItem>
          {playlistNames?.map((playlist) => (
            <MenuItem key={playlist._id} value={playlist.playlistId}>
              {playlist.playlistName}
            </MenuItem>
          ))}
        </Select>
        <Button
          fullWidth
          variant="contained"
          sx={{
            fontFamily: "Poppins, sans-serif",
            background: "linear-gradient(to right, #720361, #bf2f75)",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.5rem",
            "&:hover": {
              background: "linear-gradient(to right, #720361, #bf2f75)",
            },
          }}
          onClick={handleAddToPlaylist}
          disabled={!selectedPlaylist || isButtonLoading}
        >
          {isButtonLoading ? <CircularProgress color="inherit" size={24} /> : "Add"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddVideoToPlaylistModal;
