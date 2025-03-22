// import getCurrentUser from "@/app/actions/getCurrentUser";
// import { NextResponse } from "next/server";
// import prisma from "@/app/libs/prismadb";

// export async function POST(request: Request) {
//   try {
//     const currentUser = await getCurrentUser();

//     if (!currentUser) {
//       return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { 
//         status: 401, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     const body = await request.json();
//     const { listingId, startDate, endDate, totalPrice } = body;

//     // Log the exact received data
//     console.log("API received data:", {
//       listingId,
//       startDate,
//       endDate,
//       totalPrice,
//       userId: currentUser.id
//     });

//     // Validate each field with detailed error messages
//     if (!listingId) {
//       return new NextResponse(JSON.stringify({ 
//         error: "Missing required field: listingId",
//         received: body 
//       }), { 
//         status: 400, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     if (!startDate) {
//       return new NextResponse(JSON.stringify({ 
//         error: "Missing required field: startDate",
//         received: body 
//       }), { 
//         status: 400, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     if (!endDate) {
//       return new NextResponse(JSON.stringify({ 
//         error: "Missing required field: endDate",
//         received: body 
//       }), { 
//         status: 400, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     if (!totalPrice) {
//       return new NextResponse(JSON.stringify({ 
//         error: "Missing required field: totalPrice",
//         received: body 
//       }), { 
//         status: 400, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     // First, verify that the listing exists
//     const listing = await prisma.listing.findUnique({
//       where: {
//         id: listingId
//       }
//     });

//     if (!listing) {
//       return new NextResponse(JSON.stringify({ 
//         error: `Listing with ID ${listingId} not found`
//       }), { 
//         status: 404, 
//         headers: { "Content-Type": "application/json" } 
//       });
//     }

//     // Create the reservation
//     const reservation = await prisma.reservation.create({
//       data: {
//         userId: currentUser.id,
//         listingId,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         totalPrice: Number(totalPrice)
//       }
//     });

//     return new NextResponse(JSON.stringify(reservation), { 
//       status: 200, 
//       headers: { "Content-Type": "application/json" } 
//     });
    
//   } catch (error: any) {
//     console.error("[RESERVATION_POST_ERROR]", error);
//     return new NextResponse(JSON.stringify({ 
//       error: "Internal Server Error", 
//       details: error.message 
//     }), { 
//       status: 500, 
//       headers: { "Content-Type": "application/json" } 
//     });
//   }
// }









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

    // Log the exact received data
    console.log("API received data:", {
      listingId,
      startDate,
      endDate,
      totalPrice,
      userId: currentUser.id
    });

    // Validate each field with detailed error messages
    if (!listingId) {
      return new NextResponse(JSON.stringify({ 
        error: "Missing required field: listingId",
        received: body 
      }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    if (!startDate) {
      return new NextResponse(JSON.stringify({ 
        error: "Missing required field: startDate",
        received: body 
      }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    if (!endDate) {
      return new NextResponse(JSON.stringify({ 
        error: "Missing required field: endDate",
        received: body 
      }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    if (!totalPrice) {
      return new NextResponse(JSON.stringify({ 
        error: "Missing required field: totalPrice",
        received: body 
      }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // First, verify that the listing exists
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId
      }
    });

    if (!listing) {
      return new NextResponse(JSON.stringify({ 
        error: `Listing with ID ${listingId} not found`
      }), { 
        status: 404, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: currentUser.id,
        listingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: Number(totalPrice)
      }
    });

    return new NextResponse(JSON.stringify(reservation), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
    
  } catch (error: any) {
    console.error("[RESERVATION_POST_ERROR]", error);
    return new NextResponse(JSON.stringify({ 
      error: "Internal Server Error", 
      details: error.message 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const url = new URL(request.url);
    const reservationId = url.pathname.split("/").pop(); 

    if (!reservationId) {
      return new NextResponse(JSON.stringify({ error: "Reservation ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if the reservation exists and belongs to the user or the listing author
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true }
    });

    if (!reservation) {
      return new NextResponse(JSON.stringify({ error: "Reservation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (reservation.userId !== currentUser.id && reservation.listing.userId !== currentUser.id) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized: Cannot delete this reservation" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Perform the deletion
    await prisma.reservation.delete({
      where: { id: reservationId }
    });

    return new NextResponse(JSON.stringify({ message: "Reservation deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("[RESERVATION_DELETE_ERROR]", error);
    return new NextResponse(JSON.stringify({ 
      error: "Internal Server Error", 
      details: error.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

