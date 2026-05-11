import { NextRequest, NextResponse } from "next/server";
import * as offlineDb from '@/lib/offline-db';

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

async function emailExists(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  const students = await offlineDb.getAllStudents();
  return students.some(s => s.email.toLowerCase() === normalizedEmail);
}

async function phoneExists(phone: string) {
  const trimmedPhone = phone.trim();
  const normalizedPhone = normalizePhone(phone);

  if (!trimmedPhone) {
    return false;
  }

  const students = await offlineDb.getAllStudents();
  const exactMatch = students.some(s => s.phone === trimmedPhone);

  if (exactMatch) {
    return true;
  }

  if (normalizedPhone.length < 4) {
    return false;
  }

  return students.some(s => normalizePhone(s.phone) === normalizedPhone);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") ?? "";
    const phone = searchParams.get("phone") ?? "";

    const [hasEmail, hasPhone] = await Promise.all([
      email ? emailExists(email) : Promise.resolve(false),
      phone ? phoneExists(phone) : Promise.resolve(false),
    ]);

    return NextResponse.json({
      emailExists: hasEmail,
      phoneExists: hasPhone,
    });
  } catch (error) {
    console.error("Error checking registration availability:", error);

    return NextResponse.json(
      { error: "Failed to check registration availability." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      phoneWhatsApp,
      gender,
      stateOfResidence,
      learningTrack,
      howHeardAboutUs,
      hasLaptopAndInternet,
      email,
      employmentStatus,
      wantsScholarship,
      whyLearnThisSkill,
    } = body;

    if (
      !fullName ||
      !phoneWhatsApp ||
      !gender ||
      !stateOfResidence ||
      !learningTrack ||
      !howHeardAboutUs ||
      !hasLaptopAndInternet ||
      !email ||
      !employmentStatus ||
      !wantsScholarship ||
      !whyLearnThisSkill
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phoneWhatsApp);

    const [hasEmail, hasPhone] = await Promise.all([
      emailExists(normalizedEmail),
      phoneExists(normalizedPhone),
    ]);

    if (hasEmail || hasPhone) {
      return NextResponse.json(
        {
          error:
            hasEmail && hasPhone
              ? "Email and phone number already exist."
              : hasEmail
                ? "Email already exists."
                : "Phone number already exists.",
          emailExists: hasEmail,
          phoneExists: hasPhone,
        },
        { status: 409 },
      );
    }

    const submittedAt = new Date();
    const registrationData = {
      name: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      course: learningTrack.trim(),
      reg_date: submittedAt.toLocaleDateString("en-GB"),
      reg_time: submittedAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      payment_plan: "Not Paid Yet",
      amount_paid: 0,
      balance_remaining: 0,
      status: "None",
      timestamp: submittedAt.toISOString(),
      gender: gender.trim(),
      state_of_residence: stateOfResidence.trim(),
      learning_track: learningTrack.trim(),
      how_did_you_hear: howHeardAboutUs.trim(),
      has_laptop_and_internet: hasLaptopAndInternet.trim(),
      current_employment_status: employmentStatus.trim(),
      wants_scholarship: wantsScholarship.trim(),
      why_learn_this_skill: whyLearnThisSkill.trim(),
      public_student_id: null,
      last_progress: null,
    };

    await offlineDb.createStudent(registrationData);

    return NextResponse.json({
      success: true,
      message:
        "Registration received successfully. We will reach out to you through email.",
    });
  } catch (error) {
    console.error("Error processing registration:", error);

    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 },
    );
  }
}