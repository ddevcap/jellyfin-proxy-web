# Jellymux Web

Custom frontend for [jellymux](https://github.com/ddevcap/jellymux) — a multi-backend proxy for Jellyfin.

This is a fork of [jellyfin-web](https://github.com/jellyfin/jellyfin-web) with additional pages and UI modifications for managing proxy users and backends.

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
make build
```

Or manually:

```sh
npm install
PROXY_MODE=1 npm run build:production
```

The output is in `dist/`.

## Syncing with upstream Jellyfin Web

To pull in a new upstream release:

```sh
# Check the latest available upstream release
make sync-upstream-check

# Merge the latest upstream release into a new branch
make sync-upstream

# Or sync a specific version
make sync-upstream TAG=v10.12.0
```

This creates a `sync/<version>` branch where you can resolve conflicts and test before merging into `main`.

## Releasing

```sh
make release VERSION=10.12.0-jellymux.1
git push origin v10.12.0-jellymux.1
```

Pushing a `v*` tag triggers the GitHub Actions workflow to build and create a release.

## Usage

The built `dist/` directory should be served as the web frontend by or alongside jellymux. Typically this is done by mounting it into the Jellyfin container or having the proxy serve it as static files.

## License

This project is licensed under the [GPL-2.0](LICENSE) license, same as the upstream Jellyfin project.