import React, { useState } from 'react' ;
import PropTypes from 'prop-types' ;

import { list , map , enumerate } from '@aureooms/js-itertools' ;

import { makeStyles } from '@material-ui/core/styles' ;

import Color from './Color.js' ;

const useStyles = makeStyles(
	theme => ({
		container: {
			display: 'flex',
			flexWrap: 'nowrap',
			justifyContent: 'flex-start',
			alignItems: 'stretch',
		},
	})
);

export default function Palette ({colors, transforms, filters, addColor, removeColor, updateColor, moveColor, layout}) {

	const classes = useStyles();

	const style = {
		flexDirection: layout === 'top-down' ? 'column' : 'row' ,
		minHeight: '100vh' ,
	} ;

	const colorStyle = {
		flexGrow: layout === 'top-down' ? 0 : 1,
		flexShrink: 1,
	} ;

	return (
		<ol className={classes.container} style={style}>
			{list(map(
				([i, color]) => (
					<Color
						key={i}
						index={i}
						color={color}
						remove={removeColor(i)}
						update={updateColor(i)}
						move={moveColor(i)}
						transforms={transforms}
						filters={filters}
						style={colorStyle}
						layout={layout === 'top-down' ? 'horizontal' : 'vertical'}
					/>
				),
				enumerate(colors)
			))}
		</ol>
	) ;
} ;

Palette.propTypes = {
	colors: PropTypes.object.isRequired,
	transforms: PropTypes.object,
	filters: PropTypes.array,
	layout: PropTypes.string.isRequired,
} ;
