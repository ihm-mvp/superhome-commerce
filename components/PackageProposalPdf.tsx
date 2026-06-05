import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"

type ProductItem = {
  name: string
  quantity?: number
  config?: string
  dimensions?: string
}

type Room = {
  name: string
  items: ProductItem[]
}

type Props = {
  packageName: string
  displayPrice: string
  rooms: Room[]
}

const styles = StyleSheet.create({

  page: {
    padding: 40,
    fontSize: 11,
    lineHeight: 1.5,
  },

  header: {
    marginBottom: 20,
    borderBottom: "1 solid #dddddd",
    paddingBottom: 12,
  },

  brand: {
    fontSize: 10,
    color: "#888888",
    textTransform: "uppercase",
  },

  title: {
    fontSize: 24,
    marginTop: 8,
    marginBottom: 8,
  },

  value: {
    fontSize: 16,
    marginBottom: 12,
  },

  intro: {
    marginBottom: 20,
    color: "#555555",
  },

  section: {
    marginTop: 18,
  },

  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1 solid #eeeeee",
  },

  itemBlock: {
    marginBottom: 10,
  },

  itemName: {
    fontSize: 11,
  },

  itemMeta: {
    fontSize: 9,
    color: "#666666",
    marginTop: 2,
  },

  footer: {
    marginTop: 30,
    paddingTop: 12,
    borderTop: "1 solid #dddddd",
    fontSize: 10,
    color: "#666666",
  },

})

export default function PackageProposalPdf({
  packageName,
  displayPrice,
  rooms,
}: Props) {

  return (

    <Document>

      <Page
        size="A4"
        style={styles.page}
      >

        {/* Header */}

        <View style={styles.header}>

          <Text style={styles.brand}>
            MoveInReady
          </Text>

          <Text style={styles.title}>
            {packageName}
          </Text>

          <Text style={styles.value}>
            Included Value: {displayPrice}
          </Text>

        </View>

        {/* Intro */}

        <Text style={styles.intro}>

          A complete move-in-ready solution
          professionally selected for modern
          townhouse living.

          Furniture, sunshine package,
          styling, delivery and installation
          are coordinated as one package.

        </Text>

        {/* Rooms */}

        {rooms.map((room, roomIndex) => (

          <View
            key={roomIndex}
            style={styles.section}
          >

            <Text style={styles.sectionTitle}>
              {room.name}
            </Text>

            {room.items.map((item, itemIndex) => (

              <View
                key={itemIndex}
                style={styles.itemBlock}
              >

                <Text style={styles.itemName}>

                  {item.name}

                  {item.quantity
                    ? ` × ${item.quantity}`
                    : ""}

                </Text>

                {item.config && (

                  <Text style={styles.itemMeta}>
                    {item.config}
                  </Text>

                )}

                {item.dimensions && (

                  <Text style={styles.itemMeta}>
                    {item.dimensions}
                  </Text>

                )}

              </View>

            ))}

          </View>

        ))}

        {/* Footer */}

        <View style={styles.footer}>

          <Text>
            Furniture + Sunshine + Styling
          </Text>

          <Text>
            A complete move-in-ready solution
            for modern New Zealand homes.
          </Text>

        </View>

      </Page>

    </Document>

  )

}