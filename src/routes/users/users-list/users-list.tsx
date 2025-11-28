import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import {
  fetchPaginatedUsers,
  type FilterStatus,
  type User,
} from '../../../usersApi'

const PAGE_SIZE = 10

const UsersList: React.FunctionComponent = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPaginatedUsers(
          currentPage,
          PAGE_SIZE,
          undefined,
          filterStatus === 'all' ? undefined : filterStatus,
        )
        setUsers(data.items)
        setTotalCount(data.pagination.total)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [currentPage, filterStatus])

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as FilterStatus)
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="tw:flex tw:h-screen tw:items-center tw:justify-center">
        <h1 className="tw:text-xl tw:text-red-600">
          Error loading user data. Please try again.
        </h1>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="tw:flex tw:h-screen tw:items-center tw:justify-center">
        <h1 className="tw:text-xl">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="tw:p-4">
      <h1 className="tw:text-2xl tw:font-bold tw:mb-4">Users List</h1>

      <div className="tw:mb-4 tw:flex tw:items-center tw:gap-4">
        <label htmlFor="status-filter" className="tw:font-semibold">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={handleFilterChange}
          className="tw:p-2 tw:border tw:border-gray-300 tw:rounded-md"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="tw:grid tw:grid-cols-6 tw:gap-6 tw:font-semibold tw:mb-2">
        <p>Name</p>
        <p>Email</p>
        <p>Status</p>
        <p>Account</p>
        <p>Address</p>
        <p>Last Updated</p>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className="tw:grid tw:grid-cols-6 tw:gap-6 tw:items-center tw:border-b-[3px] tw:border-[#F0F0F0] tw:py-4"
        >
          <div className="tw:flex tw:gap-3 tw:items-center">
            <span className="tw:bg-[#FF9C6E] tw:text-white tw:rounded-full tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
              {user.firstName.charAt(0).toUpperCase() +
                user.lastName.charAt(0).toUpperCase()}
            </span>
            <span>{user.firstName + ' ' + user.lastName}</span>
          </div>
          <p>{user.email}</p>
          <p>{user.status}</p>
          <p>
            {user.account.balance} {user.account.currency}
          </p>
          <p>
            {user.address.street}, {user.address.city}, {user.address.zip},{' '}
            {user.address.country}
          </p>
          <p className="tw:text-[#8C8C8C] tw:text-sm">{user.updatedAt}</p>
        </div>
      ))}

      <div className="tw:mt-6 tw:flex tw:items-center tw:justify-center tw:w-full ">
        <div className="tw:text-sm tw:text-gray-600 tw:mr-4">
          Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}{' '}
          results
        </div>

        <div className="tw:flex tw:items-center tw:gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="tw:px-3 tw:py-1 tw:border tw:border-gray-300 tw:rounded-md tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="tw:px-3">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="tw:px-3 tw:py-1 tw:border tw:border-gray-300 tw:rounded-md tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/users/list')({
  component: UsersList,
})
