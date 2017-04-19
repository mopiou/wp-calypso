/**
 * Internal dependencies
 */
import { requestTags } from 'state/reader/tags/items/actions';
import { getReaderFollowedTags, getReaderTags } from 'state/selectors';

const readerTags = ( { needTags = true, needFollowedTags = false } = {} ) => ( {
	mapStateToProps: ( state ) => {
		const props = {};

		if ( needTags ) {
			props.followedTags = getReaderFollowedTags( state );
		}
		if ( needFollowedTags ) {
			props.tags = getReaderTags( state );
		}

		return props;
	},

	mapStateToRequestActions: ( state, ownProps ) => {
		const requestActions = [];
		const followedTagsShouldBeFetched = getReaderFollowedTags( state ) === null;
		const tagShouldBeFetched = ownProps.tag && ! find( getReaderTags( state ), { slug: ownProps.tag } );

		followedTagsShouldBeFetched && requestActions.push( requestTags() );
		// tagShouldBeFetched && requestActions.push( requestTags( ownProps.tag ) );
		console.error( tagShouldBeFetched, ownProps, getReaderTags( state ) );

		console.error( 'from rags needs', requestActions );
		return requestActions;
	}
} );

export default readerTags;
