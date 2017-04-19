export default function isFollowingFeed( state, feedId ) {
	const follow = find( state.reader.follows.items, { feed_ID: +feedId } );
	return !! follow && follow.is_following;
}
