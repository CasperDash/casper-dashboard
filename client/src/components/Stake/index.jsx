import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	EXPLORER_URL,
	CASPER_SYMBOL,
	CSPR_AUCTION_DELEGATE_FEE,
	CSPR_AUCTION_UNDELEGATE_FEE,
	ENTRY_POINT_DELEGATE,
	ENTRY_POINT_UNDELEGATE,
} from '../../constants/key';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import StakingAccountList from '../Common/Layout/Stake/Table';
import StakingForm from '../Common/Layout/Stake/Form';
import { MessageModal } from '../Common/Layout/Modal/MessageModal';

import { getMassagedUserDetails, getPublicKey } from '../../selectors/user';
import { getCurrentPrice } from '../../selectors/price';
import { getValidators } from '../../selectors/validator';
import { fetchValidators } from '../../actions/stakeActions';
import { getPendingStakes } from '../../selectors/stake';
import { useStakeWithStatus } from '../hooks/useStakeDeploys';

const UnlockSingerWarning = ({ title, message }) => (
	<section className="cd_staking_page">
		<HeadingModule name={title} />
		<div className="cd_staking_capser_locked">
			<div className="cd_main_message">
				<Alert variant="danger">{message}</Alert>
			</div>
		</div>
	</section>
);

const ConfirmingTransactionsInfo = (transactions) => {
	if (!transactions || !transactions.length) {
		return;
	}

	if (transactions.length === 1) {
		return (
			<Alert variant={'info'} show={!!transactions.length}>
				Confirming transaction ...{' '}
				<Alert.Link rel="noopner noreferrer" target="_blank" href={`${EXPLORER_URL}/deploy/${transactions[0]}`}>
					View on explorer
				</Alert.Link>
			</Alert>
		);
	}

	return (
		<Alert variant={'info'} show={!!transactions.length}>
			Confirming transactions ...{' '}
		</Alert>
	);
};

const getStakeFee = (action) =>
	ENTRY_POINT_DELEGATE === action ? CSPR_AUCTION_DELEGATE_FEE : CSPR_AUCTION_UNDELEGATE_FEE;

/**
 * Get account balance  and stacked amount by the specific validator
 *
 * @param {String} action
 * @param {Object} userDetails
 * @param {Array} stakingDeployList
 * @param {String} selectedValidator
 * @returns
 */
const getBalances = (action, userDetails, stakingDeployList, selectedValidator) => {
	let displayBalance = {
		accountBalance: userDetails && userDetails.balance ? userDetails.balance.displayBalance : 0,
		validatorStakedBalance: 0,
	};
	if (ENTRY_POINT_DELEGATE === action) {
		return displayBalance;
	}

	if (stakingDeployList) {
		const foundItem = stakingDeployList.find((item) => selectedValidator.validator === item.validator);
		return foundItem ? { ...displayBalance, validatorStakedBalance: foundItem.successAmount } : displayBalance;
	}

	return displayBalance;
};

const Stake = () => {
	const dispatch = useDispatch();

	// State
	const [send, setSend] = useState(false);
	const [showError, setShowError] = useState(false);
	// Used when user selects the validator from table to delegate or undelegate
	const [defaultValidator, setDefaultValidator] = useState(null);
	const [stakeAction, setStakeAction] = useState(ENTRY_POINT_DELEGATE);

	// Selector
	const publicKey = useSelector(getPublicKey);
	const currentPrice = useSelector(getCurrentPrice);
	const validators = useSelector(getValidators);
	const userDetails = useSelector(getMassagedUserDetails);
	const pendingStakes = useSelector(getPendingStakes());
	const stakingDeployList = useStakeWithStatus(publicKey);

	useEffect(() => {
		dispatch(fetchValidators());
	}, [dispatch]);

	// Function

	/**
	 * Show/hide stake form
	 *
	 * @param {Object} props
	 * @returns
	 */
	const handleToggle = (props) => {
		if (!publicKey) {
			setShowError(true);
			return;
		}

		if (props && props.forceOpen) {
			setSend(true);
			return;
		}

		setSend(!send);
	};

	/**
	 * Delegate callback to set the default validator to delegate
	 *
	 * @param {Object} validator
	 */
	const delegate = (validator) => {
		setDefaultValidator(validator);
		setStakeAction(ENTRY_POINT_DELEGATE);
		handleToggle({ forceOpen: true });
	};

	/**
	 * Undelegate callback to set the default validator to undelegate
	 *
	 * @param {Object} validator
	 */
	const undelegate = (validator) => {
		setDefaultValidator(validator);
		setStakeAction(ENTRY_POINT_UNDELEGATE);
		handleToggle({ forceOpen: true });
	};

	const displayBalance = getBalances(stakeAction, userDetails, stakingDeployList, defaultValidator);
	const toggleStakingForm = send ? 'toggle_form' : '';
	if (!publicKey) {
		return (
			<UnlockSingerWarning
				title={'Staking'}
				message={'Please unlock your Casper Signer to see your delegations'}
			/>
		);
	}

	return (
		<>
			<section className="cd_staking_page">
				{ConfirmingTransactionsInfo(pendingStakes)}
				<HeadingModule name={'Staking'} />
				<div className={`cd_staking_component ${toggleStakingForm}`}>
					{pendingStakes && pendingStakes.length === 0 && (
						<div className="cd_send_currency_btn_text cd_btn_stake_cspr">
							<Button className=" cd_send_currency_btn" onClick={handleToggle}>
								Stake CSPR
							</Button>
						</div>
					)}
					<div className="cd_staking_form">
						<StakingForm
							action={stakeAction}
							defaultValidator={defaultValidator}
							validators={validators}
							handleToggle={handleToggle}
							fromAddress={publicKey}
							csprPrice={currentPrice}
							balance={displayBalance}
							tokenSymbol={CASPER_SYMBOL}
							fee={getStakeFee(stakeAction)}
						/>
					</div>
					{stakingDeployList && stakingDeployList.length > 0 && (
						<h3 className="cd_transaction_list_main_heading">Your Delegations</h3>
					)}
					<StakingAccountList
						stakingDeployList={stakingDeployList}
						delegateFunc={(validator) => delegate(validator)}
						unDelegateFunc={(validator) => undelegate(validator)}
					/>
				</div>
				<MessageModal
					type="Error"
					message="Please unlock your Casper Signer"
					show={showError}
					handleClose={() => setShowError(false)}
				/>
			</section>
		</>
	);
};

export default Stake;
