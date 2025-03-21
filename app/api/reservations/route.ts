import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { 
                status: 401, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        const body = await request.json();
        const { listingId, startDate, endDate, totalPrice } = body;

        if (!listingId || !startDate || !endDate || !totalPrice) {
            return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { 
                status: 400, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        console.log("User:", currentUser);
        console.log("Request Body:", body);
        console.log("Listing ID:", listingId);
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        console.log("Total Price:", totalPrice);

        const listingAndReservation = await prisma.listing.update({
            where: { id: listingId },
            data: {
                reservations: {
                    create: {
                        userId: currentUser.id,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        totalPrice
                    }
                }
            }
        });

        return new NextResponse(JSON.stringify(listingAndReservation), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error("[RESERVATION_POST_ERROR]", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    }
}
