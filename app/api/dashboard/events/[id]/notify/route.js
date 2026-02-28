import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Event from '@/lib/models/Event'
import Alumni from '@/lib/models/Alumni'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

// Create email transporter
function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || 
      process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log('⚠️  SMTP not configured - emails will be simulated')
    return null
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Generate personalized email content
function generateEmailContent(alumni, event) {
  const firstName = alumni.name.split(' ')[0]
  const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const subject = `🎓 ${firstName}, Join Us for ${event.title} at GJTS ${alumni.school}!`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .event-card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .event-title { color: #0ea5e9; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .event-detail { margin: 10px 0; padding: 10px; background: #f0f9ff; border-left: 4px solid #0ea5e9; }
    .cta-button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 GJTS ${alumni.school}</h1>
      <p>Government Junior Technical School</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #0369a1;"><strong>Dear ${firstName},</strong></p>
      
      <p>We're excited to invite you to an upcoming event at your alma mater, GJTS ${alumni.school}!</p>
      
      <div class="event-card">
        <div class="event-title">${event.title}</div>
        <p>${event.description}</p>
        
        <div class="event-detail">
          <strong>📅 Date:</strong> ${eventDate}
        </div>
        
        <div class="event-detail">
          <strong>🕐 Time:</strong> ${event.time}
        </div>
        
        <div class="event-detail">
          <strong>📍 Venue:</strong> ${event.venue}
        </div>
        
        <div class="event-detail">
          <strong>🎯 Event Type:</strong> ${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1).replace('-', ' ')}
        </div>
        
        ${event.registrationRequired ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>⚠️ Registration Required</strong>
            ${event.maxParticipants ? `<br>Limited to ${event.maxParticipants} participants` : ''}
          </div>
        ` : ''}
      </div>
      
      ${event.registrationLink ? `
        <center>
          <a href="${event.registrationLink}" class="cta-button">Register Now</a>
        </center>
      ` : ''}
      
      <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin-top: 0;">Why Attend?</h3>
        <ul>
          <li>Reconnect with your alma mater</li>
          <li>Network with fellow alumni</li>
          <li>Share your experiences with current students</li>
          <li>Stay updated with school developments</li>
        </ul>
      </div>
      
      <p>We look forward to seeing you at the event!</p>
      
      <p style="margin-top: 30px;">
        Warm regards,<br>
        <strong>GJTS ${alumni.school} Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>This email was sent to ${alumni.email} because you're a registered alumnus of GJTS ${alumni.school}.</p>
      <p>Government Junior Technical Schools Karnataka | Empowering 800+ Students</p>
    </div>
  </div>
</body>
</html>
  `

  return { subject, html }
}

// Send emails to alumni
async function sendEventEmails(event, alumni, transporter) {
  const results = {
    total: alumni.length,
    sent: 0,
    failed: 0,
    details: []
  }

  // If no transporter (SMTP not configured), simulate
  if (!transporter) {
    console.log(`📧 Sending emails for event: ${event.title}`)
    console.log(`📧 Recipients: ${alumni.length} alumni`)
    console.log(`⚠️  SMTP not configured - simulating email sends`)
    
    alumni.forEach(alumnus => {
      console.log(`✅ Email simulated to: ${alumnus.name} (${alumnus.email})`)
      results.details.push({
        success: true,
        recipient: alumnus.email,
        messageId: `simulated-${Date.now()}-${Math.random()}`,
        simulated: true
      })
    })
    
    results.sent = alumni.length
    return results
  }

  // Send real emails
  console.log(`📧 Sending REAL emails for event: ${event.title}`)
  console.log(`📧 Recipients: ${alumni.length} alumni`)

  for (const alumnus of alumni) {
    try {
      const { subject, html } = generateEmailContent(alumnus, event)

      const mailOptions = {
        from: `"GJTS ${event.school}" <${process.env.SMTP_USER}>`,
        to: alumnus.email,
        subject: subject,
        html: html
      }

      const info = await transporter.sendMail(mailOptions)
      
      console.log(`✅ Email sent to: ${alumnus.name} (${alumnus.email}) - ID: ${info.messageId}`)
      
      results.details.push({
        success: true,
        recipient: alumnus.email,
        messageId: info.messageId,
        simulated: false
      })
      
      results.sent++

      // Rate limiting: Wait 100ms between emails to avoid spam filters
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`❌ Failed to send email to ${alumnus.email}:`, error.message)
      
      results.details.push({
        success: false,
        recipient: alumnus.email,
        error: error.message,
        simulated: false
      })
      
      results.failed++
    }
  }

  return results
}

export async function POST(request, { params }) {
  try {
    await dbConnect()

    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET)
    
    const { id } = params

    // Get event
    const event = await Event.findById(id)
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.emailSent) {
      return NextResponse.json({ 
        message: 'Emails already sent for this event',
        alreadySent: true 
      })
    }

    // Get alumni for this school
    const alumni = await Alumni.find({ 
      school: event.school
    })

    console.log(`Found ${alumni.length} alumni for ${event.school}`)

    if (alumni.length === 0) {
      return NextResponse.json({ 
        message: 'No alumni found for this school',
        sent: 0 
      })
    }

    // Create transporter
    const transporter = createTransporter()

    // Send emails
    const results = await sendEventEmails(event, alumni, transporter)

    // Update event
    event.emailSent = true
    event.emailSentAt = new Date()
    event.recipientCount = results.sent
    await event.save()

    const message = transporter 
      ? `✅ Real emails sent to ${results.sent} alumni (${results.failed} failed)`
      : `⚠️  Emails simulated for ${results.sent} alumni (SMTP not configured)`

    console.log(message)

    return NextResponse.json({ 
      success: true,
      message,
      results,
      smtpConfigured: !!transporter
    })
  } catch (error) {
    console.error('Error sending event notifications:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications', details: error.message },
      { status: 500 }
    )
  }
}
