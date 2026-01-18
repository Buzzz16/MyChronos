import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TimeProvider } from "@/contexts/TimeContext"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user data with location
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      city: true,
      region: true,
      country: true,
      timezone: true,
      lastLatitude: true,
      lastLongitude: true,
      displayMode: true,
      notificationsEnabled: true,
      lastLocationUpdate: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Fetch agendas and categories
  const agendas = await prisma.agenda.findMany({
    where: {
      userId: user.id,
      isArchived: false,
    },
    include: {
      category: true,
    },
    orderBy: [
      { isCompleted: "asc" },
      { targetDateTime: "asc" },
    ],
  })

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <TimeProvider timezone={user.timezone}>
      <DashboardClient user={user} agendas={agendas} categories={categories} />
    </TimeProvider>
  )
}
