import { ReactNode, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { queryBuilder } from "../../utils/queries/queryBuilder";
import { PostQueryResult } from "./Post";

interface SettingsProps {
  commentId: string;
  postId: string;
  editingCallback: (_?: number) => void;
}

interface ListItemProps {
  children: ReactNode;
}

const ListItem = ({ children }: ListItemProps) => (
  <li className="text-center hover:bg-slate-200">{children}</li>
);

interface DeleteCommentData {
  commentId: string;
  postId: string;
}
const deleteCommentMutationFn = ({ commentId }: DeleteCommentData) =>
  queryBuilder(`/comments/delete?id=${commentId}`, "delete", {})();

const Settings = ({ commentId, postId, editingCallback }: SettingsProps) => {
  const queryClient = useQueryClient();
  const deleteCommentMutation = useMutation(deleteCommentMutationFn, {
    onMutate: async ({ commentId, postId }) => {
      const queryKey = "getPosts";
      await queryClient.cancelQueries(queryKey);

      const previousPosts = queryClient.getQueryData<PostQueryResult>(queryKey);

      queryClient.setQueryData<PostQueryResult>(queryKey, (prev) => ({
        message: prev?.message ?? "",
        success: prev?.success ?? false,
        query:
          prev?.query.map((p) => {
            const newP = { ...p };
            if (p.id === postId) {
              newP.comments = p.comments.filter((c) => c.id !== commentId);
            }
            return newP;
          }) ?? [],
      }));
      return previousPosts;
    },
    onSettled: (data, err, _v, previousPosts) => {
      const queryKey = "getPosts";
      if (!data.success || err) {
        queryClient.setQueryData(queryKey, previousPosts);
      }
      queryClient.invalidateQueries(queryKey);
    },
  });
  const [showMenu, setShowMenu] = useState(false);

  const executeFnThenHideMenu = (fn: () => void) => {
    fn();
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button className="text-lg" onClick={() => setShowMenu(!showMenu)}>
        &#8942;
      </button>
      <ul
        className={`absolute right-0 top-full p-2 shadow rounded bg-slate-100 ${
          showMenu ? "" : "hidden"
        }`}
      >
        <ListItem>
          <button onClick={() => executeFnThenHideMenu(editingCallback)}>
            Edit
          </button>
        </ListItem>
        <ListItem>
          <button
            onClick={() =>
              executeFnThenHideMenu(() =>
                deleteCommentMutation.mutate({ commentId, postId })
              )
            }
          >
            Delete
          </button>
        </ListItem>
      </ul>
    </div>
  );
};

export default Settings;
