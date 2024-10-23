import React, { useState } from "react";
import { FaFacebook, FaApple, FaGoogle } from "react-icons/fa";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
import { browserPopupRedirectResolver } from "firebase/auth";

const SocialSignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    // changes to be done. Error facing has request action is invalid
    console.log("Google sign in running ");
    const provide = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(
        auth,
        provide,
        browserPopupRedirectResolver
      );
      console.log("Google User signed in:", result);
      setError("");
    } catch (error) {
      console.error("Error during google sign in->", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //    getting error
  /*  Can't load URL
The domain of this URL isn't included in the app's domains. To be able to load this URL, add all domains and sub-domains of your app to the App Domains field in your app settings.  */
  const handleFacebookSignIn = async () => {
    console.log("Facebook Sign In");
    const provider = new FacebookAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(
        auth,
        provider,
        browserPopupRedirectResolver
      );
      console.log("Facebook User signed in:", result);
      setError("");
    } catch (error) {
      console.error("Error during facebook sign in -> ", error);
      setError("Facebook sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    console.log("Apple Sign In");
  };

  return (
    <div>
      <div className="social-media">
        <div
          className="social-icon"
          onClick={!loading ? handleGoogleSignIn : null}
        >
          <FaGoogle />
        </div>
        <div className="social-icon" onClick={handleFacebookSignIn}>
          <FaFacebook />
        </div>
        <div className="social-icon" onClick={handleAppleSignIn}>
          <FaApple />
        </div>
      </div>
      {error && <h6 className="text-danger text-center p-2">{error}</h6>}
      {loading && <p className="text-center">Signing in...</p>}
    </div>
  );
};

export default SocialSignUp;
