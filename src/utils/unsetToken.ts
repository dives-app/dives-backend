import { Cookie } from "../../types";

/**
 * Sends empty token cookie expiring immediately with the next request
 * @param setCookies array of cookies to be set
 */
export async function unsetToken(setCookies: Array<Cookie>) {
  const { STAGE, SERVER_HOST } = process.env;

  setCookies.push({
    name: "token",
    value: "",
    options: {
      domain: SERVER_HOST,
      expires: new Date(Date.now()),
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: true,
      secure: STAGE !== "dev",
    },
  });
}
