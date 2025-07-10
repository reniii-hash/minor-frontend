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

  const signup = async (email, username, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase(),
    )

    if (existingUser) {
      const errorMsg =
        existingUser.email.toLowerCase() === email.toLowerCase()
          ? "User already exists with this email"
          : "Username is already taken"
      return { success: false, error: errorMsg }
    }

    const newUser = {
      id: Date.now(),
      email,
      username,
      password,
      role: "user",
      name: username,
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
