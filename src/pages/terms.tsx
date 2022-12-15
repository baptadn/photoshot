import PageContainer from "@/components/layout/PageContainer";
import { Link, List, ListItem, Text, VStack } from "@chakra-ui/react";
import React from "react";

const Terms = () => {
  return (
    <PageContainer>
      <VStack
        margin="auto"
        maxWidth="container.lg"
        p={10}
        spacing={4}
        backgroundColor="white"
        borderRadius="lg"
        width="100%"
        alignItems="flex-start"
      >
        <Text fontWeight="bold" fontSize="3xl">
          Photoshot Privacy Policy
        </Text>

        <Text>
          It is Photoshot&#39;s policy to respect your privacy and comply with
          any applicable law and regulation regarding any personal information
          we may collect about you, including across our website,{" "}
          <Link textDecoration="underline" href="https://photoshot.app/">
            https://photoshot.app/
          </Link>
          , and other sites we own and operate.{" "}
        </Text>
        <Text>
          This policy is effective as of 14 December 2022 and was last updated
          on 14 December 2022.{" "}
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          Photos upload
        </Text>
        <Text>
          To upload photos to this site, you must ensure that they are of
          yourself, that you own the rights to them, and that they are not naked
          or pornographic. We are not responsible for any harm that may result
          from uploading photos that do not meet these criteria.
        </Text>

        <Text fontWeight="bold" fontSize="xl">
          Information We Collect
        </Text>
        <Text>
          Information we collect includes both information you knowingly and
          actively provide us when using or participating in any of our services
          and promotions, and any information automatically sent by your devices
          in the course of accessing our products and services.{" "}
        </Text>
        <Text fontWeight="semibold" fontSize="md">
          Log Data
        </Text>
        <Text>
          When you visit our website, our servers may automatically log the
          standard data provided by your web browser. It may include your
          device’s Internet Protocol (IP) address, your browser type and
          version, the pages you visit, the time and date of your visit, the
          time spent on each page, other details about your visit, and technical
          details that occur in conjunction with any errors you may encounter.{" "}
        </Text>
        <Text>
          Please be aware that while this information may not be personally
          identifying by itself, it may be possible to combine it with other
          data to personally identify individual persons.{" "}
        </Text>
        <Text fontWeight="semibold" fontSize="md">
          Personal Information
        </Text>
        <Text>
          We may ask for personal information which may include one or more of
          the following:{" "}
        </Text>
        <List listStyleType="initial" pl={4}>
          <ListItem>Email</ListItem>
        </List>
        <Text fontWeight="semibold" fontSize="md">
          Legitimate Reasons for Processing Your Personal Information
        </Text>
        <Text>
          We only collect and use your personal information when we have a
          legitimate reason for doing so. In which instance, we only collect
          personal information that is reasonably necessary to provide our
          services to you.{" "}
        </Text>
        <Text fontWeight="semibold" fontSize="md">
          Collection and Use of Information
        </Text>
        <Text>
          By accessing and using photoshot, you are also using the Replicate
          service and thereby accepting the terms of use outlined at
          <Link ml={1} href="https://replicate.com/privacy">
            https://replicate.com/privacy
          </Link>
          . Please review these terms carefully before using the service. If you
          do not agree to these terms, please refrain from using the service.
        </Text>
        <Text>
          We may collect personal information from you when you do any of the
          following on our website:{" "}
        </Text>
        <List listStyleType="initial" pl={4}>
          <ListItem>
            Use a mobile device or web browser to access our content
          </ListItem>
          <ListItem>
            Contact us via email, social media, or on any similar technologies
          </ListItem>
          <ListItem>When you mention us on social media</ListItem>
        </List>
        <Text>
          We may collect, hold, use, and disclose information for the following
          purposes, and personal information will not be further processed in a
          manner that is incompatible with these purposes:{" "}
        </Text>
        <Text>
          We may collect, hold, use, and disclose information for the following
          purposes, and personal information will not be further processed in a
          manner that is incompatible with these purposes:{" "}
        </Text>
        <List listStyleType="initial" pl={4}>
          <ListItem>
            to enable you to access and use our website, associated
            applications, and associated social media platforms
          </ListItem>
        </List>
        <Text>
          Please be aware that we may combine information we collect about you
          with general information or research data we receive from other
          trusted sources.{" "}
        </Text>
        <Text fontWeight="semibold" fontSize="md">
          Security of Your Personal Information
        </Text>
        <Text>
          When we collect and process personal information, and while we retain
          this information, we will protect it within commercially acceptable
          means to prevent loss and theft, as well as unauthorized access,
          disclosure, copying, use, or modification.{" "}
        </Text>
        <Text>
          Although we will do our best to protect the personal information you
          provide to us, we advise that no method of electronic transmission or
          storage is 100% secure, and no one can guarantee absolute data
          security. We will comply with laws applicable to us in respect of any
          data breach.{" "}
        </Text>
        <Text>
          You are responsible for selecting any password and its overall
          security strength, ensuring the security of your own information
          within the bounds of our services.{" "}
        </Text>
        <Text fontWeight="semibold" fontSize="md">
          How Long We Keep Your Personal Information
        </Text>
        <Text>
          We keep your personal information only for as long as we need to. This
          time period may depend on what we are using your information for, in
          accordance with this privacy policy. If your personal information is
          no longer required, we will delete it or make it anonymous by removing
          all details that identify you.{" "}
        </Text>
        <Text>
          However, if necessary, we may retain your personal information for our
          compliance with a legal, accounting, or reporting obligation or for
          archiving purposes in the public interest, scientific, or historical
          research purposes or statistical purposes.{" "}
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

        <Text fontWeight="bold" fontSize="xl">
          Children’s Privacy
        </Text>
        <Text>
          We do not aim any of our products or services directly at children
          under the age of 13, and we do not knowingly collect personal
          information about children under 13.{" "}
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          Disclosure of Personal Information to Third Parties
        </Text>
        <Text>We may disclose personal information to: </Text>
        <List listStyleType="initial" pl={4}>
          <ListItem>a parent, subsidiary, or affiliate of our company</ListItem>
          <ListItem>
            third party service providers for the purpose of enabling them to
            provide their services, for example, IT service providers, data
            storage, hosting and server providers, advertisers, or analytics
            platforms
          </ListItem>
          <ListItem>
            our employees, contractors, and/or related entities
          </ListItem>
          <ListItem>
            our existing or potential agents or business partners
          </ListItem>
          <ListItem>
            sponsors or promoters of any competition, sweepstakes, or promotion
            we run
          </ListItem>
          <ListItem>
            courts, tribunals, regulatory authorities, and law enforcement
            officers, as required by law, in connection with any actual or
            prospective legal proceedings, or in order to establish, exercise,
            or defend our legal rights
          </ListItem>
          <ListItem>
            third parties, including agents or sub-contractors, who assist us in
            providing information, products, services, or direct marketing to
            you third parties to collect and process data
          </ListItem>
        </List>
        <Text fontWeight="bold" fontSize="xl">
          International Transfers of Personal Information
        </Text>
        <Text>
          The personal information we collect is stored and/or processed where
          we or our partners, affiliates, and third-party providers maintain
          facilities. Please be aware that the locations to which we store,
          process, or transfer your personal information may not have the same
          data protection laws as the country in which you initially provided
          the information. If we transfer your personal information to third
          parties in other countries: (i) we will perform those transfers in
          accordance with the requirements of applicable law; and (ii) we will
          protect the transferred personal information in accordance with this
          privacy policy.{" "}
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          Your Rights and Controlling Your Personal Information
        </Text>
        <Text>
          You always retain the right to withhold personal information from us,
          with the understanding that your experience of our website may be
          affected. We will not discriminate against you for exercising any of
          your rights over your personal information. If you do provide us with
          personal information you understand that we will collect, hold, use
          and disclose it in accordance with this privacy policy. You retain the
          right to request details of any personal information we hold about
          you.{" "}
        </Text>
        <Text>
          If we receive personal information about you from a third party, we
          will protect it as set out in this privacy policy. If you are a third
          party providing personal information about somebody else, you
          represent and warrant that you have such person’s consent to provide
          the personal information to us.{" "}
        </Text>
        <Text>
          If you have previously agreed to us using your personal information
          for direct marketing purposes, you may change your mind at any time.
          We will provide you with the ability to unsubscribe from our
          email-database or opt out of communications. Please be aware we may
          need to request specific information from you to help us confirm your
          identity.{" "}
        </Text>
        <Text>
          If you believe that any information we hold about you is inaccurate,
          out of date, incomplete, irrelevant, or misleading, please contact us
          using the details provided in this privacy policy. We will take
          reasonable steps to correct any information found to be inaccurate,
          incomplete, misleading, or out of date.{" "}
        </Text>
        <Text>
          If you believe that we have breached a relevant data protection law
          and wish to make a complaint, please contact us using the details
          below and provide us with full details of the alleged breach. We will
          promptly investigate your complaint and respond to you, in writing,
          setting out the outcome of our investigation and the steps we will
          take to deal with your complaint. You also have the right to contact a
          regulatory body or data protection authority in relation to your
          complaint.{" "}
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          Use of Cookies
        </Text>
        <Text>
          We use &ldquo;cookies&rdquo; to collect information about you and your
          activity across our site. A cookie is a small piece of data that our
          website stores on your computer, and accesses each time you visit, so
          we can understand how you use our site. This helps us serve you
          content based on preferences you have specified.{" "}
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          Limits of Our Policy
        </Text>
        <Text>
          Our website may link to external sites that are not operated by us.
          Please be aware that we have no control over the content and policies
          of those sites, and cannot accept responsibility or liability for
          their respective privacy practices.{" "}
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          Changes to This Policy
        </Text>
        <Text>
          At our discretion, we may change our privacy policy to reflect updates
          to our business processes, current acceptable practices, or
          legislative or regulatory changes. If we decide to change this privacy
          policy, we will post the changes here at the same link by which you
          are accessing this privacy policy.{" "}
        </Text>
        <Text>
          If required by law, we will get your permission or give you the
          opportunity to opt in to or opt out of, as applicable, any new uses of
          your personal information.{" "}
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          Contact Us
        </Text>
        <Text>
          For any questions or concerns regarding your privacy, you may contact
          us using the following details:{" "}
          <Link href="mailto:support@photoshot.app">support@photoshot.app</Link>
        </Text>
      </VStack>
    </PageContainer>
  );
};

export default Terms;
