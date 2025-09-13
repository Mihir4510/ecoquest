import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Button from "../components/Button";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/users/register", { name, email, password });
      console.log("✅ User Registered:", res.data);

      localStorage.setItem("token", res.data.token);

      navigate("/Profile");

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Register
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-center">
            {/* Add type="submit" so form onSubmit triggers */}
            <Button text={loading ? "Registering..." : "Register"} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
