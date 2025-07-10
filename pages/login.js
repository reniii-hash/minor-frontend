"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../context/AuthContext';
import "./login.css"

const Login = () => {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup, user } = useAuth()

  useEffect(() => {
    if (user) {
      const redirectPath = user.role === "admin" ? "/admin-dashboard" : location.state?.from?.pathname || "/"
      navigate(redirectPath, { replace: true })
    }
  }, [user, navigate, location.state])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const validateForm = () => {
    if (!formData.emailOrUsername || !formData.password) {
      setError("Please fill in all required fields")
      return false
    }

    if (formData.password.length < 3) {
      setError("Password must be at least 3 characters long")
      return false
    }

    // For signup, validate email or username format
    if (isSignup) {
      const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrUsername)
      const isValidUsername = /^[a-zA-Z0-9_]{3,20}$/.test(formData.emailOrUsername)

      if (!isEmail && !isValidUsername) {
        setError(
          "Please enter a valid email address or username (3-20 characters, letters, numbers, and underscores only)",
        )
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const result = isSignup
        ? await signup(formData.emailOrUsername, formData.password)
        : await login(formData.emailOrUsername, formData.password)

      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setError("")
    setFormData({ emailOrUsername: "", password: "" })
  }

  if (user) return <div>Redirecting...</div>

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form-wrapper">
          <h1 className="login-brand">GUARDORA</h1>
          <h2 className="login-title">{isSignup ? "Create Account" : "Welcome Back"}</h2>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="emailOrUsername">{isSignup ? "Email or Username *" : "Email or Username *"}</label>
              <input
                type="text"
                id="emailOrUsername"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleInputChange}
                placeholder={isSignup ? "Enter email or choose username" : "Enter your email or username"}
                disabled={loading}
                required
              />
              {isSignup && (
                <small className="form-hint">
                  Enter an email address or username (3-20 characters, letters, numbers, and underscores only)
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isSignup ? "Create a password" : "Enter your password"}
                disabled={loading}
                required
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


