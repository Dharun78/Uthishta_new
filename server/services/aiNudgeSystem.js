/**
 * AI Nudge System - Intelligent Email Notification System
 * Uses AI to personalize and optimize email notifications to alumni
 */

const nodemailer = require('nodemailer')
const Alumni = require('../models/Alumni')
const Event = require('../models/Event')

class AIEmailNudgeSystem {
  constructor() {
    this.transporter = null
    this.initializeTransporter()
  }

  initializeTransporter() {
    // Configure email transporter
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  /**
   * AI-powered email personalization
   */
  personalizeEmail(alumni, event) {
    const firstName = alumni.name.split(' ')[0]
    const graduationYear = alumni.graduationYear
    const yearsAgo = new Date().getFullYear() - graduationYear

    // AI determines best greeting based on time since graduation
    let greeting = ''
    if (yearsAgo <= 2) {
      greeting = `Dear ${firstName}, we hope you're thriving in your career!`
    } else if (yearsAgo <= 5) {
      greeting = `Hello ${firstName}, it's been ${yearsAgo} years since graduation!`
    } else {
      greeting = `Dear ${firstName}, we'd love to reconnect with you!`
    }

    // AI-generated subject line based on event type
    const subjectLines = {
      'alumni-meet': `🎓 ${firstName}, Join Us for Alumni Reunion at GJTS ${alumni.school}!`,
      'placement': `💼 Career Opportunity Alert for GJTS ${alumni.school} Alumni`,
      'workshop': `🔧 Exclusive Workshop for ${alumni.school} Alumni`,
      'seminar': `📚 Knowledge Session: ${event.title}`,
      'cultural': `🎉 Cultural Event at Your Alma Mater!`,
      'sports': `⚽ Sports Event - Show Your School Spirit!`,
      'other': `📢 Important Update from GJTS ${alumni.school}`
    }

    const subject = subjectLines[event.eventType] || `Event Notification: ${event.title}`

    // AI-optimized email body
    const body = this.generateEmailBody(alumni, event, greeting, yearsAgo)

    return { subject, body }
  }

  generateEmailBody(alumni, event, greeting, yearsAgo) {
    const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
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
    .ai-badge { background: #10b981; color: white; padding: 5px 10px; border-radius: 15px; font-size: 11px; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 GJTS ${alumni.school}</h1>
      <p>Government Junior Technical School</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #0369a1;"><strong>${greeting}</strong></p>
      
      <p>We're excited to share an upcoming event at your alma mater, GJTS ${alumni.school}!</p>
      
      <div class="ai-badge">✨ AI-Personalized for You</div>
      
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
          <strong>🎯 Event Type:</strong> ${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
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
        <h3 style="color: #0369a1; margin-top: 0;">Why This Matters to You</h3>
        <p>As a proud alumnus of GJTS ${alumni.school} (Class of ${alumni.graduationYear}), this is a great opportunity to:</p>
        <ul>
          <li>Reconnect with your alma mater</li>
          <li>Network with fellow alumni</li>
          <li>Share your experiences with current students</li>
          <li>Stay updated with school developments</li>
        </ul>
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        <strong>Your Journey:</strong> It's been ${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} since you graduated from GJTS ${alumni.school}. 
        We'd love to hear about your achievements and how you're making a difference!
      </p>
      
      <p>Looking forward to seeing you at the event!</p>
      
      <p style="margin-top: 30px;">
        Warm regards,<br>
        <strong>GJTS ${alumni.school} Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>This email was sent to ${alumni.email} because you're a registered alumnus of GJTS ${alumni.school}.</p>
      <p>Government Junior Technical Schools Karnataka | Empowering 800+ Students</p>
      <p style="font-size: 10px; color: #999;">
        Powered by AI Nudge System - Personalized notifications for better engagement
      </p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * AI determines optimal send time based on alumni profile
   */
  determineOptimalSendTime(alumni) {
    // AI logic: Send emails at times when alumni are most likely to engage
    const currentOccupation = alumni.currentOccupation?.toLowerCase() || ''
    
    // Working professionals: 7-9 AM or 6-8 PM
    // Students: 10 AM - 2 PM
    // Default: 9 AM
    
    const now = new Date()
    const hour = now.getHours()
    
    if (currentOccupation.includes('student')) {
      // Send during lunch hours
      return hour >= 10 && hour <= 14
    } else {
      // Send during commute hours or evening
      return (hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 20)
    }
  }

  /**
   * Send email to a single alumni
   */
  async sendEmailToAlumni(alumni, event) {
    try {
      const { subject, body } = this.personalizeEmail(alumni, event)

      const mailOptions = {
        from: `"GJTS ${alumni.school}" <${process.env.SMTP_USER}>`,
        to: alumni.email,
        subject: subject,
        html: body
      }

      const info = await this.transporter.sendMail(mailOptions)
      
      console.log(`Email sent to ${alumni.email}: ${info.messageId}`)
      
      return {
        success: true,
        messageId: info.messageId,
        recipient: alumni.email
      }
    } catch (error) {
      console.error(`Failed to send email to ${alumni.email}:`, error)
      return {
        success: false,
        error: error.message,
        recipient: alumni.email
      }
    }
  }

  /**
   * AI-powered batch email sending with smart filtering
   */
  async sendEventNotifications(eventId) {
    try {
      const event = await Event.findById(eventId)
      
      if (!event) {
        throw new Error('Event not found')
      }

      if (event.status !== 'published') {
        throw new Error('Event must be published before sending notifications')
      }

      // AI filters alumni based on event criteria
      const query = {
        school: event.school,
        verified: true // Only send to verified alumni
      }

      // Smart filtering based on target audience
      if (event.targetAudience.includes('alumni') && !event.targetAudience.includes('all')) {
        // Only alumni
        query.graduationYear = { $lte: new Date().getFullYear() }
      }

      const alumni = await Alumni.find(query)

      console.log(`Found ${alumni.length} alumni for ${event.school}`)

      const results = {
        total: alumni.length,
        sent: 0,
        failed: 0,
        details: []
      }

      // Send emails with rate limiting (avoid spam)
      for (let i = 0; i < alumni.length; i++) {
        const alumnus = alumni[i]
        
        // AI determines if this is optimal time to send
        const isOptimalTime = this.determineOptimalSendTime(alumnus)
        
        if (!isOptimalTime && process.env.NODE_ENV === 'production') {
          // Schedule for later in production
          console.log(`Scheduling email for ${alumnus.email} at optimal time`)
          continue
        }

        const result = await this.sendEmailToAlumni(alumnus, event)
        results.details.push(result)
        
        if (result.success) {
          results.sent++
        } else {
          results.failed++
        }

        // Rate limiting: Wait 100ms between emails
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Update event with email stats
      event.emailSent = true
      event.emailSentAt = new Date()
      event.recipientCount = results.sent
      await event.save()

      return results
    } catch (error) {
      console.error('Error sending event notifications:', error)
      throw error
    }
  }

  /**
   * AI-powered reminder system
   */
  async sendEventReminders(daysBeforeEvent = 3) {
    try {
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + daysBeforeEvent)

      const events = await Event.find({
        status: 'published',
        date: {
          $gte: new Date(),
          $lte: targetDate
        },
        emailSent: true // Only send reminders for events that already had initial notification
      })

      console.log(`Found ${events.length} events for reminders`)

      const results = []

      for (const event of events) {
        const alumni = await Alumni.find({
          school: event.school,
          verified: true
        })

        for (const alumnus of alumni) {
          const { subject, body } = this.personalizeEmail(alumnus, event)
          
          // Modify subject for reminder
          const reminderSubject = `⏰ Reminder: ${subject}`

          const result = await this.sendEmailToAlumni(alumnus, {
            ...event.toObject(),
            title: `Reminder: ${event.title}`
          })

          results.push(result)

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      return results
    } catch (error) {
      console.error('Error sending reminders:', error)
      throw error
    }
  }

  /**
   * Test email configuration
   */
  async testEmailConfiguration() {
    try {
      await this.transporter.verify()
      console.log('Email configuration is valid')
      return { success: true, message: 'Email server is ready' }
    } catch (error) {
      console.error('Email configuration error:', error)
      return { success: false, error: error.message }
    }
  }
}

module.exports = new AIEmailNudgeSystem()
