import { create } from "zustand";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: false,
  refreshingToken: false,
  isLogin: false,
  isSignup: false,
  isForgotPassword: false,
  isOTP: false,
  email: "",
  isResetPassword: false,
  isMenu: false,
  isMobileMenu: false,

  setIsMobileMenu: () =>
    set((state) => ({
      isMobileMenu: !state.isMobileMenu,
    })),
  setIsMenu: () =>
    set((state) => ({
      isMenu: !state.isMenu,
    })),

  setIsResetPassword: (value) => {
    set({ isResetPassword: value });
  },

  setEmail: (value) => {
    set({ email: value });
  },

  setIsOTP: (value) => {
    set({ isOTP: value });
  },

  setIsForgotPassword: (value) => {
    set({ isForgotPassword: value });
  },

  setIsLogin: (value) => {
    set({ isLogin: value });
  },
  setIsSignup: (value) => {
    set({ isSignup: value });
  },

  signup: async (formData) => {
    set({ loading: true });
    try {
      const response = await Axios.post("/auth/signup", formData);
      set({ user: response.data.user });
      if (response.data.success === true) {
        toast.success("Account Created Successfully");
        get().setIsSignup(false);
        get().setIsLogin(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during signup"
      );
    } finally {
      set({ loading: false });
    }
  },
  login: async (formData) => {
    set({ loading: true });
    try {
      const response = await Axios.post("/auth/login", formData);
      set({ user: response.data.user });
      if (response.data.success === true) {
        toast.success("Login Successfully");
        get().setIsLogin(false);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during login"
      );
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      const response = await Axios.get("/auth/logout");
      if (response.data.success === true) {
        set({ user: null });
        toast.success("Logout Successful");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await Axios.get("/auth/profile");
      set({ user: response.data.user, checkingAuth: false });
    } catch (error) {
      //   console.log(error);
      set({ user: null });
    } finally {
      set({ checkingAuth: false });
    }
  },
  forgetPassword: async () => {
    set({ loading: true });

    try {
      const response = await Axios.post("/auth/forget-password", {
        email: get().email,
      });
      if (response.data.success === true) {
        toast.success("OTP sent successfully");
        get().setIsForgotPassword(false);
        get().setIsOTP(true);
      } else {
        toast.error(response?.data?.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during forget-password"
      );
    } finally {
      set({ loading: false });
    }
  },
  OTPVerify: async (fullOtp) => {
    set({ loading: true });
    try {
      const response = await Axios.post("/auth/verify-forget-password-otp", {
        email: get().email,
        otp: fullOtp,
      });
      if (response.data.success === true) {
        toast.success("OTP verified successfully");
        get().setIsOTP(false);
        get().setIsResetPassword(true);
      } else {
        toast.error(error.response?.data?.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during OTP-verification"
      );
    } finally {
      set({ loading: false });
    }
  },
  resetPassword: async (password) => {
    set({ loading: true });
    try {
      const response = await Axios.post("/auth/reset-password", {
        email: get().email,
        password,
      });
      if (response.data.success === true) {
        toast.success("Password changed successfully");
        get().setIsResetPassword(false);
        get().setIsLogin(true);
        get().setEmail("");
      } else {
        toast.error(error.response?.data?.message || "");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset password failed");
    } finally {
      set({ loading: false });
    }
  },
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().refreshingToken) return;
    set({ refreshingToken: true });

    try {
      const response = await Axios.post("/auth/refresh-token");
      if (response.data?.success) {
        console.log("Access token refreshed successfully.");
      } else {
        console.log(
          "Unexpected response during refresh:",
          response.data.message
        );
        set({ user: null });
      }
    } catch (error) {
      set({ user: null });
      console.log("Error in refresh token: ", error);
    } finally {
      set({ refreshingToken: false });
    }
  },
  uploadAvatar: async (image) => {
    set({ loading: true });
    try {
      const response = await Axios.put("/auth/upload-avatar", image);
      if (response.data.success === true) {
        set({ user: response.data.user });
      } else {
        toast.error(
          error.response?.data?.message || "Profile picture upload failed"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Profile picture upload failed"
      );
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async (data) => {
    set({ loading: true });
    try {
      const response = await Axios.put("/auth/update-user", data);
      if (response.data.success === true) {
        toast.success("Profile updated successfully");
        set({ user: response.data.user });
      } else {
        toast.error(error.response?.data?.message || "Profile update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ loading: false });
    }
  },
}));
