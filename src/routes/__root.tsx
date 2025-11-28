import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import BaseLayout from '@/layouts/base-layout'

interface MyRouterContext {
  queryClient: QueryClient
}

const RootComponent: React.FunctionComponent = () => {
  return (
    <ConfigProvider locale={enUS}>
      <BaseLayout>
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </BaseLayout>
    </ConfigProvider>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  },
})
