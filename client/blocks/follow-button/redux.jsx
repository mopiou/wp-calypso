/**
 * External Dependencies
 */
import React from 'react';
import { noop } from 'lodash';
import { connect } from 'react-redux';

/**
 * Internal Dependencies
 */
import FollowButton from './button';
import { followUrl, followBlog, followFeed } from 'state/reader/follows/actions';
import { isFollowingBlog, isFollowingFeed, isFollowingUrl } from 'state/selectors';


const FollowButtonContainer = React.createClass( {
	propTypes: {
		siteUrl: React.PropTypes.string.isRequired,
		iconSize: React.PropTypes.number,
		onFollowToggle: React.PropTypes.func,
		followLabel: React.PropTypes.string,
		followingLabel: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			onFollowToggle: noop
		};
	},

	getInitialState() {
		return this.getStateFromStores();
	},

	getStateFromStores( props = this.props ) {
		return { following: FeedSubscriptionStore.getIsFollowingBySiteUrl( props.siteUrl ) };
	},

	componentDidMount() {
		FeedSubscriptionStore.on( 'change', this.onStoreChange );
	},

	componentWillUnmount() {
		FeedSubscriptionStore.off( 'change', this.onStoreChange );
	},

	componentWillReceiveProps( nextProps ) {
		this.updateState( nextProps );
	},

	updateState( props = this.props ) {
		const newState = this.getStateFromStores( props );
		if ( newState.following !== this.state.following ) {
			this.setState( newState );
		}
	},

	onStoreChange() {
		this.updateState();
	},

	handleFollowToggle( following ) {
		FeedSubscriptionActions[ following ? 'follow' : 'unfollow' ]( this.props.siteUrl );
		this.props.onFollowToggle( following );
	},

	render() {
		return (
			<FollowButton
				following={ this.state.following }
				onFollowToggle={ this.handleFollowToggle }
				iconSize={ this.props.iconSize }
				tagName={ this.props.tagName }
				disabled={ this.props.disabled }
				followLabel={ this.props.followLabel }
				followingLabel={ this.props.followingLabel }
				className={ this.props.className } />
		);
	}
} );



export default connect(
	( state, ownProps ) => {
		let following = false;
		if ( ownProps.feedId ) {
			following = isFollowingFeed( ownProps.feedId );
		} else if ( ownProps.url ) {
			following = isFollowingUrl( ownProps.url );
		} else if ( ownProps.blogId ) {
			following = isFollowingBlog( ownProps.blogId );
		}

		return { following,  };
	},
	( dispatch, ownProps ) => {
		onFollowToggle: function( following ) {
			let follow, unfollow;
			if ( ownProps.feedId ) {
				follow = followFeed;
				unfollow = unfollowFeed;
			} else if ( ownProps.url ) {
				following = isFollowingUrl( ownProps.url );
			} else if ( ownProps.blogId ) {
				following = isFollowingBlog( ownProps.blogId );
			}
			if ( following ) {
				return followUrl( )
			}
		}
	}
)( FollowButton )
