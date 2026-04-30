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

export default function WelcomeEmail() {
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
          {/* Header */}
          <Text style={{ fontSize: "20px", fontWeight: "600" }}>
            MoveInReady
          </Text>

          <Text style={{ fontSize: "16px", marginTop: "20px" }}>
            Welcome — you're in.
          </Text>

          {/* Core message */}
          <Text style={{ fontSize: "14px", color: "#555", lineHeight: "22px" }}>
            You now have access to curated home layouts and complete furniture
            packages — designed to get your home ready before you arrive.
          </Text>

          {/* Value */}
          <Section style={{ marginTop: "20px" }}>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              What you can do next:
            </Text>

            <Text style={{ fontSize: "14px", color: "#555" }}>
              • Explore real New Zealand home layouts
              <br />
              • Match layouts with furniture packages
              <br />
              • Plan your move-in setup in advance
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ marginTop: "28px" }}>
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
              View Furniture Packages
            </Button>
          </Section>

          <Hr style={{ margin: "30px 0" }} />

          {/* Footer */}
          <Text style={{ fontSize: "12px", color: "#888" }}>
            MoveInReady
          </Text>

          <Text style={{ fontSize: "12px", color: "#888" }}>
            Operated by SuperMilkBaba (NZ) Limited
          </Text>

          <Text style={{ fontSize: "12px", color: "#888" }}>
            Christchurch, New Zealand
          </Text>
        </Container>
      </Body>
    </Html>
  )
}