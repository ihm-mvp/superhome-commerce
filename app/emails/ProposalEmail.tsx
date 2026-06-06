import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Hr,
  Section,
} from "@react-email/components"

type Props = {
  firstName: string
}

export default function ProposalEmail({
  firstName,
}: Props) {

  return (

    <Html>

      <Head />

      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
          margin: 0,
          padding: 0,
        }}
      >

        <Container
          style={{
            maxWidth: "520px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "8px",
          }}
        >

          <Text
            style={{
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            MoveInReady
          </Text>

          <Text
            style={{
              fontSize: "18px",
              marginTop: "20px",
            }}
          >
            Your Package Proposal Is Ready
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#555",
              lineHeight: "22px",
            }}
          >
            Hi {firstName},
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#555",
              lineHeight: "22px",
            }}
          >
            Thank you for exploring MoveInReady.
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#555",
              lineHeight: "22px",
            }}
          >
            Your requested furniture package proposal
            is attached to this email.
          </Text>

          <Section
            style={{
              marginTop: "20px",
            }}
          >

            <Text
              style={{
                fontSize: "14px",
                color: "#333",
              }}
            >
              Included in your proposal:
            </Text>

            <Text
              style={{
                fontSize: "14px",
                color: "#555",
              }}
            >
              • Furniture Package
              <br />
              • Sunshine Package
              <br />
              • Professional Styling
              <br />
              • Delivery & Installation
            </Text>

          </Section>

          <Text
            style={{
              fontSize: "14px",
              color: "#555",
              lineHeight: "22px",
              marginTop: "20px",
            }}
          >
            Everything required to prepare
            your home before move-in day.
          </Text>

          <Section
            style={{
              marginTop: "28px",
            }}
          >

            <Button
              href="https://moveinready.co.nz/packages"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              View More Packages
            </Button>

          </Section>

          <Hr
            style={{
              margin: "30px 0",
            }}
          />

          <Text
            style={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            MoveInReady
          </Text>

          <Text
            style={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            Operated by SuperMilkBaba (NZ) Limited
          </Text>

          <Text
            style={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            Christchurch, New Zealand
          </Text>

        </Container>

      </Body>

    </Html>

  )

}