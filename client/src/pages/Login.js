import { useState, useRef } from "react";
import {
Box,
Button,
Container,
TextField,
Typography,
CircularProgress,
Alert,
Link,
Checkbox,
FormControlLabel,
Stack,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";

export default function Login() {
const navigate = useNavigate();
const [username, setUsername] = useState("");
const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);

const GRADIENT_COLORS = {
START: "#ffed4a",
MIDDLE: "#ffa500",
END: "#dc3545",
};
const TEXT_COLORS = { PRIMARY_DARK: "#333", ACCENT_LIGHT: "#fff" };

const handlePinChange = (index, value) => {
const digit = value.slice(-1);
if (!/^\d*$/.test(digit)) return;
const newPinDigits = [...pinDigits];
newPinDigits[index] = digit;
setPinDigits(newPinDigits);
if (digit !== "" && index < pinDigits.length - 1) pinRefs[index + 1].current.focus();
};

const handlePinKeyDown = (index, e) => {
if (e.key === "Backspace" && pinDigits[index] === "" && index > 0) {
e.preventDefault();
pinRefs[index - 1].current.focus();
}
};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
const pin = pinDigits.join("");
if (!username) return setError("Username is required.");
if (pin.length !== 4) return setError("Enter full 4-digit PIN.");
setIsLoading(true);
try {
const res = await fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, pin }),
});

const data = await res.json();
if (!res.ok) setError(data.message || "Invalid credentials.");
else console.log("Logged in:", data);
} catch {
setError("Network error. Check your connection.");
} finally {
setIsLoading(false);
}
};

return (
<Box sx={{ display: "flex", minHeight: "100vh" }}>
{/* Left side: Login form */}
<Box
sx={{
flex: 1,
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "#f5f5f5",
}}
> <Container maxWidth="xs">
<Box
sx={{
p: 5,
borderRadius: 4,
boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
background: "#ffffffee",
}}
>
<Box align="center" sx={{ mb: 2 }}>
<LockOpenIcon sx={{ fontSize: 50, color: GRADIENT_COLORS.END }} /> </Box> <Typography variant="h4" align="center" gutterBottom>
Access Portal </Typography>
<Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
Authenticate with your username & PIN </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="body1" sx={{ mb: 1 }}>
            Security PIN:
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
            {pinDigits.map((digit, index) => (
              <TextField
                key={index}
                inputRef={pinRefs[index]}
                type="password"
                required
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "1.5rem" } }}
                sx={{ width: "18%" }}
              />
            ))}
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <FormControlLabel control={<Checkbox />} label="Remember this device" />
            <Link href="#" underline="hover">
              Need assistance?
            </Link>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.5,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${GRADIENT_COLORS.START}, ${GRADIENT_COLORS.MIDDLE}, ${GRADIENT_COLORS.END})`,
              color: TEXT_COLORS.PRIMARY_DARK,
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Login"}
          </Button>

          {/* SIGN UP LINK */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component="button" variant="body2" onClick={() => navigate('/signup')}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  </Box>

  {/* Right side: Gradient background */}
  <Box
    sx={{
      flex: 1,
      background: `linear-gradient(135deg, ${GRADIENT_COLORS.START}, ${GRADIENT_COLORS.MIDDLE}, ${GRADIENT_COLORS.END})`,
    }}
  />
</Box>

);
}
