import React, { useCallback, useEffect, useRef, useState } from 'react';
import globalize from '../../../../lib/globalize';
import confirm from '../../../../components/confirm/confirm';
import ProxyUserCardBox from '../../../../components/dashboard/proxyusers/ProxyUserCardBox';
import SectionTitleContainer from '../../../../elements/SectionTitleContainer';
import '../../../../elements/emby-button/emby-button';
import '../../../../elements/emby-button/paper-icon-button-light';
import '../../../../components/cardbuilder/card.scss';
import '../../../../components/indicators/indicators.scss';
import '../../../../styles/flexstyles.scss';
import Page from '../../../../components/Page';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from 'apps/dashboard/components/Toast';
import { useProxyUsers } from 'apps/dashboard/features/proxyusers/api/useProxyUsers';
import { useDeleteProxyUser } from 'apps/dashboard/features/proxyusers/api/useDeleteProxyUser';
import Loading from 'components/loading/LoadingComponent';
import dom from 'utils/dom';
import type { ProxyUser } from 'types/proxyUser';

type MenuEntry = {
    name?: string;
    id?: string;
    icon?: string;
};

const ProxyUserProfiles = () => {
    const location = useLocation();
    const [isSettingsSavedToastOpen, setIsSettingsSavedToastOpen] = useState(false);
    const element = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { data: users, isPending } = useProxyUsers();
    const deleteProxyUser = useDeleteProxyUser();


    const handleToastClose = useCallback(() => {
        setIsSettingsSavedToastOpen(false);
    }, []);

    useEffect(() => {
        const page = element.current;

        if (location.state?.openSavedToast) {
            setIsSettingsSavedToastOpen(true);
            window.history.replaceState({}, '');
        }

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }

        const showUserMenu = (elem: HTMLElement) => {
            const card = dom.parentWithClass(elem, 'card');
            const userId = card?.getAttribute('data-userid');
            const username = card?.getAttribute('data-username');

            if (!userId) {
                console.error('Unexpected null user id');
                return;
            }

            const menuItems: MenuEntry[] = [];

            menuItems.push({
                name: globalize.translate('ButtonEdit'),
                id: 'open',
                icon: 'mode_edit'
            });
            menuItems.push({
                name: globalize.translate('Delete'),
                id: 'delete',
                icon: 'delete'
            });

            import('../../../../components/actionSheet/actionSheet').then(({ default: actionsheet }) => {
                actionsheet.show({
                    items: menuItems,
                    positionTo: card,
                    callback: function (id: string) {
                        switch (id) {
                            case 'open':
                                navigate(`/dashboard/proxyusers/profile?userId=${userId}`);
                                break;

                            case 'delete':
                                confirmDeleteUser(userId, username);
                        }
                    }
                }).catch(() => {
                    // action sheet closed
                });
            }).catch(err => {
                console.error('[proxyuserprofiles] failed to load action sheet', err);
            });
        };

        const confirmDeleteUser = (id: string, username?: string | null) => {
            const title = username ? globalize.translate('DeleteName', username) : globalize.translate('Delete');
            const text = globalize.translate('MessageAreYouSure');

            confirm({
                title,
                text,
                confirmText: globalize.translate('Delete'),
                primary: 'delete'
            }).then(function () {
                deleteProxyUser.mutate(id);
            }).catch(() => {
                // confirm dialog closed
            });
        };

        const onPageClick = function (e: MouseEvent) {
            const btnUserMenu = dom.parentWithClass(e.target as HTMLElement, 'btnProxyUserMenu');

            if (btnUserMenu) {
                showUserMenu(btnUserMenu);
            }
        };

        const onAddUserClick = function() {
            navigate('/dashboard/proxyusers/add');
        };

        page.addEventListener('click', onPageClick);
        (page.querySelector('#btnAddProxyUser') as HTMLButtonElement)?.addEventListener('click', onAddUserClick);

        return () => {
            page.removeEventListener('click', onPageClick);
            (page.querySelector('#btnAddProxyUser') as HTMLButtonElement)?.removeEventListener('click', onAddUserClick);
        };
    }, [navigate, deleteProxyUser, location.state?.openSavedToast]);

    if (isPending) {
        return <Loading />;
    }

    return (
        <Page
            id='proxyUserProfilesPage'
            className='mainAnimatedPage type-interior userProfilesPage fullWidthContent'
            title={globalize.translate('HeaderProxyUsers')}
        >
            <Toast
                open={isSettingsSavedToastOpen}
                onClose={handleToastClose}
                message={globalize.translate('SettingsSaved')}
            />
            <div ref={element} className='content-primary'>
                <div className='verticalSection'>
                    <SectionTitleContainer
                        title={globalize.translate('HeaderProxyUsers')}
                        isBtnVisible={true}
                        btnId='btnAddProxyUser'
                        btnClassName='fab submit sectionTitleButton'
                        btnTitle='ButtonAddProxyUser'
                        btnIcon='add'
                    />
                </div>

                <div className='localUsers itemsContainer vertical-wrap'>
                    {users?.map((user: ProxyUser) => {
                        return <ProxyUserCardBox key={user.id} user={user} />;
                    })}
                </div>
            </div>
        </Page>
    );
};

export default ProxyUserProfiles;

