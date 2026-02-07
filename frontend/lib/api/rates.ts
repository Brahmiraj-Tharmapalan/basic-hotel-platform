"use server"

import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

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
        const res = await fetch(`${API_URL}/rates/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": ... // Auth is handled implicitly via cookies/middleware if set up, or we might need to pass token
            },
            body: JSON.stringify(rawData),
        })

        if (!res.ok) {
            const errorData = await res.json()
            // Simple validation error mapping, can be improved with Zod validation on client too
            if (res.status === 422) {
                return {
                    message: "Validation failed",
                    errors: errorData.detail.reduce((acc: any, err: any) => {
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
        const res = await fetch(`${API_URL}/rates/`, {
            cache: "no-store",
        })

        if (!res.ok) {
            console.error("Failed to fetch rate adjustments:", await res.text())
            return []
        }

        return await res.json()
    } catch (error) {
        console.error("Error fetching rate adjustments:", error)
        return []
    }
}
