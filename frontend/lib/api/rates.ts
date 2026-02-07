"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

async function getAuthHeaders() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value || ""
    return {
        "Content-Type": "application/json",
        "Cookie": `access_token=${token}`,
    }
}

export type RateAdjustment = {
    id: number
    room_type_id: number
    adjustment_amount: number
    effective_date: string
    reason?: string
}

export type CreateRateAdjustmentState = {
    errors?: {
        room_type_id?: string[]
        adjustment_amount?: string[]
        effective_date?: string[]
        reason?: string[]
        _form?: string[]
    }
    message?: string
} | null

export async function createRateAdjustment(
    prevState: CreateRateAdjustmentState,
    formData: FormData
): Promise<CreateRateAdjustmentState> {
    const rawData = {
        room_type_id: Number(formData.get("room_type_id")),
        adjustment_amount: Number(formData.get("adjustment_amount")),
        effective_date: formData.get("effective_date"),
        reason: formData.get("reason"),
    }

    try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${API_URL}/rates/`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(rawData),
        })

        if (!res.ok) {
            const errorData = await res.json()
            // Simple validation error mapping, can be improved with Zod validation on client too
            if (res.status === 422) {
                return {
                    message: "Validation failed",
                    errors: errorData.detail.reduce((acc: Record<string, string[]>, err: { loc: string[], msg: string }) => {
                        acc[err.loc[1]] = [err.msg]
                        return acc
                    }, {})
                }
            }
            return {
                message: errorData.detail || "Failed to create rate adjustment",
            }
        }

        revalidatePath("/rate-adjustment")
        return { message: "Rate adjustment created successfully" }

    } catch (error) {
        console.error("Error creating rate adjustment:", error)
        return {
            message: "Failed to connect to server"
        }
    }
}

export async function getRateAdjustments(): Promise<RateAdjustment[]> {
    try {
        const headers = await getAuthHeaders()
        console.log('🔍 Fetching rate adjustments from:', `${API_URL}/rates/`)
        const res = await fetch(`${API_URL}/rates/`, {
            cache: "no-store",
            headers: headers,
        })

        console.log('📡 Response status:', res.status)

        if (!res.ok) {
            const errorText = await res.text()
            console.error("❌ Failed to fetch rate adjustments:", errorText)
            return []
        }

        const data = await res.json()
        console.log('✅ Rate adjustments fetched:', data.length, 'items')
        return data
    } catch (error) {
        console.error("💥 Error fetching rate adjustments:", error)
        return []
    }
}
