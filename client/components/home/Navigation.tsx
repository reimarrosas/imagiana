import { useEffect } from "react";
import { useQuery } from "react-query";

import { User } from "../../pages";
import { logout } from "../../utils/queries/logout";
import NavigationLink from "../commons/NavigationLink";

type StateSetter<T> = (_: T) => void;

interface Props {
  user: User;
  setIsLogoutSuccess: StateSetter<boolean>;
}

const Navigation = ({ user, setIsLogoutSuccess }: Props) => {
  const { isFetching, data, refetch } = useQuery("logout", logout, {
    cacheTime: Infinity,
    staleTime: Infinity,
    enabled: false,
  });

  useEffect(() => {
    if (data?.success) setIsLogoutSuccess(true);
  }, [isFetching]);

  const handleLogout = () => {
    refetch();
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
