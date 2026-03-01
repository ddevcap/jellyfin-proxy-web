// Camelcase TS representation of the proxy user
export interface ProxyUser {
    id: string;
    username: string;
    displayName: string;
    isAdmin: boolean;
    directStream: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProxyUserRequest {
    username: string;
    displayName: string;
    password: string;
    isAdmin?: boolean;
    directStream?: boolean;
}

export interface UpdateProxyUserRequest {
    displayName?: string;
    isAdmin?: boolean;
    directStream?: boolean;
}

export interface UpdateProxyUserPasswordRequest {
    currentPassword?: string;
    newPassword: string;
}

// ── Backends ──────────────────────────────────────────────────────────────────

export interface ProxyBackend {
    id: string;
    name: string;
    url: string;
    externalId: string;
    enabled: boolean;
    createdAt?: string;
}

export interface CreateProxyBackendRequest {
    name: string;
    url: string;
}

export interface UpdateProxyBackendRequest {
    name?: string;
    url?: string;
    enabled?: boolean;
}

export interface BackendUserMapping {
    id: string;
    userId: string;
    username: string;
    backendId: string;
    backendUserId: string;
    enabled: boolean;
}

export interface LoginToBackendRequest {
    proxyUserId: string;
    username: string;
    password: string;
}

export interface UpdateBackendUserRequest {
    backendUserId?: string;
    backendToken?: string;
    enabled?: boolean;
}
