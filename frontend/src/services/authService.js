import { buildFakeToken } from '../utils/authStorage'

// HARDCODED DEMO USERS — add your credentials here
export const DEMO_USERS = [
  {
    email: 'admin@reconengine.com',
    password: 'Admin@123',
    name: 'Ehteshamul Haque',
    role: 'admin',
    avatar: 'EH',
  },
  {
    email: 'analyst@reconengine.com',
    password: 'Analyst@123',
    name: 'Analyst User',
    role: 'analyst',
    avatar: 'AU',
  },
  {
    email: 'viewer@reconengine.com',
    password: 'Viewer@123',
    name: 'Viewer User',
    role: 'viewer',
    avatar: 'VU',
  },
]

export function getDemoUser(identifier) {
  const normalizedIdentifier = identifier.trim().toLowerCase()

  return DEMO_USERS.find((user) => user.email === normalizedIdentifier) || null
}

export async function login({ identifier, password }) {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const user = getDemoUser(identifier)

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password.')
  }

  const fakeToken = buildFakeToken(user.email)

  return {
    access_token: fakeToken,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  }
}
