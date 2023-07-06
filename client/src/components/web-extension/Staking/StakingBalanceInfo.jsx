import React from 'react';
import _get from 'lodash-es/get';

import { useWallet } from '@cd/components/hooks/useWallet';
import { useSelector } from 'react-redux';
import { getPublicKey } from '@cd/selectors/user';
import { useStakeInfo } from '@cd/components/hooks/useStakeInfo';
import { getLatestMarketInfo } from '@cd/selectors/price';
import { getValueByFormat } from '@cd/helpers/format';
import CSPRImg from '@cd/assets/image/token-icons/cspr.png';

import './StakingBalanceInfo.scss';

const BalanceNumber = ({ value }) => (
    <div className="cd_we_staking_balance_info__number">
        <img src={CSPRImg} width={10} height={10}/>
        <span>
            {value}
        </span>
    </div>
);

export const StakingBalanceInfo = () => {
    const csprMarketInfo = useSelector(getLatestMarketInfo);
    const publicKey = useSelector(getPublicKey);
    const { balance, formattedBalance, formattedBalanceInFiat } = useWallet();
    const { 
        totalStaked,
        formattedTotalStaked, 
        formattedTotalStakedInFiat, 
        totalUndelegating,
        formattedTotalUndelegating, 
        formattedTotalUndelegatingInFiat 
    } = useStakeInfo(publicKey);

    const totalBalance = balance + totalStaked + totalUndelegating;
    const formattedTotalBalance = getValueByFormat(totalBalance, { format: 'number' });
    const totalBalanceInFiat = totalBalance * _get(csprMarketInfo, 'price', 0);
    const formattedTotalBalanceInFiat = getValueByFormat(totalBalanceInFiat, { format: 'number' });

    return (
        <div className="cd_we_staking_balance_info">
            <div className="cd_we_staking_balance_info__total">
                <div className="cd_we_staking_balance_info__title">Total</div>
                <div className="cd_we_staking_balance_info__total--number">
                    <BalanceNumber value={formattedTotalBalance} />
                </div>
                <div className="cd_we_staking_balance_info__fiat">${formattedTotalBalanceInFiat}</div>
            </div>
            <div className="cd_we_staking_balance_info__section">
                <div className="cd_we_staking_balance_info__availiable">
                    <div className="cd_we_staking_balance_info__title">Availiable</div>
                    <div className="cd_we_staking_balance_info__amount">
                        <BalanceNumber value={formattedBalance} />
                    </div>
                    <div className="cd_we_staking_balance_info__fiat">${formattedBalanceInFiat}</div>
                </div>
                <div className="cd_we_staking_balance_info__staked">
                    <div className="cd_we_staking_balance_info__title">Staked</div>
                    <div className="cd_we_staking_balance_info__amount">
                        <BalanceNumber value={formattedTotalStaked} />
                    </div>
                    <div className="cd_we_staking_balance_info__fiat">${formattedTotalStakedInFiat}</div>
                </div>
                <div className="cd_we_staking_balance_info__undelegating">
                    <div className="cd_we_staking_balance_info__title">Undelegating</div>
                    <div className="cd_we_staking_balance_info__amount">
                        <BalanceNumber value={formattedTotalUndelegating} />
                    </div>
                    <div className="cd_we_staking_balance_info__fiat">${formattedTotalUndelegatingInFiat}</div>
                </div>
            </div>
        </div>
    )
}