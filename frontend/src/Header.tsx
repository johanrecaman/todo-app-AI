import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/chatbot') {
      return location.pathname === '/' || location.pathname === '/chatbot'
    }
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <nav className="flex space-x-1">
          <Link
            to="/chatbot"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive('/chatbot')
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Chat Bot
          </Link>
          <Link
            to="/reminders"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive('/reminders')
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Lembretes
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
