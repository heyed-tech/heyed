"use server"

import { getSupabase } from "@/lib/supabase"

export async function registerInterest(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      company_name: formData.get("company") as string, // Changed from company_nam to company_name
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
    }

    // Validate required fields
    if (!data.name || !data.company_name || !data.email) {
      // Changed from company_nam to company_name
      throw new Error("Required fields are missing")
    }

    console.log("Attempting to insert data:", {
      ...data,
      email: "[REDACTED]",
      phone: "[REDACTED]",
    })

    const supabase = getSupabase()
    const { error, data: result } = await supabase.from("registered_interest").insert([data])

    if (error) {
      console.error("Insert error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }

    console.log("Successfully inserted data:", result)

    // Send Slack notification
    try {
      if (!process.env.SLACK_WEBHOOK_URL) {
        console.warn("SLACK_WEBHOOK_URL not configured, skipping Slack notification")
        return { success: true, data: result }
      }

      const slackMessage = {
        text: "🎉 New Registration Interest!",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🎉 New Registration Interest!",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Name:*\n${data.name}`,
              },
              {
                type: "mrkdwn",
                text: `*Company:*\n${data.company_name}`,
              },
              {
                type: "mrkdwn",
                text: `*Email:*\n${data.email}`,
              },
              {
                type: "mrkdwn",
                text: `*Phone:*\n${data.phone || "Not provided"}`,
              },
            ],
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Submitted at ${new Date().toLocaleString()}`,
              },
            ],
          },
        ],
      }

      await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slackMessage),
      })

      console.log("Slack notification sent successfully")
    } catch (slackError) {
      console.error("Failed to send Slack notification:", slackError)
      // Don't throw error here - we don't want Slack failures to break the registration
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Full error details:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register interest. Please try again.",
    }
  }
}

export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      reason: formData.get("reason") as string,
      message: formData.get("message") as string,
      status: "new",
    }

    // Validate required fields
    if (!data.name || !data.email || !data.reason || !data.message) {
      throw new Error("Required fields are missing")
    }

    console.log("Submitting contact form:", {
      ...data,
      email: "[REDACTED]",
      phone: "[REDACTED]",
      message: "[TRUNCATED]",
    })

    // Insert data into the contact_submissions table
    const supabase = getSupabase()
    const { error } = await supabase.from("contact_submissions").insert([data])

    if (error) {
      console.error("Contact form submission error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }

    console.log("Contact form submitted successfully")

    // Send Slack notification
    try {
      if (!process.env.SLACK_WEBHOOK_URL) {
        console.warn("SLACK_WEBHOOK_URL not configured, skipping Slack notification")
        return { success: true }
      }

      // Truncate message if too long and escape special characters
      const truncatedMessage = data.message.length > 500 ? data.message.substring(0, 500) + "..." : data.message

      // Escape special characters that might break JSON
      const safeMessage = truncatedMessage.replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r")

      const slackMessage = {
        text: "📞 New Contact Form Submission!",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "📞 New Contact Form Submission!",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Name:*\n${data.name}`,
              },
              {
                type: "mrkdwn",
                text: `*Email:*\n${data.email}`,
              },
              {
                type: "mrkdwn",
                text: `*Phone:*\n${data.phone || "Not provided"}`,
              },
              {
                type: "mrkdwn",
                text: `*Reason:*\n${data.reason}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Message:*\n${safeMessage}`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Submitted at ${new Date().toLocaleString()}`,
              },
            ],
          },
        ],
      }

      const response = await fetch(
        process.env.SLACK_WEBHOOK_URL!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(slackMessage),
        },
      )

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status} ${response.statusText}`)
      }

      console.log("Contact form Slack notification sent successfully")
    } catch (slackError) {
      console.error("Failed to send contact form Slack notification:", slackError)
      // Don't throw error here - we don't want Slack failures to break the contact form
    }

    return { success: true }
  } catch (error) {
    console.error("Contact form submission failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit contact form. Please try again.",
    }
  }
}

