// app/team/[token]/page.tsx

import { notFound } from "next/navigation"

import { supabase } from "@/lib/supabase"

type Props = {
  params: Promise<{
    token: string
  }>
}

export default async function TeamPage({
  params,
}: Props) {

  const { token } =
    await params

  const {
    data: team,
    error,
  } = await supabase
    .from("team_accounts")
    .select("*")
    .eq(
      "login_token",
      token
    )
    .eq(
      "status",
      "Active"
    )
    .single()

  if (
    error ||
    !team
  ) {

    notFound()

  }

  return (

    <main className="min-h-screen bg-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-gray-900">

            {team.team_name}

          </h1>

          <p className="mt-2 text-lg text-gray-700">

            Marketing Toolkit

          </p >

        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 p-6">

          <div className="text-sm text-gray-500">

            Team Login Email

          </div>

          <div className="mt-2 text-lg font-semibold text-gray-900">

            {team.login_email}

          </div>

        </div>

        <button
          className="mt-8 w-full rounded-xl bg-black py-3 font-semibold text-white"
        >

          Continue

        </button>

        <div className="mt-8 text-center text-sm leading-7 text-gray-500">

          首次登录后，
          <br />
          当前设备将保持登录状态。

          <br />
          <br />

          After your first sign in,
          <br />
          this device will stay signed in.

        </div>

      </div>

    </main>

  )

}