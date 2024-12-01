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
} from "../../redux/api/authApi";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import DoctorFormModal from "./DoctorFormModal";

const SocialSignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [authType, setAuthType] = useState("");
  const [role, setRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [socialSignUp] = useSocialSignUpMutation();
  const [newUserSocialSignup] = useNewUserSocialSignupMutation();

  const handleGoogleSignIn = async () => {
    const provide = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(
        auth,
        provide,
        browserPopupRedirectResolver
      );
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await socialSignUp({ token: idToken, authType: "google" });

      if (res.data.isNewUser) {
        setTokenId(idToken);
        setAuthType("google");
        setShowModal(true);
      } else {
        navigate("/");
      }

      setError("");
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
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

      const res = await socialSignUp({ token: idToken, authType: "facebook" });
      if (res.data.isNewUser) {
        setTokenId(idToken);
        setAuthType("facebook");
        setShowModal(true);
      } else {
        navigate("/");
      }

      setError("");
    } catch (error) {
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
      if (input === "doctor") {
        setRole("doctor");
        setShowModal(false);
        setShowForm(true);
      } else {
        const res = await newUserSocialSignup({
          token: tokenId,
          role: input,
          authType: authType,
        });

        setTokenId(null);
        setAuthType("");
        setShowModal(false);
        setShowForm(false);
        navigate("/");
      }
    } catch (error) {
      setError("Error in Server");
    }
  };
  const doctorSignUpFunc = async (data) => {
    try {
      const res = await newUserSocialSignup({
        token: tokenId,
        role: role,
        authType: authType,
        data: data,
      });

      setTokenId(null);
      setAuthType("");
      setRole("");
      setShowModal(false);
      setShowForm(false);
      navigate("/");
    } catch (error) {
      setError("Error in Server");
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
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setTokenId("");
        }}
        centered
      >
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

      <DoctorFormModal
        showForm={showForm}
        setShowForm={setShowForm}
        doctorSignUp={doctorSignUpFunc}
      />
    </div>
  );
};

export default SocialSignUp;
