import React, { useCallback, useEffect, useState } from 'react';
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
    const [displayName, setDisplayName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [directStream, setDirectStream] = useState(false);

    const handleDisplayNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value);
    }, []);

    const handleAdminChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAdmin(e.target.checked);
    }, []);

    const handleDirectStreamChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDirectStream(e.target.checked);
    }, []);

    // Populate form once user data is loaded
    useEffect(() => {
        if (!user) return;

        setDisplayName(user.displayName || '');
        setIsAdmin(user.isAdmin);
        setDirectStream(user.directStream);
    }, [user]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        loading.show();

        updateUser.mutate(
            { userId, data: { displayName, isAdmin, directStream } },
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
    }, [userId, displayName, isAdmin, directStream, navigate, updateUser]);

    if (isPending || !user) {
        return <Loading />;
    }

    return (
        <Page id='proxyUserEditPage' className='mainAnimatedPage type-interior'>
            <div className='content-primary'>
                <form onSubmit={handleSubmit}>
                    <div className='verticalSection'>
                        <SectionTitleContainer title={user.displayName || user.username} />
                    </div>
                    <div className='inputContainer'>
                        <Input
                            type='text'
                            id='txtDisplayName'
                            label={globalize.translate('LabelDisplayName')}
                            value={displayName}
                            onChange={handleDisplayNameChange}
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                id='chkDirectStream'
                                checked={directStream}
                                onChange={handleDirectStreamChange}
                            />
                        }
                        label={globalize.translate('LabelDirectStream')}
                    />
                    <div className='fieldDescription'>
                        {globalize.translate('LabelDirectStreamHelp')}
                    </div>
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
