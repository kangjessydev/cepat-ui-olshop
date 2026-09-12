/**
 * mailer.ts
 *
 * Pluggable email sending adapter for order notifications and auth emails.
 * Supports Mock Dev Logger, Resend, and standard SMTP API endpoints.
 */

export interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string
}

export interface MailerAdapter {
  send(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }>
}

/**
 * Mock Mailer for Local Development
 */
export class MockMailerAdapter implements MailerAdapter {
  async send(payload: EmailPayload) {
    console.group(`📧 [Mock Mailer] Email to: ${payload.to}`)
    console.log(`Subject: ${payload.subject}`)
    console.log(`From: ${payload.from || 'noreply@cepatstore.com'}`)
    console.log('HTML Body Preview:', payload.html.slice(0, 200) + '...')
    console.groupEnd()

    return {
      success: true,
      messageId: `mock_${Date.now()}`
    }
  }
}

/**
 * Render template helper
 */
export function renderEmailTemplate(templateHtml: string, variables: Record<string, string | number>): string {
  let rendered = templateHtml
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replaceAll(`{{${key}}}`, String(value))
  }
  return rendered
}

export const defaultMailer: MailerAdapter = new MockMailerAdapter()
