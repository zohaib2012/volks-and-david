import api from './api'
import { useAuthStore } from '../store/useAuthStore'
import type { User } from '@volks/types'

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password })
  if (res.data.success) {
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
  if (res.data.success) {
    useAuthStore.getState().setAuth(res.data.data.token, res.data.data.user)
  }
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
