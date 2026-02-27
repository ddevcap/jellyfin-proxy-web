import React, { FunctionComponent } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getLocaleWithSuffix } from '../../../utils/dateFnsLocale';
import globalize from '../../../lib/globalize';
import IconButtonElement from '../../../elements/IconButtonElement';
import LinkButton from '../../../elements/emby-button/LinkButton';
import { getDefaultBackgroundClass } from '../../cardbuilder/cardBuilderUtils';
import { ProxyUser } from 'types/proxyUser';

type IProps = {
    user?: ProxyUser;
};

const getLastSeenText = (updatedAt?: string | null) => {
    if (updatedAt) {
        return globalize.translate('LastSeen', formatDistanceToNow(Date.parse(updatedAt), getLocaleWithSuffix()));
    }

    return '';
};

const ProxyUserCardBox: FunctionComponent<IProps> = ({ user = {} as ProxyUser }: IProps) => {
    const cssClass = 'card squareCard scalableCard squareCard-scalable';
    const imageClass = 'cardImage';
    const lastSeen = getLastSeenText(user.updatedAt);
    const displayLabel = user.displayName || user.username;

    const renderImage = (
        <div className={`${imageClass} ${getDefaultBackgroundClass(displayLabel)} flex align-items-center justify-content-center`}>
            <span className='material-icons cardImageIcon person' aria-hidden='true'></span>
        </div>
    );

    return (
        <div data-userid={user.id} data-username={user.username} className={cssClass}>
            <div className='cardBox visualCardBox'>
                <div className='cardScalable visualCardBox-cardScalable'>
                    <div className='cardPadder cardPadder-square'></div>
                    <LinkButton
                        className='cardContent'
                        href={`#/dashboard/proxyusers/profile?userId=${user.id}`}>
                        {renderImage}
                    </LinkButton>
                </div>
                <div className='cardFooter visualCardBox-cardFooter'>
                    <div
                        style={{ textAlign: 'right', float: 'right', paddingTop: '5px' }}
                    >
                        <IconButtonElement
                            is='paper-icon-button-light'
                            className='btnProxyUserMenu flex-shrink-zero'
                            icon='more_vert'
                        />
                    </div>
                    <div className='cardText'>
                        <span>{displayLabel}</span>
                    </div>
                    <div className='cardText cardText-secondary'>
                        <span>{lastSeen}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProxyUserCardBox;

