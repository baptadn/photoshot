import PageContainer from "@/components/layout/PageContainer";
import { Link, List, ListItem, Text, VStack } from "@chakra-ui/react";
import React from "react";

const Terms = () => {
  return (
    <PageContainer>
      <VStack
        marginX="auto"
        maxWidth="container.lg"
        p={10}
        spacing={4}
        backgroundColor="white"
        borderRadius="lg"
        width="100%"
        alignItems="flex-start"
      >
        <Text fontWeight="bold" fontSize="3xl">
          Frequently Asked Questions
        </Text>

        <Text fontWeight="bold" fontSize="xl">
          📸 What kind of photos should I upload to the platform?
        </Text>
        <Text>
          We recommend that you upload a variety of photos to ensure that your
          avatar is as accurate as possible. This may include close-up shots of
          your face, photos of your profile, and full-body shots. {`It's`}{" "}
          important to make sure that your photos are clear and of high quality,
          and that they do not include any other people or animals. We also
          recommend that you include a range of expressions, locations,
          backgrounds, and perspectives in your photos to create the most
          accurate avatar possible.
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          👩‍🎨 How similar will the avatar be to my appearance?
        </Text>
        <Text>
          The accuracy of your avatar will largely depend on the number and
          variety of the photos that you provide. The better and more diverse
          the photos are, the easier it will be for the AI to understand and
          replicate your facial and bodily characteristics. As a result, your
          avatar will be more likely to closely resemble your actual appearance!
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          💰 Is it possible to obtain a refund?
        </Text>
        <Text>
          It is possible to obtain a refund for purchases made within the first
          14 days, as long as you have not yet trained the AI. However, once the
          14-day period has passed or if you have already used the service (by
          clicking on the train button), you will no longer be eligible for a
          refund.
        </Text>
        <Text>
          Please ensure that you upload a sufficient number of high-quality
          photos to avoid disappointment with the generated avatars!
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          🖼 What will happen to my photos?
        </Text>
        <Text>
          You may delete all of the photos and datasets associated with the
          studio by deleting the studio from your account. Once the studio
          credits have been exhausted, the model will be automatically deleted
          within 24 hours.
        </Text>
        <Text>
          To request that your account and all associated data be deleted,
          please send an email to{" "}
          <Link href="mailto:support@photoshot">support@photoshot</Link>. Please
          note that by deleting your account, you will no longer have access to
          any of the data or content associated with your account.
        </Text>
        <Text>
          Please be aware that only the data on Photoshot servers will be 
          deleted. Data that was transmitted to Replicate will not be deleted.
          You would have to contact them in order to do so, according to their 
          <Link href="https://replicate.com/privacy">Terms of Service</Link>.
        </Text>
      </VStack>
    </PageContainer>
  );
};

export default Terms;
