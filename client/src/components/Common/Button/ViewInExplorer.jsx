import { getExplorer } from '@cd/selectors/settings';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { viewInExplorer } from '../../../helpers/redirect';
import './ViewInExplorer.scss';

const ViewInExplorer = ({ type, value, text }) => {
	const explorerUrl = useSelector(getExplorer);
	return (
		<OverlayTrigger placement="top" overlay={<Tooltip>View in explorer</Tooltip>}>
			<>
				{text}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="11"
					height="11"
					fill="currentColor"
					className="bi bi-box-arrow-up-right cd_btn_explorer"
					viewBox="0 0 16 16"
					onClick={() => viewInExplorer({ type, value, explorerUrl })}
				>
					<path
						fill="#989a9b"
						fillRule="evenodd"
						d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
					/>
					<path
						fill="#989a9b"
						fillRule="evenodd"
						d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
					/>
				</svg>
			</>
		</OverlayTrigger>
	);
};

export default ViewInExplorer;
