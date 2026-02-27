import React, { useCallback, useEffect, useState, useRef } from 'react';
import globalize from '../../../../lib/globalize';
import loading from '../../../../components/loading/loading';
import SectionTitleContainer from '../../../../elements/SectionTitleContainer';
import Input from '../../../../elements/emby-input/Input';
import Button from '../../../../elements/emby-button/Button';
import Page from '../../../../components/Page';
import Toast from 'apps/dashboard/components/Toast';
import { useCreateProxyUser } from 'apps/dashboard/features/proxyusers/api/useCreateProxyUser';
import { useNavigate } from 'react-router-dom';

const ProxyUserNew = () => {
    const navigate = useNavigate();
    const [isErrorToastOpen, setIsErrorToastOpen] = useState(false);
    const element = useRef<HTMLDivElement>(null);

    const handleToastClose = useCallback(() => {
        setIsErrorToastOpen(false);
    }, []);

    const createProxyUser = useCreateProxyUser();

    useEffect(() => {
        const page = element.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }

        const saveUser = () => {
            const username = (page.querySelector('#txtUsername') as HTMLInputElement).value;
            const displayName = (page.querySelector('#txtDisplayName') as HTMLInputElement).value;
            const password = (page.querySelector('#txtPassword') as HTMLInputElement).value;

            if (!username || !displayName) {
                setIsErrorToastOpen(true);
                return;
            }

            loading.show();

            createProxyUser.mutate(
                { username, displayName, password },
                {
                    onSuccess: () => {
                        loading.hide();
                        navigate('/dashboard/proxyusers', {
                            state: { openSavedToast: true }
                        });
                    },
                    onError: (error: unknown) => {
                        loading.hide();
                        console.error('[proxyusernew] failed to create user', error);
                        setIsErrorToastOpen(true);
                    }
                }
            );
        };

        const onSubmit = (e: Event) => {
            saveUser();
            e.preventDefault();
            return false;
        };

        const submitButton = page.querySelector('#btnCreateProxyUser') as HTMLButtonElement;
        submitButton?.addEventListener('click', onSubmit);

        return () => {
            submitButton?.removeEventListener('click', onSubmit);
        };
    }, [createProxyUser, navigate]);

    return (
        <Page
            id='newProxyUserPage'
            className='mainAnimatedPage type-interior'
        >
            <Toast
                open={isErrorToastOpen}
                onClose={handleToastClose}
                message={globalize.translate('MessageUnableToCreateUser') || 'Unable to create user'}
            />
            <div ref={element} className='content-primary'>
                <form>
                    <div className='verticalSection'>
                        <SectionTitleContainer title={globalize.translate('ButtonAddProxyUser')} />
                    </div>
                    <div className='inputContainer'>
                        <Input
                            type='text'
                            id='txtUsername'
                            label={globalize.translate('LabelName')}
                            required
                        />
                    </div>
                    <div className='inputContainer'>
                        <Input
                            type='text'
                            id='txtDisplayName'
                            label={globalize.translate('LabelDisplayName')}
                            required
                        />
                    </div>
                    <div className='inputContainer'>
                        <Input
                            type='password'
                            id='txtPassword'
                            label={globalize.translate('LabelPassword')}
                            autoComplete='new-password'
                        />
                    </div>
                    <br />
                    <div>
                        <Button
                            type='submit'
                            id='btnCreateProxyUser'
                            className='raised button-submit block'
                            title={globalize.translate('Add')}
                        >
                            <span>{globalize.translate('Add')}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </Page>
    );
};

export default ProxyUserNew;

