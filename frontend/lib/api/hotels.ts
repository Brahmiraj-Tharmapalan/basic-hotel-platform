"use server"

import { revalidatePath } from "next/cache"
import { Hotel } from "@/components/hotels/schema"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export async function getHotels(): Promise<Hotel[]> {
    try {
        const res = await fetch(`${API_URL}/hotels`, {
            cache: "no-store", // Ensure fresh data
        })

        if (!res.ok) {
            console.error("Failed to fetch hotels:", await res.text())
            // Return empty array or throw, depending on UI strategy. 
            // For now, returning empty allows page to render with "No hotels"
            return []
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching hotels:", error)
        return []
    }
}

export async function getHotel(id: string): Promise<Hotel | null> {
    try {
        const res = await fetch(`${API_URL}/hotels/${id}`, {
            cache: "no-store",
        })

        if (res.status === 404) {
            return null
        }

        if (!res.ok) {
            console.error(`Failed to fetch hotel ${id}:`, await res.text())
            return null
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error(`Error fetching hotel ${id}:`, error)
        return null
    }
}

export type CreateRoomTypeState = {
    errors?: {
        name?: string[]
        description?: string[]
        price?: string[]
        capacity?: string[]
        amenities?: string[]
        _form?: string[]
    }
    message?: string
} | null

export async function createRoomType(
    hotelId: string,
    prevState: CreateRoomTypeState,
    formData: FormData
): Promise<CreateRoomTypeState> {

    // Extract data
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        capacity: Number(formData.get("capacity")),
        amenities: [], // Handle amenities parsing if needed, assumed empty for now or parsed from string
    }

    try {
        const res = await fetch(`${API_URL}/hotels/${hotelId}/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rawData),
        })

        if (!res.ok) {
            const errorData = await res.json()
            return {
                message: errorData.detail || "Failed to create room type",
            }
        }

        revalidatePath(`/hotels/${hotelId}`)
        return { message: "Room type created successfully" }

    } catch (error) {
        console.error("Error creating room type:", error)
        return {
            message: "Failed to connect to server"
        }
    }
}
