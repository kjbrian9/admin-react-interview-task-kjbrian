import { Link } from '@tanstack/react-router'
import vector from '../assets/Vector.svg'
function LastActiveUserTable({ users }: { users: any[] }) {
  return (
    <div className=" tw:bg-white tw:rounded-[12px] tw:w-[90%] tw:border-[1.5px] tw:border-[#F0F0F0] tw:mb-20">
      <div className="tw:px-6 tw:py-4 tw:flex tw:flex-row tw:items-center tw:justify-between tw:border-b-[1.5px] tw:border-[#F0F0F0]">
        <h1 className="tw:text-[#1F1F1F] tw:text-sm tw:font-medium ">
          Last Active Users
        </h1>
        <Link
          to="/users/list"
          className="tw:flex tw:flex-row tw:justify-center tw:items-center tw:gap-2"
        >
          <h1 className="tw:text-[#1890FF] tw:text-xs tw:font-normal ">
            All users
          </h1>
          <img src={vector}></img>
        </Link>
      </div>
      {users
        .filter((user) => user.status === 'active')
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5)
        .map((user) => (
          <div className="tw:flex tw:flex-row tw:justify-between tw:items-center">
            <div className="tw:flex tw:flex-row tw:gap-4 tw:px-6 tw:py-4 tw:items-center ">
              <div key={user.id}>
                <p className="tw:bg-[#FF9C6E] tw:text-[#FFFFFF] tw:text-sm tw:rounded-full tw:p-3 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center">
                  {user.firstName.charAt(0).toUpperCase() +
                    user.lastName.charAt(0).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="tw:text-2xl tw:text-base tw:font-medium">
                  {user.firstName + ' ' + user.lastName}
                </p>
                <p className="tw:text-[#8C8C8C] tw:font-normal tw:text-sm ">
                  {user.email}
                </p>
              </div>
            </div>
            <div>
              <p className="tw:text-[#8C8C8C] tw:font-normal tw:text-sm tw:font-normal tw:text-sm tw:mr-4 ">
                {user.updatedAt}
              </p>
            </div>
          </div>
        ))}
    </div>
  )
}

export default LastActiveUserTable
