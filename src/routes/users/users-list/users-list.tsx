import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useMemo } from 'react'
import useUserStats from '../../../usersApi.tsx'

type UserStatus = 'active' | 'inactive' | 'pending'
type FilterStatus = UserStatus | 'all'

const UsersList: React.FunctionComponent = () => {
  const {
    users,
    totalCount,
    activeCount,
    inactiveCount,
    pendingCount,
    loading,
    error,
  } = useUserStats()

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const filteredUsers = useMemo(() => {
    if (filterStatus === 'all') {
      return users
    }

    return users.filter((user) => user.status === filterStatus)
  }, [users, filterStatus])

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as FilterStatus)
  }

  return error ? (
    <div className="tw:flex tw:h-screen tw:items-center tw:justify-center">
      <h1 className="tw:text-xl tw:text-red-600">
        Error loading user data. Please try again.
      </h1>
    </div>
  ) : loading ? (
    <div className="tw:flex tw:h-screen  tw:items-center tw:justify-center">
      <h1 className="tw:text-xl">Loading...</h1>
    </div>
  ) : (
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
          <option value="all">All ({totalCount})</option>

          <option value="active">Active ({activeCount})</option>
          <option value="inactive">Inactive ({inactiveCount})</option>
          <option value="pending">Pending ({pendingCount})</option>
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

      {filteredUsers.map((user) => (
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
          <p>{user.account.balance + ' ' + user.account.currency}</p>
          <p>
            {user.address.street}, {user.address.city}, {user.address.zip},{' '}
            {user.address.country}
          </p>

          <p className="tw:text-[#8C8C8C] tw:text-sm">{user.updatedAt}</p>
        </div>
      ))}
    </div>
  )
}

export const Route = createFileRoute('/users/list')({
  component: UsersList,
})
