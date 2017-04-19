export default function isFollowingBlog( state, blogId ) {
	const follow = find( state.reader.follows.items, { blog_ID: +blogId } );
	return !! follow && follow.is_following;
}
