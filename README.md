# Neuland CORS Proxy

A simple CORS proxy server that forwards POST requests to the THI API while adding proper CORS headers. This allows access from the Neuland Next Web development environment to the THI API, which does not have CORS enabled.

> [!CAUTION]
> It is not allowed to use this proxy in production environments due to security risks. It is intended for local development use only!

## What is it for?

This proxy is designed to bypass CORS (Cross-Origin Resource Sharing) restrictions when developing the Neuland Next Web application that needs to communicate with the THI API, which doesn't have CORS enabled.

## Installation

### Using Docker (Recommended)

The easiest way to run the proxy is using Docker:

```bash
docker run -p 3001:3001 ghcr.io/neuland-ingolstadt/neuland-next-proxy:latest
```

With a custom target host:

```bash
docker run -p 3001:3001 -e TARGET_HOST=custom.api.com ghcr.io/neuland-ingolstadt/neuland-next-proxy:latest
```

Or with a custom port:

```bash
docker run -p 8080:8080 -e PORT=8080 ghcr.io/neuland-ingolstadt/neuland-next-proxy:latest
```

### Manual Installation

```bash
# Install dependencies
pnpm install
```

## Usage

### Using Docker

Run the proxy with Docker:

```bash
docker run -p 3001:3001 ghcr.io/neuland-ingolstadt/neuland-next-proxy:latest
```

Optional environment variables:

- `TARGET_HOST`: The target API hostname (default: `hiplan.thi.de`)
- `PORT`: The port to run the proxy on (default: `3001`)

### Start the Server Manually

**Development mode** (with auto-reload):

```bash
pnpm dev
```

**Production mode**:

```bash
pnpm start
```

### Setting up Neuland Next Web

Once the proxy is running, send POST requests to `http://localhost:3001/path/to/endpoint` instead of directly to the target API.

In your Neuland Next Web `.env` file, set the following environment variable:

```env
EXPO_PUBLIC_ENDPOINT_HOST=http://localhost:3001
```

## Security Considerations

> [!CAUTION]
> **This proxy is intended for development use only.**

- Do not use in production without proper authentication and rate limiting
- API keys or sensitive information may be logged
- No request validation or sanitization is performed
- CORS is enabled for all origins (`*`)

## Development

```bash
# Run in development mode with hot-reload
pnpm dev

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Build TypeScript
pnpm build
```
