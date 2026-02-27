import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { queryClient } from 'utils/query/queryClient';
import type { LoginToBackendRequest } from 'types/proxyUser';
import { QUERY_KEY as BACKEND_USERS_QUERY_KEY, toBackendUserMapping } from './useBackendUsers';

interface LoginToBackendParams {
    backendId: string;
    data: LoginToBackendRequest;
}

export const useLoginToBackend = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async ({ backendId, data }: LoginToBackendParams) => {
            /* eslint-disable @typescript-eslint/naming-convention */
            const body = {
                proxy_user_id: data.proxyUserId,
                username: data.username,
                password: data.password
            };
            /* eslint-enable @typescript-eslint/naming-convention */
            const response = await api!.axiosInstance.post(
                `${api!.basePath}/proxy/backends/${backendId}/login`,
                body,
                { headers: { ...api!.configuration.baseOptions?.headers } }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as { data: any };

            return toBackendUserMapping(response.data);
        },
        onSuccess: (_, { backendId }) => {
            void queryClient.invalidateQueries({ queryKey: [BACKEND_USERS_QUERY_KEY, backendId] });
        }
    });
};
