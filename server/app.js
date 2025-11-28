import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import users from './data/users.js'

const app = express()
const PORT = process.env.PORT || 50000

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'Simple node.js API',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique ID',
              example: 1,
            },
            firstName: {
              type: 'string',
              description: 'First name of the user',
              example: 'Deborah',
            },
            lastName: {
              type: 'string',
              description: 'Surname of the user',
              example: 'Davenport',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email',
              example: 'parsonsmary@szm.sk',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'pending'],
              description: 'Status of the user',
              example: 'pending',
            },
            createdAt: {
              type: 'string',
              format: 'date',
              description: 'Creation date',
              example: '2024-11-01',
            },
            updatedAt: {
              type: 'string',
              format: 'date',
              description: 'Date of last update',
              example: '2025-10-22',
            },
            address: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                  description: 'Street and number',
                  example: 'Justičná 504',
                },
                city: {
                  type: 'string',
                  description: 'City',
                  example: 'Spišská Stará Ves',
                },
                zip: {
                  type: 'string',
                  description: 'ZIP code',
                  example: '816 59',
                },
                country: {
                  type: 'string',
                  description: 'Country',
                  example: 'Slovakia',
                },
              },
            },
            account: {
              type: 'object',
              properties: {
                balance: {
                  type: 'number',
                  format: 'float',
                  description: 'Balance of the account',
                  example: 3266.96,
                },
                currency: {
                  type: 'string',
                  description: 'Currency of the account',
                  example: 'EUR',
                },
              },
            },
          },
        },
        UserListResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total number of users',
                  example: 1250,
                },
                page: {
                  type: 'integer',
                  description: 'Current page',
                  example: 1,
                },
                pageSize: {
                  type: 'integer',
                  description: 'Number of users per page',
                  example: 10,
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: "Parameter 'page' is required.",
            },
          },
        },
      },
    },
  },
  apis: ['./app.js'], // Swagger comments are in this file
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 🔹 CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://localhost:5432',
    ], // Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

// 🔹 Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get list of users with advanced filtering
 *     description: Returns a paginated list of users with the ability to filter by various criteria and sorting.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: page
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number (required)
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         description: Number of users per page (required)
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *           example: createdAt
 *         description: Field for sorting (optional)
 *       - name: direction
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: DESC
 *         description: Sort direction (optional)
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *           example: active
 *         description: Filter by user status (optional)
 *       - name: email
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: "gmail.com"
 *         description: Filter by part of email (optional)
 *       - name: balanceFrom
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *           example: 1000
 *         description: Minimum account balance (optional)
 *       - name: balanceTo
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *           example: 5000
 *         description: Maximum account balance (optional)
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *             example:
 *               items:
 *                 - id: 1
 *                   firstName: "Deborah"
 *                   lastName: "Davenport"
 *                   email: "parsonsmary@szm.sk"
 *                   status: "pending"
 *                   createdAt: "2024-11-01"
 *                   updatedAt: "2025-10-22"
 *                   address:
 *                     street: "Justičná 504"
 *                     city: "Spišská Stará Ves"
 *                     zip: "816 59"
 *                     country: "Slovakia"
 *                   account:
 *                     balance: 3266.96
 *                     currency: "EUR"
 *               pagination:
 *                 total: 1250
 *                 page: 1
 *                 pageSize: 10
 *       412:
 *         description: Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_page:
 *                 summary: Missing page parameter
 *                 value:
 *                   message: "Parameter 'page' is required."
 *               missing_pageSize:
 *                 summary: Missing pageSize parameter
 *                 value:
 *                   message: "Parameter 'pageSize' is required."
 *               invalid_sortBy:
 *                 summary: Invalid sortBy value
 *                 value:
 *                   message: "Parameter 'sortBy' can be only 'createdAt', 'updatedAt'."
 *               invalid_direction:
 *                 summary: Invalid direction value
 *                 value:
 *                   message: "Parameter 'direction' can be only 'ASC' or 'DESC'."
 */
app.get('/users', async (req, res) => {
  const {
    page,
    pageSize,
    sortBy,
    direction,
    status,
    email,
    balanceFrom,
    balanceTo,
  } = req.query

  if (!page) {
    return res.status(412).json({ message: "Parameter 'page' is required." })
  }
  if (!pageSize) {
    return res
      .status(412)
      .json({ message: "Parameter 'pageSize' is required." })
  }
  if (sortBy && ['createdAt', 'updatedAt'].indexOf(sortBy) === -1) {
    return res.status(412).json({
      message: "Parameter 'sortBy' can be only 'createdAt', 'updatedAt'.",
    })
  }
  if (direction && ['ASC', 'DESC'].indexOf(direction) === -1) {
    return res
      .status(412)
      .json({ message: "Parameter 'direction' can be only 'ASC' or 'DESC'." })
  }

  const indexEnd = page * pageSize
  const indexStart = (page - 1) * pageSize

  let usersFiltered = users

  if (status) {
    usersFiltered = usersFiltered.filter((user) => user.status === status)
  }
  if (email) {
    usersFiltered = usersFiltered.filter((user) => user.email.includes(email))
  }
  if (balanceFrom) {
    usersFiltered = usersFiltered.filter(
      (user) => user.account.balance >= Number(balanceFrom),
    )
  }
  if (balanceTo) {
    usersFiltered = usersFiltered.filter(
      (user) => user.account.balance <= Number(balanceTo),
    )
  }

  if (sortBy) {
    if (direction === 'ASC') {
      usersFiltered = usersFiltered.sort(function (a, b) {
        return new Date(a[sortBy]) - new Date(b[sortBy])
      })
    } else {
      usersFiltered = usersFiltered.sort(function (a, b) {
        return new Date(b[sortBy]) - new Date(a[sortBy])
      })
    }
  }
  const filteredUsers = usersFiltered.slice(indexStart, indexEnd)

  const delay = Math.floor((Math.random() / 2) * 10001)
  await sleep(delay)

  res.json({
    items: filteredUsers,
    pagination: {
      total: usersFiltered.length,
      page: Number(page),
      pageSize: Number(pageSize),
    },
  })
})

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user detail by ID
 *     description: Returns complete information about a user based on their unique identifier.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Unique user identifier
 *     responses:
 *       200:
 *         description: Successfully retrieved user detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               firstName: "Deborah"
 *               lastName: "Davenport"
 *               email: "parsonsmary@szm.sk"
 *               status: "pending"
 *               createdAt: "2024-11-01"
 *               updatedAt: "2025-10-22"
 *               address:
 *                 street: "Justičná 504"
 *                 city: "Spišská Stará Ves"
 *                 zip: "816 59"
 *                 country: "Slovakia"
 *               account:
 *                 balance: 3266.96
 *                 currency: "EUR"
 *       404:
 *         description: User with given ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "User not found"
 *       412:
 *         description: Invalid or missing ID parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Parameter 'id' is required."
 */
app.get('/users/:id', async (req, res) => {
  const id = Number(req.params.id)

  if (!id) {
    return res.status(412).json({ message: "Parameter 'id' is required." })
  }
  const user = users.find((u) => u.id === id)

  const delay = Math.floor((Math.random() / 2) * 10001)
  await sleep(delay)

  res.json(user)
})

// Server startup
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
  console.log(`📘 Swagger documentation: http://localhost:${PORT}/api-docs`)
})
