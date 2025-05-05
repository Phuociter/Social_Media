import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { UpdateProfile } from "../redux/userSlice";
import { updateInfoUser, uploadProfilePicture, uploadCoverPicture } from "../api/UserAPI";
import { setUser } from "../redux/userSlice";
import axios from "axios";

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });

  const handleSelect = (e, type) => {
    const file = e.target.files[0];
    if (type === "profile") setProfileImg(file);
    if (type === "cover") setCoverImg(file);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg("");

    const userId = user.userId;
    const payload = {
      username: data.username,
      email: data.email,
      profession: data.profession,
      bio: data.bio,
      country: data.country,
      website: data.website,
    };

    try {
      // First, update user info
      const updatedUser = await updateInfoUser(userId, payload);

      // Update Redux and LocalStorage after updating user info
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Handle profile image upload if exists
      if (profileImg) {
        const updatedProfile = await uploadProfilePicture(userId, profileImg);
        dispatch(setUser(updatedProfile));
        localStorage.setItem("user", JSON.stringify(updatedProfile));
      }

      if (coverImg) {
        console.log("Ảnh bìa đang upload:", coverImg);
        const updatedCover = await uploadCoverPicture(userId, coverImg);
        dispatch(setUser(updatedCover));
        localStorage.setItem("user", JSON.stringify(updatedCover));
      }

      // Fetch the updated user info to ensure all changes are reflected
      const updatedUserRes = await axios.get(`http://localhost:8080/api/users/${userId}`);
      dispatch(setUser(updatedUserRes.data)); // Update Redux state
      localStorage.setItem("user", JSON.stringify(updatedUserRes.data));

      navigate(-1); // Go back after updating
    } catch (error) {
      console.error("Error:", error);
      setErrMsg("Cập nhật thất bại"); // Error message to show
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleClose = () => {
    dispatch(UpdateProfile(false));
    navigate(-1); // Close and go back
  };

  return (
    <div className='fixed z-50 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity'>
          <div className='absolute inset-0 bg-[#000] opacity-70'></div>
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
        &#8203;
        <div
          className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-headline'
        >
          <div className='flex justify-between px-6 pt-5 pb-2'>
            <label className='block font-medium text-xl text-ascent-1 text-left'>
              Edit Profile
            </label>
            <button className='text-ascent-1' onClick={handleClose}>
              <MdClose size={22} />
            </button>
          </div>

          <form
            className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name='username'
              label='User Name'
              placeholder='User name'
              type='text'
              styles='w-full'
              register={register("username", {
                required: "Không được bỏ trống User name!",
                minLength: {
                  value: 1,
                  message: "Ít nhất phải có 1 ký tự!",
                },
                maxLength: {
                  value: 40,
                  message: "Không được quá 40 ký tự!",
                },
                pattern: {
                  value: /^[A-Za-zÀ-ỹà-ỹ\s]+$/, // Chỉ cho phép ký tự chữ cái (cả chữ hoa và chữ thường)
                  message: "User name chỉ được chứa chữ cái!",
                },
              })}
              error={errors.username?.message || ""}
            />
            <TextInput
              name='profession'
              label='Profession'
              placeholder='Profession'
              type='text'
              styles='w-full'
              register={register("profession", {
                maxLength: {
                  value: 255,
                  message: "Không được quá 255 ký tự!",
                },
                pattern: {
                  value: /^[A-Za-zÀ-ỹà-ỹ\s]+$/, // Chỉ cho phép ký tự chữ cái (cả chữ hoa và chữ thường)
                  message: "Profession chỉ được chứa chữ cái!",
                },
              })}
              error={errors.profession?.message || ""}
            />
            <TextInput
              name='bio'
              label='Bio'
              placeholder='Enter Bio'
              type='text'
              styles='w-full'
              register={register("bio", {
                maxLength: {
                  value: 140,
                  message: "Không được quá 140 ký tự!",
                },
                pattern: {
                  value: /^[\p{L}\p{M}\s.,!?;:'"“”‘’\-–—()]+$/u,
                  message: "Bio chỉ được chứa chữ cái và dấu câu!",
                },
              })}
              error={errors.bio?.message || ""}
            />


            <TextInput
              name='country'
              label='Country'
              placeholder='Enter Country'
              type='text'
              styles='w-full'
              register={register("country", {
                maxLength: {
                  value: 255,
                  message: "Không được quá 255 ký tự!",
                },
                pattern: {
                  value: /^[A-Za-zÀ-ỹà-ỹ\s]+$/, // Chỉ cho phép ký tự chữ cái (cả chữ hoa và chữ thường)
                  message: "User name chỉ được chứ chữ cái!",
                },
              })}
              error={errors.country?.message || ""}
            />

            <TextInput
              name='website'
              label='Website'
              placeholder='Enter Website'
              type='text'
              styles='w-full'
              register={register("website", {
                required: "Không được bỏ trống Website!",
                minLength: {
                  value: 1,
                  message: "Ít nhất phải có một ký tự!",
                },
                maxLength: {
                  value: 255,
                  message: "Không được quá 255 ký tự!",
                },

              })}
              error={errors.website?.message || ""}
            />

            <label className='text-sm font-medium text-ascent-2 mt-2'>
              Profile Image:
              <input
                type='file'
                accept='.jpg,.jpeg,.png'
                onChange={(e) => handleSelect(e, "profile")}
              />
            </label>

            <label className='text-sm font-medium text-ascent-2 mt-2'>
              Cover Image:
              <input
                type='file'
                accept='.jpg,.jpeg,.png'
                onChange={(e) => handleSelect(e, "cover")}
              />
            </label>

            {errMsg && (
              <span className='text-sm text-red-500 mt-1'>{errMsg}</span>
            )}

            <div className='py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]'>
              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type='submit'
                  containerStyles='inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none'
                  title='Submit'
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
