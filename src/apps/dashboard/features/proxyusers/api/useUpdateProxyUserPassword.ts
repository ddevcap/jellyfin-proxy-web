import { useMutation } from '@tanstack/react-query';
import { UpdateProxyUserPasswordRequest } from 'types/proxyUser';

interface UpdatePasswordParams {
    userId: string;
    data: UpdateProxyUserPasswordRequest;
}

export const useUpdateProxyUserPassword = () => {
    return useMutation({
        mutationFn: async ({ userId, data }: UpdatePasswordParams) => {
            const url = window.ApiClient.getUrl(`proxy/users/${userId}/password`);
            await window.ApiClient.ajax({
                type: 'PUT',
                url,
                data: JSON.stringify(data),
                contentType: 'application/json'
            });
        }
    });
};
