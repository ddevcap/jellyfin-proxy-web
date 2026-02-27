import { useMutation } from '@tanstack/react-query';
import { useApi } from 'hooks/useApi';
import { queryClient } from 'utils/query/queryClient';
import type { CreateProxyBackendRequest } from 'types/proxyUser';
import { QUERY_KEY as BACKENDS_QUERY_KEY, toProxyBackend } from './useProxyBackends';

export const useCreateProxyBackend = () => {
    const { api } = useApi();

    return useMutation({
        mutationFn: async (request: CreateProxyBackendRequest) => {
            const response = await api!.axiosInstance.post(
                `${api!.basePath}/proxy/backends`,
                {
                    name: request.name,
                    url: request.url,
                    prefix: request.prefix
                },
                { headers: { ...api!.configuration.baseOptions?.headers } }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as { data: any };

            return toProxyBackend(response.data);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [BACKENDS_QUERY_KEY] });
        }
    });
};
