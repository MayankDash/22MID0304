import { Box, Container, Stack, Typography } from "@mui/material";
import AppRoutes from "./routes";
import TokenBar from "./components/TokenBar";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              background: "linear-gradient(120deg, #0f6b5b, #1fa187)",
              color: "#fff",
              boxShadow: "0 16px 40px rgba(15, 107, 91, 0.25)",
              animation: "fadeUp 500ms ease",
            }}
          >
            <Typography variant="h4">Campus Notification Hub</Typography>
            <Typography sx={{ mt: 1, opacity: 0.9 }}>
              Placements, events, and results in one live feed.
            </Typography>
          </Box>

          <TokenBar />

          <AppRoutes />
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
