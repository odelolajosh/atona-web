import { Routes, Route } from 'react-router-dom'
import { MissionHome } from './home'

const Mission = () => {
  return (
    <Routes>
      <Route path="new" index element={<h1>New Mission</h1>} />
    </Routes>
  )
}

export {
  Mission,
  MissionHome
}