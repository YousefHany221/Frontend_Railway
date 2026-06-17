import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/authLayout";
import logo from "../assets/Logo 1.png";
import logo2 from "../assets/Globe.png";
import { authService } from "../api/auth";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(57);
  const [loading, setLoading] = useState(false);

  const startTimer = () => {
    setTimer(57);
    const iv = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(iv); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setErrors({ email: "Please enter your email address" });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      startTimer();
      setStep(2);
    } catch (err) {
      setErrors(err.response?.data || { general: "Failed to send reset link" });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleConfirmOTP = () => {
    const code = otp.join("");
    if (code.length < 6) {
      setErrors({ otp: "Please enter the complete 6-digit code" });
      return;
    }
    setErrors({});
    // TODO: POST /api/auth/verify-otp { phone, otp: code }
    setStep(3);
  };

  const handleResetPassword = async () => {
    const e = {};
    if (newPass.length < 8) e.newPass = "Password Must Be At Least 8 Characters";
    else if (!/[a-zA-Z]/.test(newPass) || !/[0-9]/.test(newPass))
      e.newPass = "Password Must Include Letters And Numbers";
    if (newPass !== confirmPass) e.confirmPass = "Passwords Do Not Match";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setLoading(true);
      try {
        await authService.resetPassword({
          email,
          token: otp.join(""),
          password: newPass,
          password_confirmation: confirmPass,
        });
        setStep(4);
      } catch (err) {
        setErrors(err.response?.data || { general: "Failed to reset password" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <img src={logo} alt="NBIS Logo" className="w-[130px] h-[130px] object-contain mb-2" />
      <p className="text-gray-400 text-xs mb-5">Newborn Biometric ID</p>

      <div className="w-full max-w-sm space-y-4">

        {/* ── STEP 1: Email ── */}
        {step === 1 && (
          <>
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-blue-500">Forgot Password?</h2>
              <p className="text-gray-400 text-xs mt-1">We'll send you a password reset link to your email.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Email*</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full border rounded-xl mt-1 px-3 py-2.5 text-sm outline-none transition placeholder-gray-300 text-gray-700
                  ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
                placeholder="user@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">⚠ {errors.email}</p>
              )}
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-[#1E88E5] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            {errors.general && <p className="text-red-500 text-xs mt-1 text-center">⚠ {errors.general}</p>}
          </>
        )}

        {/* ── STEP 2: Token Input ── */}
        {step === 2 && (
          <>
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-blue-500">Enter Reset Token</h2>
              <p className="text-gray-400 text-xs mt-1">Enter the token from the email we sent you.</p>
            </div>

            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Backspace" && !digit && i > 0)
                      document.getElementById(`otp-${i - 1}`)?.focus();
                  }}
                  className={`w-11 h-12 text-center text-lg font-bold border rounded-xl outline-none transition
                    ${errors.otp ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"}`}
                />
              ))}
            </div>
            {errors.otp && <p className="text-red-500 text-xs text-center">⚠ {errors.otp}</p>}

            <button
              onClick={handleConfirmOTP}
              className="w-full bg-[#1E88E5] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm">
              Continue
            </button>
          </>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === 3 && (
          <>
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-blue-500">Create New Password</h2>
              <p className="text-gray-400 text-xs mt-1">Your Password Must Be At Least 8 Characters And Include Letters And Numbers</p>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Password*</label>
              <div className={`flex items-center border rounded-xl mt-1 px-3 py-2.5 gap-2 transition
                ${errors.newPass ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-blue-400"}`}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-300 text-gray-700"
                  placeholder="••••••••••••••"
                />
                <button onClick={() => setShowNew(!showNew)}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    {showNew
                      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    }
                  </svg>
                </button>
              </div>
              {errors.newPass && <p className="text-red-500 text-xs mt-1">⚠ {errors.newPass}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Confirm Password*</label>
              <div className={`flex items-center border rounded-xl mt-1 px-3 py-2.5 gap-2 transition
                ${errors.confirmPass ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-blue-400"}`}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-300 text-gray-700"
                  placeholder="••••••••••••••"
                />
                <button onClick={() => setShowConfirm(!showConfirm)}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    {showConfirm
                      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    }
                  </svg>
                </button>
              </div>
              {errors.confirmPass && <p className="text-red-500 text-xs mt-1">⚠ {errors.confirmPass}</p>}
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-[#1E88E5] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            {errors.general && <p className="text-red-500 text-xs mt-1 text-center">⚠ {errors.general}</p>}
          </>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 4 && (
          <>
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-blue-500">Password Reset Successful</h2>
              <p className="text-gray-400 text-xs mt-1">Your Password Has Been Updated Successfully. You Can Now Log In.</p>
            </div>

            <div className="flex justify-center my-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#1E88E5] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm">
              Login Now
            </button>
          </>
        )}

      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;