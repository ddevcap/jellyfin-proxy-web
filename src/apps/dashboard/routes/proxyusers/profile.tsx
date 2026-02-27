import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import globalize from '../../../../lib/globalize';
import Button from '../../../../elements/emby-button/Button';
import Input from '../../../../elements/emby-input/Input';
import SectionTitleContainer from '../../../../elements/SectionTitleContainer';
import loading from '../../../../components/loading/loading';
import Page from '../../../../components/Page';
import { useProxyUser } from 'apps/dashboard/features/proxyusers/api/useProxyUser';
import { useUpdateProxyUser } from 'apps/dashboard/features/proxyusers/api/useUpdateProxyUser';
import Loading from 'components/loading/LoadingComponent';

const ProxyUserEdit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');

    const { data: user, isPending } = useProxyUser(userId || undefined);
    const updateUser = useUpdateProxyUser();
    const element = useRef<HTMLDivElement>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleAdminChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAdmin(e.target.checked);
    }, []);

    // Populate form once user data is loaded
    useEffect(() => {
        const page = element.current;
        if (!page || !user) return;

        (page.querySelector('#txtDisplayName') as HTMLInputElement).value = user.displayName || '';
        setIsAdmin(user.isAdmin);
    }, [user]);

    // Wire up save button
    useEffect(() => {
        const page = element.current;
        if (!page || !userId) return;

        const saveUser = () => {
            loading.show();

            const displayName = (page.querySelector('#txtDisplayName') as HTMLInputElement).value;

            updateUser.mutate(
                { userId, data: { displayName, isAdmin } },
                {
                    onSuccess: () => {
                        loading.hide();
                        navigate('/dashboard/proxyusers', { state: { openSavedToast: true } });
                    },
                    onError: (error) => {
                        loading.hide();
                        console.error('[proxyuseredit] failed to update user', error);
                    }
                }
            );
        };

        const onSubmit = (e: Event) => {
            saveUser();
            e.preventDefault();
        };
        const submitButton = page.querySelector('.btnSave') as HTMLButtonElement;
        submitButton?.addEventListener('click', onSubmit);
        return () => submitButton?.removeEventListener('click', onSubmit);
    }, [userId, navigate, updateUser]);

    if (isPending || !user) {
        return <Loading />;
    }

    return (
        <Page id='proxyUserEditPage' className='mainAnimatedPage type-interior'>
            <div ref={element} className='content-primary'>
                <form>
                    <div className='verticalSection'>
                        <SectionTitleContainer title={user.displayName || user.username} />
                    </div>
                    <div className='inputContainer'>
                        <Input
                            type='text'
                            id='txtDisplayName'
                            label={globalize.translate('LabelDisplayName')}
                        />
                    </div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                id='chkIsAdmin'
                                checked={isAdmin}
                                onChange={handleAdminChange}
                            />
                        }
                        label={globalize.translate('OptionMakeAdmin')}
                    />
                    <br />
                    <div>
                        <Button
                            type='submit'
                            className='raised button-submit block btnSave'
                            title={globalize.translate('Save')}
                        >
                            <span>{globalize.translate('Save')}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </Page>
    );
};

export default ProxyUserEdit;
