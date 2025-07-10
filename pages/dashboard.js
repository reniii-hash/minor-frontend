"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./dashboard.css"

const Dashboard = () => {
  const navigate = useNavigate()
  const [violations, setViolations] = useState([])
  const [stats, setStats] = useState({
    totalViolations: 0,
    helmetViolations: 0,
    vestViolations: 0,
    todayViolations: 0,
  })
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadViolations = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/violations');
        // const violationsData = await response.json();

        // For now, empty array as requested
        const violationsData = []

        setViolations(violationsData)
        calculateStats(violationsData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading violations:", error)
        setLoading(false)
      }
    }

    loadViolations()
  }, [])

  const calculateStats = (violationsData) => {
    const today = new Date().toDateString()
    const todayViolations = violationsData.filter((v) => new Date(v.date).toDateString() === today).length

    const helmetViolations = violationsData.filter((v) => v.label === "NoHelmet").length
    const vestViolations = violationsData.filter((v) => v.label === "NoVest").length

    setStats({
      totalViolations: violationsData.length,
      helmetViolations,
      vestViolations,
      todayViolations,
    })
  }

  const filteredViolations = violations.filter((violation) => {
    if (filter === "all") return true
    return violation.label === filter
  })

  const clearViolations = async () => {
    if (window.confirm("Are you sure you want to clear all violation records?")) {
      try {
        // TODO: Replace with actual API call
        // await fetch('/api/user/violations', { method: 'DELETE' });

        setViolations([])
        setStats({
          totalViolations: 0,
          helmetViolations: 0,
          vestViolations: 0,
          todayViolations: 0,
        })
      } catch (error) {
        console.error("Error clearing violations:", error)
      }
    }
  }

  const exportViolations = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/violations/export');
      // const blob = await response.blob();

      const csvContent = [
        ["Date", "Label", "Confidence"],
        ...filteredViolations.map((v) => [v.timestamp, v.label, v.confidence]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "ppe_violations.csv"
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting violations:", error)
    }
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>PPE Violations Dashboard</h1>
            <p>Monitor and track safety compliance violations</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate("/ppe-detection")}>
              Back to Detection
            </button>
            <button className="btn btn-primary" onClick={exportViolations}>
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Violations</h3>
            <p className="stat-number">{stats.totalViolations}</p>
          </div>
        </div>
        <div className="stat-card helmet">
          <div className="stat-icon">⛑️</div>
          <div className="stat-content">
            <h3>Helmet Violations</h3>
            <p className="stat-number">{stats.helmetViolations}</p>
          </div>
        </div>
        <div className="stat-card vest">
          <div className="stat-icon">🦺</div>
          <div className="stat-content">
            <h3>Vest Violations</h3>
            <p className="stat-number">{stats.vestViolations}</p>
          </div>
        </div>
        <div className="stat-card today">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Today's Violations</h3>
            <p className="stat-number">{stats.todayViolations}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-container">
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Violations</option>
            <option value="NoHelmet">Helmet Violations</option>
            <option value="NoVest">Vest Violations</option>
          </select>
        </div>
        <div className="actions">
          <button className="btn btn-danger" onClick={clearViolations}>
            Clear All Records
          </button>
        </div>
      </div>

      {/* Violations Table */}
      <div className="violations-container">
        <div className="violations-header">
          <h2>Violations History</h2>
          <p>Ready for backend integration</p>
        </div>

        <div className="table-container">
          <table className="violations-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Label</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="loading-cell">
                    <div className="loading-spinner"></div>
                    Loading violations...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    <div className="empty-state">
                      <div className="empty-icon">📊</div>
                      <h3>No Violations Found</h3>
                      <p>Violations will appear here when detected by the PPE monitoring system.</p>
                      <p className="backend-note">Ready for backend integration</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
