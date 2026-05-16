import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0f6b5b" },
    secondary: { main: "#ff8f4f" },
    background: { default: "#f5f1e8", paper: "#fff8f0" },
  },
  typography: {
    fontFamily: "Space Grotesk, Segoe UI, sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff8f0",
          border: "1px solid #f0e3d5",
          boxShadow: "0 12px 30px rgba(31, 54, 48, 0.08)",
        },
      },
    },
  },
});

export default theme;
