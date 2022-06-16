export const checkAuthStatus = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`,
    {
      credentials: "include",
    }
  );
  return res.json();
};
