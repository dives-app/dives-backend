import {APIGatewayProxyEvent} from "aws-lambda";

export function getCookie(event: APIGatewayProxyEvent, cookieName: string) {
  const matcher = new RegExp(`${cookieName}=.*?(?=;|$)`, "m");
  return event.headers.Cookie.match(matcher)?.[0]?.slice(cookieName.length + 1);
}
