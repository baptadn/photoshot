# Photoshot

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/photoshot_ai.svg?style=social&label=Follow%20%40photoshot_ai)](https://twitter.com/photoshot_ai)

An open-source AI avatar generator web app

[![Photoshot](https://photoshot.app/og-cover.jpg)
](https://user-images.githubusercontent.com/1102595/206658000-d349ef06-e4f2-4626-9deb-6c8a246f7553.mp4)

Try it out at [photoshot.app](https://photoshot.app)

## Stack

- ▲ [Next.js](https://nextjs.org/) for webapp
- 🖼 [Chakra UI](https://chakra-ui.com/) for UI components
- 📦 [Prisma](https://www.prisma.io/) for database
- 🧠 [Replicate](https://replicate.com/), a platform for running machine learning models in the cloud
- 💰 [Stripe](https://stripe.com/) for payments
- 👩‍🎨 [Stable Diffusion](https://replicate.com/stability-ai/stable-diffusion) an open-source text-to-image generation model

## Getting Started

Install dependencies:

```bash
yarn install
```

You can use Docker to run a local postgres database and maildev server (accessible at http://localhost:1080):

```bash
docker-compose up -d
```

Create .env.local:

```bash
cp .env.example .env.local
```

Update environment variable values:

| Environment Variable                 | Explanation                                                                                                                                                                     |
|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DATABASE_URL                         | The connection string for your PostgreSQL database. It will be `postgresql://photoshot:photoshot@localhost:5432/photoshot` if you are using the provided docket setup.          |
| NEXTAUTH_URL                         | The URL of your Next.js application, used for authentication purposes with NextAuth.js.                                                                                         |
| S3_UPLOAD_KEY                        | The access key for your AWS S3 bucket used for storing pictures.                                                                                                                |
| S3_UPLOAD_SECRET                     | The secret key for your AWS S3 bucket used for storing pictures.                                                                                                                |
| S3_UPLOAD_BUCKET                     | The name of your AWS S3 bucket used for storing pictures.                                                                                                                       |
| S3_UPLOAD_REGION                     | The AWS region where your S3 bucket is located.                                                                                                                                 |
| REPLICATE_API_TOKEN                  | The [API token](https://replicate.com/account) for Replicate.                                                                                                                   |
| REPLICATE_USERNAME                   | The username associated with your Replicate account.                                                                                                                            |
| REPLICATE_MAX_TRAIN_STEPS            | The maximum number of training steps for the Dreambooth AI model. Defaults to `3000`.                                                                                           |
| REPLICATE_NEGATIVE_PROMPT            | A prompt used for negative training examples in the Replicate AI model. Defualts to `cropped face, cover face, cover visage, mutated hands`                                     |
| REPLICATE_HD_VERSION_MODEL_ID        | The version of the model for upscaling the generated images. Such models can be browsed [here](https://replicate.com/collections/super-resolution)                              |
| NEXT_PUBLIC_REPLICATE_INSTANCE_TOKEN | A unique identifier for the training data. It can be any string. For best results use an identifier containing three Unicode characters, without spaces e.g. `cjw`              |
| SECRET                               | A random string used for NextAuth.js authentication.                                                                                                                            |
| EMAIL_FROM                           | The email address from which emails will be sent.                                                                                                                               |
| EMAIL_SERVER                         | The SMTP server URL used for sending emails. It will be `http://localhost:25` if you are using the provided docker setup,                                                       |
| STRIPE_SECRET_KEY                    | The API key for your Stripe account.                                                                                                                                            |
| NEXT_PUBLIC_STRIPE_STUDIO_PRICE      | The price of a studio in cents (e.g., 1000 = $10).                                                                                                                              |
| NEXT_PUBLIC_STUDIO_SHOT_AMOUNT       | The maximum number of shots allowed per studio.                                                                                                                                 |
| OPENAI_API_KEY                       | The API key for the OpenAI API, used for the prompt wizard feature.                                                                                                             |
| OPENAI_API_SEED_PROMPT               | A seed prompt used for generating style prompts using the OpenAI API.                                                                                                           |


Please note that if you want to use the provided `docker-compose` setup you have to disable `TLS` in your `.env.local` by adding:

```
NODE_TLS_REJECT_UNAUTHORIZED = "0"
```

Run migrations

```bash
yarn prisma:migrate:dev
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
