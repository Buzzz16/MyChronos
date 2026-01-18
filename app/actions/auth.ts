"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "User already exists" }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    })

    return { success: true, userId: user.id }
  } catch (error) {
    return { error: "Failed to create user" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" }
    }
    return { error: "Something went wrong" }
  }
}

export async function updateUserLocation(
  userId: string,
  locationData: {
    latitude: number
    longitude: number
    city?: string
    region?: string
    country?: string
    timezone?: string
  }
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLatitude: locationData.latitude,
        lastLongitude: locationData.longitude,
        city: locationData.city,
        region: locationData.region,
        country: locationData.country,
        timezone: locationData.timezone || "UTC",
        lastLocationUpdate: new Date(),
      },
    })
    return { success: true }
  } catch (error) {
    return { error: "Failed to update location" }
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: {
    displayMode?: "DETAILED" | "BROAD"
    notificationsEnabled?: boolean
    timezone?: string
  }
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: preferences,
    })
    return { success: true }
  } catch (error) {
    return { error: "Failed to update preferences" }
  }
}
