"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulseOffset: number
}

export function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let points: Point[] = []
    const connectionDistance = 180
    const numPoints = 25
    const mouseRadius = 150

    let mouse = { x: -1000, y: -1000 }

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      initPoints()
    }

    const initPoints = () => {
      points = []
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1.5,
          pulseOffset: Math.random() * Math.PI * 2
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    const animate = (time: number) => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const isDark = theme === "dark"

      ctx.clearRect(0, 0, width, height)

      // Update points
      points.forEach((point) => {
        point.x += point.vx
        point.y += point.vy

        // Bounce off edges
        if (point.x < 0 || point.x > width) point.vx *= -1
        if (point.y < 0 || point.y > height) point.vy *= -1

        // Keep in bounds
        point.x = Math.max(0, Math.min(width, point.x))
        point.y = Math.max(0, Math.min(height, point.y))

        // Mouse repulsion
        const dx = point.x - mouse.x
        const dy = point.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius
          point.vx += (dx / dist) * force * 0.3
          point.vy += (dy / dist) * force * 0.3
        }

        // Dampen velocity
        point.vx *= 0.99
        point.vy *= 0.99
      })

      // Colors based on theme
      const lineColor = isDark ? "255, 255, 255" : "0, 0, 0"
      const pointColor = isDark ? "255, 255, 255" : "0, 0, 0"

      // Draw connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.5
            const pulse = Math.sin(time * 0.001 + points[i].pulseOffset) * 0.15 + 0.85

            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity * pulse})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Draw points
      points.forEach((point) => {
        const pulse = Math.sin(time * 0.002 + point.pulseOffset) * 0.3 + 1.2
        const glowRadius = point.radius * pulse * 3

        // Glow effect
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, glowRadius
        )
        gradient.addColorStop(0, `rgba(${pointColor}, 0.6)`)
        gradient.addColorStop(0.4, `rgba(${pointColor}, 0.15)`)
        gradient.addColorStop(1, `rgba(${pointColor}, 0)`)

        ctx.beginPath()
        ctx.arc(point.x, point.y, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core point
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${pointColor}, 0.8)`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  )
}
