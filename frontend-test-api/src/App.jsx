import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import AdminLogin from "./admin/Admin";
import AdminKYC from "./admin/KYC";
import ReportsPage from "./admin/Reports";
import LogoutButton from "./logout";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/register">User Register</Link></li>
          <li><Link to="/login">User Login</Link></li>
          <li><Link to="/submit-kyc"> User Submit KYC</Link></li>
          <li><Link to="/admin-login">Admin Login</Link></li> {/* New link */}
          
        </ul>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit-kyc" element={<SubmitKYC />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {/* New route */}
        <Route path="/admin-kyc" element={<AdminKYC />} /> {/* New KYC page */}
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", formData);
      setResponse(res.data);
      navigate("/login")
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <button type="submit">Register</button>
      </form>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", formData);
      setResponse(res.data);
      localStorage.setItem("accessToken", res.data.user.body.accessToken);
      navigate("/submit-kyc");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <button type="submit">Login</button>
      </form>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}

function SubmitKYC() {
  const [formData, setFormData] = useState({ name: "", image: null });
  const [response, setResponse] = useState(null);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("image", formData.image);
    formDataObj.append("page", 1);
    formDataObj.append("pageSize", 10);

    try {
      const res = await axios.post("http://localhost:5000/kyc", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Submit KYC</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
        <button type="submit">Submit</button>
      </form>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      <LogoutButton data='user' />  {/* Add the logout button here */}
    </div>
  );
}

export default App;
