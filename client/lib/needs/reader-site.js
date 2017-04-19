/**
 * Internal dependencies
 */
import { getSite } from 'state/reader/sites/selectors';
import { getFeed } from 'state/reader/feeds/selectors';
import { shouldSiteBeFetched } from 'state/reader/sites/selectors';
import { requestSite } from 'state/reader/sites/actions';

const readerSite = () => ( {
	mapStateToProps: ( state, ownProps ) => ( {
		site: getSite( state, ownProps.siteId )
	} ),

	mapStateToRequestActions: ( state, ownProps ) => {
		const feed = ownProps.feed && getFeed( state, ownProps.feedId );
		const siteId = ownProps.siteId ? ownProps.siteId : feed && feed.blog_ID;

		if ( shouldSiteBeFetched( state, siteId ) ) {
			return [ requestSite( siteId ) ];
		}
		return [];
	}
} );

export default readerSite;
