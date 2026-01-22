// Generate a random 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store codes temporarily (in production, use Redis or a database)
const adminCodes = new Map<string, { code: string; expires: number }>()

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    console.log("[v0] Email code request for:", email)

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if RESEND_API_KEY is set
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.log("[v0] Demo mode: RESEND_API_KEY not configured, generating code for demo")
      // Demo mode - just generate and store the code without sending
      const code = generateCode()
      const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
      adminCodes.set(email, { code, expires })
      
      return Response.json({ 
        success: true, 
        demo: true,
        code: code,
        message: `Demo Mode: Your code is ${code}. Check your console.` 
      })
    }

    // Generate a new code
    const code = generateCode()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store the code
    adminCodes.set(email, { code, expires })
    console.log("[v0] Generated code for", email, ":", code)

    // Send the email
    console.log("[v0] Sending email to:", email)
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "AI Billing System <onboarding@resend.dev>",
        to: [email],
        subject: "Your Admin Access Code - AI Billing System",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0f; color: #ffffff; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .card { background: linear-gradient(135deg, rgba(30, 30, 40, 0.9) 0%, rgba(20, 20, 30, 0.9) 100%); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 16px; padding: 40px; }
                .logo { text-align: center; margin-bottom: 30px; }
                .logo-icon { width: 60px; height: 60px; background: rgba(0, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; }
                h1 { color: #00ffff; text-align: center; margin: 0 0 10px 0; font-size: 24px; }
                .subtitle { color: #a0a0a0; text-align: center; margin-bottom: 30px; }
                .code-box { background: rgba(0, 255, 255, 0.1); border: 2px solid rgba(0, 255, 255, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
                .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00ffff; font-family: monospace; }
                .info { color: #a0a0a0; font-size: 14px; text-align: center; margin-top: 20px; }
                .warning { color: #ff6b6b; font-size: 12px; text-align: center; margin-top: 15px; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="card">
                  <div class="logo">
                    <div class="logo-icon">🛡️</div>
                  </div>
                  <h1>Admin Access Code</h1>
                  <p class="subtitle">AI Billing System</p>
                  
                  <div class="code-box">
                    <div class="code">${code}</div>
                  </div>
                  
                  <p class="info">
                    Use this code to access the admin portal.<br/>
                    This code will expire in <strong>10 minutes</strong>.
                  </p>
                  
                  <p class="warning">
                    ⚠️ If you didn't request this code, please ignore this email.
                  </p>
                  
                  <div class="footer">
                    AI Billing System &copy; 2026<br/>
                    Secure • Fast • Intelligent
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    console.log("[v0] Email API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Resend API error:", errorData)
      return Response.json({ error: `Failed to send email: ${JSON.stringify(errorData)}` }, { status: 500 })
    }

    const data = await response.json()
    console.log("[v0] Email sent successfully. Message ID:", data.id)
    return Response.json({ success: true, messageId: data.id })
  } catch (error) {
    console.error("[v0] Error sending admin code:", error)
    return Response.json({ error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 })
  }
}

// Verify code endpoint
export async function PUT(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return Response.json({ error: "Email and code are required" }, { status: 400 })
    }

    const stored = adminCodes.get(email)

    if (!stored) {
      return Response.json({ error: "No code found for this email" }, { status: 404 })
    }

    if (Date.now() > stored.expires) {
      adminCodes.delete(email)
      return Response.json({ error: "Code has expired" }, { status: 410 })
    }

    if (stored.code !== code) {
      return Response.json({ error: "Invalid code" }, { status: 401 })
    }

    // Code is valid, remove it
    adminCodes.delete(email)

    return Response.json({ success: true, verified: true })
  } catch (error) {
    console.error("Error verifying code:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
