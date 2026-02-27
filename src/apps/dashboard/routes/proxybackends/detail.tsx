import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MuiButton from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import globalize from '../../../../lib/globalize';
import Button from '../../../../elements/emby-button/Button';
import Input from '../../../../elements/emby-input/Input';
import SectionTitleContainer from '../../../../elements/SectionTitleContainer';
import loading from '../../../../components/loading/loading';
import Page from '../../../../components/Page';
import Loading from 'components/loading/LoadingComponent';
import Toast from 'apps/dashboard/components/Toast';
import confirm from '../../../../components/confirm/confirm';
import { useProxyBackends } from 'apps/dashboard/features/proxyusers/api/useProxyBackends';
import { useUpdateProxyBackend } from 'apps/dashboard/features/proxyusers/api/useUpdateProxyBackend';
import { useBackendUsers } from 'apps/dashboard/features/proxyusers/api/useBackendUsers';
import { useDeleteBackendUser } from 'apps/dashboard/features/proxyusers/api/useDeleteBackendUser';
import { useLoginToBackend } from 'apps/dashboard/features/proxyusers/api/useLoginToBackend';
import { useProxyUsers } from 'apps/dashboard/features/proxyusers/api/useProxyUsers';
import type { BackendUserMapping } from 'types/proxyUser';

