import axios from "axios";
import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const replicateClient = axios.create({
  baseURL: "https://dreambooth-api-experimental.replicate.com",
  headers: {
    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "*",
  },
});

export default replicateClient;
