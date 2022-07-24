import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getConnectedAccountLocalStorage } from '@cd/actions/userActions';
import { getPublicKey } from '@cd/selectors/user';

const WithAccount = ({ children }) => {
  const cacheConnectedAccount = getConnectedAccountLocalStorage();
  const { publicKey: publicKeyCache, loginOptions: loginOptionsCache } = cacheConnectedAccount;
  console.log(`🚀 ~ WithAccount ~ loginOptionsCache`, loginOptionsCache)
  console.log(`🚀 ~ WithAccount ~ publicKeyCache`, publicKeyCache)
	// Hook
  /**
   * publicKey is cleared after closing extension (Clicking on CD extension icon)
   * We should store this somewhere else
   */
	const publicKey = useSelector(getPublicKey);
  console.log(`🚀 ~ WithAccount ~ publicKey`, publicKey)
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
    /**
     * Navigate to `/welcomeBack` screen when found cached User info
     * Otherwiest, redirect back to connect Account screen
     */
    if (!publicKey) {
      if (loginOptionsCache?.userHashingOptions) {
        navigate('/welcomeBack');
        return;
      }

      navigate('/connectAccount');
    }
	}, [cacheConnectedAccount, publicKey, navigate, dispatch, publicKeyCache, loginOptionsCache]);

	return children;
};

export default WithAccount;
