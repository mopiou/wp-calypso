/**
 * External dependencies
 */
import { connect } from 'react-redux';
import React from 'react';
import { map, reduce, merge } from 'lodash';

export readerFeed from './reader-feed';
export readerSite from './reader-site';
export readerTags from './reader-tags';

const mergeMapPropsToActions = ( needs, state, ownProps ) =>
	reduce(
		needs.mapStateToRequestActions,
		( accum, mapStateToRequestActions ) => [ ...accum, mapStateToRequestActions( state, ownProps ) ],
		[]
	);

const mergeMapStateToProps = ( needs, state, ownProps ) =>
	reduce(
		map( needs, 'mapStateToProps' ),
		( accum, mapStateToProps ) => merge( accum, mapStateToProps( state, ownProps ) ),
		{},
	);

export default ( ...needs ) => Component => {
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
			return <Component { ...this.props } />;
		}
	}

	return connect(
		( state, ownProps ) => ( {
			requestActions: mergeMapPropsToActions( needs, state, ownProps ),
			...mergeMapStateToProps( needs, state, ownProps )
		} )
	)( EnhancedComponent );
};
