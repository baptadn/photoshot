import uniqid from "uniqid";

export async function resizeImage(file: File | Blob) {
  const reduce = require("image-blob-reduce")();
  const blob = new Blob([file], { type: "image/jpeg" });
  const resizedBlob = await reduce.toBlob(blob, { max: 1024 });
  const resizedFile = new File([resizedBlob], `${uniqid()}.jpeg`);

  return resizedFile;
}

export const createPreviewMedia = (media: File | Blob) =>
  Object.assign(media, {
    preview: URL.createObjectURL(media),
  });
