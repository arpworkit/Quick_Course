import './globals.css'

export const metadata = {
  title: 'Quick Course',
  description: 'A comprehensive learning management system designed for students, instructors, and administrators.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
