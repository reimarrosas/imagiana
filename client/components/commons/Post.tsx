import { FormEventHandler, useCallback, useState } from "react";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { UserQueryData } from "../../pages";
import { queryBuilder } from "../../utils/queries/queryBuilder";
import Settings from "./Setting";

/* === Types Section === */

export interface PostQueryResult {
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
  postId: string;
}

/* === Post Header Section === */
const deletePostMutationFunction = (id: string) =>
  queryBuilder(`/posts/delete?id=${id}`, "delete", {})();

const PostHeader = ({
  postInfo: { id, email, fullName, createdAt, userId },
  currentUserId,
}: PostHeaderProps) => {
  const queryClient = useQueryClient();
  const deletePostMutation = useMutation(deletePostMutationFunction, {
    onMutate: async () => {
      const queryKey = "getPosts";
      await queryClient.cancelQueries(queryKey);
      const previousPosts = queryClient.getQueryData<PostQueryResult>(queryKey);
      queryClient.setQueryData<PostQueryResult>(queryKey, (prev) => {
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
      return previousPosts;
    },
    onSettled: (data, error, _v, previousPosts) => {
      const queryKey = "getPosts";
      if (!data.success || error) {
        queryClient.setQueryData(queryKey, previousPosts);
      }
      queryClient.invalidateQueries(queryKey);
    },
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

const PostLike = ({ postLikes: { likedByUser, id } }: PostLikeProps) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation(likeMutationFunction, {
    onMutate: async ({ likedByUser, id }) => {
      const queryKey = "getPosts";
      await queryClient.cancelQueries(queryKey);
      const previousTodos = queryClient.getQueryData<PostQueryResult>(queryKey);
      queryClient.setQueryData<PostQueryResult>(queryKey, (prev) => {
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

      return previousTodos;
    },
    onSettled: (data, error, _v, previousTodos) => {
      const queryKey = "getPosts";
      if (!data.success || error) {
        queryClient.setQueryData(queryKey, previousTodos);
      }
      queryClient.invalidateQueries(queryKey);
    },
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
const PostAside = ({ comments, currentUserId, postId }: PostAsideProps) => {
  const [editingCommentIndex, setEditingCommentIndex] = useState(-1);

  return (
    <aside>
      <ul className="my-3">
        {comments?.map((c, ind) =>
          editingCommentIndex === ind ? (
            <CreateCommentForm
              key={c.id}
              postId={postId}
              commentId={c.id}
              previousComment={c.comment}
              cancelFn={setEditingCommentIndex}
            />
          ) : (
            <li
              className="odd:bg-slate-200 p-3 last-of-type:border-b-2 last-of-type:border-slate-700"
              key={c.id}
            >
              <div className="flex flex-col items-start mb-2">
                <div className="flex justify-between w-full">
                  <a className="text-md font-semibold m-0">
                    {c.fullName} &lt;{c.email}&gt;
                  </a>
                  {currentUserId === c.userId && (
                    <Settings
                      commentId={c.id}
                      postId={postId}
                      editingCallback={() => setEditingCommentIndex(ind)}
                    />
                  )}
                </div>
                <small className="text-xs">
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              </div>
              {c.comment}
            </li>
          )
        )}
      </ul>
      {editingCommentIndex === -1 && <CreateCommentForm postId={postId} />}
    </aside>
  );
};

interface CreateCommentFormProps {
  postId: string;
  commentId?: string;
  previousComment?: string;
  cancelFn?: (_: number) => void;
}
/* === Comment Form Section === */
interface CommentData {
  comment: string;
  postId: number;
  commentId?: string;
}

const mutateCommentQuery = ({ comment, postId, commentId }: CommentData) =>
  queryBuilder(
    `/comments/${commentId ? `update?id=${commentId}` : "create"}`,
    commentId ? "put" : "post",
    { comment, postId }
  )();

const CreateCommentForm = ({
  postId,
  commentId,
  previousComment,
  cancelFn,
}: CreateCommentFormProps) => {
  const [commentState, setCommentState] = useState({
    comment: previousComment ?? "",
    isValid: true,
  });
  const queryClient = useQueryClient();
  const commentMutation = useMutation(mutateCommentQuery, {
    onMutate: async ({ postId, comment, commentId }) => {
      const queryKey = "getPosts";
      await queryClient.cancelQueries(queryKey);

      const previousPosts = queryClient.getQueryData<PostQueryResult>(queryKey);
      const userQueryData =
        queryClient.getQueryData<UserQueryData>("authStatus");

      queryClient.setQueryData<PostQueryResult>(queryKey, (prev) => ({
        message: prev?.message ?? "",
        success: prev?.success ?? false,
        query:
          prev?.query.map((p) => {
            const newP = { ...p };
            if (p.id === postId.toString()) {
              const now = new Date(Date.now()).toLocaleString();
              if (!commentId) {
                newP.comments = [
                  ...p.comments,
                  {
                    id: `Placeholder-${
                      parseInt(p.comments[p.comments.length - 1]?.id ?? "0") + 1
                    }`,
                    comment,
                    createdAt: now,
                    updatedAt: now,
                    postId: postId.toString(),
                    email: userQueryData?.user?.email ?? "",
                    fullName: userQueryData?.user?.fullName ?? "",
                    userId: userQueryData?.user?.id ?? "",
                  },
                ];
              } else {
                newP.comments = p.comments.map((c) => {
                  const newC = { ...c };
                  if (c.id === commentId) {
                    newC.comment = comment;
                    newC.updatedAt = Date.now().toLocaleString();
                  }
                  return newC;
                });
              }
            }
            return newP;
          }) ?? [],
      }));

      setCommentState({ comment: "", isValid: true });

      return previousPosts;
    },
    onSettled: (data, err, _v, previousPosts) => {
      const queryKey = "getPosts";
      if (data.success || err) {
        queryClient.setQueryData(queryKey, previousPosts);
      }
      queryClient.invalidateQueries(queryKey);
    },
  });

  const cancelFnMemo = useCallback(cancelFn ? cancelFn : (_: number) => {}, [
    cancelFn,
  ]);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (commentState.isValid) {
      commentMutation.mutate({
        comment: commentState.comment,
        postId: parseInt(postId),
        commentId,
      });
      cancelFnMemo(-1);
    }
  };

  return (
    <form className="pt-2" onSubmit={handleFormSubmit}>
      <label htmlFor="comment" className="sr-only">
        Comment
      </label>
      <input
        type="text"
        name="comment"
        id={`comment${commentId ? `-${commentId}` : ""}`}
        className="w-full shadow rounded-sm p-1"
        placeholder="Write your thoughts..."
        value={commentState.comment}
        onChange={(e) => {
          setCommentState({
            comment: e.target.value,
            isValid: e.target.value.trim().length !== 0,
          });
        }}
        required
      />
      <div className="text-center">
        <small className="text-xs text-red-600 mt-1">
          {!commentState.isValid && "Comment must not be a non-empty string!"}
        </small>
      </div>
      <div className="flex justify-between items-center px-2">
        <button onClick={() => cancelFnMemo(-1)} type="button">
          {commentId && "Cancel"}
        </button>
        <button type="submit">{commentId ? "Edit" : "Create"}</button>
      </div>
    </form>
  );
};

/* === Post Section === */
const Post = ({ post, currentUserId }: PostProps) => {
  return (
    <article className="mx-1 shadow-lg rounded p-4 mt-8">
      <PostHeader postInfo={post} currentUserId={currentUserId} />
      <PostMain postContent={post} postLikes={post} />
      <PostAside
        comments={post.comments}
        currentUserId={currentUserId}
        postId={post.id}
      />
    </article>
  );
};

export default Post;
