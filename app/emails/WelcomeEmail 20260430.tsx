import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Hr,
} from "@react-email/components"

export default function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", background: "#f6f6f6" }}>
        <Container
          style={{
            background: "#ffffff",
            margin: "40px auto",
            padding: "30px",
            borderRadius: "8px",
            maxWidth: "480px",
          }}
        >
          {/* Title */}
          <Text style={{ fontSize: "20px", fontWeight: "600" }}>
            Welcome to MoveInReady
          </Text>

          {/* Intro */}
          <Text style={{ fontSize: "14px", color: "#555" }}>
            Thanks for joining.
          </Text>

          <Text style={{ fontSize: "14px", color: "#555" }}>
            We help you set up your home before you arrive — with real layouts
            and complete furniture packages.
          </Text>

          {/* CTA */}
          <div style={{ margin: "20px 0" }}>
            <Button
              href="https://moveinready.co.nz/packages"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              View Packages
            </Button>
          </div>

          <Hr />

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