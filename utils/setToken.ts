import {Cookie} from "../types";

export async function setToken(token: string, setCookies: Array<Cookie>) {
  const {STAGE, SERVER_HOST} = process.env;
  const MILLISECONDS_IN_A_WEEK = 60_480_000;

  setCookies.push({
    name: "token",
    value: token,
    options: {
      domain: SERVER_HOST,
      expires: new Date(Date.now() + MILLISECONDS_IN_A_WEEK),
      httpOnly: true,
      maxAge: MILLISECONDS_IN_A_WEEK / 100,
      path: "/",
      sameSite: true,
      secure: STAGE !== "local",
    },
  });
}
