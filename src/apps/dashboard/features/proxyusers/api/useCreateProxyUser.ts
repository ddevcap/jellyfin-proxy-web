import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { queryClient } from 'utils/query/queryClient';
import { CreateProxyUserRequest } from 'types/proxyUser';
import { QUERY_KEY as PROXY_USERS_QUERY_KEY, toProxyUser } from './useProxyUsers';

export const useCreateProxyUser = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async (request: CreateProxyUserRequest) => {
            const response = await api!.axiosInstance.post(
                `${api!.basePath}/proxy/users`,
                {
                    username: request.username,
                    display_name: request.displayName,
                    password: request.password,
                    is_admin: request.isAdmin ?? false
                },
                { headers: { ...api!.configuration.baseOptions?.headers } }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as { data: any };

            return toProxyUser(response.data);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [PROXY_USERS_QUERY_KEY] });
        }
    });
};
