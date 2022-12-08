import ImageBlobReduce from "image-blob-reduce";
import uniqid from "uniqid";

export async function resizeImage(file: File) {
  const reduce = new ImageBlobReduce();

  const blob = new Blob([file], { type: "image/jpeg" });
  const resizedBlob = await reduce.toBlob(blob, { max: 1024 });
  const resizedFile = new File([resizedBlob], `${uniqid()}.jpeg`);

  return resizedFile;
}
