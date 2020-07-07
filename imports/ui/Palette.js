import React, { useState } from 'react' ;
import PropTypes from 'prop-types' ;

import { list , map , enumerate } from '@aureooms/js-itertools' ;

import { makeStyles } from '@material-ui/core/styles' ;

import Color from './Color.js' ;

const useStyles = makeStyles(
	theme => ({
	})
);

export default function Palette ({colors, addColor, removeColor, updateColor, moveColor}) {

	const classes = useStyles();

	return (
		<ol>
			{list(map(
				([i, color]) => (
					<Color
						key={i}
						index={i}
						color={color}
						remove={removeColor(i)}
						update={updateColor(i)}
						move={moveColor(i)}
					/>
				),
				enumerate(colors)
			))}
		</ol>
	) ;
} ;

Palette.propTypes = {
	colors: PropTypes.object.isRequired,
} ;
