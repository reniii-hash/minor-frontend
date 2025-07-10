"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock user database with admin users
const MOCK_USERS = [
  // Admin users
  { id: 1, email: "renila@guardora.com", password: "renila", role: "admin", name: "Renila" },
  { id: 2, email: "shradha@guardora.com", password: "shradha", role: "admin", name: "Shradha" },
  { id: 3, email: "simon@guardora.com", password: "simon", role: "admin", name: "Simon" },
  // Regular users
  { id: 4, email: "user@guardora.com", password: "user123", role: "user", name: "User" },
  { id: 5, email: "john@example.com", password: "password123", role: "user", name: "John" },
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registeredUsers, setRegisteredUsers] = useState(MOCK_USERS)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in registered users
      const foundUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )

      if (!foundUser) {
        return { success: false, error: "Invalid email or password" }
      }

      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const signup = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (existingUser) {
        return { success: false, error: "User already exists with this email" }
      }

      // Create new user - always set role as "user"
      const newUser = {
        id: Date.now(),
        email: email,
        password: password,
        role: "user", // Always set as user
        name: email.split("@")[0],
      }

      // Add to registered users
      const updatedUsers = [...registeredUsers, newUser]
      setRegisteredUsers(updatedUsers)

      // Auto login after signup
      const userData = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: "Signup failed" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
