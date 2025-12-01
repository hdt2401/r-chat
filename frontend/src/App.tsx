import { BrowserRouter, Route, Routes } from 'react-router'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/auth/protectedRoute'

function App() {

  return (
    <>
      <Toaster position='top-right' />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="*" element={<div>Not Found</div>} /> */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
