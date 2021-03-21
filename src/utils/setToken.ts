import { Cookie } from "../../types";

/**
 * Sends a token cookie with the next request
 * @param token token to be set
 * @param setCookies array of cookies to be set
 */
export async function setToken(token: string, setCookies: Array<Cookie>) {
  const { STAGE, SERVER_HOST } = process.env;
  const MILLISECONDS_IN_A_WEEK = 60_480_000;

  setCookies.push({
    name: "token",
    value: token,
    options: {
      domain: SERVER_HOST,
      httpOnly: true,
      maxAge: MILLISECONDS_IN_A_WEEK / 100,
      path: "/",
      // Disable sameSite to allow localhost development with staging backend
      sameSite: STAGE === "staging" ? "none" : "strict",
      secure: STAGE !== "dev",
    },
  });
}
