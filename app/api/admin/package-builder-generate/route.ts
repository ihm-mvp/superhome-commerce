import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  try {

    const {
      layout,
      packages,
      rooms,
    } = await req.json()

    // =====================
    // Layout
    // =====================

    const {
      data: layoutRow,
      error: layoutError,
    } = await supabase
      .from("layouts")
      .insert([
        {
          name:
            layout.name,

          slug:
            layout.slug,

          location:
            layout.location,

          bedrooms:
            layout.bedrooms,

          bathrooms:
            layout.bathrooms,

          garage:
            layout.garage,

          floor_size:
            layout.floor_size,

          land_size:
            layout.land_size,

          description:
            layout.description,

          hero_exterior_image:
            layout.hero_exterior_image,

          elevation_image:
            layout.elevation_image,

          floorplan_image:
            layout.floorplan_image,

          video_url:
            layout.video_url,
        },
      ])
      .select()
      .single()

    if (
      layoutError ||
      !layoutRow
    ) {

      return Response.json(
        {
          error:
            layoutError?.message ||
            "Layout insert failed",
        },
        {
          status: 500,
        }
      )

    }

    // =====================
    // Packages
    // =====================

    for (const pkg of packages) {

      const packageSlug =
        `${layout.slug}-${pkg.name}`
          .toLowerCase()
          .replaceAll(
            " ",
            "-"
          )

      const {
        data: packageRow,
        error: packageError,
      } = await supabase
        .from("packages")
        .insert([
          {
            layout_id:
              layoutRow.id,

            name:
              pkg.name,

            slug:
              packageSlug,

            sort_order:
              pkg.sort_order,
          },
        ])
        .select()
        .single()

      if (
        packageError ||
        !packageRow
      ) {

        return Response.json(
          {
            error:
              packageError?.message ||
              "Package insert failed",
          },
          {
            status: 500,
          }
        )

      }

      // =====================
      // Rooms
      // =====================

      const roomRows =
        rooms.map(
          (
            room: any
          ) => ({
            package_id:
              packageRow.id,

            space_type_id:
              room.space_type_id,

            name:
              room.name,

            sort_order:
              room.sort_order,
          })
        )

      const {
        error: roomError,
      } = await supabase
        .from(
          "package_rooms"
        )
        .insert(
          roomRows
        )

      if (
        roomError
      ) {

        return Response.json(
          {
            error:
              roomError.message,
          },
          {
            status: 500,
          }
        )

      }

    }

    return Response.json({
      success: true,
      layout_id:
        layoutRow.id,
    })

  } catch (err: any) {

    return Response.json(
      {
        error:
          err.message,
      },
      {
        status: 500,
      }
    )

  }

}