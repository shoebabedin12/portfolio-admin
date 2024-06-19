import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../feature/users/authSlice";

const Home = () => {
  const url = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.login.userLogin);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const [checked, setChecked] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditMode2, setIsEditMode2] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    profession: "",
    email: "",
    phone: "",
    address: "",
  });
  const [userDetails2, setUserDetails2] = useState({
    profile_img: null,
    description: "",
  });

  useEffect(() => {
    if (users?.user) {
      setUserDetails(users?.user);
    }
  }, [users]);

  const handleEditClick = async () => {
    if (isEditMode) {
      try {
        let response = await axios.post(`${url}/update-user`, userDetails);

        let data = response.data;
        if (data.success) {
          localStorage.setItem("User", JSON.stringify(data));
          dispatch(LoginUser(data));
        } else {
          console.error("Error updating user:", data.message);
        }
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error(
            "Server Error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // Request was made but no response was received
          console.error("Network Error: No response received", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Error:", error.message);
        }
      }
    }
    setIsEditMode(!isEditMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleChange2 = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_img" && files.length > 0) {
      setUserDetails2((prevDetails) => ({
        ...prevDetails,
        profile_img: files[0],
      }));
    } else {
      setUserDetails2((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleEditClick2 = async () => {
    if (isEditMode2) {
      const formData = new FormData();
      formData.append("profile_img", userDetails2.profile_img);
      formData.append("description", userDetails2.description);
      formData.append("_id", users.user._id);

      try {
        const response = await axios.post(`${url}/update-user-info`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const data = response.data;
        if (data.success) {
          localStorage.setItem("User", JSON.stringify(data));
          dispatch(LoginUser(data));
        } else {
          console.error("Error updating user:", data.message);
        }
      } catch (error) {
        if (error.response) {
          console.error(
            "Server Error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("Network Error: No response received", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
    }
    setIsEditMode2(!isEditMode2);
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [modalOpen]);


  const companyHandleChange = (event) => {
    const { name, value, type, checked: isChecked } = event.target;
    
    if (type === 'checkbox') {
      setChecked(isChecked);
      if (isChecked) {
        setInputs(values => ({ ...values, leave_date: 'continued' }));
      } else {
        setInputs(values => {
          const newValues = { ...values };
          delete newValues.leave_date; // Remove leave_date when checkbox is unchecked
          return newValues;
        });
      }
    } else {
      setInputs(values => ({ ...values, [name]: value }));
    }
  }

  const companyHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/add-experience`, {
        ...inputs,
        userId: users.user._id  // Include userId in the request body
      });      
      const data = response.data;
      console.log(data);
      if (data.success) {
        setInputs({});
        setChecked(false);
      } else {
        console.error("Error updating user:", data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server Error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("Network Error: No response received", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  }

  return (
    <>
      <div className={`bg-gray-100 min-h-screen`}>
        <div className="container my-5 p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            {/* <!-- Left Side --> */}
            <div className="w-full md:w-3/12 md:mx-2 bg-white p-3 border-t-4 border-green-400">
              {/* <!-- Profile Card --> */}
              <button
                className="mb-4 px-4 py-1 bg-white rounded text-base"
                onClick={handleEditClick2}
              >
                {isEditMode2 ? (
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 20.75H7C6.27065 20.75 5.57118 20.4603 5.05546 19.9445C4.53973 19.4288 4.25 18.7293 4.25 18V6C4.25 5.27065 4.53973 4.57118 5.05546 4.05546C5.57118 3.53973 6.27065 3.25 7 3.25H14.5C14.6988 3.25018 14.8895 3.32931 15.03 3.47L19.53 8C19.6707 8.14052 19.7498 8.33115 19.75 8.53V18C19.75 18.7293 19.4603 19.4288 18.9445 19.9445C18.4288 20.4603 17.7293 20.75 17 20.75ZM7 4.75C6.66848 4.75 6.35054 4.8817 6.11612 5.11612C5.8817 5.35054 5.75 5.66848 5.75 6V18C5.75 18.3315 5.8817 18.6495 6.11612 18.8839C6.35054 19.1183 6.66848 19.25 7 19.25H17C17.3315 19.25 17.6495 19.1183 17.8839 18.8839C18.1183 18.6495 18.25 18.3315 18.25 18V8.81L14.19 4.75H7Z"
                      fill="#000000"
                    />
                    <path
                      d="M16.75 20H15.25V13.75H8.75V20H7.25V13.5C7.25 13.1685 7.3817 12.8505 7.61612 12.6161C7.85054 12.3817 8.16848 12.25 8.5 12.25H15.5C15.8315 12.25 16.1495 12.3817 16.3839 12.6161C16.6183 12.8505 16.75 13.1685 16.75 13.5V20Z"
                      fill="#000000"
                    />
                    <path
                      d="M12.47 8.75H8.53001C8.3606 8.74869 8.19311 8.71403 8.0371 8.64799C7.88109 8.58195 7.73962 8.48582 7.62076 8.36511C7.5019 8.24439 7.40798 8.10144 7.34437 7.94443C7.28075 7.78741 7.24869 7.61941 7.25001 7.45V4H8.75001V7.25H12.25V4H13.75V7.45C13.7513 7.61941 13.7193 7.78741 13.6557 7.94443C13.592 8.10144 13.4981 8.24439 13.3793 8.36511C13.2604 8.48582 13.1189 8.58195 12.9629 8.64799C12.8069 8.71403 12.6394 8.74869 12.47 8.75Z"
                      fill="#000000"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <form>
                <div className="image overflow-hidden">
                  {isEditMode2 ? (
                    <input
                      className="border rounded px-2 py-1"
                      type="file"
                      name="profile_img"
                      onChange={handleChange2}
                      accept="image/*"
                    />
                  ) : (
                    <img
                      className="h-auto w-full mx-auto"
                      src={userDetails2.profile_img}
                      alt=""
                    />
                  )}
                  {users.user.profile_img && (
                    <div className="h-[200px] w-[200px] rounded-full overflow-hidden mx-[auto] mb-[30px]">
                      <img
                        src={`${url}/${users.user.profile_img}`}
                        alt="Profile Preview"
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-gray-600 font-lg text-semibold leading-6">
                  Owner at Her Company Inc.
                </h3>
                <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                  {isEditMode2 ? (
                    <input
                      type="text"
                      name="description"
                      value={userDetails2.description}
                      onChange={handleChange2}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    users.user.description
                  )}
                </p>
              </form>
              {/* <!-- End of profile card --> */}
              <div className="my-4"></div>
            </div>
            {/* <!-- Right Side --> */}
            <div className="w-full md:w-9/12 mx-2 h-64">
              {/* <!-- Profile tab --> */}
              {/* <!-- About Section --> */}
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="flex items-center justify-between space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="flex items-center gap-2">
                    <span clas="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">About</span>
                  </span>
                  <button
                    className="mb-4 px-4 py-1 bg-white rounded text-base"
                    onClick={handleEditClick}
                  >
                    {isEditMode ? (
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 20.75H7C6.27065 20.75 5.57118 20.4603 5.05546 19.9445C4.53973 19.4288 4.25 18.7293 4.25 18V6C4.25 5.27065 4.53973 4.57118 5.05546 4.05546C5.57118 3.53973 6.27065 3.25 7 3.25H14.5C14.6988 3.25018 14.8895 3.32931 15.03 3.47L19.53 8C19.6707 8.14052 19.7498 8.33115 19.75 8.53V18C19.75 18.7293 19.4603 19.4288 18.9445 19.9445C18.4288 20.4603 17.7293 20.75 17 20.75ZM7 4.75C6.66848 4.75 6.35054 4.8817 6.11612 5.11612C5.8817 5.35054 5.75 5.66848 5.75 6V18C5.75 18.3315 5.8817 18.6495 6.11612 18.8839C6.35054 19.1183 6.66848 19.25 7 19.25H17C17.3315 19.25 17.6495 19.1183 17.8839 18.8839C18.1183 18.6495 18.25 18.3315 18.25 18V8.81L14.19 4.75H7Z"
                          fill="#000000"
                        />
                        <path
                          d="M16.75 20H15.25V13.75H8.75V20H7.25V13.5C7.25 13.1685 7.3817 12.8505 7.61612 12.6161C7.85054 12.3817 8.16848 12.25 8.5 12.25H15.5C15.8315 12.25 16.1495 12.3817 16.3839 12.6161C16.6183 12.8505 16.75 13.1685 16.75 13.5V20Z"
                          fill="#000000"
                        />
                        <path
                          d="M12.47 8.75H8.53001C8.3606 8.74869 8.19311 8.71403 8.0371 8.64799C7.88109 8.58195 7.73962 8.48582 7.62076 8.36511C7.5019 8.24439 7.40798 8.10144 7.34437 7.94443C7.28075 7.78741 7.24869 7.61941 7.25001 7.45V4H8.75001V7.25H12.25V4H13.75V7.45C13.7513 7.61941 13.7193 7.78741 13.6557 7.94443C13.592 8.10144 13.4981 8.24439 13.3793 8.36511C13.2604 8.48582 13.1189 8.58195 12.9629 8.64799C12.8069 8.71403 12.6394 8.74869 12.47 8.75Z"
                          fill="#000000"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-gray-700">
                  <form className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Name</div>
                      <div className="px-4 py-2">
                        {isEditMode ? (
                          <input
                            type="text"
                            name="name"
                            value={userDetails.name}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                          />
                        ) : (
                          userDetails.name
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Profession</div>
                      <div className="px-4 py-2">
                        {isEditMode ? (
                          <input
                            type="text"
                            name="profession"
                            value={userDetails.profession}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                          />
                        ) : (
                          userDetails.profession
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Contact No.</div>
                      <div className="px-4 py-2">
                        {isEditMode ? (
                          <input
                            type="text"
                            name="phone"
                            value={userDetails.phone}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                          />
                        ) : (
                          userDetails.phone
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Current Address
                      </div>
                      <div className="px-4 py-2">
                        {isEditMode ? (
                          <input
                            type="text"
                            name="address"
                            value={userDetails.address}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                          />
                        ) : (
                          userDetails.address
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Email</div>
                      <div className="px-4 py-2">
                        {isEditMode ? (
                          <input
                            type="email"
                            name="email"
                            value={userDetails.email}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                          />
                        ) : (
                          <a
                            className="text-blue-800"
                            href={`mailto:${userDetails.email}`}
                          >
                            {userDetails.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* <!-- End of about section --> */}

              <div className="my-4"></div>

              {/* <!-- Experience and education --> */}
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                      <span className="flex items-center">
                        <span clas="text-green-500">
                          <svg
                            className="h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </span>
                        <span className="tracking-wide">Experience</span>
                      </span>
                      <button onClick={() => setModalOpen(!modalOpen)}>
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 10C3 8.34315 4.34315 7 6 7H14C15.6569 7 17 8.34315 17 10V18C17 19.6569 15.6569 21 14 21H6C4.34315 21 3 19.6569 3 18V10Z"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 14V11M10 14V17M10 14H13M10 14H7"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7 3L18 3C19.6569 3 21 4.34315 21 6L21 17"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <ul className="list-inside space-y-2">
                      <li>
                        <div className="flex items-center justify-between">
                          <span className="text-teal-600">
                            Owner at Her Company Inc.
                          </span>
                          <button
                            className="mb-4 px-4 py-1 bg-white rounded text-base"
                            // onClick={handleEditClick2}
                          >
                            {isEditMode ? (
                              <svg
                                width="20px"
                                height="20px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M17 20.75H7C6.27065 20.75 5.57118 20.4603 5.05546 19.9445C4.53973 19.4288 4.25 18.7293 4.25 18V6C4.25 5.27065 4.53973 4.57118 5.05546 4.05546C5.57118 3.53973 6.27065 3.25 7 3.25H14.5C14.6988 3.25018 14.8895 3.32931 15.03 3.47L19.53 8C19.6707 8.14052 19.7498 8.33115 19.75 8.53V18C19.75 18.7293 19.4603 19.4288 18.9445 19.9445C18.4288 20.4603 17.7293 20.75 17 20.75ZM7 4.75C6.66848 4.75 6.35054 4.8817 6.11612 5.11612C5.8817 5.35054 5.75 5.66848 5.75 6V18C5.75 18.3315 5.8817 18.6495 6.11612 18.8839C6.35054 19.1183 6.66848 19.25 7 19.25H17C17.3315 19.25 17.6495 19.1183 17.8839 18.8839C18.1183 18.6495 18.25 18.3315 18.25 18V8.81L14.19 4.75H7Z"
                                  fill="#000000"
                                />
                                <path
                                  d="M16.75 20H15.25V13.75H8.75V20H7.25V13.5C7.25 13.1685 7.3817 12.8505 7.61612 12.6161C7.85054 12.3817 8.16848 12.25 8.5 12.25H15.5C15.8315 12.25 16.1495 12.3817 16.3839 12.6161C16.6183 12.8505 16.75 13.1685 16.75 13.5V20Z"
                                  fill="#000000"
                                />
                                <path
                                  d="M12.47 8.75H8.53001C8.3606 8.74869 8.19311 8.71403 8.0371 8.64799C7.88109 8.58195 7.73962 8.48582 7.62076 8.36511C7.5019 8.24439 7.40798 8.10144 7.34437 7.94443C7.28075 7.78741 7.24869 7.61941 7.25001 7.45V4H8.75001V7.25H12.25V4H13.75V7.45C13.7513 7.61941 13.7193 7.78741 13.6557 7.94443C13.592 8.10144 13.4981 8.24439 13.3793 8.36511C13.2604 8.48582 13.1189 8.58195 12.9629 8.64799C12.8069 8.71403 12.6394 8.74869 12.47 8.75Z"
                                  fill="#000000"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="20px"
                                height="20px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                  stroke="#000000"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                  stroke="#000000"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="text-gray-500 text-xs">
                          March 2020 - Now
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center justify-between space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                      <span className="flex items-center">
                        <span clas="text-green-500">
                          <svg
                            className="h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path
                              fill="#fff"
                              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                            />
                          </svg>
                        </span>
                        <span className="tracking-wide">Education</span>
                      </span>
                      <button
                        className="mb-4 px-4 py-1 bg-white rounded text-base"
                        // onClick={handleEditClick2}
                      >
                        {isEditMode ? (
                          <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17 20.75H7C6.27065 20.75 5.57118 20.4603 5.05546 19.9445C4.53973 19.4288 4.25 18.7293 4.25 18V6C4.25 5.27065 4.53973 4.57118 5.05546 4.05546C5.57118 3.53973 6.27065 3.25 7 3.25H14.5C14.6988 3.25018 14.8895 3.32931 15.03 3.47L19.53 8C19.6707 8.14052 19.7498 8.33115 19.75 8.53V18C19.75 18.7293 19.4603 19.4288 18.9445 19.9445C18.4288 20.4603 17.7293 20.75 17 20.75ZM7 4.75C6.66848 4.75 6.35054 4.8817 6.11612 5.11612C5.8817 5.35054 5.75 5.66848 5.75 6V18C5.75 18.3315 5.8817 18.6495 6.11612 18.8839C6.35054 19.1183 6.66848 19.25 7 19.25H17C17.3315 19.25 17.6495 19.1183 17.8839 18.8839C18.1183 18.6495 18.25 18.3315 18.25 18V8.81L14.19 4.75H7Z"
                              fill="#000000"
                            />
                            <path
                              d="M16.75 20H15.25V13.75H8.75V20H7.25V13.5C7.25 13.1685 7.3817 12.8505 7.61612 12.6161C7.85054 12.3817 8.16848 12.25 8.5 12.25H15.5C15.8315 12.25 16.1495 12.3817 16.3839 12.6161C16.6183 12.8505 16.75 13.1685 16.75 13.5V20Z"
                              fill="#000000"
                            />
                            <path
                              d="M12.47 8.75H8.53001C8.3606 8.74869 8.19311 8.71403 8.0371 8.64799C7.88109 8.58195 7.73962 8.48582 7.62076 8.36511C7.5019 8.24439 7.40798 8.10144 7.34437 7.94443C7.28075 7.78741 7.24869 7.61941 7.25001 7.45V4H8.75001V7.25H12.25V4H13.75V7.45C13.7513 7.61941 13.7193 7.78741 13.6557 7.94443C13.592 8.10144 13.4981 8.24439 13.3793 8.36511C13.2604 8.48582 13.1189 8.58195 12.9629 8.64799C12.8069 8.71403 12.6394 8.74869 12.47 8.75Z"
                              fill="#000000"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ul className="list-inside space-y-2">
                      <li>
                        <div className="text-teal-600">
                          Masters Degree in Oxford
                        </div>
                        <div className="text-gray-500 text-xs">
                          March 2020 - Now
                        </div>
                      </li>
                      <li>
                        <div className="text-teal-600">
                          Bachelors Degreen in LPU
                        </div>
                        <div className="text-gray-500 text-xs">
                          March 2020 - Now
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* <!-- End of Experience and education grid --> */}
              </div>
              {/* <!-- End of profile tab --> */}
            </div>
          </div>
        </div>
      </div>

      <div
      className={`fixed top-0 left-0 bg-black/60 w-full min-h-screen overflow-hidden overflow-y-auto flex items-center justify-center ${
        modalOpen
          ? 'opacity-100 visible z-10 transition duration-1000 ease-linear'
          : 'opacity-0 invisible -z-10 transition ease-in duration-500'
      }`}
    >
      <div className="max-w-[600px] w-full h-auto bg-white shadow-sm shadow-white py-2 px-4 rounded-lg">
        <div className="header flex items-center justify-between border-b-[1px] mb-2 py-1">
          <h2>Add Job Experience</h2>
          <button onClick={() => setModalOpen(false)}>
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
                fill="#1C274C"
              />
            </svg>
          </button>
        </div>
        <div className="content">
          <form onSubmit={companyHandler}>
            <div className="flex flex-col border-b-[1px] py-2">
              <label>Company Name</label>
              <input
                className="border-0 outline-none shadow-none"
                type="text"
                name="company_name"
                placeholder="type your company name"
                value={inputs.company_name || ""} 
                onChange={companyHandleChange}
              />
            </div>
            <div className="flex flex-col border-b-[1px] py-2">
              <label>Designation</label>
              <input
                className="border-0 outline-none shadow-none"
                type="text"
                name="designation"
                placeholder="type your designation here"
                value={inputs.designation || ""} 
                onChange={companyHandleChange}
              />
            </div>
            <div className="flex flex-col border-b-[1px] py-2">
              <label>Join Date</label>
              <input
                className="border-0 outline-none shadow-none"
                type="date"
                name="join_date"
                value={inputs.join_date || ""} 
                onChange={companyHandleChange}
              />
            </div>
       
            <div className="flex flex-col border-b-[1px] py-2">
        <label>Leave Date</label>
        <input
          className="border-0 outline-none shadow-none"
          type={checked ? 'text' : 'date'}
          name="leave_date"
          value={checked ? 'continue' : inputs.leave_date || ""} 
          onChange={companyHandleChange}
          disabled={checked}
        />
      </div>
      <div className="flex flex-col items-start justify-start border-b-[1px] py-2">
        <label>Continue</label>
        <input
          className="border-0 outline-none shadow-none"
          type="checkbox"
          name="continue"
          checked={checked}
          onChange={companyHandleChange}
        />
      </div>
            <button type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
