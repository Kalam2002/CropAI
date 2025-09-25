'use server';
/**
 * @fileOverview Sends an email from the contact form.
 *
 * - sendContactEmail - A function that handles sending the email.
 * - SendContactEmailInput - The input type for the sendContactEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

const SendContactEmailInputSchema = z.object({
  name: z.string().describe('Name of the person sending the message.'),
  email: z.string().email().describe('Email of the person sending the message.'),
  subject: z.string().describe('Subject of the message.'),
  message: z.string().describe('The message content.'),
});
export type SendContactEmailInput = z.infer<typeof SendContactEmailInputSchema>;

export async function sendContactEmail(input: SendContactEmailInput): Promise<{ success: boolean; error?: string }> {
  return sendContactEmailFlow(input);
}

const sendContactEmailFlow = ai.defineFlow(
  {
    name: 'sendContactEmailFlow',
    inputSchema: SendContactEmailInputSchema,
    outputSchema: z.object({ success: z.boolean(), error: z.string().optional() }),
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const sendToEmail = process.env.CONTACT_FORM_SEND_TO_EMAIL;

    if (!resendApiKey) {
      console.error('Resend API key is not configured.');
      return { success: false, error: 'The server is not configured to send emails. Please contact support.' };
    }
    if (!sendToEmail) {
        console.error('CONTACT_FORM_SEND_TO_EMAIL is not configured.');
        return { success: false, error: 'The server is not configured to send emails. Please contact support.' };
    }

    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: 'KrishiMitra Contact Form <onboarding@resend.dev>',
        to: sendToEmail,
        subject: `New Contact Form Submission: ${input.subject}`,
        reply_to: input.email,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <hr />
          <h2>Message:</h2>
          <p>${input.message}</p>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: 'An unexpected error occurred while trying to send the message.' };
    }
  }
);
