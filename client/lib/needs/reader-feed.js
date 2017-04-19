/**
 * Internal dependencies
 */
import { getSite } from 'state/reader/sites/selectors';
import { getFeed } from 'state/reader/feeds/selectors';
import { requestFeed } from 'state/reader/feeds/actions';
import { shouldFeedBeFetched } from 'state/reader/feeds/selectors';

const readerFeed = () => ( {
	mapStateToProps: ( state, ownProps ) => ( {
		feed: getFeed( state, ownProps.feedId )
	} ),

	mapStateToRequestActions: ( state, ownProps ) => {
		const site = ownProps.siteId && getSite( state, ownProps.siteId );
		const feedId = ownProps.feedId ? ownProps.feedId : site && site.feed_ID;

		if ( shouldFeedBeFetched( state, feedId ) ) {
			return [ requestFeed( feedId ) ];
		}
		return [];
	}
} );

export default readerFeed;
