"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, User, Mail, Lock, Eye, EyeOff, ArrowLeft, Send, Loader2, KeyRound } from "lucide-react"
import Link from "next/link"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

interface Admin {
  name: string
  email: string
}

interface AdminAccount {
  name: string
  email: string
  password: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([])
  const [demoCode, setDemoCode] = useState<string | null>(null)

  // Form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupSecretKey, setSignupSecretKey] = useState("")

  const [codeEmail, setCodeEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)

  // Load admin accounts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("adminAccounts")
    if (stored) {
      setAdminAccounts(JSON.parse(stored))
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Check if credentials match any registered admin account
    const account = adminAccounts.find((acc) => acc.email === loginEmail && acc.password === loginPassword)

    if (account) {
      setAdmin({ name: account.name, email: account.email })
      setIsLoggedIn(true)
      setLoginEmail("")
      setLoginPassword("")
    } else {
      setError("Invalid email or password. Please sign up first if you don't have an account.")
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!signupName || !signupEmail || signupPassword.length < 6) {
      setError("Please fill all fields. Password must be at least 6 characters.")
      return
    }

    // Check if email already exists
    if (adminAccounts.some((acc) => acc.email === signupEmail)) {
      setError("This email is already registered. Please log in instead.")
      return
    }

    // Create new account and save to localStorage
    const newAccount: AdminAccount = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    }

    const updatedAccounts = [...adminAccounts, newAccount]
    setAdminAccounts(updatedAccounts)
    localStorage.setItem("adminAccounts", JSON.stringify(updatedAccounts))

    // Log in immediately after signup
    setAdmin({ name: signupName, email: signupEmail })
    setIsLoggedIn(true)

    // Clear signup form
    setSignupName("")
    setSignupEmail("")
    setSignupPassword("")
    setSignupSecretKey("")
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!codeEmail) {
      setError("Please enter your email address")
      return
    }

    setSendingCode(true)

    try {
      const response = await fetch("/api/send-admin-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: codeEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send code")
      }

      setCodeSent(true)
      setSuccess(`Admin code sent to ${codeEmail}! Check your inbox.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code. Please try again.")
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit code")
      return
    }

    setVerifyingCode(true)

    try {
      const response = await fetch("/api/send-admin-code", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: codeEmail, code: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid code")
      }

      // Code verified, log in the user
      setAdmin({ name: "Admin User", email: codeEmail })
      setIsLoggedIn(true)
      setSuccess("Code verified! Logging in...")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.")
    } finally {
      setVerifyingCode(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAdmin(null)
    setLoginEmail("")
    setLoginPassword("")
    setCodeSent(false)
    setCodeEmail("")
    setVerificationCode("")
  }

  if (isLoggedIn && admin) {
    return <AdminDashboard admin={admin} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md glass-card border-border/50 relative">
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-xl bg-neon-cyan/20 flex items-center justify-center neon-glow mb-2">
            <Shield className="h-7 w-7 text-neon-cyan" />
          </div>
          <CardTitle className="text-2xl neon-text">Admin Portal</CardTitle>
          <CardDescription>Secure access to the billing system management</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email-code" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/30">
              <TabsTrigger value="email-code">Email Code</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="email-code">
              {!codeSent ? (
                <form onSubmit={handleSendCode} className="space-y-4 mt-4">
                  <div className="text-center mb-4">
                    <div className="mx-auto h-12 w-12 rounded-full bg-neon-purple/20 flex items-center justify-center mb-3">
                      <Send className="h-6 w-6 text-neon-purple" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter your email to receive a secure admin access code
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="code-email"
                        type="email"
                        placeholder="your.email@gmail.com"
                        className="pl-10 bg-secondary/30 border-border/50"
                        value={codeEmail}
                        onChange={(e) => setCodeEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {success && <p className="text-sm text-green-500">{success}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-neon-purple hover:bg-neon-purple/90 text-white font-semibold"
                    disabled={sendingCode}
                  >
                    {sendingCode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Code to Email
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4 mt-4">
                  <div className="text-center mb-4">
                    <div className="mx-auto h-12 w-12 rounded-full bg-neon-cyan/20 flex items-center justify-center mb-3">
                      <KeyRound className="h-6 w-6 text-neon-cyan" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to <strong className="text-foreground">{codeEmail}</strong>
                    </p>
                  </div>
                  {demoCode && (
                    <div className="bg-neon-purple/20 border border-neon-purple/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Demo Mode Code</p>
                      <p className="text-lg font-mono font-bold text-neon-purple">{demoCode}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                      id="verification-code"
                      type="text"
                      placeholder="123456"
                      className="bg-secondary/30 border-border/50 text-center text-2xl tracking-[0.5em] font-mono"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {success && <p className="text-sm text-green-500">{success}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-neon-cyan hover:bg-neon-cyan/90 text-background font-semibold"
                    disabled={verifyingCode || verificationCode.length !== 6}
                  >
                    {verifyingCode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={() => {
                      setCodeSent(false)
                      setVerificationCode("")
                      setError("")
                      setSuccess("")
                    }}
                  >
                    Use a different email
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-10 bg-secondary/30 border-border/50"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-secondary/30 border-border/50"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-neon-cyan hover:bg-neon-cyan/90 text-background font-semibold"
                >
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      className="pl-10 bg-secondary/30 border-border/50"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-10 bg-secondary/30 border-border/50"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-secondary/30 border-border/50"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-neon-cyan hover:bg-neon-cyan/90 text-background font-semibold"
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-border/50">
            <Link href="/">
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Checkout
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
