import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useRouterState } from '@tanstack/react-router'
import { Layout, Menu } from 'antd'
import React from 'react'
import classes from './base-layout.module.scss'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouterState()
  const last = router.matches[router.matches.length - 1].fullPath

  const items: Array<MenuItem> = React.useMemo(
    () => [
      {
        key: '/',
        label: <Link to="/">Dashboard</Link>,
        icon: <HomeOutlined />,
      },
    ],
    [],
  )

  return (
    <Layout className={classes['app-layout']}>
      <Layout.Header className={classes['app-header']}>
        <Link to="/" className={`${classes['app-logo-wrapper']} tw:mr-4`}>
          <div className={classes['demo-logo']} />
          <div className="tw:text-white tw:text-2xl tw:font-bold">
            UserManager
          </div>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          className={classes['app-menu']}
          selectedKeys={[last]}
        />
        <div className="tw:text-white tw:ml-4">
          <UserOutlined className="tw:mr-2" />
          John Doe
        </div>
      </Layout.Header>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  )
}

export default BaseLayout