export async function submitEnterpriseContact(formData: FormData) {
  try {
    // Extract form data - use contact_submissions table with enterprise-specific reason
    const company = formData.get("company") as string
    const staffCount = formData.get("staffCount") as string
    const enterpriseMessage = formData.get("message") as string
    
    // Combine enterprise-specific info into a single message
    const combinedMessage = `Enterprise Inquiry from ${company} (${staffCount} staff)${enterpriseMessage ? `\n\nMessage: ${enterpriseMessage}` : ''}`
    
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      reason: "Enterprise Plan", // Fixed reason for enterprise contacts
      message: combinedMessage,
      status: "new",
    }

    // Validate required fields
    if (!data.name || !data.email || !company || !staffCount) {
      throw new Error("Required fields are missing")
    }

    console.log("Submitting enterprise contact form:", {
      ...data,
      email: "[REDACTED]",
      phone: "[REDACTED]",
      message: "[TRUNCATED]",
    })

    // Insert data into the contact_submissions table (same as regular contact form)
    const supabase = getSupabase()
    const { error } = await supabase.from("contact_submissions").insert([data])

    if (error) {
      console.error("Enterprise contact form submission error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }

    console.log("Enterprise contact form submitted successfully")

    // Send Slack notification
    try {
      if (!process.env.SLACK_WEBHOOK_URL) {
        console.warn("SLACK_WEBHOOK_URL not configured, skipping Slack notification")
        return { success: true }
      }

      // Extract company and staff count from the combined message for display
      const companyName = company
      const staffCountNum = staffCount

      // Truncate message if too long and escape special characters
      const truncatedMessage = combinedMessage.length > 500 ? combinedMessage.substring(0, 500) + "..." : combinedMessage

      // Escape special characters that might break JSON
      const safeMessage = truncatedMessage.replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r")

      const slackMessage = {
        text: "🏢 New Enterprise Contact Submission!",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🏢 New Enterprise Contact Submission!",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Name:*\n${data.name}`,
              },
              {
                type: "mrkdwn",
                text: `*Email:*\n${data.email}`,
              },
              {
                type: "mrkdwn",
                text: `*Phone:*\n${data.phone || "Not provided"}`,
              },
              {
                type: "mrkdwn",
                text: `*Company:*\n${companyName}`,
              },
              {
                type: "mrkdwn",
                text: `*Staff Count:*\n${staffCountNum}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Message:*\n${safeMessage}`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Submitted at ${new Date().toLocaleString()}`,
              },
            ],
          },
        ],
      }

      const response = await fetch(
        process.env.SLACK_WEBHOOK_URL!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(slackMessage),
        },
      )

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status} ${response.statusText}`)
      }

      console.log("Enterprise contact Slack notification sent successfully")
    } catch (slackError) {
      console.error("Failed to send enterprise contact Slack notification:", slackError)
      // Don't throw error here - we don't want Slack failures to break the contact form
    }

    return { success: true }
  } catch (error) {
    console.error("Enterprise contact form submission failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit enterprise contact form. Please try again.",
    }
  }
}

export async function registerPDFDownload(formData: FormData) {
  try {
    const data = {
      email: formData.get("email") as string,
      name: (formData.get("name") as string) || null,
      company: (formData.get("company") as string) || null,
      role: (formData.get("role") as string) || null,
      pdf_name: "EYFS Safeguarding Changes 2025", // You can make this dynamic if you have multiple PDFs
    }

    // Validate required fields
    if (!data.email) {
      throw new Error("Email is required")
    }

    console.log("Recording PDF download:", {
      ...data,
      email: "[REDACTED]",
    })

    // Insert data into the pdf_downloads table
    const supabase = getSupabase()
    const { error } = await supabase.from("pdf_downloads").insert([data])

    if (error) {
      console.error("PDF download registration error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }

    console.log("PDF download registered successfully")

    // Send Slack notification
    try {
      if (!process.env.SLACK_WEBHOOK_URL) {
        console.warn("SLACK_WEBHOOK_URL not configured, skipping Slack notification")
      } else {
        const slackMessage = {
          text: "📄 New PDF Download!",
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "📄 New PDF Download!",
              },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Email:*\n${data.email}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Name:*\n${data.name || "Not provided"}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Company:*\n${data.company || "Not provided"}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Role:*\n${data.role || "Not provided"}`,
                },
                {
                  type: "mrkdwn",
                  text: `*PDF:*\n${data.pdf_name}`,
                },
              ],
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `Downloaded at ${new Date().toLocaleString()}`,
                },
              ],
            },
          ],
        }

        const response = await fetch(
          process.env.SLACK_WEBHOOK_URL!,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(slackMessage),
          },
        )

        if (!response.ok) {
          throw new Error(`Slack API error: ${response.status} ${response.statusText}`)
        }

        console.log("PDF download Slack notification sent successfully")
      }
    } catch (slackError) {
      console.error("Failed to send PDF download Slack notification:", slackError)
      // Don't throw error here - we don't want Slack failures to break the download
    }

    // Return the PDF URL from your public-assets bucket
    // Properly encode the filename for URL
    const filename = encodeURIComponent("HeyEd. - EYFS Safeguarding Changes 2025.pdf")
    const pdfUrl = `https://oxabxfydvltdhxekaqym.supabase.co/storage/v1/object/public/public-assets/${filename}`

    return { success: true, pdfUrl }
  } catch (error) {
    console.error("PDF download registration failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process download request. Please try again.",
    }
  }
}
