export interface User {
  _id: string
  name: string
  email: string
}

export interface TooltipProps {
  active?: boolean
  payload?: { color: string; name: string; value: number }[]
  label?: string
}

export interface AuthResponse {
  _id: string
  name: string
  email: string
}