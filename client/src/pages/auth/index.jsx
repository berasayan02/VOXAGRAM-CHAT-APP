import Background from "@/assets/login1.webp";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";


function Auth() {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address!");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  };


  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address!");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required!");
      return false;
    }
    if (!confirmPassword.length) {
      toast.error("Confirm Password is required!");
      return false;
    }
    if (password != confirmPassword) {
      toast.error("Password and Confirm Password should be same!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true }
        );
        if (response.data.user.id) {
          toast.success("Login successful!");
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
        // console.log({ response });
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          toast.success("Signup successful!");
          setUserInfo(response.data.user);
          navigate("/profile");
        }
        // console.log({ response });
      }
    } catch (error) {
      toast.error("You are already signed up! Please login.")
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col items-center justify-center gap-0">
      <div>
        <Logo />
      </div>
      <div className="h-[80vh] below500:h-[72vh] bg-white border-2 border-white text-opacity-90 shadow-2xl shadow-purple-500/40 w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center pl-3">
          <div className="flex items-center justify-center flex-col px-2">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl below500:text-4xl">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px] below500:h-[80px]" />
            </div>
            <p className="font-medium text-center ">
              Fill in the details to get started with the chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4 below500:w-[85%]" defaultValue="login">
              <TabsList className="flex bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 below500:gap-3 mt-10 below500:mt-6" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 " value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="Background Login" className="h-[550px]" />
        </div>
      </div>
    </div>
  );
}

export default Auth;




const Logo = () => {
  return (
    <div className="flex p-3  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-5xl below500:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#1b1c24]/70 [text-shadow:_0_4px_4px_rgb(168_85_247_/_0.8)]">VOXAGRAM</span>
    </div>
  );
};