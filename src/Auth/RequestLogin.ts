import axios, { AxiosResponse } from "axios";
import { REFRESH_TOKEN } from "../Common/Const/data.const";
// 로그인 로직
const requestLogin = async (
  username: string,
  password: string,
  autoLogin: boolean
) => {
  return axios
    .post(
      "/auth/login/email",
      {},
      {
        auth: {
          username,
          password,
        },
      }
    )
    .then(onLoginSuccess(autoLogin))
    .catch((reason) => {
      console.error(reason);
      window.alert("아이디 또는 비밀번호를 확인해주세요");
      return false;
    });
};

// 로그인 성공 후 로직
const onLoginSuccess = (autoLogin: boolean) => (response: AxiosResponse) => {
  const { refreshToken, accessToken } = response.data;
  try {
    axios.defaults.headers.common["authorization"] = `Bearer ${accessToken}`;
    if (!autoLogin) {
      sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
    } else {
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
    }
    return true;
  } catch (e) {
    console.error(e);
    window.alert("토큰 설정에 문제가 발생했습니다. 다시 시도해주세요.");
  }
  return false;
};

// accessToken 재발급
const accessTokenRefresh = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if (refreshToken) {
    return axios
      .post(
        "/auth/token/access",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      )
      .then(onAccessTokenSuccess)
      .catch((error) => {
        console.error(error);
        window.alert("토큰 갱신에 문제가 발생했습니다. 다시 시도해주세요.");
        return false;
      });
  } else {
    window.alert("토큰이 없습니다. 다시 로그인해주세요.");
    return false;
  }
};

// 재발급 성공 로직
const onAccessTokenSuccess = (response: AxiosResponse) => {
  const { accessToken } = response.data;
  axios.defaults.headers.common["authorization"] = `Bearer ${accessToken}`;
  return true;
};

// 유저 정보 호출 로직
const getUser = async () => {
  const response = await axios.get("/users/me");
  return response.data;
};

// 날씨 정보 호출 로직
const getWeather = async (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const response = await axios.get(`/users/weather?address=${encodedAddress}`);
  return response.data;
};

export { requestLogin, accessTokenRefresh, getUser, getWeather };
