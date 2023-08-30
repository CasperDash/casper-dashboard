import React from 'react';

const ResetDataNotice = () => {
	return (
		<div className="cd_setting_modal">
			<p>
				CasperDash does not keep a copy of your password. If you’re having trouble unlocking your account, you
				will need to reset your wallet.
			</p>
			<p>
				Your current wallet, including <strong>accounts</strong> and <strong>assets</strong>{' '}
				<strong style={{ color: '#fa2852' }}>will be removed from this device permanently</strong>. Please
				acknowledge this action <strong>cannot be undone.</strong>
			</p>
			<p>
				You can <strong>ONLY</strong> recover with your Secret CasperDash Recovery Phrase which you provided
				when setting up this wallet. Make sure you&lsquo;re having a copy of your correct Secret Recovery
				Phrase.
			</p>
		</div>
	);
};

export default ResetDataNotice;
