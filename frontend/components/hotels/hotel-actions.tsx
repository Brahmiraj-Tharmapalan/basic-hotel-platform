"use client"

import { useState } from "react"

import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Hotel } from "./schema"
import { deleteHotel } from "@/lib/api/hotels"
import { EditHotelDialog } from "./edit-hotel-dialog"

interface HotelActionsProps {
    hotel: Hotel
}

export function HotelActions({ hotel }: HotelActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteAlertDialog, setShowDeleteAlertDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        setIsDeleting(true)
        try {
            const result = await deleteHotel(hotel.id.toString())
            if (result.error) {
                console.error(result.error)
                alert(result.error || "Failed to delete hotel")
            } else {
                // toast.success("Hotel deleted successfully")
                setShowDeleteAlertDialog(false)
            }
        } catch (error) {
            console.error("Failed to delete hotel", error)
            alert("An unexpected error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <EditHotelDialog
                hotel={hotel}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />
            <AlertDialog open={showDeleteAlertDialog} onOpenChange={setShowDeleteAlertDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the hotel
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(hotel.id.toString())}
                    >
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/hotels/${hotel.id}`}>
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setShowDeleteAlertDialog(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
