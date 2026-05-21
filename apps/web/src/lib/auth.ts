import api from './api'
import { useAuthStore } from '../store/useAuthStore'
import type { User } from '@volks/types'

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password })
  if (res.data.success && res.data.data.token) {
    useAuthStore.getState().setAuth(res.data.data.token, res.data.data.user)
  }
  return res.data
}

export async function register(data: {
  email: string
  password: string
  name: string
  referralCode?: string
}) {
  const res = await api.post('/auth/register', data)
  if (res.data.success && res.data.data.token) {
    useAuthStore.getState().setAuth(res.data.data.token, res.data.data.user)
  }
  return res.data
}

export async function sendOtp(target: string, type: string) {
  const res = await api.post('/auth/send-otp', { target, type })
  return res.data
}

export async function verifyOtp(target: string, code: string, type: string) {
  const res = await api.post('/auth/verify-otp', { target, code, type })
  return res.data
}

export async function verifyLoginOtp(email: string, code: string) {
  const res = await api.post('/auth/verify-login-otp', { email, code })
  if (res.data.success) {
    useAuthStore.getState().setAuth(res.data.data.token, res.data.data.user)
  }
  return res.data
}

export async function forgotPassword(email: string) {
  const res = await api.post('/auth/forgot-password', { email })
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me')
  return res.data.data
}

export async function logout() {
  await api.post('/auth/logout')
  useAuthStore.getState().logout()
}
