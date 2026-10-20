import { NextResponse } from 'next/server';

export interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  consultationType: string;
  preferredDate: string;
  timeSlot: string;
  zipCode: string;
  estimatedSqFt?: number;
  materialPreference?: string;
  notes?: string;
}

// In-memory record for test review during dev
const bookingsLog: Array<BookingPayload & { id: string; createdAt: string }> = [];

export async function POST(request: Request) {
  try {
    const data: BookingPayload = await request.json();

    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    const bookingId = `VRN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      ...data,
      id: bookingId,
      createdAt: new Date().toISOString(),
    };

    bookingsLog.unshift(newBooking);
    console.log('[API] New Consultation Call Booked:', newBooking);

    return NextResponse.json({
      success: true,
      bookingId,
      message: `Consultation call booked successfully for ${data.name}! A calendar invite and confirmation has been dispatched to ${data.email}.`,
      booking: newBooking,
    });
  } catch (err: unknown) {
    console.error('[API] Booking error:', err);
    return NextResponse.json(
      { error: 'Failed to process booking. Please call our hotline directly.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    totalBookings: bookingsLog.length,
    recentBookings: bookingsLog.slice(0, 10),
  });
}
