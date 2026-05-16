import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function TokenBar() {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("accessToken") || "";
    setToken(existing);
  }, []);

  function handleSave() {
    localStorage.setItem("accessToken", token.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: "#fff8f0",
        border: "1px solid #f0e3d5",
        animation: "fadeUp 600ms ease",
      }}
    >
      <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
        <TextField
          label="Access Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste Bearer token here"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ minWidth: 140 }}
        >
          Save Token
        </Button>
      </Stack>
      <Typography sx={{ mt: 1, fontSize: 13, opacity: 0.75 }}>
        {saved ? "Token saved" : "Token is stored locally in this browser."}
      </Typography>
    </Box>
  );
}

export default TokenBar;
