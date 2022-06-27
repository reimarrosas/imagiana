import { useQuery } from "react-query";
import { User } from "../../pages";
import { postQuery } from "../../utils/queries/fetchAllPosts";
import Loading from "../commons/Loading";
import Post, { Post as PostType } from "../commons/Post";
import CreatePostsForm from "./CreatePostsForm";

interface Props {
  user: User;
}

const MainSection = ({ user }: Props) => {
  const { isLoading, data } = useQuery("getPosts", postQuery());
  return (
    <main className="max-w-prose mx-auto pb-8">
      <CreatePostsForm />
      <Loading isLoading={isLoading}>
        {data?.query?.map((p: PostType) => (
          <Post key={p.id} post={p} currentUserId={user.id} />
        ))}
      </Loading>
    </main>
  );
};

export default MainSection;
