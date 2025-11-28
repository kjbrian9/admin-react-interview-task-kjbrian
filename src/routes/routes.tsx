// routes.ts
import { index, rootRoute, route } from '@tanstack/virtual-file-routes'

export const routes = rootRoute('./__root.tsx', [
  index('./dashboard/dashboard.tsx'),
  route('/users', [route('/list', './users/users-list/users-list.tsx')]),
])
