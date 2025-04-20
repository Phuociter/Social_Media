import React from 'react';
import CustomButton from './CustomButton';
import UserItem from './UserItem';
import PostCard from './PostCard';

const SearchResultsSection = ({
  results,
  user,
  onClear,
  onLikePost,
  showAllUsers,
  setShowAllUsers,
  showAllPosts,
  setShowAllPosts
}) => {
  const { users, user: singleUser, posts = [] } = results;

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex justify-end">
        <CustomButton
          title="Xóa kết quả tìm kiếm"
          onClick={onClear}
          containerStyles="text-red-500 underline text-sm mb-2 bg-primary p-4 rounded-lg text-white"
        />
      </div>

      {singleUser && (
        <div className="bg-primary p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 bg-primary p-4 rounded-lg text-white">Người dùng</h2>
          <UserItem user={singleUser} />

          <h2 className="text-lg font-semibold mt-4 mb-2 bg-primary p-4 rounded-lg text-white">Bài viết</h2>
          {posts.length > 0 ? (
            (showAllPosts ? posts : posts.slice(0, 3)).map((post, index) => (
              <PostCard
                key={post.postId || index}
                post={post}
                user={user}
                likePost={() => onLikePost(post.postId)}
              />
            ))
          ) : (
            <p>Không có bài viết nào</p>
          )}
          {posts.length > 3 && (
            <CustomButton
              title={showAllPosts ? "Thu gọn bài viết" : "Xem thêm bài viết"}
              onClick={() => setShowAllPosts(!showAllPosts)}
              containerStyles="text-blue-500 text-sm mt-2 bg-primary p-4 rounded-lg text-white"
            />
          )}
        </div>
      )}

      {!singleUser && (
        <>
          {users?.length > 0 && (
            <div className="bg-primary p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2 bg-primary p-4 rounded-lg text-white">Người dùng</h2>
              {(showAllUsers ? users : users.slice(0, 3)).map((user) => (
                <UserItem key={user.userId} user={user} />
              ))}
              {users.length > 3 && (
                <CustomButton
                  title={showAllUsers ? "Thu gọn người dùng" : "Xem thêm người dùng"}
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  containerStyles="text-blue-500 text-sm mt-2"
                />
              )}
            </div>
          )}

          {posts.length > 0 && (
            <div className="bg-primary p-4 rounded-lg mt-4">
              <h2 className="text-lg font-semibold mb-2">Bài viết</h2>
              {(showAllPosts ? posts : posts.slice(0, 3)).map((post, index) => (
                <PostCard
                  key={post?.postId || index}
                  post={post}
                  user={user}
                  likePost={() => onLikePost(post.postId)}
                />
              ))}
              {posts.length > 3 && (
                <CustomButton
                  title={showAllPosts ? "Thu gọn bài viết" : "Xem thêm bài viết"}
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  containerStyles="text-blue-500 text-sm mt-2"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsSection;
