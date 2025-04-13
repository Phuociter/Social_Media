import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { BsFiletypeGif } from "react-icons/bs";
import { postAPI } from "../api";
import { NoProfile } from "../assets";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import TextInput from "./TextInput";

const CreatePost = ({user, onPostCreated}) => {
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [posting, setPosting] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const [fileType, setFileType] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors},
    } = useForm();

    // Xử lý khi chọn file
    const handleFileChange = (e, type) => {
        const selectedFile = e.target.files[0];
        if(!selectedFile) return;

        // Kiểm tra kích thước file (5MB)
        if(selectedFile.size > 5 * 1024 * 1024){
            setErrMsg({status: "failed", message: "File size should be less than 5MB"});
            return;
        }
        setFile(selectedFile);
        setFileType(type);

        // Tạo preview
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(selectedFile);
    };

    // Xử lý submit form
    const handlePostSubmit = async(data) => {
        setPosting(true);
        try{
            const formData = new FormData();
            formData.append("description", data.description);
            if(file){
                formData.append("media", file);
                formData.append("mediaType", fileType);
            }
            
            const response = await postAPI.createPost(formData);

            // Reset form sau khi đăng
            reset();
            setFile(null);
            setFilePreview(null);
            setFileType(null);
            setErrMsg({status: "success", message: "Post created successfully"});

            // Gọi callback để cập nhật danh sách bài viết
            if(onPostCreated) onPostCreated(response.data);
        }
        catch(error){
            console.error("Post error: ", error);
            setErrMsg({status: "failed", message: error.message || "Failed to create post"});
        }finally{
            setPosting(false);
        }
    };
    return (
        <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
          <form
            onSubmit={handleSubmit(handlePostSubmit)}
            className='bg-primary px-4 rounded-lg'
          >
            <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
              <img
                src={user?.profileUrl ?? NoProfile}
                alt='User Image'
                className='w-14 h-14 rounded-full object-cover'
              />
              <TextInput
                styles='w-full rounded-full py-5'
                placeholder="What's on your mind...."
                name='description'
                register={register("description", {
                  required: "Write something about post",
                })}
                error={errors.description ? errors.description.message : ""}
              />
            </div>
    
            {/* Hiển thị preview media */}
            {filePreview && (
              <div className="mt-2 relative">
                {fileType === "image" ? (
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-contain rounded-lg"
                  />
                ) : fileType === "video" ? (
                  <video 
                    src={filePreview} 
                    controls 
                    className="w-full h-64 object-contain rounded-lg"
                  />
                ) : (
                  <img 
                    src={filePreview} 
                    alt="GIF Preview" 
                    className="w-full h-64 object-contain rounded-lg"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                    setFileType(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            )}
    
            {errMsg?.message && (
              <span
                role='alert'
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}
    
            <div className='flex items-center justify-between py-4'>
              <label
                htmlFor='imgUpload'
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
              >
                <input
                  type='file'
                  onChange={(e) => handleFileChange(e, "image")}
                  className='hidden'
                  id='imgUpload'
                  accept='.jpg, .png, .jpeg'
                />
                <BiImages />
                <span>Image</span>
              </label>
    
              <label
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                htmlFor='videoUpload'
              >
                <input
                  type='file'
                  onChange={(e) => handleFileChange(e, "video")}
                  className='hidden'
                  id='videoUpload'
                  accept='.mp4, .wav'
                />
                <BiSolidVideo />
                <span>Video</span>
              </label>
    
              <label
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                htmlFor='gifUpload'
              >
                <input
                  type='file'
                  onChange={(e) => handleFileChange(e, "gif")}
                  className='hidden'
                  id='gifUpload'
                  accept='.gif'
                />
                <BsFiletypeGif />
                <span>Gif</span>
              </label>
    
              <div>
                {posting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type='submit'
                    title='Post'
                    containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'
                    disabled={posting || (!file && !watch("description"))}
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      );
    };
    
    export default CreatePost;
