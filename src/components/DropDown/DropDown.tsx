import {
  Button,
  Dropdown,
  Label,
  Modal,
  toast,
  useOverlayState,
} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { HiBookmark, HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import type { PostCardPropsType } from "../../types/PostCardPropsType.types";
import axios from "axios";
import { AuthCreatedContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DropDownProps = {
  isOwner: boolean;
  isShared?: boolean;
  isSaved: boolean;
  onDelete: () => void;
  post: PostCardPropsType["post"];
  onSave: () => void;
};

export default function DropDown({
  isOwner,
  isShared = false,
  onDelete,
  post,
  onSave,
  isSaved,
}: DropDownProps) {
  const state = useOverlayState({
    defaultOpen: false,
    onOpenChange: (isOpen) => console.log(isOpen),
  });

  const imageFile = useRef<HTMLInputElement>(null);

  const postBody = useRef<HTMLTextAreaElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(post.image ?? null);

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

  const queryClient = useQueryClient();

  const { token } = useContext(AuthCreatedContext);

  const { mutate } = useMutation({
    mutationFn: handleEditPost,
    onSuccess: function () {
      toast.success("Post Updated");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

  function handleEditPost() {
    const postData = new FormData();
    if (postBody.current?.value) {
      postData.append("body", postBody.current.value);
    }
    if (imageFile.current?.files?.[0]) {
      postData.append("image", imageFile.current?.files?.[0]);
    }
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}`,
      postData,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  return (
    <>
      <Dropdown>
        <Dropdown.Trigger>
          <Button
            aria-label="Post options"
            variant="secondary"
            className=" hover:text-primePink hover:bg-softRose size-11 min-w-11 rounded-full bg-transparent transition-all duration-300 border border-transparent text-burgundy hover:border-lightPink ">
            <HiOutlineDotsHorizontal className="size-8" />
          </Button>
        </Dropdown.Trigger>

        <Dropdown.Popover
          placement="bottom end"
          shouldFlip={false}
          className="data-entering:animate-none data-exiting:animate-none">
          <Dropdown.Menu
            className="px-4"
            onAction={(key) => {
              if (key === "edit-file") {
                state.open();
              }
              if (key === "delete-file") {
                onDelete();
              }
              if (key === "save-post") onSave();
            }}>
            {isOwner ? (
              <>
                {!isShared && (
                  <Dropdown.Item
                    id="edit-file"
                    textValue="Edit Post"
                    className="dropDownStyle mt-4">
                    <Label className="text-burgundy">Edit Post</Label>
                    <MdEdit className="size-5" />
                  </Dropdown.Item>
                )}

                <Dropdown.Item
                  id="delete-file"
                  className="dropDownStyle mt-2 mb-4!"
                  textValue="Delete Post"
                  variant="danger">
                  <Label className="text-burgundy">Delete Post</Label>
                  <FaTrash className="size-3.5" />
                </Dropdown.Item>
              </>
            ) : (
              <Dropdown.Item
                id="save-post"
                textValue={isSaved ? "Unsave Post" : "Save Post"}
                className="dropDownStyle my-4!">
                <Label className="text-burgundy">
                  {isSaved ? "Unsave Post" : "Save Post"}
                </Label>
                <HiBookmark className="size-5" />
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <Modal state={state} >
        <Modal.Backdrop className="bg-black/50" >
          <Modal.Container>
            <Modal.Dialog className="relative w-[calc(100vw-2rem)] sm:w-3/4 lg:w-[40%]  max-w-3xl rounded-3xl bg-white px-6 pb-6 pt-8 text-black shadow-xl">
              <Modal.CloseTrigger className="absolute right-5 top-5 bg-primePink hover:bg-softRose hover:border-lightPink border border-transparent hover:text-burgundy text-softRose font-semibold transition-all duration-300" />

              <Modal.Header className="mb-4 flex flex-col items-start gap-4 p-0">
                <Modal.Heading className="text-2xl font-semibold">
                  Edit Post
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body className="p-0">
                <textarea
                  ref={postBody}
                  defaultValue={post.body}
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
                    <span>Update Image To Your Post</span>
                  </label>
                  {imageSrc && (
                    <div className="relative">
                      <img
                        src={imageSrc}
                        alt="Image Uploaded"
                        className="my-5"
                      />
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
                  Edit
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
