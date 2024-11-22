import SocialSignUp from "../../components/Login/SocialSignUp";
import { setUserInfo } from "../../utils/local-storage";
import { baseApi } from "./baseApi";

const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: loginData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = (await queryFulfilled).data;
          setUserInfo({ accessToken: result.accessToken });
        } catch (error) {}
      },
    }),
    //  changed for social sign in
    socialSignUp: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/social-login`,
        method: "POST",
        data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = (await queryFulfilled).data;
          setUserInfo({ accessToken: result.accessToken });
        } catch (error) {}
      },
    }),

    newUserSocialSignup: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/social-signup`,
        method: "POST",
        data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = (await queryFulfilled).data;
          setUserInfo({ accessToken: result.accessToken });
        } catch (error) {}
      },
    }),

    patientSignUp: build.mutation({
      query: (data) => ({
        url: `/patient`,
        method: "POST",
        data,
      }),
    }),
    doctorSignUp: build.mutation({
      query: (data) => ({
        url: `/doctor`,
        method: "POST",
        data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        data,
      }),
    }),
    resetConfirm: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/reset-password/confirm`,
        method: "POST",
        data,
      }),
    }),
    changePassword: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/change-password`,
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useUserLoginMutation,
  useSocialSignUpMutation,
  useNewUserSocialSignupMutation,
  useDoctorSignUpMutation,
  usePatientSignUpMutation,
  useResetPasswordMutation,
  useResetConfirmMutation,
  useChangePasswordMutation,
} = authApi;
