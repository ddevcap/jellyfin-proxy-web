import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import globalize from '../../../../lib/globalize';
import Button from '../../../../elements/emby-button/Button';
import Input from '../../../../elements/emby-input/Input';
import SectionTitleContainer from '../../../../elements/SectionTitleContainer';
import loading from '../../../../components/loading/loading';
import Page from '../../../../components/Page';
import { useCreateProxyBackend } from 'apps/dashboard/features/proxyusers/api/useCreateProxyBackend';

const ProxyBackendAdd = () => {
    const navigate = useNavigate();
    const element = useRef<HTMLDivElement>(null);
    const createBackend = useCreateProxyBackend();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const page = element.current;
        if (!page) return;

        const save = () => {
            const name = (page.querySelector('#txtName') as HTMLInputElement).value.trim();
            const rawUrl = (page.querySelector('#txtUrl') as HTMLInputElement).value.trim();
            const prefix = (page.querySelector('#txtPrefix') as HTMLInputElement).value.trim();

            if (!name || !rawUrl || !prefix) {
                setErrorMessage(globalize.translate('MessagePleaseFillInAllFields'));
                return;
            }

            setErrorMessage('');
            loading.show();
            // Prepend http:// if the user omitted the scheme
            const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `http://${rawUrl}`;
            createBackend.mutate(
                { name, url, prefix },
                {
                    onSuccess: () => {
                        loading.hide();
                        navigate('/dashboard/proxybackends', { state: { openSavedToast: true } });
                    },
                    onError: (err: unknown) => {
                        loading.hide();
                        console.error('[proxybackendadd] failed to create backend', err);
                        const apiMessage =
                            (err as { response?: { data?: { error?: string } } })
                                ?.response?.data?.error;
                        setErrorMessage(apiMessage ?? globalize.translate('ErrorDefault'));
                    }
                }
            );
        };

        const onSubmit = (e: Event) => {
            save();
            e.preventDefault();
        };
        const btn = page.querySelector('#btnSave') as HTMLButtonElement;
        btn?.addEventListener('click', onSubmit);
        return () => btn?.removeEventListener('click', onSubmit);
    }, [createBackend, navigate]);

    return (
        <Page id='proxyBackendAddPage' className='mainAnimatedPage type-interior'>
            <div ref={element} className='content-primary'>
                <form>
                    <div className='verticalSection'>
                        <SectionTitleContainer title={globalize.translate('ButtonAddBackend')} />
                    </div>
                    <div className='inputContainer'>
                        <Input type='text' id='txtName' label={globalize.translate('LabelName')} required />
                    </div>
                    <div className='inputContainer'>
                        <Input type='text' id='txtUrl' label={globalize.translate('LabelBackendURL')} required />
                        <div className='fieldDescription'>{globalize.translate('LabelBackendURLHelp')}</div>
                    </div>
                    <div className='inputContainer'>
                        <Input type='text' id='txtPrefix' label={globalize.translate('LabelPrefix')} required />
                        <div className='fieldDescription'>{globalize.translate('LabelPrefixHelp')}</div>
                    </div>

                    {errorMessage && (
                        <Alert severity='error' sx={{ mt: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <br />
                    <div>
                        <Button
                            type='submit'
                            id='btnSave'
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

export default ProxyBackendAdd;

