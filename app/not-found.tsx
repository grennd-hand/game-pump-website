import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-retro text-retro-green mb-4">404</h1>
        <h2 className="text-2xl font-retro text-retro-cyan mb-8">Page Not Found</h2>
        <p className="text-gray-400 font-pixel mb-8">
          The page you are looking for does not exist.
        </p>
        <Link 
          href="/"
          className="neon-button text-retro-green border-retro-green px-8 py-4 text-lg"
        >
          🏠 Back to Home
        </Link>
      </div>
    </div>
  )
} 