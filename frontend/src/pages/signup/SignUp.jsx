import React, { useState } from "react";
import GenderCheckbox from "./GenderCheckbox";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";
import { IoMdEye } from "react-icons/io";
import { RiEyeCloseFill } from "react-icons/ri";

function SignUp() {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirmPassword visibility

  const { loading, signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up
          <span className="text-blue-500"> ChatApp</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered h-10"
              value={inputs.fullName}
              onChange={(e) =>
                setInputs({ ...inputs, fullName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full input input-bordered h-10"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="john@yopmail.com"
              className="w-full input input-bordered h-10"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                placeholder="Enter password"
                className="w-full input input-bordered h-10 pr-10"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              >
                {showPassword ? (
                  <IoMdEye size={20}/>
                ) : (
                  <RiEyeCloseFill size={20}/>
                )}
              </button>
            </div>
          </div>
          <div className="pb-2">
            <label className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle input type
                placeholder="Confirm password"
                className="w-full input input-bordered h-10 pr-10"
                value={inputs.confirmPassword}
                onChange={(e) =>
                  setInputs({ ...inputs, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                } // Toggle visibility
              >
                {showConfirmPassword ? (
                  <IoMdEye size={20}/>
                ) : (
                  <RiEyeCloseFill size={20}/>
                )}
              </button>
            </div>
          </div>
          <GenderCheckbox
            onCheckboxChange={handleCheckboxChange}
            selectedGender={inputs.gender}
          />
          <Link
            to="/login"
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
          >
            Already have an account?
          </Link>
          <div className="mt-4">
            <button
              className="btn btn-block btn-sm h-10 hover:bg-gray-850"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;