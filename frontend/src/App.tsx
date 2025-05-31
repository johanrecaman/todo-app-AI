import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Header.tsx'
import ChatBot from './ChatBot.tsx'
import ReminderList from './ReminderList.tsx'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ChatBot />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/reminders" element={<ReminderList />} />
      </Routes>
    </Router>
  )
}

export default App
