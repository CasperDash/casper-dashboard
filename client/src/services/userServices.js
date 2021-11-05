import { CLPublicKey } from 'casper-js-sdk';
import { MOTE_RATE } from '../constants/key';
import { getTransferDeploy, signDeploy } from './casperServices';

export const getSignedTransferDeploy = async (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, transferId = 0, fee } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		const transferDeploy = getTransferDeploy(fromPbKey, toPbKey, amount * MOTE_RATE, transferId, fee);
		const signedDeploy = await signDeploy(transferDeploy, fromAddress, toAddress);

		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};
