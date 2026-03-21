import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import HowItWorks from './sections/HowItWorks'

const Home = () => (
  <>
    <Hero />
    <Features />
    <HowItWorks />
  </>
)

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-bg min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App