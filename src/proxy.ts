import { URLSearchParams } from 'node:url'
import cors from 'cors'
import dotenv from 'dotenv'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'

import type {
  Response as FetchResponse,
  RequestInfo,
  RequestInit,
} from 'node-fetch'

dotenv.config()

const fetch = (...args: [RequestInfo, RequestInit?]): Promise<FetchResponse> =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const app: express.Express = express()

const PORT: number = Number.parseInt(process.env.PORT || '3001', 10)
const TARGET_HOST: string | undefined = process.env.TARGET_HOST

const PROXY_URL = `http://localhost:${PORT}`

if (!TARGET_HOST) {
  console.error('TARGET_HOST environment variable is required')
  process.exit(1)
}

const TARGET_URL = `https://${TARGET_HOST}`

app.use(cors())

app.use(express.urlencoded({ extended: true }))

app.post(/\/*/, async (req: Request, res: Response) => {
  const targetPath = req.path
  const targetUrl = new URL(targetPath, TARGET_URL).toString()

  try {
    const headers: Record<string, string> = {
      Host: TARGET_HOST,
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-API-KEY': req.headers['x-api-key'] as string,
    }

    const userAgent = req.headers['user-agent']
    if (userAgent) {
      headers['User-Agent'] = Array.isArray(userAgent)
        ? userAgent[0]
        : userAgent
    }

    const apiResponse: FetchResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams(req.body as Record<string, string>).toString(),
    })

    const responseBodyText: string = await apiResponse.text()
    res.status(apiResponse.status)

    const contentType = apiResponse.headers.get('content-type')
    if (contentType) {
      res.setHeader('Content-Type', contentType)
    }

    res.send(responseBodyText)
  } catch (error: unknown) {
    console.error('Proxy Error:', error)
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred'
    res
      .status(500)
      .json({ error: 'Proxy encountered an error.', details: message })
  }
})

app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Application Error:', err.stack)
  res.status(500).json({ error: 'Internal Server Error', details: err.message })
})

app.listen(PORT, () => {
  console.log(`Neuland CORS Proxy listening on: ${PROXY_URL}`)
  console.log('Add the following to your Neuland Next Web .env file:')
  console.log(`\n\n\tEXPO_PUBLIC_ENDPOINT_HOST=${PROXY_URL}\n\n`)
})
