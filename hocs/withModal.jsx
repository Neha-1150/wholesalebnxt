import { useState } from 'react';
import SimpleModal from './modals/SimpleModal';

/**
 *
 * @param {Object} WrappedModalComponent
 * @param {Object} {
 *  `popupShow,
 *   heading,
 *   description,
 *   type,
 *   primaryBtnText,
 *   secondaryBtnText,
 *   onPrimaryClick,
 *   onSecondaryClick,
 *   onClose`
 * } - props to pass to the wrapped component
 * @returns {Object}
 */
const withModal = WrappedModalComponent => {
	return props => {
		const [open, setOpen] = useState(false);
		const [modalConfig, setModalConfig] = useState({});

		/**
		 * @param {Object} {
		 *  `popupShow,
		 *   heading,
		 *   description,
		 *   type,
		 *   primaryBtnText,
		 *   secondaryBtnText,
		 *   onPrimaryClick,
		 *   onSecondaryClick,
		 *   onClose`
		 * } - props to pass to the wrapped component
		 * @returns {Object}
		 */
		const setPopup = ({ popupShow, heading, description, type, primaryBtnText, secondaryBtnText, onPrimaryClick, onSecondaryClick, onClose }) => {
			if (popupShow) {
				setModalConfig({
					...(heading && { heading }),
					...(description && { description }),
					...(type && { type }),
					...(primaryBtnText && { primaryBtnText }),
					...(secondaryBtnText && { secondaryBtnText }),
					...(onPrimaryClick && { onPrimaryClick }),
					...(onSecondaryClick && { onSecondaryClick }),
					...(onClose && { onClose }),
				});
				setOpen(true);
			} else {
				setOpen(false);
			}
		};
		return (
			<>
				<WrappedModalComponent {...props} setPopup={setPopup} />
				<SimpleModal
					setOpen={setOpen}
					heading={modalConfig.heading}
					description={modalConfig.description}
					type={modalConfig.type}
					primaryBtnText={modalConfig.primaryBtnText}
					secondaryBtnText={modalConfig.secondaryBtnText}
					{...(modalConfig?.onClose ? { onClose: () => modalConfig?.onClose() } : { onClose: () => setPopup(false) })}
					{...(modalConfig?.onSecondaryClick && { onSecondaryClick: () => modalConfig?.onSecondaryClick() })}
					{...(modalConfig?.onPrimaryClick && { onPrimaryClick: () => modalConfig?.onPrimaryClick() })}
					open={open}
				/>
			</>
		);
	};
};

export default withModal;
