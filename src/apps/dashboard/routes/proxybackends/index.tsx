import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import globalize from '../../../../lib/globalize';
import confirm from '../../../../components/confirm/confirm';
import Page from '../../../../components/Page';
import Loading from 'components/loading/LoadingComponent';
import SectionTitleContainer from '../../../../elements/SectionTitleContainer';
import IconButtonElement from '../../../../elements/IconButtonElement';
import Toast from 'apps/dashboard/components/Toast';
import dom from 'utils/dom';
import '../../../../elements/emby-button/emby-button';
import '../../../../elements/emby-button/paper-icon-button-light';
import '../../../../components/cardbuilder/card.scss';
import '../../../../styles/flexstyles.scss';
import { useProxyBackends } from 'apps/dashboard/features/proxyusers/api/useProxyBackends';
import { useDeleteProxyBackend } from 'apps/dashboard/features/proxyusers/api/useDeleteProxyBackend';
import { useUpdateProxyBackend } from 'apps/dashboard/features/proxyusers/api/useUpdateProxyBackend';
import type { ProxyBackend } from 'types/proxyUser';

type MenuEntry = { name?: string; id?: string; icon?: string };

const ProxyBackends = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const element = useRef<HTMLDivElement>(null);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const { data: backends, isPending } = useProxyBackends();
    const deleteBackend = useDeleteProxyBackend();
    const updateBackend = useUpdateProxyBackend();

    const handleToastClose = useCallback(() => setIsToastOpen(false), []);

    useEffect(() => {
        if (location.state?.openSavedToast) {
            setToastMessage(globalize.translate('SettingsSaved'));
            setIsToastOpen(true);
            window.history.replaceState({}, '');
        }
    }, [location.state]);

    useEffect(() => {
        const page = element.current;
        if (!page || !backends) return;

        const showMenu = (elem: HTMLElement) => {
            const card = dom.parentWithClass(elem, 'card');
            const backendId = card?.getAttribute('data-backendid');
            const backend = backends.find(b => b.id === backendId);
            if (!backendId || !backend) return;

            const menuItems: MenuEntry[] = [
                { name: globalize.translate('ButtonEdit'), id: 'open', icon: 'mode_edit' },
                {
                    name: backend.enabled ?
                        globalize.translate('ButtonDisable') :
                        globalize.translate('ButtonEnable'),
                    id: 'toggleEnabled',
                    icon: backend.enabled ? 'block' : 'check_circle'
                },
                { name: globalize.translate('Delete'), id: 'delete', icon: 'delete' }
            ];

            import('../../../../components/actionSheet/actionSheet').then(({ default: actionsheet }) => {
                actionsheet.show({
                    items: menuItems,
                    positionTo: card,
                    callback: (id: string) => {
                        if (id === 'open') {
                            navigate(`/dashboard/proxybackends/detail?backendId=${backendId}`);
                        } else if (id === 'toggleEnabled') {
                            updateBackend.mutate(
                                { backendId, data: { enabled: !backend.enabled } },
                                {
                                    onSuccess: () => {
                                        setToastMessage(globalize.translate('SettingsSaved'));
                                        setIsToastOpen(true);
                                    }
                                }
                            );
                        } else if (id === 'delete') {
                            confirm(
                                globalize.translate('MessageAreYouSure'),
                                globalize.translate('HeaderDeleteBackend')
                            ).then(() => {
                                deleteBackend.mutate(backendId, {
                                    onSuccess: () => {
                                        setToastMessage(globalize.translate('SettingsSaved'));
                                        setIsToastOpen(true);
                                    }
                                });
                            }).catch(() => { /* cancelled */ });
                        }
                    }
                });
            }).catch(console.error);
        };

        const onAddClick = () => navigate('/dashboard/proxybackends/add');

        const onClick = (e: Event) => {
            const btn = dom.parentWithClass(e.target as HTMLElement, 'btnBackendMenu');
            if (btn) showMenu(btn);
        };

        const addBtn = page.querySelector('#btnAddBackend') as HTMLButtonElement;
        addBtn?.addEventListener('click', onAddClick);
        page.addEventListener('click', onClick);
        return () => {
            addBtn?.removeEventListener('click', onAddClick);
            page.removeEventListener('click', onClick);
        };
    }, [backends, navigate, deleteBackend, updateBackend]);

    if (isPending) return <Loading />;

    return (
        <Page
            id='proxyBackendsPage'
            className='mainAnimatedPage type-interior fullWidthContent'
            title={globalize.translate('HeaderProxyBackends')}
        >
            <Toast open={isToastOpen} onClose={handleToastClose} message={toastMessage} />
            <div ref={element} className='content-primary'>
                <div className='verticalSection'>
                    <SectionTitleContainer
                        title={globalize.translate('HeaderProxyBackends')}
                        isBtnVisible={true}
                        btnId='btnAddBackend'
                        btnClassName='fab submit sectionTitleButton'
                        btnTitle='ButtonAddBackend'
                        btnIcon='add'
                    />
                </div>

                <div className='localUsers itemsContainer vertical-wrap'>
                    {(backends ?? []).map((backend: ProxyBackend) => (
                        <div
                            key={backend.id}
                            data-backendid={backend.id}
                            className='card squareCard scalableCard squareCard-scalable'
                        >
                            <div className='cardBox visualCardBox'>
                                <div className='cardScalable visualCardBox-cardScalable'>
                                    <div className='cardPadder cardPadder-square' />
                                    <a
                                        className='cardContent'
                                        href={`#/dashboard/proxybackends/detail?backendId=${backend.id}`}
                                    >
                                        <div className='cardImage flex align-items-center justify-content-center defaultCardColor1'>
                                            <span className='material-icons cardImageIcon dns' aria-hidden='true' />
                                        </div>
                                    </a>
                                </div>
                                <div className='cardFooter visualCardBox-cardFooter'>
                                    <div style={{ textAlign: 'right', float: 'right', paddingTop: '5px' }}>
                                        <IconButtonElement
                                            is='paper-icon-button-light'
                                            className='btnBackendMenu flex-shrink-zero'
                                            icon='more_vert'
                                        />
                                    </div>
                                    <div className='cardText'>{backend.name}</div>
                                    <div className='cardText cardText-secondary'>
                                        {backend.url}
                                        {!backend.enabled && (
                                            <span style={{ marginLeft: '0.5em', opacity: 0.6 }}>
                                                ({globalize.translate('Disabled')})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Page>
    );
};

export default ProxyBackends;

