import React, {ChangeEvent, FormEvent, useState} from 'react';
import {requestLogin} from "../../Auth/RequestLogin";
import {useAuthStore} from "../../Auth/Store/authStore";
import {AUTO_LOGIN, IS_LOGGED_IN} from "../../Common/Const/data.const";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      window.alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    
    try {
      const isLogin = await requestLogin(email, password, autoLogin);
      if (isLogin) {
        sessionStorage.setItem(IS_LOGGED_IN, 'true');
        if (autoLogin) {
          localStorage.setItem(AUTO_LOGIN, 'true');
        } else {
          localStorage.setItem(AUTO_LOGIN, 'false');
        }
        try {
          handleLoginSuccess();
        } catch (e) {
          window.alert('사용자 정보를 불러오는데 실패하였습니다.');
        }
        
      } else {
        return;
      }
    } catch (e) {
      window.alert('로그인에 실패하였습니다.');
      return;
    }
  };
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  }
  
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onAutoLoginChange = () => {
    setAutoLogin((prevState) => !prevState);
  };
  
  
  return (
    <div className="login">
      <div className="login-screen">
        <img src="/assets/image/login.png" alt="로그인 로고 이미지" className="login--image"/>
        <header className="login-header">
          <div className="login-header__title">영상 및 IoT 센서 기반</div>
          <div className="login-header__subTitle">스마트팜 생육 모니터링 시스템</div>
        </header>
        <form onSubmit={onSubmit} className="login-form">
          <div className="userName-box">
            <label htmlFor="email"><img src="/assets/icon/monitoring/ic_id.png" alt="아이디 로고"/></label>
            <input id="email" type="text" value={email} placeholder="아이디를 입력하세요" name="userName"
                   onChange={onEmailChange}/>
          </div>
          <div className="userPassword-box">
            <label htmlFor="password"><img src="/assets/icon/monitoring/ic_password.png" alt="비밀번호 로고"/></label>
            <input id="password" type="password" value={password} placeholder="비밀번호를 입력하세요"
                   name="userPassword"
                   onChange={onPasswordChange}/>
          </div>
          <div className="checkbox">
            <input type="checkbox" checked={autoLogin} onChange={onAutoLoginChange} id="auto-login"/>
            <label htmlFor="auto-login">자동로그인</label>
          </div>
          <button type="submit" className="login__btn">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default Login;