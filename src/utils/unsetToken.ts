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
      httpOnly: true,
      // Set and max-age to unset the cookie in the browser
      maxAge: 0,
      path: "/",
      // Disable sameSite to allow localhost development with staging backend
      sameSite: STAGE === "staging" ? "none" : "strict",
      secure: STAGE !== "dev",
    },
  });
}