const ProxyBackendDetail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const backendId = searchParams.get('backendId') ?? undefined;

    const { data: backends, isPending: isBackendsPending } = useProxyBackends();
    const { data: mappings, isPending: isMappingsPending } = useBackendUsers(backendId);
    const { data: proxyUsers } = useProxyUsers();
    const updateBackend = useUpdateProxyBackend();
    const deleteMapping = useDeleteBackendUser();
    const loginToBackend = useLoginToBackend();

    const element = useRef<HTMLDivElement>(null);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    // Login dialog state
    const [loginProxyUserId, setLoginProxyUserId] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoginPending, setIsLoginPending] = useState(false);

    const handleToastClose = useCallback(() => setIsToastOpen(false), []);
    const handleOpenLoginDialog = useCallback(() => setIsLoginDialogOpen(true), []);
    const handleCancelLogin = useCallback(() => {
        setIsLoginDialogOpen(false);
        setLoginError('');
    }, []);
    const handleNavigateBack = useCallback(() => navigate('/dashboard/proxybackends'), [navigate]);
    const handleProxyUserChange = useCallback((e: SelectChangeEvent) => {
        setLoginProxyUserId(e.target.value);
    }, []);
    const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginUsername(e.target.value);
    }, []);
    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginPassword(e.target.value);
    }, []);

    const backend = backends?.find(b => b.id === backendId);

    // Populate edit fields when backend loads
    useEffect(() => {
        const page = element.current;
        if (!page || !backend) return;
        (page.querySelector('#txtName') as HTMLInputElement).value = backend.name;
        (page.querySelector('#txtUrl') as HTMLInputElement).value = backend.url;
    }, [backend]);

    // Wire up save button
    useEffect(() => {
        const page = element.current;
        if (!page || !backendId) return;

        const save = () => {
            const name = (page.querySelector('#txtName') as HTMLInputElement).value.trim();
            const rawUrl = (page.querySelector('#txtUrl') as HTMLInputElement).value.trim();

            const data: { name?: string; url?: string } = {};
            if (name) data.name = name;
            if (rawUrl) {
                // Prepend http:// if the user omitted the scheme
                data.url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `http://${rawUrl}`;
            }

            loading.show();
            updateBackend.mutate(
                { backendId, data },
                {
                    onSuccess: () => {
                        loading.hide();
                        setToastMessage(globalize.translate('SettingsSaved'));
                        setIsToastOpen(true);
                    },
                    onError: (err) => {
                        loading.hide();
                        console.error('[proxybackenddetail] failed to update backend', err);
                        const apiMessage =
                            (err as { response?: { data?: { error?: string } } })
                                ?.response?.data?.error;
                        setToastMessage(apiMessage ?? globalize.translate('ErrorDefault'));
                        setIsToastOpen(true);
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
    }, [backendId, updateBackend]);

    const handleToggleEnabled = useCallback(() => {
        if (!backendId || !backend) return;
        updateBackend.mutate(
            { backendId, data: { enabled: !backend.enabled } },
            {
                onSuccess: () => {
                    setToastMessage(globalize.translate('SettingsSaved'));
                    setIsToastOpen(true);
                }
            }
        );
    }, [backendId, backend, updateBackend]);

    const handleDeleteMapping = useCallback((mapping: BackendUserMapping) => {
        if (!backendId) return;
        confirm(
            globalize.translate('MessageAreYouSure'),
            globalize.translate('HeaderRemoveUserMapping')
        ).then(() => {
            deleteMapping.mutate({ backendId, mappingId: mapping.id });
        }).catch(() => { /* cancelled */ });
    }, [backendId, deleteMapping]);

    const handleLoginSubmit = useCallback(() => {
        if (!backendId || !loginProxyUserId || !loginUsername || !loginPassword) {
            setLoginError(globalize.translate('MessagePleaseFillInAllFields'));
            return;
        }
        setLoginError('');
        setIsLoginPending(true);
        loginToBackend.mutate(
            { backendId, data: { proxyUserId: loginProxyUserId, username: loginUsername, password: loginPassword } },
            {
                onSuccess: () => {
                    setIsLoginPending(false);
                    setIsLoginDialogOpen(false);
                    setLoginUsername('');
                    setLoginPassword('');
                    setLoginProxyUserId('');
                    setToastMessage(globalize.translate('SettingsSaved'));
                    setIsToastOpen(true);
                },
                onError: (err) => {
                    setIsLoginPending(false);
                    console.error('[proxybackenddetail] login failed', err);
                    const apiMessage =
                        (err as { response?: { data?: { error?: string } } })
                            ?.response?.data?.error;
                    setLoginError(apiMessage ?? globalize.translate('MessageLoginFailed'));
                }
            }
        );
    }, [backendId, loginToBackend, loginProxyUserId, loginUsername, loginPassword]);

    if (isBackendsPending || !backend) return <Loading />;

    return (
        <Page id='proxyBackendDetailPage' className='mainAnimatedPage type-interior'>
            <Toast open={isToastOpen} onClose={handleToastClose} message={toastMessage} />
            <div ref={element} className='content-primary'>

                {/* ── Backend settings ─────────────────────────── */}
                <form>
                    <div className='verticalSection'>
                        <SectionTitleContainer title={backend.name} />
                    </div>

                    <div className='inputContainer'>
                        <Input type='text' id='txtName' label={globalize.translate('LabelName')} />
                    </div>
                    <div className='inputContainer'>
                        <Input type='text' id='txtUrl' label={globalize.translate('LabelBackendURL')} />
                        <div className='fieldDescription'>{globalize.translate('LabelBackendURLHelp')}</div>
                    </div>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={backend.enabled}
                                onChange={handleToggleEnabled}
                            />
                        }
                        label={globalize.translate('OptionEnableBackend')}
                    />
                    <div className='fieldDescription' style={{ marginTop: '-0.5em', marginBottom: '1em' }}>
                        {globalize.translate('OptionEnableBackendHelp')}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5em', marginTop: '1em' }}>
                        <Button
                            type='submit'
                            id='btnSave'
                            className='raised button-submit'
                            title={globalize.translate('Save')}
                        >
                            <span>{globalize.translate('Save')}</span>
                        </Button>
                        <Button
                            type='button'
                            className='raised button-cancel'
                            title={globalize.translate('ButtonCancel')}
                            onClick={handleNavigateBack}
                        >
                            <span>{globalize.translate('ButtonCancel')}</span>
                        </Button>
                    </div>
                </form>

                {/* ── Mapped users ─────────────────────────────── */}
                <div className='verticalSection' style={{ marginTop: '2em' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 className='sectionTitle'>{globalize.translate('HeaderMappedUsers')}</h2>
                        <Button
                            type='button'
                            className='raised button-submit'
                            title={globalize.translate('ButtonLoginToBackend')}
                            onClick={handleOpenLoginDialog}
                        >
                            <span className='material-icons' style={{ marginRight: '0.3em' }}>login</span>
                            <span>{globalize.translate('ButtonLoginToBackend')}</span>
                        </Button>
                    </div>

                    {isMappingsPending ? (
                        <Loading />
                    ) : (
                        <MappingsTable
                            mappings={mappings ?? []}
                            onDelete={handleDeleteMapping}
                        />
                    )}
                </div>
            </div>

            {/* ── Login to backend dialog ───────────────────── */}
            <LoginDialog
                open={isLoginDialogOpen}
                proxyUsers={proxyUsers ?? []}
                loginProxyUserId={loginProxyUserId}
                loginUsername={loginUsername}
                loginPassword={loginPassword}
                loginError={loginError}
                isLoginPending={isLoginPending}
                onProxyUserChange={handleProxyUserChange}
                onUsernameChange={handleUsernameChange}
                onPasswordChange={handlePasswordChange}
                onSubmit={handleLoginSubmit}
                onCancel={handleCancelLogin}
            />
        </Page>
    );
};

// ── Sub-components to avoid inline arrow functions ────────────────────────────

interface MappingsTableProps {
    mappings: BackendUserMapping[];
    onDelete: (m: BackendUserMapping) => void;
}

const MappingsTable = ({ mappings, onDelete }: MappingsTableProps) => (
    <table className='tblApiKeys detailTable' style={{ width: '100%', marginTop: '1em' }}>
        <thead>
            <tr>
                <th className='detailTableHeaderCell'>{globalize.translate('LabelUser')}</th>
                <th className='detailTableHeaderCell'>{globalize.translate('LabelBackendUserId')}</th>
                <th className='detailTableHeaderCell'>{globalize.translate('LabelStatus')}</th>
                <th className='detailTableHeaderCell' />
            </tr>
        </thead>
        <tbody>
            {mappings.map(m => (
                <MappingRow key={m.id} mapping={m} onDelete={onDelete} />
            ))}
            {mappings.length === 0 && (
                <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '1em', opacity: 0.6 }}>
                        {globalize.translate('MessageNoMappedUsers')}
                    </td>
                </tr>
            )}
        </tbody>
    </table>
);

interface MappingRowProps {
    mapping: BackendUserMapping;
    onDelete: (m: BackendUserMapping) => void;
}

const MappingRow = ({ mapping, onDelete }: MappingRowProps) => {
    const handleDelete = useCallback(() => onDelete(mapping), [mapping, onDelete]);
    const statusLabel = mapping.enabled ?
        globalize.translate('Active') :
        globalize.translate('Disabled');

    return (
        <tr>
            <td className='detailTableBodyCell'>{mapping.username}</td>
            <td className='detailTableBodyCell'><code>{mapping.backendUserId}</code></td>
            <td className='detailTableBodyCell'>{statusLabel}</td>
            <td className='detailTableBodyCell' style={{ textAlign: 'right' }}>
                <Button
                    type='button'
                    className='raised button-delete'
                    title={globalize.translate('Delete')}
                    onClick={handleDelete}
                >
                    <span>{globalize.translate('Delete')}</span>
                </Button>
            </td>
        </tr>
    );
};

interface LoginDialogProps {
    open: boolean;
    proxyUsers: { id: string; displayName: string; username: string }[];
    loginProxyUserId: string;
    loginUsername: string;
    loginPassword: string;
    loginError: string;
    isLoginPending: boolean;
    onProxyUserChange: (e: SelectChangeEvent) => void;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

const LoginDialog = ({
    open, proxyUsers, loginProxyUserId, loginUsername, loginPassword,
    loginError, isLoginPending,
    onProxyUserChange, onUsernameChange, onPasswordChange, onSubmit, onCancel
}: LoginDialogProps) => (
    <Dialog open={open} onClose={onCancel} maxWidth='xs' fullWidth>
        <DialogTitle>{globalize.translate('ButtonLoginToBackend')}</DialogTitle>
        <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.875em' }}>
                    {globalize.translate('MessageLoginToBackendHelp')}
                </p>
                <FormControl fullWidth size='small'>
                    <InputLabel id='login-proxy-user-label'>{globalize.translate('LabelUser')}</InputLabel>
                    <Select
                        labelId='login-proxy-user-label'
                        value={loginProxyUserId}
                        label={globalize.translate('LabelUser')}
                        onChange={onProxyUserChange}
                    >
                        <MenuItem value=''><em>{'— ' + globalize.translate('LabelSelectUser') + ' —'}</em></MenuItem>
                        {proxyUsers.map(u => (
                            <MenuItem key={u.id} value={u.id}>{u.displayName || u.username}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label={globalize.translate('LabelBackendUsername')}
                    value={loginUsername}
                    onChange={onUsernameChange}
                    fullWidth
                    size='small'
                    autoComplete='username'
                />
                <TextField
                    label={globalize.translate('LabelPassword')}
                    type='password'
                    value={loginPassword}
                    onChange={onPasswordChange}
                    fullWidth
                    size='small'
                    autoComplete='current-password'
                />
                {loginError && (
                    <p style={{ margin: 0, color: 'var(--color-error, #f44336)', fontSize: '0.875em' }}>{loginError}</p>
                )}
            </Stack>
        </DialogContent>
        <DialogActions>
            <MuiButton onClick={onCancel} variant='text'>
                {globalize.translate('ButtonCancel')}
            </MuiButton>
            <MuiButton onClick={onSubmit} variant='contained' disabled={isLoginPending}>
                {isLoginPending ?
                    globalize.translate('Loading') :
                    globalize.translate('ButtonLoginToBackend')}
            </MuiButton>
        </DialogActions>
    </Dialog>
);

export default ProxyBackendDetail;

