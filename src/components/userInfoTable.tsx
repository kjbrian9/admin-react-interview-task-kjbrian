interface props {
  usersStatus?: string
  userCount?: number
  userStatusSubtitle?: string
}

function UserInfoTable({ usersStatus, userCount, userStatusSubtitle }: props) {
  return (
    <div className="tw:bg-white tw:rounded-[12px] tw:w-[100%]  tw:border-[1.5px] tw:border-[#F0F0F0] ">
      <div className="tw:px-3 tw:py-2 tw:border-b-[1.5px] tw:border-[#F0F0F0]">
        <h1 className="tw:text-[#1F1F1F] tw:text-sm tw:font-medium">
          {usersStatus}
        </h1>
      </div>
      <div className="tw:flex tw:flex-col tw:p-3">
        <p className="tw:text-2xl">{userCount}</p>
        <p className="tw:text-[#8C8C8C]">{userStatusSubtitle}</p>
      </div>
    </div>
  )
}

export default UserInfoTable
