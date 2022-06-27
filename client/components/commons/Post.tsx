import { useCallback } from "react";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { queryBuilder } from "../../utils/queries/queryBuilder";

/* === Types Section === */

interface PostQueryResult {
  message: string;
  success: boolean;
  query: Post[];
}

export type Post = PostInfo &
  PostContent &
  PostLikes & {
    comments: Comment[];
  };

interface PostInfo {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface PostContent {
  description: string;
  imageUrl: string;
}

interface PostLikes {
  id: string;
  likedByUser: boolean;
}

interface Comment {
  id: string;
  email: string;
  fullName: string;
  comment: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface PostProps {
  post: Post;
  currentUserId: string;
}

interface PostHeaderProps {
  postInfo: PostInfo;
  currentUserId: string;
}

interface PostMainProps {
  postContent: PostContent;
  postLikes: PostLikes;
}

interface PostLikeProps {
  postLikes: PostLikes;
}

interface PostAsideProps {
  comments: Comment[];
  currentUserId: string;
}

/* === Post Header Section === */
const deletePostMutationFunction = (id: string) =>
  queryBuilder(`/posts/delete?id=${id}`, "delete", {})();

const deletePostOnClientSide =
  (queryClient: QueryClient) => (data: any, id: string) => {
    if (data.success) {
      queryClient.setQueryData<PostQueryResult>("getPosts", (prev) => {
        if (prev) {
          const { message, success, query } = prev;
          const newQuery = query.filter((p) => p.id !== id);
          return {
            message,
            success,
            query: newQuery,
          };
        } else {
          return {
            message: "",
            success: false,
            query: [],
          };
        }
      });
    }
  };

const PostHeader = ({
  postInfo: { id, email, fullName, createdAt, userId },
  currentUserId,
}: PostHeaderProps) => {
  const queryClient = useQueryClient();
  const deletePostMutation = useMutation(deletePostMutationFunction, {
    onSuccess: deletePostOnClientSide(queryClient),
  });

  const handleDeleteOnClick = () => {
    deletePostMutation.mutate(id);
  };

  return (
    <header className="flex justify-between items-start">
      <div>
        <h1 className="text-md font-semibold mb-0">
          {fullName} <span className="sm:inline hidden">&lt;{email}&gt;</span>
        </h1>
        <small className="mt-0 text-xs">
          {new Date(createdAt).toLocaleString()}
        </small>
      </div>
      <button
        type="button"
        className={`font-bold text-2xl my-0 ${
          currentUserId === userId ? "" : "hidden"
        }`}
        onClick={handleDeleteOnClick}
      >
        &times;
      </button>
    </header>
  );
};

const PostMain = ({
  postContent: { description, imageUrl },
  postLikes,
}: PostMainProps) => (
  <section aria-label="Post contents." className="mt-4">
    <figure>
      <figcaption className="whitespace-pre-line">{description}</figcaption>
      <img src={imageUrl} className="my-2" alt="" />
    </figure>
    <PostLike postLikes={postLikes} />
  </section>
);

interface LikeMutationQueryParam {
  likedByUser: boolean;
  id: string;
}

/* === Post Like Section === */
const likeMutationFunction = ({ likedByUser, id }: LikeMutationQueryParam) =>
  queryBuilder(
    `/likes/${likedByUser ? "unlike" : "like"}?id=${id}`,
    likedByUser ? "delete" : "post",
    {}
  )();

const modifyPostLikeOnClientSide =
  (queryClient: QueryClient) =>
  (data: any, { id, likedByUser }: LikeMutationQueryParam) => {
    if (data.success) {
      queryClient.setQueryData<PostQueryResult>("getPosts", (prev) => {
        if (prev) {
          const { message, success, query } = prev;
          const newQuery = query.map((p) => {
            const newP = { ...p };
            if (p.id === id) {
              newP.likedByUser = !likedByUser;
            }
            return newP;
          });

          return {
            message,
            success,
            query: newQuery,
          };
        } else {
          return {
            message: "",
            success: false,
            query: [],
          };
        }
      });
    }
  };

const PostLike = ({ postLikes: { likedByUser, id } }: PostLikeProps) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation(likeMutationFunction, {
    onSuccess: modifyPostLikeOnClientSide(queryClient),
  });

  const handleLikeOrUnlike = () => {
    likeMutation.mutate({ likedByUser, id });
  };

  return (
    <div>
      <button onClick={handleLikeOrUnlike}>
        {likedByUser ? "Dislike" : "Like"}
      </button>
    </div>
  );
};

/* === Post Aside Section === */
const PostAside = ({ comments, currentUserId }: PostAsideProps) => {
  const handleUpdateOnClick = () => {};
  const handleDeleteOnClick = () => {};

  return (
    <aside>
      <ul className="my-3">
        {comments?.map((c, ind) => (
          <li className="odd:bg-slate-200 p-3" key={ind}>
            <div className="flex flex-col items-start mb-2">
              <div className="flex justify-between w-full">
                <a className="text-md font-semibold m-0">
                  {c.fullName} &lt;{c.email}&gt;
                </a>
                <button
                  type="button"
                  className={`font-bold text-lg my-0 ${
                    currentUserId === c.userId ? "" : "hidden"
                  }`}
                  onClick={handleDeleteOnClick}
                >
                  &times;
                </button>
              </div>
              <small className="text-xs">
                {new Date(c.createdAt).toLocaleString()}
              </small>
            </div>
            {c.comment}
          </li>
        ))}
      </ul>
      <form className="pt-2 border-t-2  border-slate-700">
        <label htmlFor="comment" className="sr-only">
          Comment
        </label>
        <input
          type="text"
          name="comment"
          id="commment"
          className="w-full shadow rounded-sm p-1"
          placeholder="Write your thoughts..."
          required
        />
        <input type="submit" value="" />
      </form>
    </aside>
  );
};

/* === Post Section === */
const Post = ({ post, currentUserId }: PostProps) => {
  return (
    <article className="mx-1 shadow-lg rounded p-4 mt-8">
      <PostHeader postInfo={post} currentUserId={currentUserId} />
      <PostMain postContent={post} postLikes={post} />
      <PostAside comments={post.comments} currentUserId={currentUserId} />
    </article>
  );
};

export default Post;
