import React, {useRef} from 'react';

import Button from '@material-ui/core/Button' ;

function InputFileButton ( {onChange, Button, forwardedRef, ...rest} ) {

	const inputEl = useRef(null);

	return (
		<React.Fragment>
			<Button { ...rest} ref={forwardedRef} onClick={() => inputEl.current.click()}/>
			<input
				multiple
				ref={inputEl}
				onChange={onChange}
				style={{ display: 'none' }}
				type="file"
			/>
		</React.Fragment>
	);
}

InputFileButton.defaultProps = {
	Button,
} ;

export default React.forwardRef((props, ref) => {
	return <InputFileButton {...props} forwardedRef={ref}/>;
});
