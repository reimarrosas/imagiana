export const verifyEmailAddress = async (verificationId: string) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify?id=${verificationId}`;
  const res = await fetch(url, {
    credentials: "include",
  });

  return res.json();
};
