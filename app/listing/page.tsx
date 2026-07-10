"use client"

import {
  useEffect,
  useState,
} from "react"

import { supabase } from "@/lib/supabase"

export default function ListingPage() {

  const [
    url,
    setUrl,
  ] = useState("")

  const [
  teamId,
  setTeamId,
] = useState("")

const [
  teams,
  setTeams,
] = useState<any[]>([])

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    result,
    setResult,
  ] = useState<any>(null)

  useEffect(() => {

  loadTeams()

}, [])

async function loadTeams() {

  const {

    data,

  } = await supabase

    .from("team_accounts")

    .select(

      "id, team_name"

    )

    .eq(

      "status",

      "Active"

    )

    .order(

      "team_name"

    )

  setTeams(

    data || []

  )

  if (

    data?.length

  ) {

    setTeamId(

      data[0].id

    )

  }

}

  async function importListing() {

    if (!url) {

      alert(
        "Please enter Listing URL."
      )

      return

    }

    setLoading(true)

    setResult(null)

    const res =
      await fetch(
        "/api/listing/import",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

body:

JSON.stringify({

  url,

  teamId,

}),

        }
      )

    const json =
      await res.json()

    setLoading(false)

    setResult(json)

  }

  return (

    <div
      className="
        max-w-3xl
        mx-auto
        px-6
        py-10
        space-y-6
      "
    >

      <h1
        className="
          text-3xl
          font-semibold
        "
      >
        Listing Import
      </h1>

      <div
        className="
          text-gray-500
        "
      >
        Import a property listing from a supported website to MIR.
      </div>

      <select

  value={teamId}

  onChange={(e) =>

    setTeamId(

      e.target.value

    )

  }

  className="
    w-full
    border
    rounded-lg
    px-4
    py-3
  "

>

  {teams.map(

    (team) => (

      <option

        key={team.id}

        value={team.id}

      >

        {team.team_name}

      </option>

    )

  )}

</select>

      <input
        type="text"
        value={url}
        onChange={(e) =>
          setUrl(
            e.target.value
          )
        }
        placeholder="Paste a listing URL..."
        className="
          w-full
          border
          rounded-lg
          px-4
          py-3
        "
      />

      <button
        onClick={
          importListing
        }
        disabled={
          loading
        }
        className="
          bg-black
          text-white
          px-6
          py-3
          rounded-lg
          disabled:opacity-50
        "
      >

        {loading

          ? "Importing..."

          : "Import Listing"}

      </button>

      {result && (

        <div
          className="
            border
            rounded-xl
            p-5
            bg-gray-50
          "
        >

          {result.success ? (

            <div
              className="
                text-green-700
              "
            >

              Import Success

              <div
                className="
                  mt-2
                  text-sm
                  text-gray-600
                "
              >

                Listing ID:

                {" "}

                {result.id}

              </div>

            </div>

          ) : (

            <div
              className="
                text-red-600
              "
            >

              {result.error}

            </div>

          )}

        </div>

      )}

    </div>

  )

}