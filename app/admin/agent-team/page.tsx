"use client"

import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"

type Team = {
  id: string
  team_name: string
  login_email: string
  login_token: string
  status: string
}

export default function TeamAdminPage() {

  const [teams, setTeams] =
    useState<Team[]>([])

  useEffect(() => {

    loadTeams()

  }, [])

  async function loadTeams() {

    const {
      data,
    } = await supabase
      .from("team_accounts")
      .select("*")
      .order(
        "team_name",
        {
          ascending: true,
        }
      )

    setTeams(
      data || []
    )

  }

  async function copyLink(
    token: string
  ) {

    const url =
      `${window.location.origin}/team/${token}`

    await navigator.clipboard.writeText(
      url
    )

    alert("Link copied.")

  }

  return (

    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-3xl px-5 py-8">

        <h1 className="text-3xl font-bold">

          Team Accounts

        </h1>

        <div className="mt-8 space-y-5">

          {teams.map(
            (team) => {

              const url =
                `${typeof window !== "undefined"
                  ? window.location.origin
                  : ""
                }/team/${team.login_token}`

              return (

                <div
                  key={team.id}
                  className="rounded-2xl border bg-white p-5"
                >

                  <div className="text-xl font-semibold">

                    {team.team_name}

                  </div>

                  <div className="mt-1 text-gray-500">

                    {team.login_email}

                  </div>

                  <div className="mt-1 text-sm">

                    Status：

                    <span className="font-medium">

                      {team.status}

                    </span>

                  </div>

                  <div className="mt-5">

                    <div className="mb-2 text-sm text-gray-500">

                      Login Link

                    </div>

                    <div className="rounded-xl border bg-gray-50 p-3 break-all text-sm">

                      {url}

                    </div>

                  </div>

                  <button

                    onClick={() =>
                      copyLink(
                        team.login_token
                      )
                    }

                    className="mt-5 w-full rounded-xl bg-black py-3 font-semibold text-white"

                  >

                    Copy Link

                  </button>

                </div>

              )

            }
          )}

        </div>

      </div>

    </main>

  )

}