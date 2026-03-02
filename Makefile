.PHONY: sync-upstream sync-upstream-check build release

# Upstream Jellyfin Web repository
UPSTREAM_REMOTE := upstream
UPSTREAM_URL := https://github.com/jellyfin/jellyfin-web

# Fetch the latest upstream release tag (excludes pre-releases like -rc)
LATEST_UPSTREAM = $(shell git ls-remote --tags $(UPSTREAM_REMOTE) 'refs/tags/v*' 2>/dev/null \
	| awk '{print $$2}' \
	| sed 's|refs/tags/||' \
	| grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$$' \
	| sort -V \
	| tail -1)

## Show the latest upstream release and current base
sync-upstream-check:
	@echo "Current branch: $$(git branch --show-current)"
	@echo "Latest upstream release: $(LATEST_UPSTREAM)"
	@echo ""
	@echo "Local tags:"
	@git tag -l 'v*' --sort=-version:refname | head -5

## Sync with a new upstream release. Creates a branch to merge upstream changes.
## Usage: make sync-upstream [TAG=v10.12.0]
sync-upstream:
	$(eval TAG ?= $(LATEST_UPSTREAM))
	@if [ -z "$(TAG)" ]; then \
		echo "Error: Could not determine upstream tag. Is the '$(UPSTREAM_REMOTE)' remote configured?"; \
		echo "Run: git remote add $(UPSTREAM_REMOTE) $(UPSTREAM_URL)"; \
		exit 1; \
	fi
	@echo "Syncing with upstream $(TAG)..."
	git fetch $(UPSTREAM_REMOTE) --tags
	git checkout -b sync/$(TAG) main
	git merge $(TAG) --no-commit --no-ff || true
	@echo ""
	@echo "====================================================="
	@echo "  Upstream $(TAG) has been merged into sync/$(TAG)"
	@echo "  Resolve any conflicts, then:"
	@echo "    git add -A && git commit"
	@echo "    git checkout main && git merge sync/$(TAG)"
	@echo "====================================================="

## Build for production (proxy mode)
build:
	PROXY_MODE=true npm run build:production

## Create a new release tag
## Usage: make release VERSION=10.12.0-jellymux.1
release:
	@if [ -z "$(VERSION)" ]; then \
		echo "Usage: make release VERSION=10.12.0-jellymux.1"; \
		exit 1; \
	fi
	git tag v$(VERSION)
	@echo "Tagged v$(VERSION). Push with: git push origin v$(VERSION)"