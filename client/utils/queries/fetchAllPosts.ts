export const getAllPosts = async () => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/get`;
  const res = await fetch(url, {
    credentials: "include",
  });

  return res.json();
};
