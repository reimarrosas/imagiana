export const logout = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
    {
      credentials: "include",
    }
  );

  return res.json();
};
