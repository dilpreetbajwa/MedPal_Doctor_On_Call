import React, { useState } from "react";
import { FaFacebook, FaApple, FaGoogle } from "react-icons/fa";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
import { browserPopupRedirectResolver } from "firebase/auth";
import {
  useSocialSignUpMutation,
  useNewUserSocialSignupMutation,
  useDoctorSignUpMutation,
} from "../../redux/api/authApi";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // For modal
import DoctorFormModal from "./DoctorFormModal";

const SocialSignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [newUser, setNewUser] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [authType, setAuthType] = useState("");
  const [showModal, setShowModal] = useState(false); // for role selection
  const [showForm, setShowForm] = useState(false); // for entering details
  const navigate = useNavigate();
  const [socialSignUp] = useSocialSignUpMutation();
  const [newUserSocialSignup] = useNewUserSocialSignupMutation();
  const [doctorSignUp] = useDoctorSignUpMutation(); // this

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

      //  integrating with backend
      // getting token
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log("checking result.user and idtoken", user, idToken);

      //  TODO - fetch for social sign in
      const res = await socialSignUp({ token: idToken, authType: "google" });
      if (res.data.isNewUser) {
        setTokenId(idToken);
        // setNewUser(true);
        setAuthType("google");
        setShowModal(true); // open the modal
        // }
      } else {
        navigate("/");
      }
      console.log("res.data.isNewUser ->", res.data.isNewUser);

      setError("");
    } catch (error) {
      console.error("Error during google sign in->", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log("checking result.user and idtoken", user, idToken);

      const res = await socialSignUp({ token: idToken, authType: "facebook" });
      if (res.data.isNewUser) {
        setTokenId(idToken);
        // setNewUser(true);
        setAuthType("facebook");
        setShowModal(true); // open the modal
        // }
      } else {
        navigate("/");
      }

      // console.log("Facebook User signed in:", result);
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

  const handleRoleSelection = async (input) => {
    try {
      console.log("Role selected ->", input);
      if (input == "doctor") {
        setShowModal(false); // close the modal
        setShowForm(true); // open the form
      } else {
        const res = await newUserSocialSignup({
          token: tokenId,
          role: input,
          authType: authType,
        });

        setTokenId(null);
        setAuthType("");
        setShowModal(false); // close the modal
        setShowForm(false);
        navigate("/");
      }
      //   const res = await newUserSocialSignup({
      //     token: tokenId,
      //     role: input,
      //     authType: authType,
      //   });
      //   console.log("role selection", res);
      //   //   setNewUser(false);
      //   setTokenId(null);
      //   setAuthType("");
      //   setShowModal(false); // close the modal
      //   setShowForm(true); // open the form
      //   //   navigate("/");
    } catch (error) {
      console.log("Error in Social SignIn", error);
    }
  };
  const doctorSignUpFunc = async (data) => {
    try {
      const res = await doctorSignUp(data);
    } catch (error) {
      console.log("Error in Social SignIn", error);
    }
  };
  return (
    <div>
      <div className="social-media">
        <div
          className="social-icon"
          onClick={!loading ? handleGoogleSignIn : null}
          disabled={loading}
        >
          <FaGoogle />
        </div>
        <div
          className="social-icon"
          onClick={!loading ? handleFacebookSignIn : null}
          disabled={loading}
        >
          <FaFacebook />
        </div>
        <div
          className="social-icon"
          onClick={!loading ? handleAppleSignIn : null}
          disabled={loading}
        >
          <FaApple />
        </div>
      </div>

      {error && <h6 className="text-danger text-center p-2">{error}</h6>}
      {loading && <p className="text-center">Signing in...</p>}

      {/* Modal for role selection */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Your Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="text-center">Please select your role:</h5>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="iBtn"
              onClick={() => handleRoleSelection("doctor")}
            >
              Doctor
            </button>
            <button
              className="iBtn"
              onClick={() => handleRoleSelection("patient")}
            >
              Patient
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for doctors profile form */}

      {/* <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>We would like to know more!</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
      </Modal> */}
      <DoctorFormModal
        showForm={showForm}
        setShowForm={setShowForm}
        doctorSignUp={doctorSignUpFunc}
      />
    </div>
  );
};

export default SocialSignUp;
