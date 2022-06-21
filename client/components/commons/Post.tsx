export type Post = PostInfo & PostContent & PostEffects;

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

interface PostEffects {
  id: string;
  likedByUser: boolean;
  comments: Comment[];
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
}

interface PostAsideProps {
  postEffects: PostEffects;
  currentUserId: string;
}

const PostHeader = ({
  postInfo: { id, email, fullName, createdAt, userId },
  currentUserId,
}: PostHeaderProps) => {
  const handleDeleteOnClick = () => {
    // PASS
    id = id;
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
}: PostMainProps) => (
  <section aria-label="Post contents." className="mt-4">
    <figure>
      <figcaption className="whitespace-pre-line">{description}</figcaption>
      <img src={imageUrl} className="my-2" alt="" />
    </figure>
  </section>
);

const PostAside = ({
  postEffects: { id, likedByUser, comments },
  currentUserId,
}: PostAsideProps) => {
  const handleDeleteOnClick = () => {};

  return (
    <aside>
      <div>
        <a
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/likes/${
            likedByUser ? "unlike" : "like"
          }?id=${id}`}
        >
          {likedByUser ? "Dislike" : "Like"}
        </a>
      </div>
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

const Post = ({ post, currentUserId }: PostProps) => {
  return (
    <article className="mx-1 shadow-lg rounded p-4">
      <PostHeader postInfo={post} currentUserId={currentUserId} />
      <PostMain postContent={post} />
      <PostAside postEffects={post} currentUserId={currentUserId} />
    </article>
  );
};

export default Post;
