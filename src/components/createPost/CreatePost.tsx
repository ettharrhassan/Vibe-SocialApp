import { Button, Modal } from "@heroui/react";
import { AuthCreatedContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function CreatePost() {
  const { user } = useContext(AuthCreatedContext);

  return (
    <Modal>
      <Button
        variant="secondary"
        className="mb-2 flex h-auto w-1/2 mx-auto items-center gap-3 rounded-2xl border border-lightPink bg-white p-3 text-left shadow-sm">
        <span className="size-12 shrink-0 overflow-hidden rounded-full bg-lightPink">
          {user?.photo && (
            <img
              src={user.photo}
              alt="Profile Image"
              className="h-full w-full object-cover"
            />
          )}
        </span>

        <span className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-base text-gray-500">
          What’s on your mind?
        </span>

        <span
          aria-label="إضافة صورة"
          className="shrink-0 text-2xl text-green-500">
          ▧
        </span>
      </Button>

      <Modal.Backdrop className="bg-black/50">
        <Modal.Container>
          <Modal.Dialog className="w-1/2 max-w-[calc(100vw-32px)]! rounded-3xl bg-white px-6 pb-6 pt-8 text-black shadow-xl">
            <Modal.CloseTrigger className="absolute right-5 top-5 bg-primePink hover:bg-burgundy text-softRose font-semibold transition-all duration-300" />

            <Modal.Header className="mb-4 flex flex-col items-start gap-4 p-0">
              <Modal.Heading className="text-2xl font-semibold">
                Create Post
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-0">
              <textarea
                placeholder="What’s In Your Mind"
                aria-label="What’s In Your Mind"
                className="h-32 w-full resize-none rounded-2xl border border-lightPink bg-white p-4 text-xl text-black outline-none placeholder:text-[#888]  focus:border-2"
              />
            </Modal.Body>

            <Modal.Footer className="mt-8 border-t-0 p-0">
              <Button
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
