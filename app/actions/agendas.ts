"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Priority } from "@prisma/client"

export async function createAgenda(userId: string, data: {
  title: string
  description?: string
  targetDateTime: Date
  categoryId?: string
  priority?: Priority
}) {
  try {
    // Check agenda limit (max 100 per user)
    const agendaCount = await prisma.agenda.count({
      where: {
        userId,
        isArchived: false,
      },
    })

    if (agendaCount >= 100) {
      return { error: "Maximum of 100 active agendas reached" }
    }

    const agenda = await prisma.agenda.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        targetDateTime: data.targetDateTime,
        categoryId: data.categoryId,
        priority: data.priority || "MEDIUM",
      },
      include: {
        category: true,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, agenda }
  } catch (error) {
    console.error("Create agenda error:", error)
    return { error: "Failed to create agenda" }
  }
}

export async function getAgendas(userId: string, options?: {
  includeArchived?: boolean
  includeCompleted?: boolean
}) {
  try {
    const agendas = await prisma.agenda.findMany({
      where: {
        userId,
        ...(options?.includeArchived ? {} : { isArchived: false }),
        ...(options?.includeCompleted ? {} : { isCompleted: false }),
      },
      include: {
        category: true,
      },
      orderBy: [
        { isCompleted: "asc" },
        { targetDateTime: "asc" },
      ],
    })

    return { success: true, agendas }
  } catch (error) {
    console.error("Get agendas error:", error)
    return { error: "Failed to fetch agendas" }
  }
}

export async function updateAgenda(
  agendaId: string,
  userId: string,
  data: {
    title?: string
    description?: string
    targetDateTime?: Date
    categoryId?: string
    priority?: Priority
    isCompleted?: boolean
    isArchived?: boolean
  }
) {
  try {
    // Verify ownership
    const existing = await prisma.agenda.findFirst({
      where: { id: agendaId, userId },
    })

    if (!existing) {
      return { error: "Agenda not found" }
    }

    const agenda = await prisma.agenda.update({
      where: { id: agendaId },
      data: {
        ...data,
        ...(data.isCompleted && !existing.completedAt
          ? { completedAt: new Date() }
          : {}),
      },
      include: {
        category: true,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, agenda }
  } catch (error) {
    console.error("Update agenda error:", error)
    return { error: "Failed to update agenda" }
  }
}

export async function deleteAgenda(agendaId: string, userId: string) {
  try {
    // Verify ownership
    const existing = await prisma.agenda.findFirst({
      where: { id: agendaId, userId },
    })

    if (!existing) {
      return { error: "Agenda not found" }
    }

    await prisma.agenda.delete({
      where: { id: agendaId },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Delete agenda error:", error)
    return { error: "Failed to delete agenda" }
  }
}

export async function toggleAgendaComplete(agendaId: string, userId: string) {
  try {
    const existing = await prisma.agenda.findFirst({
      where: { id: agendaId, userId },
    })

    if (!existing) {
      return { error: "Agenda not found" }
    }

    const agenda = await prisma.agenda.update({
      where: { id: agendaId },
      data: {
        isCompleted: !existing.isCompleted,
        completedAt: !existing.isCompleted ? new Date() : null,
      },
      include: {
        category: true,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, agenda }
  } catch (error) {
    console.error("Toggle complete error:", error)
    return { error: "Failed to toggle completion" }
  }
}
