import React, {useRef} from 'react';

import Button from '@material-ui/core/Button' ;

export default function InputFileButton ( {onChange, Button, ...rest} ) {

	const inputEl = useRef(null);

	return (
		<React.Fragment>
			<Button { ...rest} onClick={() => inputEl.current.click()}/>
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
