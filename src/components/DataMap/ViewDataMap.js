import PropTypes from 'prop-types';
import React from 'react';
import Datamaps from 'datamaps';

const MAP_CLEARING_PROPS = [
	'height', 'scope', 'setProjection', 'width'
];

const propChangeRequiresMapClear = (oldProps, newProps) => {
	return MAP_CLEARING_PROPS.some((key) =>
		oldProps[key] !== newProps[key]
	);
};

export default class ViewDataMap extends React.Component {

	static propTypes = {
		arc: PropTypes.array,
		arcOptions: PropTypes.object,
		bubbleOptions: PropTypes.object,
		bubbles: PropTypes.array,
		data: PropTypes.object,
		graticule: PropTypes.bool,
		height: PropTypes.any,
		labels: PropTypes.bool,
		responsive: PropTypes.bool,
		style: PropTypes.object,
		updateChoroplethOptions: PropTypes.object,
		width: PropTypes.any
	};

	constructor(props) {
		super(props);
		this.resizeMap = this.resizeMap.bind(this);
	}

	componentDidMount() {
		if (this.props.responsive) {
			window.addEventListener('resize', this.resizeMap);
		}		
		this.drawMap();
	}

	componentWillReceiveProps(newProps) {
		// const {zoomIndex} = newProps;
		// zoomIndex == 2 ? this.resizeMap(): '';
		if (propChangeRequiresMapClear(this.props, newProps)) {
			this.clear();
		}
	}

	componentDidUpdate() {
			
	}

	componentWillUnmount() {
		this.clear();
		if (this.props.responsive) {
			window.removeEventListener('resize', this.resizeMap);
		}
	}

	clear() {
		const { container } = this.refs;
		for (const child of Array.from(container.childNodes)) {
			container.removeChild(child);
		}
		delete this.map;
	}

	drawMap() {
		const {
			arc,
			arcOptions,
			bubbles,
			bubbleOptions,
			data,
			graticule,
			labels,
			updateChoroplethOptions,
			...props
		} = this.props;

		let map = this.map;

		if (!map) {
			map = this.map = new Datamaps({
				...props,
				data,
				element: this.refs.container
			});
		} else {
			map.updateChoropleth(data, updateChoroplethOptions);
		}

		if (arc) {
			map.arc(arc, arcOptions);
		}

		if (bubbles) {
			map.bubbles(bubbles, bubbleOptions);
		}

		if (graticule) {
			map.graticule();
		}

		if (labels) {
			map.labels({fontSize: 10, lineWidth: 1});
		}
	}

	resizeMap() {
		this.map.resize();
	}

	render() {
        const {zoomIndex, height} = this.props;
		const style = {
			height: zoomIndex == 2 ? '180%' : '260px',
			position: 'relative',
			width: '500px',
			margin: '0 auto',
			...this.props.style
		};

		return(
            <div ref="container" style={style} />
        )
	}

}
