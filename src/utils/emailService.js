import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export async function sendCardByEmail({ toEmail, senderName, recipientName, cardUrl }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS non configuré. Veuillez renseigner les variables VITE_EMAILJS_* dans votre fichier .env')
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: toEmail,
      sender_name: senderName,
      recipient_name: recipientName || 'Maman',
      card_url: cardUrl,
      reply_to: toEmail,
    },
    { publicKey: PUBLIC_KEY }
  )
}

export function isEmailJsConfigured() {
  return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)
}
