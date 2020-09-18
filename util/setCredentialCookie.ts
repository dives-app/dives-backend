import { Cookie } from "../types";
import { sign } from "jsonwebtoken";

export function setCredentialCookie(
  tokenData: { id: string; email: string },
  setCookies: Array<Cookie>
) {
  const token = sign(tokenData, process.env.JWT_SECRET);
  const MILLISECONDS_IN_HOUR = 360000;
  setCookies.push({
    name: "jwt",
    value: token,
    options: {
      domain: process.env.SERVER_HOST,
      expires: new Date(Date.now() + MILLISECONDS_IN_HOUR),
      httpOnly: true,
      maxAge: 3600,
      path: "/",
      sameSite: true,
      // secure: true,
    },
  });
}
