import { useState } from 'react'
import Admin from './components/Admin.jsx'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Admin/>
    </>
  )
}

export default App
