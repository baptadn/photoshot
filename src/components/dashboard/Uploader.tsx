import { createPreviewMedia, resizeImage } from "@/core/utils/upload";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  Highlight,
  Icon,
  Image,
  Input,
  List,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdCheckCircle, MdCloud } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { useMutation } from "react-query";
import AvatarsPlaceholder from "../home/AvatarsPlaceholder";
import { CheckedListItem } from "../home/Pricing";
import UploadErrorMessages from "./UploadErrorMessages";

type TUploadState = "not_uploaded" | "uploading" | "uploaded";
export type FilePreview = (File | Blob) & { preview: string };

const MAX_FILES = 25;

const Uploader = ({ handleOnAdd }: { handleOnAdd: () => void }) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploadState, setUploadState] = useState<TUploadState>("not_uploaded");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [studioName, setStudioName] = useState<string>("");
  const [instanceClass, setInstanceClass] = useState<string>("man");
  const { uploadToS3 } = useS3Upload();
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxSize: 10000000, // 10mo
    onDropRejected: (events) => {
      setErrorMessages([]);
      const messages: { [key: string]: string } = {};

      events.forEach((event) => {
        event.errors.forEach((error) => {
          messages[error.code] = error.message;
        });
      });

      setErrorMessages(Object.keys(messages).map((id) => messages[id]));
    },
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > MAX_FILES) {
        toast({
          title: `You can't upload more than ${MAX_FILES} images`,
          duration: 3000,
          isClosable: true,
          position: "top-right",
          status: "error",
        });
      } else {
        setErrorMessages([]);
        setFiles([
          ...files,
          ...acceptedFiles.map((file) => createPreviewMedia(file)),
        ]);
      }
    },
  });

  const handleUpload = async () => {
    if (files.length < 5) {
      toast({
        title: "You need to upload at least 5 photos",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        status: "error",
      });
      return;
    }

    const filesToUpload = Array.from(files);
    setUploadState("uploading");

    for (let index = 0; index < filesToUpload.length; index++) {
      const file = await resizeImage(filesToUpload[index]);
      const { url } = await uploadToS3(file);

      setUrls((current) => [...current, url]);
    }

    setUploadState("uploaded");
  };

  const { mutate: handleCreateProject, isLoading } = useMutation(
    "create-project",
    () =>
      axios.post("/api/projects", {
        urls,
        studioName,
        instanceClass,
      }),
    {
      onSuccess: () => {
        handleOnAdd();

        // Reset
        setFiles([]);
        setUrls([]);
        setStudioName("");
        setInstanceClass("");
        setUploadState("not_uploaded");

        toast({
          title: "Studio created!",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          status: "success",
        });
      },
    }
  );

  return (
    <Box>
      {uploadState === "not_uploaded" && (
        <Center
          _hover={{
            bg: "whiteAlpha.800",
          }}
          transition="all 0.2s"
          backgroundColor="whiteAlpha.500"
          cursor="pointer"
          borderRadius="xl"
          border="1px dashed gray"
          p={10}
          flexDirection="column"
          {...getRootProps({ className: "dropzone" })}
        >
          <input {...getInputProps()} />
          <Box mb={4} position="relative">
            <AvatarsPlaceholder character="sacha" />
          </Box>
          <VStack textAlign="center" spacing={1}>
            <Box fontWeight="bold" fontSize="2xl">
              Drag and drop or click to upload
            </Box>
            <Box fontWeight="bold" fontSize="lg">
              <Highlight
                query="10-20 pictures"
                styles={{ bg: "brand.500", px: 1 }}
              >
                Upload 10-20 pictures of you
              </Highlight>
            </Box>
            <Box maxWidth="container.sm">
              <Text mt={4}>
                To get the best results, we suggest uploading 3 full body or
                entire object photos, 5 medium shots of the chest and up, and 10
                close-up photos and:
              </Text>
            </Box>
            <Box>
              <List mt={4} textAlign="left">
                <CheckedListItem>
                  Mix it up - change body pose, background, and lighting in each
                  photo
                </CheckedListItem>
                <CheckedListItem>
                  Capture a range of expressions
                </CheckedListItem>
                <CheckedListItem>
                  {`Show the subject's eyes looking in different directions`}
                </CheckedListItem>
              </List>
            </Box>
            {errorMessages?.length !== 0 && (
              <UploadErrorMessages messages={errorMessages} />
            )}
          </VStack>
        </Center>
      )}

      <Flex pt={3} flexWrap="wrap">
        {files.map((file, index) => (
          <Box
            m={3}
            width="7rem"
            height="7rem"
            position="relative"
            key={file.name}
          >
            <Center top={-2} right={-2} position="absolute">
              {uploadState === "uploading" && !urls[index] && (
                <Spinner
                  size="lg"
                  thickness="8px"
                  speed="1s"
                  color="brand.500"
                />
              )}

              {uploadState !== "uploading" && !urls[index] && (
                <Icon
                  cursor="pointer"
                  onClick={() => {
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                  borderRadius="full"
                  backgroundColor="brand.500"
                  as={IoIosClose}
                  fontSize="2rem"
                />
              )}

              {urls[index] && (
                <Icon
                  borderRadius="full"
                  backgroundColor="white"
                  color="green.400"
                  as={MdCheckCircle}
                  fontSize="2rem"
                />
              )}
            </Center>
            <Image
              objectFit="cover"
              borderRadius="xl"
              border="4px solid white"
              shadow="xl"
              alt={file.name}
              width="7rem"
              height="7rem"
              src={file.preview}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
          </Box>
        ))}
      </Flex>

      {files.length > 0 && uploadState !== "uploaded" && (
        <Box mb={10} textAlign="center">
          <Button
            isLoading={uploadState === "uploading"}
            rightIcon={<MdCloud />}
            size="lg"
            onClick={handleUpload}
            variant="brand"
          >
            {files.length < 5
              ? "Upload (min 5 photos)"
              : `Upload ${files.length} photo${files.length > 1 && "s"}`}
          </Button>
        </Box>
      )}

      {uploadState === "uploaded" && (
        <SimpleGrid
          gap={4}
          columns={{ base: 1, md: 3 }}
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProject();
          }}
          mt={4}
          alignItems="flex-start"
        >
          <FormControl>
            <Input
              isRequired
              backgroundColor="white"
              placeholder="Studio name"
              value={studioName}
              onChange={(e) => setStudioName(e.currentTarget.value)}
            />
          </FormControl>
          <FormControl>
            <Select
              value={instanceClass}
              onChange={(e) => setInstanceClass(e.currentTarget.value)}
              backgroundColor="white"
            >
              <option value="man">Man</option>
              <option value="woman">Woman</option>
              <option value="child">Child</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="couple">Couple</option>
              <option value="style">Style</option>
            </Select>
            <FormHelperText color="blackAlpha.600">
              Type of the subject
            </FormHelperText>
          </FormControl>
          <Box>
            <Button
              disabled={!Boolean(studioName)}
              isLoading={isLoading}
              variant="brand"
              rightIcon={<MdCheckCircle />}
              onClick={() => {
                if (studioName && instanceClass) {
                  handleCreateProject();
                }
              }}
            >
              Create your Studio
            </Button>
          </Box>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Uploader;
