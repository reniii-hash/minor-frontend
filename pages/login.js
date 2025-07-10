"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../context/AuthContext';
import "./login.css"

const Login = () => {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup, user } = useAuth()

  // Handle redirect when user changes
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true })
      } else {
        const from = location.state?.from?.pathname || "/"
        navigate(from, { replace: true })
      }
    }
  }, [user, navigate, location.state])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return false
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (formData.password.length < 3) {
      setError("Password must be at least 3 characters long")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      let result
      if (isSignup) {
        result = await signup(formData.email, formData.password)
      } else {
        result = await login(formData.email, formData.password)
      }

      if (result.success) {
        // The useEffect will handle the redirect based on user role
        console.log("Login successful, user role:", result.user?.role)
      } else {
        setError(result.error || "Authentication failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setError("")
    setFormData({
      email: "",
      password: "",
    })
  }

  // Don't render if user is already logged in
  if (user) {
    return <div>Redirecting...</div>
  }

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form-wrapper">
          <h1 className="login-brand">GUARDORA</h1>
          <h2 className="login-title">{isSignup ? "Create Account" : "Welcome Back"}</h2>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                disabled={loading}
                minLength={3}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span className="signup-link" onClick={toggleMode}>
                {isSignup ? "Sign In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
