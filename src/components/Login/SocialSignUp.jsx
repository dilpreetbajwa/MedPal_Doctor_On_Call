import React, { useState } from "react";
import { FaFacebook, FaApple, FaGoogle } from "react-icons/fa";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

const SocialSignUp = () => {
  const [error] = useState({});
  const handleGoogleSignIn = async () => {
    // changes to be done. Error facing has request action is invalid
    console.log("Google sign in running ", auth);
    const provide = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provide);

      console.log(result);
    } catch (error) {
      console.error("Error during google sign in->", error);
    }
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook Sign In");
  };

  const handleAppleSignIn = () => {
    console.log("Apple Sign In");
  };

  return (
    <div>
      <div className="social-media">
        <div className="social-icon" onClick={handleGoogleSignIn}>
          <FaGoogle />
        </div>
        <div className="social-icon" onClick={handleFacebookSignIn}>
          <FaFacebook />
        </div>
        <div className="social-icon" onClick={handleAppleSignIn}>
          <FaApple />
        </div>
      </div>
      {error.length && <h6 className="text-danger text-center p-2">{error}</h6>}
    </div>
  );
};

export default SocialSignUp;
