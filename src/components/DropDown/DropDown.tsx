import { Button, Dropdown, Label } from "@heroui/react";
import { FaTrash } from "react-icons/fa";
import { HiBookmark, HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit } from "react-icons/md";

type DropDownProps = {
  isOwner: boolean;
  onDelete: () => void;
};

export default function DropDown({ isOwner, onDelete }: DropDownProps) {
  return (
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
            if (key === "delete-file") {
              onDelete();
            }
          }}>
          {isOwner ? (
            <>
              <Dropdown.Item
                id="edit-file"
                textValue="Edit Post"
                className="dropDownStyle mt-4">
                <Label className="text-burgundy">Edit Post</Label>
                <MdEdit className="size-5" />
              </Dropdown.Item>

              <Dropdown.Item
                id="delete-file"
                className="dropDownStyle mt-2 mb-4!"
                textValue="Delete Post"
                variant="danger">
                <Label className="text-burgundy">Delete Post</Label>
                <FaTrash className="size-3.5"/>
              </Dropdown.Item>
            </>
          ) : (
            <Dropdown.Item
              id="save-post"
              textValue="Save Post"
              className="dropDownStyle my-4!">
              <Label className="text-burgundy">Save Post</Label>
              <HiBookmark className="size-5" />
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
