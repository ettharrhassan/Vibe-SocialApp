import { Button, Modal } from "@heroui/react";
import { AuthCreatedContext } from "../../context/AuthContext";
import { useContext, useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Hearts } from "react-loader-spinner";

export default function CreatePost() {
  const { user, token } = useContext(AuthCreatedContext);

  let imageFile = useRef<HTMLInputElement>(null);

  let postBody = useRef<HTMLTextAreaElement>(null);

  function getDataToPost() {
    const postData = new FormData();
    if (postBody.current?.value) {
      postData.append("body", postBody.current.value);
    }
    if (imageFile.current?.files?.[0]) {
      postData.append("image", imageFile.current?.files?.[0]);
    }

    return axios.post("https://route-posts.routemisr.com/posts", postData, {
      headers: {
        token: token,
      },
    });
  }

  const queryClient = useQueryClient();
  const { data, isPending, isError, mutate } = useMutation({
    mutationFn: getDataToPost,
    onSuccess: function () {
      console.log("Success");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      clearImage();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          "Upload error:",
          error.response?.status,
          error.response?.data,
        );
      } else {
        console.error(error);
      }
    },
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  function imagePreview() {
    if (imageFile.current?.files?.[0]) {
      setImageSrc(URL.createObjectURL(imageFile.current?.files?.[0]));
    }
  }
  function clearImage() {
    setImageSrc(null);

    if (imageFile.current) {
      imageFile.current.value = "";
    }
  }
  return (
    <Modal>
      <Button
        variant="secondary"
        className="mb-2 flex h-auto w-full items-center gap-3 rounded-2xl border border-lightPink bg-white p-3 text-left shadow-sm">
        <span className="size-12 shrink-0 overflow-hidden rounded-full ">
          {user?.photo && (
            <img
              src={user.photo}
              alt="Profile Image"
              className="h-full w-full object-cover"
            />
          )}
        </span>

        <span className="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-base text-gray-500 border border-transparent hover:border-lightPink transition-all duration-300">
          {isPending
            ? "Loading .. "
            : `What’s on your mind, ${user?.name?.split(" ")[0] || user?.username}?`}
        </span>

        <div className=" group flex size-10 shrink-0 items-center justify-center">
     <FaImage className="size-6 text-burgundy transition-transform duration-300 group-hover:text-primePink group-hover:scale-125" />
        </div>
      </Button>

      <Modal.Backdrop className="bg-black/50">
        <Modal.Container>
          <Modal.Dialog className="relative w-[calc(100vw-2rem)] sm:w-3/4 lg:w-[40%]  max-w-3xl rounded-3xl bg-white px-6 pb-6 pt-8 text-black shadow-xl">
            <Modal.CloseTrigger className="absolute right-5 top-5 bg-primePink hover:bg-softRose hover:border-lightPink border border-transparent hover:text-burgundy text-softRose font-semibold transition-all duration-300" />

            <Modal.Header className="mb-4 flex flex-col items-start gap-4 p-0">
              <Modal.Heading className="text-2xl font-semibold">
                Create Post
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-0">
              <textarea
                ref={postBody}
                placeholder={`What’s on your mind, ${user?.name?.split(" ")[0] || user?.username}?`}
                aria-label="What’s In Your Mind"
                className="h-32 w-full resize-none rounded-2xl border border-lightPink bg-white p-4 text-xl text-black outline-none placeholder:text-[#888]  focus:border-2"
              />

              <div className="my-7 w-full">
                <input
                  onChange={imagePreview}
                  ref={imageFile}
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                />

                <label
                  htmlFor="imageUpload"
                  className="flex w-full cursor-pointer items-center justify-center gap-3 hover:from-primePink hover:via-primePink hover:to-primePink  rounded-full bg-linear-to-r from-primePink via-lightPink to-primePink p-3 font-semibold text-lg text-white hover:-translate-y-1.5 transition-all duration-300 ">
                  <FaImage />
                  <span>Add Image To Your Post</span>
                </label>
                {imageSrc && (
                  <div className="relative">
                    <img src={imageSrc} alt="Image Uploaded" className="my-5" />
                    <button
                      onClick={clearImage}
                      type="button"
                      className="absolute right-5 top-3 z-10 flex size-11 items-center justify-center rounded-2xl  bg-primePink hover:bg-softRose hover:text-burgundy text-softRose font-semibold transition-all duration-300">
                      <FaTrashCan className="size-5 shrink-0 cursor-pointer" />
                    </button>
                  </div>
                )}
              </div>
            </Modal.Body>

           <Modal.Footer className="mt-8 border-t-0! border-0! p-0">
              <Button
                onClick={() => mutate()}
                slot="close"
                className="w-full text-xl rounded-full bg-linear-to-r from-primePink via-lightPink  to-primePink py-5 font-semibold text-white transition-all duration-300  hover:from-primePink hover:via-primePink hover:to-primePink  hover:-translate-y-1.5">
                Post
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
