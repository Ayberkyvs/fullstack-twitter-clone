import React from "react";
import PageHeading from "../../components/ui/PageHeading";
import Collapse from "../../components/ui/Collapse";
import { useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import Modal from "../../components/ui/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const SettingsPage = () => {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") ?? "default"
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  React.useEffect(() => {
    localStorage.setItem("theme", theme!);
    findActiveTheme();
  }, [theme]);

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/users/delete", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.error || "An error occurred while deleting your account"
          );
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      localStorage.clear();
      navigate("/login");
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      console.error(error.message);
    },
  });

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.value) {
      setTheme(target.value);
    }
  };
  const findActiveTheme = () => {
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html")?.setAttribute("data-theme", localTheme!);
  };
  const handleAccountDeletion = () => {
    if (isDeleting || true) return;
    deleteAccount();
  };
  return (
    <div className="min-h-screen">
      <PageHeading title="Settings" headerMobile={false} />
      <div className="flex flex-col justify-start items-start">
        <Collapse title="Theme">
          <div className="join flex-wrap join-horizontal border-none my-2">
            <input
              type="radio"
              name="theme-buttons"
              className={`btn theme-controller join-item ${
                theme === "default" ? "btn-active" : ""
              }`}
              aria-label="Default"
              value="default"
              onClick={handleClick}
            />
            <input
              type="radio"
              name="theme-buttons"
              className={`btn theme-controller join-item ${
                theme === "black" ? "btn-active" : ""
              }`}
              aria-label="Black"
              value="black"
              onClick={handleClick}
            />
            <input
              type="radio"
              name="theme-buttons"
              className={`btn theme-controller join-item ${
                theme === "light" ? "btn-active" : ""
              }`}
              aria-label="Light"
              value="light"
              onClick={handleClick}
            />
            <input
              type="radio"
              name="theme-buttons"
              className={`btn theme-controller join-item ${
                theme === "valentine" ? "btn-active" : ""
              }`}
              aria-label="Valentine"
              value="valentine"
              onClick={handleClick}
            />
            <input
              type="radio"
              name="theme-buttons"
              className={`btn theme-controller join-item ${
                theme === "coffee" ? "btn-active" : ""
              }`}
              aria-label="Coffee"
              value="coffee"
              onClick={handleClick}
            />
            <input
              type="radio"
              name="theme-buttons"
              className={`btn theme-controller join-item ${
                theme === "aqua" ? "btn-active" : ""
              }`}
              aria-label="Aqua"
              value="aqua"
              onClick={handleClick}
            />
            <input
              type="radio"
              name="theme-buttons"
              className={`btn theme-controller join-item ${
                theme === "synthwave" ? "btn-active" : ""
              }`}
              aria-label="Synthwave"
              value="synthwave"
              onClick={handleClick}
            />
            <input
              type="radio"
              name="theme-buttons"
              className={`btn theme-controller join-item ${
                theme === "lemonade" ? "btn-active" : ""
              }`}
              aria-label="Lemonade"
              value="lemonade"
              onClick={handleClick}
            />
          </div>
        </Collapse>
        <Collapse title="Author">
          Ayberk Yavas{" "}
          <a
            className="link link-info"
            href="https://ayberkyavas.com"
            target="_blank"
            rel="noopener"
          >
            My Website
          </a>
        </Collapse>
        <Collapse title="Delete Account">
          <Modal
            modalName="delete-account"
            trigger={
              <button
                className="btn btn-error"
                role="button"
                onClick={() => {
                  const modal = document.getElementById(
                    "delete-account"
                  ) as HTMLDialogElement | null;
                  modal?.showModal(); // Ensures modal exists and calls showModal()
                }}
                type="button"
              >
                <GoTrash className="w-[1.3em] h-[1.3em]" />
                Delete my account
              </button>
            }
          >
            <h3 className="font-bold text-lg">Account Deletion!</h3>
            <p className="py-4">
              We destroy all data about you and it cannot be restored.{" "}
            </p>
            <button
              className="btn btn-outline btn-error"
              onClick={handleAccountDeletion}
              type="button"
              disabled
            >
              {isDeleting ? (
                <LoadingSpinner size="lg" className="text-error"/>
              ) : (
                "I read, delete my account"
              )}
            </button>
          </Modal>
        </Collapse>
      </div>
    </div>
  );
};

export default SettingsPage;
