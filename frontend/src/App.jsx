import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'


import HomePage from './pages/HomePage'
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import EmailVerification from './pages/EmailVerification'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import LoadingSpinner from './components/LoadingSpinner'
import FloatingShape from './components/FloatingShape'


import { useAuthStore } from './store/authStore'


//Protect routes that requires authentication

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return children;
}


//Protecting the verify-email route:
const ProtectVerify = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children;
}

//Redirect authenticated user to home page:
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />
  }

  return children;
}


function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  if (isCheckingAuth) return <LoadingSpinner />


  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0}></FloatingShape>
      <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5}></FloatingShape>
      <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2}></FloatingShape>

      {/* Routes */}
      <Routes>
        <Route path='/' element={<ProtectedRoute>
          <HomePage />
        </ProtectedRoute>} />

        <Route path='/signup' element={<RedirectAuthenticatedUser>
          <SignupPage />
        </RedirectAuthenticatedUser>} />

        {/* <Route path='/login' element={<LoginPage/>} /> */}
        <Route path='/login' element={<RedirectAuthenticatedUser>
          <LoginPage />
        </RedirectAuthenticatedUser>} />

        <Route path='/verify-email' element={<ProtectVerify>
          <EmailVerification />
        </ProtectVerify>} />
        {/* <Route path='/verify-email' element={<EmailVerification />} /> */}

        <Route path='/forgot-password' element={<RedirectAuthenticatedUser>
          <ForgotPasswordPage />
        </RedirectAuthenticatedUser>} />
        <Route path='/reset-password/:token' element={<RedirectAuthenticatedUser>
          <ResetPasswordPage />
        </RedirectAuthenticatedUser>} />

        {/* Catch all routes */}
        <Route path='*' element={<Navigate to='/' replace/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App