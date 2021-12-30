import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useAutoRefreshEffect } from '../../../hooks/useAutoRefreshEffect';
import { getPublicKey } from '../../../../selectors/user';
import { getTheme } from '../../../../selectors/settings';
import { getUserDetails, setPublicKey } from '../../../../actions/userActions';
import { switchTheme } from '../../../../actions/settingActions';
import { isValidPublicKey } from '../../../../helpers/validator';
import { DARK_THEME, LIGHT_THEME } from '../../../../constants/settings';
import { MiddleTruncatedText } from '../../MiddleTruncatedText';
import { setLedgerOptions } from '../../../../actions/ledgerActions';
import { getLedgerOptions } from '../../../../selectors/ledgerOptions';
import { getLedgerPublicKey, handleLedgerError, initLedgerApp } from '../../../../services/ledgerServices';
import useCasperSigner from '../../../hooks/useCasperSigner';
import { AddPublicKeyModal } from './AddPublicKeyModal';

const HeadingModule = (props) => {
	// Hook
	const publicKey = useSelector(getPublicKey);

	const { casperApp } = useSelector(getLedgerOptions);
	const dispatch = useDispatch();
	const { ConnectSignerButton, isAvailable } = useCasperSigner();

	// Selector
	const theme = useSelector(getTheme);

	// State
	const [showPublicKeyInput, setShowPublicKeyInput] = useState(false);
	const [publicKeyError, setPublicKeyError] = useState('');

	useAutoRefreshEffect(() => {
		if (publicKey) {
			dispatch(getUserDetails(publicKey));
		}
	}, [publicKey, dispatch]);

	const handleConnectLedger = async () => {
		try {
			const app = await initLedgerApp();
			const response = await getLedgerPublicKey(app);
			if (!response.publicKey) {
				alert('You must unlock the Casper App on your Ledger device to connect.');
				return;
			}

			const key = `02${response.publicKey.toString('hex')}`;
			dispatch(setPublicKey(key));
			dispatch(
				setLedgerOptions({
					app,
				}),
			);
		} catch (error) {
			handleLedgerError(error);
		}
	};

	const onClickViewMode = () => {
		setShowPublicKeyInput(true);
	};

	const onClosePublicKeyModal = () => {
		setShowPublicKeyInput(false);
	};

	const handleAddPublicKey = (pk) => {
		if (isValidPublicKey(pk)) {
			dispatch(setPublicKey(pk));
			onClosePublicKeyModal();
		} else {
			setPublicKeyError('Invalid public key');
		}
	};

	const onSwitchTheme = () => {
		const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
		dispatch(switchTheme(newTheme));
	};

	return (
		<>
			<div className="cd_all_page_heading_section">
				<div className="cd_all_page_heading">
					<h2>{props.name}</h2>
				</div>

				<div className="cd_all_page_notify_logout_btn">
					<Button className="cd_theme_switch" onClick={onSwitchTheme}>
						<i className={`bi ${theme === DARK_THEME ? 'bi-brightness-high-fill' : 'bi-moon-fill'}`} />
					</Button>
					{/* Display public key if available */}
					{publicKey && (
						<div className="cd_heading_public_key">
							<MiddleTruncatedText placement="bottom">{publicKey}</MiddleTruncatedText>
						</div>
					)}

					{/* Display connect ledger button if no public key */}
					{!publicKey && (
						<Button
							className="cd_all_page_logout_btn"
							onClick={handleConnectLedger}
						>{`Connect Ledger`}</Button>
					)}

					{/* Display view mode button if no casper signed installed */}
					{!publicKey && !isAvailable && (
						<Button className="cd_all_page_logout_btn" onClick={onClickViewMode}>
							View Mode
						</Button>
					)}

					<ConnectSignerButton />
				</div>
				<AddPublicKeyModal
					show={showPublicKeyInput}
					handleClose={onClosePublicKeyModal}
					handleAddPublicKey={handleAddPublicKey}
					error={publicKeyError}
				/>
			</div>
		</>
	);
};

export default HeadingModule;
