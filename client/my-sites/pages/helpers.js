/**
 * External dependencies
 */
import store from 'store';
import {
	assign,
	forEach,
	groupBy,
	includes,
	map,
	reduce,
	sortBy,
} from 'lodash';

/**
 * Internal dependencies
 */
import sitesFactory from 'lib/sites-list';

const sortByModified = list => sortBy( list, 'modified' );
const getParentID = page => page.parent && page.parent.ID;

module.exports = {
	sortPages: pages => {
		const pageIDs = map( pages, 'ID' );

		const pagesByParent = reduce( groupBy( pages, getParentID ), ( result, list, parentID ) => {
			if ( ! parentID || parentID === 'false' || ! includes( pageIDs, parseInt( parentID, 10 ) ) ) {
				// If we don't have the parent in our list, promote the page to "top level"
				result.false = sortByModified( ( result.false || [] ).concat( list ) );
				return result;
			}

			result[ parentID ] = sortByModified( list );
			return result;
		}, {} );

		const sortedPages = [];

		const insertChildren = ( pageID, indentLevel ) => {
			const children = pagesByParent[ pageID ] || [];

			forEach( children, child => {
				sortedPages.push( assign( {}, child, { indentLevel } ) );
				insertChildren( child.ID, indentLevel++ );
			} );
		};

		forEach( pagesByParent.false, topLevelPage => {
			sortedPages.push( topLevelPage );
			insertChildren( topLevelPage.ID, 1 );
		} );

		return sortedPages;
	},

	editLinkForPage: function( page, site ) {
		if ( ! ( page && page.ID ) || ! ( site && site.ID ) ) {
			return null;
		}

		return '/page/' + site.slug + '/' + page.ID;
	},

	// TODO: switch all usage of this function to `isFrontPage` in `state/pages/selectors`
	isFrontPage: function( page, site ) {
		if ( ! page || ! page.ID || ! site || ! site.options ) {
			return false;
		}
		return site.options.page_on_front === page.ID;
	},

	// This gives us a means to fix the `SitesList` cache outside of actions
	// @todo Remove this when `SitesList` is Reduxified
	updateSitesList: function( { siteId, updatedOptions } ) {
		const sites = sitesFactory();
		const site = sites.getSite( siteId );

		store.remove( 'SitesList' );
		if ( site ) {
			site.options = merge( site.options, updatedOptions );
			sites.updateSite( site );
		}
		sites.fetch();
	},
};
