import { Button, Modal, toast, useOverlayState } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Hearts } from "react-loader-spinner";
import { useContext, useState, type SubmitEvent } from "react";
import { AuthCreatedContext } from "../../context/AuthContext";

type PasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const initialValues: PasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function Password() {
  const { token, user, addDataToToken } = useContext(AuthCreatedContext);
  const modalState = useOverlayState({ defaultOpen: false });
  const [values, setValues] = useState(initialValues);

  const Password = useMutation({
    mutationFn: (formValues: PasswordValues) =>
      axios.patch(
        "https://route-posts.routemisr.com/users/-password",
        formValues,
        { headers: { token } },
      ),
    onSuccess: ({ data }) => {
      const payload = data?.data ?? {};
      const nextToken = payload.token ?? payload.accessToken;
      const nextUser = payload.user ?? user;

      if (nextToken && nextUser) {
        addDataToToken(nextToken, nextUser);
      }

      toast.success(data?.message ?? "Password d successfully");
      setValues(initialValues);
      modalState.close();
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Could not  password")
        : "Could not  password";
      toast.danger(message);
    },
  });

  function submitPassword(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (values.newPassword !== values.confirmPassword) {
      toast.danger("New passwords do not match");
      return;
    }

    if (values.currentPassword === values.newPassword) {
      toast.danger("Choose a password different from your current one");
      return;
    }

    Password.mutate(values);
  }

  function updateField(field: keyof PasswordValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          modalState.open();
        }}
        className="w-full cursor-pointer rounded-2xl border border-transparent p-3 text-left font-medium text-burgundy transition-all duration-200 hover:border-lightPink hover:bg-softRose">
        Password
      </button>

      <Modal state={modalState}>
        <Modal.Backdrop className="flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <Modal.Container className="flex min-h-full w-full items-center justify-center">
            <Modal.Dialog className="relative w-[calc(100vw-2rem)] max-w-lg rounded-3xl bg-white p-6 text-black shadow-xl">
              <Modal.CloseTrigger className="absolute right-5 top-5 border border-transparent bg-primePink font-semibold text-softRose transition-all duration-300 hover:border-lightPink hover:bg-softRose hover:text-burgundy" />
              <Modal.Header className="mb-5 p-0">
                <Modal.Heading className="text-2xl font-semibold text-burgundy">
                  Password
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body className="p-0">
                <form onSubmit={submitPassword} className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Current password
                    <input
                      type="password"
                      autoComplete="current-password"
                      required
                      value={values.currentPassword}
                      onChange={(event) =>
                        updateField("currentPassword", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-lightPink bg-softRose p-3 outline-none focus:border-primePink"
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    New password
                    <input
                      type="password"
                      autoComplete="new-password"
                      required
                      value={values.newPassword}
                      onChange={(event) =>
                        updateField("newPassword", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-lightPink bg-softRose p-3 outline-none focus:border-primePink"
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Confirm new password
                    <input
                      type="password"
                      autoComplete="new-password"
                      required
                      value={values.confirmPassword}
                      onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-lightPink bg-softRose p-3 outline-none focus:border-primePink"
                    />
                  </label>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      isDisabled={Password.isPending}
                      onPress={() => modalState.close()}
                      className="rounded-xl border border-lightPink bg-softRose px-4 py-2 font-semibold text-burgundy hover:bg-primePink hover:text-softRose">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={Password.isPending}
                      className="flex min-w-36 items-center justify-center rounded-xl bg-burgundy px-4 py-2 font-semibold text-white hover:bg-primePink hover:text-softRose">
                      {Password.isPending ? (
                        <Hearts
                          height="25"
                          width="40"
                          color="#fff7fe"
                          ariaLabel="saving-password"
                          visible
                        />
                      ) : (
                        "Save password"
                      )}
                    </Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
