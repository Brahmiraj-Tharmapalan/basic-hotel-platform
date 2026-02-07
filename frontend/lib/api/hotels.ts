"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { Hotel, RoomType } from "@/components/hotels/schema"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

async function getAuthHeaders() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value || ""
    return {
        "Content-Type": "application/json",
        "Cookie": `access_token=${token}`,
    }
}

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
        basePrice: Number(formData.get("price")), // Backend expects basePrice
        capacity: Number(formData.get("capacity")),
        amenities: formData.get("amenities") || "", // Backend expects string
    }

    try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${API_URL}/hotels/${hotelId}/rooms`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(rawData),
        })

        if (!res.ok) {
            const errorData = await res.json()
            // Backend might return structured error (array of objects) or a simple string
            let errorMessage = "Failed to create room type"
            if (typeof errorData.detail === "string") {
                errorMessage = errorData.detail
            } else if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map((err: { msg: string }) => err.msg).join(", ")
            } else if (errorData.message) {
                errorMessage = errorData.message
            }

            return {
                message: errorMessage,
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

export async function getRoomTypes(hotelId: string): Promise<RoomType[]> {
    try {
        const res = await fetch(`${API_URL}/hotels/${hotelId}/rooms`, {
            cache: "no-store",
        })

        if (!res.ok) {
            console.error(`Failed to fetch room types for hotel ${hotelId}:`, await res.text())
            // return [] // Or throw
            return []
        }

        return await res.json()
    } catch (error) {
        console.error(`Error fetching room types for hotel ${hotelId}:`, error)
        return []
    }
}

export type CreateHotelState = {
    errors?: {
        name?: string[]
        location?: string[]
        rating?: string[]
        imageUrl?: string[]
        _form?: string[]
    }
    message?: string
} | null

export async function createHotel(
    prevState: CreateHotelState,
    formData: FormData
): Promise<CreateHotelState> {
    const rawData = {
        name: formData.get("name"),
        location: formData.get("location"),
        rating: Number(formData.get("rating") || 0),
        imageUrl: formData.get("imageUrl"),
    }

    try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${API_URL}/hotels`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(rawData),
        })

        if (!res.ok) {
            const errorData = await res.json()
            let errorMessage = "Failed to create hotel"
            if (typeof errorData.detail === "string") {
                errorMessage = errorData.detail
            } else if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map((err: { msg: string }) => err.msg).join(", ")
            }

            return {
                message: errorMessage,
            }
        }

        revalidatePath("/hotels")
        return { message: "Hotel created successfully" }
    } catch (error) {
        console.error("Error creating hotel:", error)
        return {
            message: "Failed to connect to server",
        }
    }
}
// ... existing code ...

export type UpdateHotelState = CreateHotelState

export async function updateHotel(
    hotelId: string,
    prevState: UpdateHotelState,
    formData: FormData
): Promise<UpdateHotelState> {
    const rawData = {
        name: formData.get("name"),
        location: formData.get("location"),
        rating: Number(formData.get("rating") || 0),
        imageUrl: formData.get("imageUrl"),
    }

    try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${API_URL}/hotels/${hotelId}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(rawData),
        })

        if (!res.ok) {
            const errorData = await res.json()
            let errorMessage = "Failed to update hotel"
            if (typeof errorData.detail === "string") {
                errorMessage = errorData.detail
            } else if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map((err: { msg: string }) => err.msg).join(", ")
            }

            return {
                message: errorMessage,
            }
        }

        revalidatePath("/hotels")
        revalidatePath(`/hotels/${hotelId}`)
        return { message: "Hotel updated successfully" }
    } catch (error) {
        console.error("Error updating hotel:", error)
        return {
            message: "Failed to connect to server",
        }
    }
}

export async function deleteHotel(hotelId: string): Promise<{ message: string; error?: string }> {
    try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${API_URL}/hotels/${hotelId}`, {
            method: "DELETE",
            headers: headers,
        })

        if (!res.ok) {
            const errorData = await res.json()
            return {
                message: "Failed to delete hotel",
                error: errorData.detail
            }
        }

        revalidatePath("/hotels")
        return { message: "Hotel deleted successfully" }
    } catch (error) {
        console.error("Error deleting hotel:", error)
        return {
            message: "Failed to connect to server",
            error: "Network error"
        }
    }
}
