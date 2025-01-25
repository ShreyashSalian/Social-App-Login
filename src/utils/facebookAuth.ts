import axios from "axios";

interface FacebookUser {
  id: string;
  name: string;
  email?: string; // Email may be optional depending on user permissions
}

export const getFacebookUser = async (
  accessToken: string
): Promise<FacebookUser> => {
  const response = await axios.get<FacebookUser>(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
  );
  return response.data;
};
