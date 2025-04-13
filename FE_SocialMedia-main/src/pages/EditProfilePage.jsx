import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "../components/TextInput";
import Loading from "../components/Loading";
import CustomButton from "../components/CustomButton";
import { UpdateProfile } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { EditProfile } from "../components";
const EditProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });

  const onSubmit = async (data) => {
    // Xử lý submit form
    // Sau khi submit thành công, có thể navigate trở lại trang profile
    console.log("Data submit:", data, picture);
    // Ví dụ:
    // setIsSubmitting(true);
    // await updateProfileAPI(data, picture);
    // setIsSubmitting(false);
    // navigate(`/profile/${user._id}`);
  };

  const handleSelect = (e) => {
    setPicture(e.target.files[0]);
  };

  return (

    <div>
        <EditProfile/>
    </div>
  );
};

export default EditProfilePage;
