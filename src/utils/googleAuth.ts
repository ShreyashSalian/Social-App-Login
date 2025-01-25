import axios from "axios";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  hd?: string; // Optional property for hosted domain, if available
}

export const getGoogleUser = async (
  accessToken: string
): Promise<GoogleUser> => {
  const response = await axios.get<GoogleUser>(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};
