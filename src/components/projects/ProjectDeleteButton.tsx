import {
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { BsTrash } from "react-icons/bs";
import { useMutation } from "react-query";

const ProjectDeleteButton = ({
  projectId,
  handleRemove,
}: {
  projectId: string;
  handleRemove: () => void;
}) => {
  const toast = useToast();
  const { isLoading, mutate: deleteProject } = useMutation(
    "delete-project",
    () => axios.delete(`/api/projects/${projectId}`),
    {
      onSuccess: () => {
        toast({
          title: "Studio deleted",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          status: "success",
        });
        handleRemove();
      },
    }
  );

  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton
              variant="ghost"
              colorScheme="red"
              aria-label="See menu"
              icon={<BsTrash />}
            />
          </PopoverTrigger>
          <PopoverContent fontSize="sm">
            <PopoverArrow />
            <PopoverHeader fontWeight="bold">Confirmation</PopoverHeader>
            <PopoverBody>
              Are you sure you want to delete this studio and training images?
            </PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end">
              <ButtonGroup size="sm">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    deleteProject();
                  }}
                  isLoading={isLoading}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export default ProjectDeleteButton;
