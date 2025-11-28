import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import UserInfoTable from '../../components/userInfoTable.tsx'
import LastActiveUserTable from '@/components/lastActiveUserTable.tsx'
import { useEffect, useState } from 'react'

import useUserStats from '../../usersApi.tsx'

const Users: React.FunctionComponent = () => {
  const { t } = useTranslation()

  const {
    users,
    totalCount,
    activeCount,
    inactiveCount,
    pendingCount,
    loading,
    error,
  } = useUserStats()

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
    <div className="tw:flex tw:flex-col tw:items-center tw:gap-4 tw:justify-center tw:mt-12 tw:border-[1.5px] tw:border-[#F0F0F0] ">
      <div className="tw:flex tw:flex-col tw:gap-2 tw:p-6 tw:border-[1px] tw:border-[#F0F0F0] tw:w-[90%] tw:mx-auto tw:mt-12 tw:bg-white tw:rounded-[12px]">
        <h1 className="tw:text-sm tw:text-[#8C8C8C] tw:leading-[22px]">
          {t('dashboard.title')}
        </h1>
        <p className="tw:text-3xl tw:font-medium tw:leading-[40px] mb-4 tw:neutral-700">
          {t('dashboard.description')}
        </p>
      </div>
      <div className="tw:flex tw:flex-row tw:gap-x-4 tw:w-[90%] tw:items-center tw:justify-center">
        <UserInfoTable
          usersStatus="Total users"
          userCount={totalCount}
          userStatusSubtitle="Total registered accounts"
        />
        <UserInfoTable
          usersStatus="Active users"
          userCount={activeCount}
          userStatusSubtitle="Total active accounts"
        />
        <UserInfoTable
          usersStatus="Inactive users"
          userCount={inactiveCount}
          userStatusSubtitle="Total inactive accounts"
        />
      </div>
      <LastActiveUserTable users={users}></LastActiveUserTable>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Users,
})
