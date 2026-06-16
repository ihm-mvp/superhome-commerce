"use client"

import {
  useEffect,
  useState,
} from "react"

type SpaceType = {
  id: string
  name: string
  display_name: string
}

type PackageRow = {
  name: string
  sort_order: number
}

type RoomRow = {
  name: string
  space_type_id: string
  sort_order: number
}

export default function PackageBuilder() {

  const [
    spaceTypes,
    setSpaceTypes,
  ] = useState<SpaceType[]>([])

  // ===== Layout =====

  const [
    layoutName,
    setLayoutName,
  ] = useState("")

  const [
    slug,
    setSlug,
  ] = useState("")

  const [
    location,
    setLocation,
  ] = useState("")

  const [
    bedrooms,
    setBedrooms,
  ] = useState(2)

  const [
    bathrooms,
    setBathrooms,
  ] = useState(1)

  const [
    garage,
    setGarage,
  ] = useState(1)

  const [
    floorSize,
    setFloorSize,
  ] = useState("")

  const [
    landSize,
    setLandSize,
  ] = useState("")

  const [
    description,
    setDescription,
  ] = useState("")

  const [
    heroExteriorImage,
    setHeroExteriorImage,
  ] = useState("")

  const [
    elevationImage,
    setElevationImage,
  ] = useState("")

  const [
    floorplanImage,
    setFloorplanImage,
  ] = useState("")

  const [
    videoUrl,
    setVideoUrl,
  ] = useState("")

  // ===== Packages =====

  const [
    packages,
    setPackages,
  ] = useState<PackageRow[]>([
    {
      name: "Basic",
      sort_order: 1,
    },
    {
      name: "Standard",
      sort_order: 2,
    },
    {
      name: "Premium",
      sort_order: 3,
    },
  ])

  // ===== Rooms =====

  const [
    rooms,
    setRooms,
  ] = useState<RoomRow[]>([])

  // ===== Load Space Types =====

  useEffect(() => {

    async function loadSpaceTypes() {

      const res =
        await fetch(
          "/api/admin/package-builder-space-types"
        )

      const data =
        await res.json()

      setSpaceTypes(
        data || []
      )

    }

    loadSpaceTypes()

  }, [])

  // ===== Initialize Default Rooms =====

  useEffect(() => {

    if (
      !spaceTypes.length
    ) return

    const living =
      spaceTypes.find(
        (s) =>
          s.name
            ?.toLowerCase()
            .includes("living")
      )

    const dining =
      spaceTypes.find(
        (s) =>
          s.name
            ?.toLowerCase()
            .includes("dining")
      )

    const bedroom =
      spaceTypes.find(
        (s) =>
          s.name
            ?.toLowerCase()
            .includes("bedroom")
      )

    setRooms([
      {
        name: "Living",
        space_type_id:
          living?.id || "",
        sort_order: 1,
      },
      {
        name: "Dining",
        space_type_id:
          dining?.id || "",
        sort_order: 2,
      },
      {
        name: "Bedroom 1",
        space_type_id:
          bedroom?.id || "",
        sort_order: 3,
      },
      {
        name: "Bedroom 2",
        space_type_id:
          bedroom?.id || "",
        sort_order: 4,
      },
    ])

  }, [spaceTypes])

  function addRoom() {

    setRooms([
      ...rooms,
      {
        name: "",
        space_type_id: "",
        sort_order:
          rooms.length + 1,
      },
    ])

  }

  function updateRoom(
    index: number,
    field: keyof RoomRow,
    value: any
  ) {

    const copy =
      [...rooms]

    copy[index] = {
      ...copy[index],
      [field]: value,
    }

    setRooms(copy)

  }

  function removeRoom(
    index: number
  ) {

    const copy =
      rooms.filter(
        (_, i) =>
          i !== index
      )

    setRooms(copy)

  }

  function updatePackage(
    index: number,
    field: keyof PackageRow,
    value: any
  ) {

    const copy =
      [...packages]

    copy[index] = {
      ...copy[index],
      [field]: value,
    }

    setPackages(copy)

  }
  async function generate() {

    if (
      !layoutName ||
      !slug
    ) {

      alert(
        "Layout Name and Slug are required."
      )

      return

    }

    const res =
      await fetch(
        "/api/admin/package-builder-generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              layout: {
                name:
                  layoutName,

                slug,

                location,

                bedrooms,

                bathrooms,

                garage,

                floor_size:
                  floorSize,

                land_size:
                  landSize,

                description,

                hero_exterior_image:
                  heroExteriorImage,

                elevation_image:
                  elevationImage,

                floorplan_image:
                  floorplanImage,

                video_url:
                  videoUrl,
              },

              packages,

              rooms,
            }),
        }
      )

    const json =
      await res.json()

    if (
      !res.ok
    ) {

      alert(
        json.error ||
        "Failed"
      )

      return

    }

    alert(
      "Package structure generated."
    )

  }

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        p-8
        space-y-8
      "
    >

      <h1
        className="
          text-3xl
          font-semibold
        "
      >
        Package Builder
      </h1>

      {/* ===== Layout ===== */}

      <div
        className="
          border
          rounded-2xl
          p-6
          space-y-5
        "
      >

        <h2
          className="
            text-xl
            font-semibold
          "
        >
          Layout Information
        </h2>

        <div
          className="
            grid
            md:grid-cols-2
            gap-4
          "
        >

          <input
            placeholder="Layout Name"
            value={layoutName}
            onChange={(e) =>
              setLayoutName(
                e.target.value
              )
            }
            className="border p-2"
          />

          <input
            placeholder="Slug"
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
              )
            }
            className="border p-2"
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            className="border p-2"
          />

          <input
            placeholder="Floor Size"
            value={floorSize}
            onChange={(e) =>
              setFloorSize(
                e.target.value
              )
            }
            className="border p-2"
          />

          <input
            placeholder="Land Size"
            value={landSize}
            onChange={(e) =>
              setLandSize(
                e.target.value
              )
            }
            className="border p-2"
          />

          <input
            placeholder="Hero Exterior Image"
            value={
              heroExteriorImage
            }
            onChange={(e) =>
              setHeroExteriorImage(
                e.target.value
              )
            }
            className="border p-2"
          />

          <input
            placeholder="Elevation Image"
            value={
              elevationImage
            }
            onChange={(e) =>
              setElevationImage(
                e.target.value
              )
            }
            className="border p-2"
          />

          <input
            placeholder="Floorplan Image"
            value={
              floorplanImage
            }
            onChange={(e) =>
              setFloorplanImage(
                e.target.value
              )
            }
            className="border p-2"
          />

          <input
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(
                e.target.value
              )
            }
            className="border p-2"
          />

        </div>

        <div
          className="
            grid
            grid-cols-3
            gap-4
          "
        >

          <input
            type="number"
            placeholder="Bedrooms"
            value={bedrooms}
            onChange={(e) =>
              setBedrooms(
                Number(
                  e.target.value
                )
              )
            }
            className="border p-2"
          />

          <input
            type="number"
            placeholder="Bathrooms"
            value={bathrooms}
            onChange={(e) =>
              setBathrooms(
                Number(
                  e.target.value
                )
              )
            }
            className="border p-2"
          />

          <input
            type="number"
            placeholder="Garage"
            value={garage}
            onChange={(e) =>
              setGarage(
                Number(
                  e.target.value
                )
              )
            }
            className="border p-2"
          />

        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          rows={4}
          className="
            border
            p-2
            w-full
          "
        />

      </div>

      {/* ===== Packages ===== */}

      <div
        className="
          border
          rounded-2xl
          p-6
          space-y-4
        "
      >

        <h2
          className="
            text-xl
            font-semibold
          "
        >
          Packages
        </h2>

        {packages.map(
          (pkg, index) => (

            <div
              key={index}
              className="
                grid
                grid-cols-2
                gap-4
              "
            >

              <input
                value={pkg.name}
                onChange={(e) =>
                  updatePackage(
                    index,
                    "name",
                    e.target.value
                  )
                }
                className="border p-2"
              />

              <input
                type="number"
                value={
                  pkg.sort_order
                }
                onChange={(e) =>
                  updatePackage(
                    index,
                    "sort_order",
                    Number(
                      e.target.value
                    )
                  )
                }
                className="border p-2"
              />

            </div>

          )
        )}

      </div>

      {/* ===== Rooms ===== */}

      <div
        className="
          border
          rounded-2xl
          p-6
          space-y-4
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
          "
        >

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Rooms
          </h2>

          <button
            onClick={addRoom}
            className="
              px-4
              py-2
              border
              rounded-lg
            "
          >
            Add Room
          </button>

        </div>

        {rooms.map(
          (room, index) => (

            <div
              key={index}
              className="
                grid
                md:grid-cols-4
                gap-4
              "
            >

              <input
                value={room.name}
                onChange={(e) =>
                  updateRoom(
                    index,
                    "name",
                    e.target.value
                  )
                }
                placeholder="Room Name"
                className="border p-2"
              />

              <select
                value={
                  room.space_type_id
                }
                onChange={(e) =>
                  updateRoom(
                    index,
                    "space_type_id",
                    e.target.value
                  )
                }
                className="border p-2"
              >

                <option value="">
                  Select Space Type
                </option>

                {spaceTypes.map(
                  (s) => (

                    <option
                      key={s.id}
                      value={s.id}
                    >
                      {s.display_name}
                    </option>

                  )
                )}

              </select>

              <input
                type="number"
                value={
                  room.sort_order
                }
                onChange={(e) =>
                  updateRoom(
                    index,
                    "sort_order",
                    Number(
                      e.target.value
                    )
                  )
                }
                className="border p-2"
              />

              <button
                onClick={() =>
                  removeRoom(
                    index
                  )
                }
                className="
                  border
                  text-red-600
                "
              >
                Remove
              </button>

            </div>

          )
        )}

      </div>

      <button
        onClick={generate}
        className="
          w-full
          bg-black
          text-white
          py-4
          rounded-xl
        "
      >
        Generate Package Structure
      </button>

    </div>

  )

}