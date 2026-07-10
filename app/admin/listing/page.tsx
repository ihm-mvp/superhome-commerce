"use client"

import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"

type Team = {

  id: string

  team_name: string

  team_slug: string

  listing_index_url: string | null

}

export default function ListingAdminPage() {

  const [

    teams,

    setTeams,

  ] = useState<Team[]>([])

  const [

    teamId,

    setTeamId,

  ] = useState("")

  const [

    loading,

    setLoading,

  ] = useState(false)

  useEffect(() => {

    loadTeams()

  }, [])

  async function loadTeams() {

    const {

      data,

      error,

    } = await supabase

      .from(

        "team_accounts"

      )

      .select(

        "id, team_name, team_slug, listing_index_url"

      )

      .eq(

        "status",

        "Active"

      )

      .order(

        "team_name"

      )

    if (

      error

    ) {

      alert(

        error.message

      )

      return

    }

    setTeams(

      data || []

    )

    if (

      data &&

      data.length > 0

    ) {

      setTeamId(

        data[0].id

      )

    }

  }

  async function runSync() {

    if (

      !teamId

    ) {

      alert(

        "Please select a Team."

      )

      return

    }

    setLoading(

      true

    )

    try {

      const res =

        await fetch(

          "/api/listing/scan",

          {

            method:

              "POST",

            headers: {

              "Content-Type":

                "application/json",

            },

            body:

              JSON.stringify({

                teamId,

              }),

          }

        )

      const json =

        await res.json()

      alert(

        json.message ||

        json.error ||

        "Finished."

      )

    }

    finally {

      setLoading(

        false

      )

    }

  }

  return (

    <main className="mx-auto max-w-xl px-6 py-10">

      <h1 className="text-3xl font-semibold">

        Listing Sync

      </h1>

      <p className="mt-2 text-gray-500">

        Scan Agent and sync Listings.

      </p >

      <div className="mt-8">

        <label className="mb-2 block font-medium">

          Agent Team

        </label>

        <select

          value={teamId}

          onChange={

            e =>

              setTeamId(

                e.target.value

              )

          }

          className="w-full rounded-lg border px-4 py-3"

        >

          {teams.map(

            team => (

              <option

                key={team.id}

                value={team.id}

              >

                {team.team_name}

              </option>

            )

          )}

        </select>

      </div>

      <button

        onClick={

          runSync

        }

        disabled={

          loading

        }

        className="mt-8 w-full rounded-xl bg-black py-4 font-semibold text-white disabled:opacity-50"

      >

        {

          loading

            ? "Running..."

            : "Run Sync"

        }

      </button>

    </main>

  )

}