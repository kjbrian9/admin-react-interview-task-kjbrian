import { useEffect, useState } from 'react'

export type UserStatus = 'active' | 'inactive' | 'pending'
export type FilterStatus = UserStatus | 'all'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  status: UserStatus
  account: {
    balance: number
    currency: string
  }
  address: {
    street: string
    city: string
    zip: string
    country: string
  }
  updatedAt: string
}

export interface PaginatedResponse {
  items: User[]
  pagination: {
    total: number
    page: number
    pageSize: number
  }
}

const PAGE_SIZE = 50

const SERVER_URL = 'http://localhost:50000'

export async function fetchPaginatedUsers(
  page: number,
  pageSize: number,
  sortBy?: string,
  status?: UserStatus,
): Promise<PaginatedResponse> {
  return fetchPage(page, pageSize, sortBy, status)
}

async function fetchPage(
  page: number,
  pageSize: number,
  sortBy?: string,
  status?: UserStatus,
): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  if (sortBy) params.append('sortBy', sortBy)
  if (status) params.append('status', status)

  const res = await fetch(`${SERVER_URL}/users?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('Failed to fetch users')

  return res.json()
}

export async function fetchAllUsers(): Promise<User[]> {
  const firstData = await fetchPage(1, PAGE_SIZE)

  const totalItems = firstData.pagination.total
  const totalPages = Math.ceil(totalItems / PAGE_SIZE)

  let allUsers: User[] = [...firstData.items]

  console.log(
    `Total users found: ${totalItems}. Total pages to fetch: ${totalPages}.`,
  )

  for (let i = 2; i <= totalPages; i++) {
    const pageData = await fetchPage(i, PAGE_SIZE)
    allUsers = [...allUsers, ...pageData.items]
  }

  return allUsers
}

export interface UserStats {
  users: User[]
  totalCount: number
  activeCount: number
  inactiveCount: number
  pendingCount: number
  loading: boolean
  error: Error | null
}

export const useAllUsers = (): UserStats => {
  const [users, setUsers] = useState<User[]>([])

  const [totalCount, setTotalCount] = useState<number>(0)
  const [activeCount, setActiveCount] = useState<number>(0)
  const [inactiveCount, setInactiveCount] = useState<number>(0)
  const [pendingCount, setPendingCount] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const allUsers = await fetchAllUsers()
        setUsers(allUsers)
        setTotalCount(allUsers.length)
        setActiveCount(allUsers.filter((u) => u.status === 'active').length)
        setInactiveCount(allUsers.filter((u) => u.status === 'inactive').length)
        setPendingCount(allUsers.filter((u) => u.status === 'pending').length)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return {
    users,
    totalCount,
    activeCount,
    inactiveCount,
    pendingCount,
    loading,
    error,
  }
}
