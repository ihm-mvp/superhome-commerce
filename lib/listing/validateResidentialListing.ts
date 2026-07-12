export function validateResidentialListing(

  bedrooms: number | null,

  bathrooms: number | null,

) {

  const supported =

    bedrooms !== null &&

    bedrooms >= 1 &&

    bathrooms !== null &&

    bathrooms >= 1

  return {

    supported,

  }

}