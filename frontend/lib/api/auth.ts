"use server"

import { cookies } from "next/headers"
import { z } from "zod"

const loginSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
})

export type LoginResponse = z.infer<typeof loginSchema>

export async function login(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams()
    formData.append("username", email)
    formData.append("password", password)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/login/access-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed")
    }

    // Forward the HttpOnly cookie from backend to client
    const setCookieHeader = response.headers.get("set-cookie")
    if (setCookieHeader) {
        const cookieStore = await cookies()
        // Simple parsing to get the access_token value. 
        // Real-world might need a more robust parser if multiple cookies are sent.
        // formatting: access_token=...; HttpOnly; Path=/; ...
        const tokenMatch = setCookieHeader.match(/access_token=([^;]+)/)
        if (tokenMatch) {
            const token = tokenMatch[1]
            // We configure the cookie to match the backend's settings
            cookieStore.set({
                name: "access_token",
                value: token,
                httpOnly: true,
                path: "/",
                maxAge: 60 * 30, // 30 minutes, matching backend
                sameSite: "lax",
                // secure: process.env.NODE_ENV === "production" // Uncomment for production
            })
        }
    }

    const data = await response.json()
    return loginSchema.parse(data)
}
