import prisma from "./prisma";

export const getUserProfile = async (userId) => {
  const user = await prisma.User.findFirst({
    where: {
      uid: userId,
    },
  });
  return { userProfile: user };
};

export const createUserProfile = async (data) => {
  try {
    const response = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
    return {};
  }
};