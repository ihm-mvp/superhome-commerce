export function validatePropertyType(
  title: string
) {

  const allowedPropertyTypes = [

    "House",

    "Townhouse",

    "Unit",

    "Apartment",

  ]

  const property_type =

    allowedPropertyTypes.find(

      type =>

        title.includes(type)

    )

return {

  property_type,

  supported:

    !!property_type,

}

}