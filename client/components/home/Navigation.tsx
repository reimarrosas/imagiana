import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { User, UserQueryData } from "../../pages";
import { queryBuilder } from "../../utils/queries/queryBuilder";
import NavigationLink from "../commons/NavigationLink";

interface Props {
  user: User;
  loadLogout: (_: boolean) => void;
}

const logoutQuery = queryBuilder("/auth/logout", "post", {});

const Navigation = ({ user, loadLogout }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation(() => logoutQuery(), {
    onMutate: async () => {
      loadLogout(true);
      const queryKey = "authStatus";
      await queryClient.cancelQueries(queryKey);
      const previousAuthStatus =
        queryClient.getQueryData<UserQueryData>(queryKey);
      queryClient.setQueryData<UserQueryData>(queryKey, (_) => ({
        message: "User is unauthenticated!",
        error: "Error 401: Unauthorized --- User is unauthenticated!",
      }));
      router.push("/auth");
      return previousAuthStatus;
    },
    onSettled: (data, error, _v, previousAuthStatus) => {
      const queryKey = "authStatus";
      if (!data.success || error) {
        queryClient.setQueryData(queryKey, previousAuthStatus);
        router.push("/");
      }
      queryClient.invalidateQueries(queryKey);
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <div className="bg-slate-900">
      <nav className="container mx-auto">
        <ul
          id="nav-links"
          className="flex items-center justify-between h-16 px-8"
        >
          <li>
            <NavigationLink linkRef="/">{user.fullName}</NavigationLink>
          </li>
          <li>
            <NavigationLink clickHandler={handleLogout}>Logout</NavigationLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
