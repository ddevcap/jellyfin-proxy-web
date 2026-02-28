# Jellyfin Proxy Web

Custom frontend for [jellyfin-proxy](https://github.com/ddevcap/jellyfin-proxy) — a multi-backend proxy for Jellyfin.

This is a fork of [jellyfin-web](https://github.com/jellyfin/jellyfin-web) (v10.11.6) with additional pages and UI modifications for managing proxy users and backends.

## What's different?

When built with `PROXY_MODE=1`, the frontend adds:

- **Proxy User Management** — Create, edit, and delete proxy users
- **Backend Management** — Register Jellyfin backends, enable/disable them, and map proxy users to backends via login
- **Simplified navigation** — The admin sidebar shows "Proxy Management" instead of the standard Dashboard/Metadata Manager links
- **Hidden irrelevant features** — Quick Connect, native user administration, and other Jellyfin-server-specific options are hidden

When built without the flag, it behaves like a standard Jellyfin web client.

## Build

### Prerequisites

- [Node.js](https://nodejs.org/en/download) (see `.nvmrc` for version)
- npm (included with Node.js)

### Development

```sh
npm install
PROXY_MODE=1 npm run build:development
```

### Production

```sh
npm install
PROXY_MODE=1 npm run build:production
```

The output is in `dist/`.

### Standard Jellyfin build (no proxy features)

```sh
npm install
npm run build:production
```

## Usage

The built `dist/` directory should be served as the web frontend by or alongside the jellyfin-proxy. Typically this is done by mounting it into the Jellyfin container or having the proxy serve it as static files.

## License

This project is licensed under the [GPL-2.0](LICENSE) license, same as the upstream Jellyfin project.
