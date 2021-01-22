import { getCookie } from "./getCookie";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("getCookie", () => {
  test("Should get a cookie value when there is a single cookie", () => {
    const event: unknown = {
      headers: {
        Cookie: "cookie=value",
      },
    };
    const value = getCookie(event as APIGatewayProxyEvent, "cookie");
    expect(value).toEqual("value");
  });
  test("Should return undefined when no cookie", () => {
    const event: unknown = {
      headers: {
        Cookie: "",
      },
    };
    const value = getCookie(event as APIGatewayProxyEvent, "cookie");
    expect(value).toBeUndefined();
  });
  test("Should get a cookie value when there are multiple cookies", () => {
    const event: unknown = {
      headers: {
        Cookie: "cookie=value; cookie_2=value2; cookie_3=value_3",
      },
    };
    const value = getCookie(event as APIGatewayProxyEvent, "cookie");
    expect(value).toEqual("value");
  });
  test("Should get a real world cookie", () => {
    const event: unknown = {
      headers: {
        Cookie:
          "CONSENT=YES; GdprApprovalDate=true; tb-search-term-analysis-action=clipboard%7Cundefined%7Cundefined; APISID=nmkjlnaw/2DA2adwad3awf; SAPISID=AxbfngDE0mmZUnnu/nmkjlnaw; __Secure-3PAPISID=AxbfngDE0mmZUnnu/nmkjlnaw; wide=1; SID=qdi@DAafawfA_wafm2342fdaGEAF3fae.; PREF=f6=1801204&cvdm=grid&f5=3000020; SIDCC=gkahbwjf213SFA-dawdadwa231-nawfAEGAegfawfRAcfbrSgteh435-jaeg34",
      },
    };
    const value = getCookie(event as APIGatewayProxyEvent, "PREF");
    expect(value).toEqual("f6=1801204&cvdm=grid&f5=3000020");
  });
  test("Should get a cookie with !#%&'-_`~ special key characters", () => {
    const event: unknown = {
      headers: {
        Cookie: "123ABCdef!#%&'-_`~=!#%&'-_`~",
      },
    };
    const value = getCookie(event as APIGatewayProxyEvent, "123ABCdef!#%&'-_`~");
    expect(value).toEqual("!#%&'-_`~");
  });
  test("Should return undefined if no Cookie header present", () => {
    const event: unknown = {
      headers: {},
    };
    const value = getCookie(event as APIGatewayProxyEvent, "test");
    expect(value).toBeUndefined();
  });
});
