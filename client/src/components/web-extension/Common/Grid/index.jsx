import React, { useCallback } from 'react';
import get from 'lodash-es/get';
import isFunction from 'lodash-es/isFunction';
import PropTypes from 'prop-types';
import { Bar } from '../../../Common/Spinner';
import NoData from '../../../Common/NoData';
import { getValueByFormat } from '../../../../helpers/format';
import './index.scss';

const Grid = ({ data = [], metadata = {}, onRowClick, className, isLoading }) => {
	// console.log(`🚀 ~ Grid ~ metadata`, metadata);
	// console.log(`🚀 ~ Grid ~ data`, data);
	const EMPTY_BALANCE = 0;
	const getFormattedValue = useCallback((item, token) => {
		const isEmptyBalance = Boolean(token?.balance?.displayValue === 0);
		return item.key === 'price' && isEmptyBalance
			? EMPTY_BALANCE
			: getValueByFormat(item.value || get(token, item.key), {
					format: item.format,
			});
	}, []);
	const renderGridItem = useCallback(
		(item, token) => {
      // console.log(`🚀 ~ Grid ~ token`, token)
			console.log(`🚀 ~ {metadata[key].map ~ item`, item);
			const Component = item.component;
			const WrapperComponent = item.wrapperComponent;
			const formattedValue = getFormattedValue(item, token);
      const shouldRender = (isFunction(item?.shouldDisplay) && !item.shouldDisplay(get(token, item.key))) ||
				!get(token, item.key);
      
      if (shouldRender) {
        return null;
      }

			return  (
				<div className={`cd_we_item_value ${item.type} ${item.valueAsClass ? formattedValue : ''}`} key={`${item.key}-${token.symbol}`}>
					{WrapperComponent ? (
						<WrapperComponent>{formattedValue}</WrapperComponent>
					) : Component ? (
						<Component {...(item.props && { ...item.props })} {...token} value={formattedValue} />
					) : (
						formattedValue
					)}{' '}
					{item.suffix}
				</div>
			);
		},
		[getFormattedValue],
	);

	return (
		<div className={`cd_we_grid ${className || ''}`}>
			{!isLoading && !data.length && <NoData />}
			{data.map((value, i) => {
				// console.log(`🚀 ~ {data.map ~ value`, value);
				// const isEmptyBalance = Boolean(value?.balance?.displayValue === 0);
				const canClick = typeof onRowClick === 'function';
				return (
					<div
						className={`cd_we_item ${canClick ? 'clickable' : ''} `}
						key={i}
						onClick={() => canClick && onRowClick(value)}
					>
						{Object.keys(metadata).map((key) => {
							return (
								<div className={`cd_we_item_${key}`} key={key}>
									{key === 'left' &&
										value.icon &&
										(Array.isArray(value.icon) ? (
											value.icon.map((ic, i) => {
												return (
													<div
														key={i}
														className={`cd_we_grid_icon ${
															metadata.left ? metadata.left.iconClassName || '' : ''
														}`}
													>
														{ic && <img src={ic} alt="grid" />}
													</div>
												);
											})
										) : (
											<div
												className={`cd_we_grid_icon ${
													metadata.left ? metadata.left.iconClassName || '' : ''
												}`}
											>
												<img src={value.icon} alt="grid" />
											</div>
										))}
									<div className="cd_we_item_content">
										{metadata[key].map((item) => {
											return renderGridItem(item, value);
											// console.log(`🚀 ~ {metadata[key].map ~ item`, item);
											// const Component = item.component;
											// const WrapperComponent = item.wrapperComponent;
											// const shouldRenderMarketPrice = Boolean(Component || WrapperComponent);
											// const compProps = item.props || {};
											// const formattedValue =
											// 	item.key === 'price' && isEmptyBalance
											// 		? EMPTY_BALANCE
											// 		: getValueByFormat(item.value || get(value, item.key), {
											// 				format: item.format,
											// 		  });
											// return (typeof item.shouldDisplay === 'function' &&
											// 	!item.shouldDisplay(get(value, item.key))) ||
											// 	!get(value, item.key) ? null : (
											// 	<div
											// 		className={`cd_we_item_value ${item.type} ${
											// 			item.valueAsClass ? formattedValue : ''
											// 		}`}
											// 		key={i}
											// 	>
											// 		{WrapperComponent ? (
											// 			<WrapperComponent>{formattedValue}</WrapperComponent>
											// 		) : Component ? (
											// 			<Component {...compProps} {...value} value={formattedValue} />
											// 		) : (
											// 			formattedValue
											// 		)}{' '}
											// 		{item.suffix}
											// 	</div>
											// );
										})
                  }
									</div>
								</div>
							);
						})}
					</div>
				);
			})}
			{isLoading && <Bar />}
		</div>
	);
};

Grid.propTypes = {
	/**
	 * Data display on grid
	 */
	data: PropTypes.array,
	/**
	 * Metadata of data pass to grid,
	 * each row will have max to 2 columns: left and right
	 * each column will have n items
	 * value for each item will get from data by key and format by type(css class) and format (formatter function)
	 * e.g {left:[{key: 'symbol',type:'primary'}],right:[{key: 'symbol',type:'primary'},{key: 'symbol', type:'secondary'}]}
	 */
	metadata: PropTypes.shape({
		left: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string,
				type: PropTypes.string,
				format: PropTypes.string,
			}),
		),
		right: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string,
				type: PropTypes.string,
				format: PropTypes.string,
			}),
		),
	}),
	/**
	 * On row click
	 */
	onRowClick: PropTypes.func,
};

export default Grid;
