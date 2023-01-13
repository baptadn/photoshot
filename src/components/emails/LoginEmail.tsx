import {
  Mjml,
  MjmlBody,
  MjmlButton,
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
} from "mjml-react";

export default function LoginEmail({ url }: { url: string }): JSX.Element {
  return (
    <Mjml>
      <MjmlBody width={500}>
        <MjmlWrapper>
          <MjmlSection>
            <MjmlColumn>
              <MjmlImage
                padding="12px 0 24px"
                width="70px"
                height="70px"
                align="center"
                src="https://photoshot.app/favicon.png"
              />
              <MjmlText fontWeight={800} fontSize={20} align="center">
                Your Photoshot Login Link
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
          <MjmlSection>
            <MjmlColumn>
              <MjmlText>
                Welcome to Photoshot! Please click the magic link below to sign
                in to your account.
              </MjmlText>
              <>
                <MjmlButton
                  href={url}
                  width="100%"
                  fontWeight={800}
                  fontSize={16}
                  align="left"
                  backgroundColor="#B5FFD9"
                  color="#415C4E"
                >
                  Sign In
                </MjmlButton>
              </>
              <MjmlText>
                {`If you're on a mobile device, you can also copy the link below
                and paste it into the browser of your choice.`}
              </MjmlText>
              <MjmlText>
                <a
                  rel="nofollow"
                  style={{
                    textDecoration: "none",
                    color: `#847F7D !important`,
                  }}
                >
                  {url.replace(/^https?:\/\//, "")}
                </a>
              </MjmlText>
              <MjmlText>
                If you did not request this email, you can safely ignore it.
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
        </MjmlWrapper>
      </MjmlBody>
    </Mjml>
  );
}
