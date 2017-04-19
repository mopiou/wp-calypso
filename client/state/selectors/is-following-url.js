export default function isFollowingUrl( state, url ) {
	// should we use prepareComparableUrl here?
	const follow = find( state.reader.follows.items, { URL: url } );
	return !! follow && follow.is_following;
}
