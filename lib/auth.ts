// Simple authentication utility using localStorage
export interface User {
  username: string
  loggedIn: boolean
  isAdmin?: boolean
}

const ADMIN_ACCOUNT = {
  username: "Cacto",
  password: "Almafa123%",
}

export function login(username: string, password: string): boolean {
  console.log("[v0] Login attempt for:", username)

  if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
    const user: User = { username, loggedIn: true, isAdmin: true }
    localStorage.setItem("auth_user", JSON.stringify(user))
    console.log("[v0] Admin login successful")
    return true
  }

  // Check if user exists in localStorage
  const storedPassword = localStorage.getItem(`user_${username}`)
  console.log("[v0] Stored password exists:", !!storedPassword)

  if (storedPassword && storedPassword === password) {
    const user: User = { username, loggedIn: true, isAdmin: false }
    localStorage.setItem("auth_user", JSON.stringify(user))
    console.log("[v0] Login successful")
    return true
  }

  console.log("[v0] Login failed - invalid credentials")
  return false
}

export function signup(username: string, password: string, confirmPassword: string): boolean {
  console.log("[v0] Signup attempt for:", username)

  if (password !== confirmPassword) {
    console.log("[v0] Signup failed - passwords don't match")
    return false
  }

  if (username.length < 3 || password.length < 6) {
    console.log("[v0] Signup failed - validation error")
    return false
  }

  // Check if user already exists
  const existingUser = localStorage.getItem(`user_${username}`)
  if (existingUser) {
    console.log("[v0] Signup failed - user already exists")
    return false
  }

  // Store user credentials (in production, this would be server-side)
  localStorage.setItem(`user_${username}`, password)
  console.log("[v0] User credentials stored")

  // Auto login after signup
  const user: User = { username, loggedIn: true, isAdmin: false }
  localStorage.setItem("auth_user", JSON.stringify(user))
  console.log("[v0] Auto-login successful after signup")
  return true
}

export function logout(): void {
  localStorage.removeItem("auth_user")
  console.log("[v0] User logged out")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("auth_user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser()?.loggedIn === true
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.isAdmin === true
}

export function getAllUsers(): Array<{ username: string; isAdmin: boolean }> {
  const users: Array<{ username: string; isAdmin: boolean }> = []

  // Add the hardcoded admin
  users.push({ username: ADMIN_ACCOUNT.username, isAdmin: true })

  // Get all user keys from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("user_") && key !== "user_meta") {
      const username = key.replace("user_", "")

      // Check if user has admin privileges
      const metaStr = localStorage.getItem(`user_meta_${username}`)
      let isUserAdmin = false
      if (metaStr) {
        try {
          const meta = JSON.parse(metaStr)
          isUserAdmin = meta.isAdmin === true
        } catch {
          // Ignore parse errors
        }
      }

      users.push({ username, isAdmin: isUserAdmin })
    }
  }

  return users
}

export function deleteUser(username: string): boolean {
  // Prevent deleting the hardcoded admin
  if (username === ADMIN_ACCOUNT.username) {
    return false
  }

  localStorage.removeItem(`user_${username}`)
  localStorage.removeItem(`user_meta_${username}`)
  return true
}

export function makeAdmin(username: string): boolean {
  // Check if user exists
  const userPassword = localStorage.getItem(`user_${username}`)
  if (!userPassword) {
    return false
  }

  // Store admin status in metadata
  const meta = { isAdmin: true }
  localStorage.setItem(`user_meta_${username}`, JSON.stringify(meta))

  // Update current user if it's the same person
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.username === username) {
    currentUser.isAdmin = true
    localStorage.setItem("auth_user", JSON.stringify(currentUser))
  }

  return true
}
