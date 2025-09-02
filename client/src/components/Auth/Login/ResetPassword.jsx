import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid reset link");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError("Password must be 8-16 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { 
          token, 
          email, 
          newPassword: password 
        }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#000",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      
      {message && (
        <div style={{ color: "green", marginTop: "10px" }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}
    </div>
  );
}