import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '../components/Input'
import { Lock, Mail, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {login, isLoading, error} = useAuthStore()
  // const isLoading = false;
  const handleLogin = async(e) => {
    e.preventDefault();

    try {
      await login(email, password)
      toast.success("User login successfully.")
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h1 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>Welcome Back</h1>

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            placeholder={"Email Address"}
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            placeholder={"Password"}
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className='flex items-center mb-4'>
            <Link to={"/forgot-password"} className='text-green-400 text-sm hover:underline'>Forgot password?</Link>
          </div>
          {error && <p className='mb-2 text-red-500 text-sm'>{error}</p>}

          <motion.button className='mt-5 mb-4  w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg 
                    hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200
                    '
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
          >
            { isLoading ? <Loader2 className='w-6 h-6 animate-spin mx-auto '/> : "Login"}
          </motion.button>
        </form>
      </div>
      <div className='py-4 flex justify-center bg-gray-900 bg-opacity-50'>
        <p className='text-gray-400 text-sm '>
          Don't have an account? {""}
          <Link to={"/signup"} className='text-green-500 hover:underline'>
            Sign up</Link>
        </p>
      </div>

    </motion.div>
  )
}

export default LoginPage
