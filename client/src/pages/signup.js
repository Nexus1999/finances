import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    full_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const GRADIENT_COLORS = {
    START: "#ffed4a",
    MIDDLE: "#ffa500",
    END: "#dc3545",
  };

  const TEXT_COLORS = {
    PRIMARY_DARK: "#333",
    ACCENT_LIGHT: "#fff",
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) return setError(data.message || "Something went wrong");

      setSuccess("Account created! You can now log in.");
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              p: 5,
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              background: "#ffffffee",
            }}
          >
            <Box align="center" sx={{ mb: 2 }}>
              <PersonAddIcon sx={{ fontSize: 50, color: GRADIENT_COLORS.END }} />
            </Box>

            <Typography variant="h4" align="center" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
              Fill in your details to register
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={form.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                value={form.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Full Name"
                name="full_name"
                fullWidth
                value={form.full_name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Phone Number"
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${GRADIENT_COLORS.START}, ${GRADIENT_COLORS.MIDDLE}, ${GRADIENT_COLORS.END})`,
                  color: TEXT_COLORS.PRIMARY_DARK,
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          flex: 1,
          background: `linear-gradient(135deg, ${GRADIENT_COLORS.START}, ${GRADIENT_COLORS.MIDDLE}, ${GRADIENT_COLORS.END})`,
        }}
      />
    </Box>
  );
}
