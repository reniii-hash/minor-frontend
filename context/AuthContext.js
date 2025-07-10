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

// Simple user database
const USERS = [
  { id: 1, email: "renila@guardora.com", username: "renila", password: "renila", role: "admin", name: "Renila" },
  { id: 2, email: "shradha@guardora.com", username: "shradha", password: "shradha", role: "admin", name: "Shradha" },
  { id: 3, email: "simon@guardora.com", username: "simon", password: "simon", role: "admin", name: "Simon" },
  { id: 4, email: "user@guardora.com", username: "user", password: "user123", role: "user", name: "User" },
  { id: 5, email: "john@example.com", username: "john", password: "password123", role: "user", name: "John" },
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState(USERS)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (emailOrUsername, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

    const foundUser = users.find(
      (u) =>
        (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
          u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
        u.password === password,
    )

    if (!foundUser) {
      return { success: false, error: "Invalid email/username or password" }
    }

    const userData = {
      id: foundUser.id,
      email: foundUser.email,
      username: foundUser.username,
      role: foundUser.role,
      name: foundUser.name,
    }

    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return { success: true, user: userData }
  }

  const signup = async (emailOrUsername, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

    const isEmail = /\S+@\S+\.\S+/.test(emailOrUsername)

    // Check if user already exists
    const existingUser = users.find(
      (u) =>
        u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
        u.username.toLowerCase() === emailOrUsername.toLowerCase(),
    )

    if (existingUser) {
      return { success: false, error: "User already exists with this email/username" }
    }

    // Create user with email and username based on input
    const newUser = {
      id: Date.now(),
      email: isEmail ? emailOrUsername : `${emailOrUsername}@guardora.com`,
      username: isEmail ? emailOrUsername.split("@")[0] : emailOrUsername,
      password,
      role: "user",
      name: isEmail ? emailOrUsername.split("@")[0] : emailOrUsername,
    }

    setUsers([...users, newUser])

    const userData = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      name: newUser.name,
    }

    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return { success: true, user: userData }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{!loading && children}</AuthContext.Provider>
  )
}
