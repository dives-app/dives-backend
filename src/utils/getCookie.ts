import { APIGatewayProxyEvent } from "aws-lambda";

/**
 * Searches for a cookie in APIGatewayProxyEvent and returns its value
 * @param event APIGatewayProxyEvent
 * @param cookieName cookie to search alphanumeric value + !#%&'-_`~
 * @returns cookie value or undefined if not found
 */
export function getCookie(event: APIGatewayProxyEvent, cookieName: string): string | undefined {
  const matcher = new RegExp(`${cookieName}=.*?(?=;|$)`, "m");
  return event.headers.Cookie.match(matcher)?.[0]?.slice(cookieName.length + 1);
}
