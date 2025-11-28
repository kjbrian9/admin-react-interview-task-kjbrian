import { useEffect, useState } from 'react'

const PAGE_SIZE = 50

async function fetchAllUsers() {
  const firstPageParams = new URLSearchParams({
    page: '1',
    pageSize: `${PAGE_SIZE}`,
  })

  const firstRes = await fetch(
    'http://localhost:50000/users?' + firstPageParams.toString(),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!firstRes.ok) {
    throw new Error('Failed to fetch the first page of users')
  }

  const firstData = await firstRes.json()

  const totalItems = firstData.pagination.total
  const totalPages = Math.ceil(totalItems / PAGE_SIZE)

  let allUsers: any[] = [...firstData.items]

  console.log(
    `Total users found: ${totalItems}. Total pages to fetch: ${totalPages}.`,
  )

  for (let i = 2; i <= totalPages; i++) {
    const pageParams = new URLSearchParams({
      page: `${i}`,
      pageSize: `${PAGE_SIZE}`,
    })

    const pageRes = await fetch(
      'http://localhost:50000/users?' + pageParams.toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!pageRes.ok) {
      console.error(`Failed to fetch page ${i}`)
      continue
    }

    const pageData = await pageRes.json()
    allUsers = [...allUsers, ...pageData.items]
  }

  return allUsers
}

const useUserStats = () => {
  const [totalCount, setTotalCount] = useState<number>(0)
  const [activeCount, setActiveCount] = useState<number>(0)
  const [inactiveCount, setInactiveCount] = useState<number>(0)
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const allUsers = await fetchAllUsers()
        setUsers(allUsers)
        setTotalCount(allUsers.length)
        setActiveCount(
          allUsers.filter((u: any) => u.status === 'active').length,
        )
        setInactiveCount(
          allUsers.filter((u: any) => u.status === 'inactive').length,
        )
        setPendingCount(
          allUsers.filter((u: any) => u.status === 'pending').length,
        )
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

export default useUserStats
