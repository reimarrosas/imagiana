import { User } from "../../pages";
import CreatePostsForm from "./CreatePostsForm";

interface Props {
  user: User;
}

const MainSection = ({ user }: Props) => (
  <main>
    <CreatePostsForm />
  </main>
);

export default MainSection;
