"use server"

import { supabase } from "@/lib/supabase"

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

      await fetch("https://hooks.slack.com/services/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", {
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
        "https://hooks.slack.com/services/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",
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
    // Extract form data
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      company_name: formData.get("company") as string,
      staff_count: Number.parseInt(formData.get("staffCount") as string),
      message: (formData.get("message") as string) || null,
      status: "new",
    }

    // Validate required fields
    if (!data.name || !data.email || !data.company_name || !data.staff_count) {
      throw new Error("Required fields are missing")
    }

    console.log("Submitting enterprise contact form:", {
      ...data,
      email: "[REDACTED]",
      phone: "[REDACTED]",
      message: data.message ? "[TRUNCATED]" : null,
    })

    // Insert data into the enterprise_contact_submissions table
    const { error } = await supabase.from("enterprise_contact_submissions").insert([data])

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
    return { success: true }
  } catch (error) {
    console.error("Enterprise contact form submission failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit enterprise contact form. Please try again.",
    }
  }
}
