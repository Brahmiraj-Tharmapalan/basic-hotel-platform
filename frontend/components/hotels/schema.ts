import { z } from "zod"


export const roomTypeSchema = z.object({
    id: z.number().optional(), // Optional for creation, present in read
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    price: z.coerce.number().min(0, {
        message: "Price must be a positive number.",
    }),
    capacity: z.coerce.number().min(1, {
        message: "Capacity must be at least 1 person.",
    }),
    amenities: z.array(z.string()).default([]).optional(),
})

export type RoomType = z.infer<typeof roomTypeSchema>

export const hotelSchema = z.object({
    id: z.number(),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    location: z.string().min(2, {
        message: "Location must be at least 2 characters.",
    }),
    rating: z.number().min(0).max(5),
    imageUrl: z.string().url().optional(),
    roomTypes: z.array(roomTypeSchema).optional(),
})

export type Hotel = z.infer<typeof hotelSchema>
