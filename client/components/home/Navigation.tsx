import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { User } from "../../pages";
import { queryBuilder } from "../../utils/queries/queryBuilder";
import NavigationLink from "../commons/NavigationLink";

interface Props {
  user: User;
  loadLogout: (_: boolean) => void;
}

const logoutQuery = queryBuilder("/auth/logout", "post", {});

const Navigation = ({ user, loadLogout }: Props) => {
  const router = useRouter();
  const mutation = useMutation(() => logoutQuery(), {
    onSuccess: (data, _v) => {
      if (data.success) {
        loadLogout(true);
        router.push("/auth");
      }
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
