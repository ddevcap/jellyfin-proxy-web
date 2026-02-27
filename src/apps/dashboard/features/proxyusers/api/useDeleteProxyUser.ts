import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { queryClient } from 'utils/query/queryClient';
import { QUERY_KEY as PROXY_USERS_QUERY_KEY } from './useProxyUsers';

export const useDeleteProxyUser = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async (userId: string) => {
            await api!.axiosInstance.delete(
                `${api!.basePath}/proxy/users/${userId}`,
                {
                    headers: {
                        ...api!.configuration.baseOptions?.headers
                    }
                }
            );
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: [PROXY_USERS_QUERY_KEY]
            });
        }
    });
};
