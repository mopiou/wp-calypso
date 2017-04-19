/**
 * External dependencies
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import React from 'react';
import { map, reduce, merge, isObjectLike } from 'lodash';

export readerFeed from './reader-feed';
export readerSite from './reader-site';
export readerTags from './reader-tags';

const mergeMapPropsToActions = ( needs, state, ownProps ) => {
	return reduce(
		map( needs, 'mapStateToRequestActions' ),
		( accum, mapStateToRequestActions ) => accum.concat( mapStateToRequestActions( state, ownProps ) ),
		[]
	);
};

const mergeMapStateToProps = ( needs, state, ownProps ) => {
	return reduce(
		map( needs, 'mapStateToProps' ),
		( accum, mapStateToProps ) => merge( accum, mapStateToProps( state, ownProps ) ),
		{},
	);
};

export default ( needs = [], mapDispatchToProps = {} ) => Component => {
	class EnhancedComponent extends React.Component {
		componentWillMount() {
			this.makeRequests( this.props.requestActions );
		}

		componentWillReceiveProps( nextProps ) {
			this.makeRequests( nextProps.requestActions );
		}

		makeRequests = ( requestActions = [] ) => {
			requestActions.forEach(
				action => this.props.dispatch( action )
			);
		}

		render() {
			const dispatchToProps = isObjectLike( mapDispatchToProps )
				? bindActionCreators( this.props.dispatch, mapDispatchToProps )
				: mapDispatchToProps( this.props.dispatch );

			return <Component { ...{
				...this.props,
				...dispatchToProps,
			} } />;
		}
	}

	return connect(
		( state, ownProps ) => ( {
			requestActions: mergeMapPropsToActions( needs, state, ownProps ),
			...mergeMapStateToProps( needs, state, ownProps )
		} ),
		null,
	)( EnhancedComponent );
};
