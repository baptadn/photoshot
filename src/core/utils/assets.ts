import { Project } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import JSZip from "jszip";
import sharp from "sharp";
import smartcrop from "smartcrop-sharp";

const zip = new JSZip();

const WIDTH = 512;
const HEIGHT = 512;

export const createZipFolder = async (urls: string[], project: Project) => {
  const requests = [];

  for (let i = 0; i < urls.length; i++) {
    requests.push(axios(urls[i], { responseType: "arraybuffer" }));
  }

  const responses = await Promise.all<AxiosResponse<Buffer>>(requests);
  const buffersPromises = responses.map((response) => {
    const buffer = response.data;
    return smartcrop
      .crop(buffer, { width: WIDTH, height: HEIGHT })
      .then(function (result) {
        const crop = result.topCrop;
        return sharp(buffer)
          .extract({
            width: crop.width,
            height: crop.height,
            left: crop.x,
            top: crop.y,
          })
          .resize(WIDTH, HEIGHT)
          .toBuffer();
      });
  });

  const buffers = await Promise.all(buffersPromises);
  const folder = zip.folder(project.name);

  buffers.forEach((buffer, i) => {
    const filename = urls[i].split("/").pop();
    folder!.file(filename!, buffer, { binary: true });
  });

  const zipContent = await zip.generateAsync({ type: "nodebuffer" });

  return zipContent;
};
