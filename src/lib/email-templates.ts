const BANNER_TOP_IMAGE_URL = "/banner.png";
const BANNER_BOTTOM_IMAGE_URL = "/banner.jpeg";

export interface EmailData {
  studentName: string;
  courseName?: string;
  startDate?: string;
  scholarshipDate?: string;
  scholarshipDecisionDate?: string;
  communityWhatsappLink?: string;
  communityTelegramLink?: string;
  paymentType?: "Fully Paid" | "1st Installment" | "2nd Installment";
  amountPaid?: number;
  paymentDate?: string;
  groupName?: string;
  groupLink?: string;
  [key: string]: unknown;
}

const KICKOFF_DATE = "20th May, 2026";
const PROGRAM_DURATION = "16 weeks";

const baseShell = ({
  title,
  preheader,
  body,
}: {
  title: string;
  preheader: string;
  body: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
          <tr>
            <td>
              <img
                src="${BANNER_TOP_IMAGE_URL}"
                alt="Tech Trailblazer Academy"
                width="640"
                style="display:block;width:100%;max-width:640px;height:auto;border:0;outline:none;text-decoration:none;"
              >
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">${body}</td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <img
                src="${BANNER_BOTTOM_IMAGE_URL}"
                alt="Tech Trailblazer Academy"
                width="592"
                style="display:block;width:100%;max-width:592px;height:auto;border-radius:10px;border:0;outline:none;text-decoration:none;"
              >
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px 26px 24px;background:#f8fafc;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 6px 0;font-size:14px;color:#111827;"><strong>Warm regards,</strong></p>
              <p style="margin:0 0 4px 0;font-size:14px;color:#111827;">Programs Team, Tech Trailblazer Academy</p>
              <p style="margin:0;font-size:12px;color:#6b7280;">Copyright &copy; 2026 Tech Trailblazer Academy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const courseCareerHint = (courseName?: string) => {
  const course = (courseName || "your selected track").trim();
  const hints: Record<string, string> = {
    "Cybersecurity":
      "You will build practical security skills for threat detection, incident response, and defensive operations.",
    "Data Science":
      "You will learn to turn datasets into insights and predictive models that solve real business problems.",
    "AI Automation":
      "You will build AI-powered workflows that automate repetitive tasks and improve team productivity.",
    "Computer Networking":
      "You will gain hands-on networking skills for modern infrastructure, troubleshooting, and reliable systems.",
    "Ethical Hacking":
      "You will develop penetration testing and vulnerability assessment skills with responsible security practices.",
    "UI/UX Design":
      "You will design user-centered digital products that combine usability, clarity, and strong visual communication.",
    "Full Stack Development":
      "You will build end-to-end web applications from frontend interfaces to backend services and deployment.",
    "Frontend Development":
      "You will create responsive, accessible interfaces and production-grade user experiences.",
    "Backend Development":
      "You will design APIs, data flows, and scalable server-side architecture for robust applications.",
    "Web Development":
      "You will build complete web solutions with modern tools, clean code practices, and real project delivery.",
    "Digital Marketing":
      "You will learn performance-driven marketing strategies for growth, conversion, and brand visibility.",
    "Cloud Computing":
      "You will deploy and manage scalable cloud infrastructure and modern application environments.",
  };

  return hints[course] || `You are on track to build real-world capability in ${course}.`;
};

// Course to WhatsApp Group Mapping
const courseGroupMapping: { [key: string]: { name: string; link: string } } = {
  'UI/UX Design': {
    name: 'UI/UX Design Group',
    link: 'https://chat.whatsapp.com/BQ4M5ms4h6u5VnEqzBQE1T'
  },
  'Cloud computing': {
    name: 'Cloud Computing Group',
    link: 'https://chat.whatsapp.com/LThgVYa8ctuEUqow4YjZuI'
  },
  'Web Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'Mobile Development': {
    name: 'Mobile Development Group',
    link: 'https://chat.whatsapp.com/CMqxNxiy2toJYJdAvZtEKx'
  },
  'Data Science': {
    name: 'Data Science Group',
    link: 'https://chat.whatsapp.com/DKMXWi3fvmHEsb5bimLaJy'
  },
  'Artificial Intelligence': {
    name: 'Artificial Intelligence Group',
    link: 'https://chat.whatsapp.com/GB6UVLaEVh1KkgBWUaZjw9'
  },
  'Cybersecurity': {
    name: 'Cybersecurity Group',
    link: 'https://chat.whatsapp.com/IKKOqN0a3EpHPHoPCiE9tL'
  },
  'Digital Marketing': {
    name: 'Digital Marketing Group',
    link: 'https://chat.whatsapp.com/HwCcz7RG0YAECqChTUGr9d'
  },
  // Fallback mappings for variations
  '3D Animation': {
    name: 'Data Science Group',
    link: 'https://chat.whatsapp.com/DKMXWi3fvmHEsb5bimLaJy'
  },
  'Graphic Design': {
    name: 'Digital Marketing Group',
    link: 'https://chat.whatsapp.com/HwCcz7RG0YAECqChTUGr9d'
  },
  'Front End Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'UI/UX': {
    name: 'UI/UX Design Group',
    link: 'https://chat.whatsapp.com/BQ4M5ms4h6u5VnEqzBQE1T'
  },
  'Mobile App Development': {
    name: 'Mobile Development Group',
    link: 'https://chat.whatsapp.com/CMqxNxiy2toJYJdAvZtEKx'
  },
  'Backend Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'Cloud Computing': {
    name: 'Cloud Computing Group',
    link: 'https://chat.whatsapp.com/LThgVYa8ctuEUqow4YjZuI'
  },
  'Computer Networking': {
    name: 'Cybersecurity Group',
    link: 'https://chat.whatsapp.com/IKKOqN0a3EpHPHoPCiE9tL'
  },
  'AI Automation': {
    name: 'Artificial Intelligence Group',
    link: 'https://chat.whatsapp.com/GB6UVLaEVh1KkgBWUaZjw9'
  }
};

export function normalizeCourseName(courseName?: string) {
  return (courseName || "")
    .replace(" - Select a plan", "")
    .replace(" - Not Paid Yet", "")
    .trim();
}

export function getGroupInfoForCourse(courseName?: string) {
  const cleanCourseName = normalizeCourseName(courseName);
  return {
    cleanCourseName,
    groupInfo: courseGroupMapping[cleanCourseName] || {
      name: "General Group",
      link: "https://chat.whatsapp.com/YOUR_GENERAL_LINK",
    },
  };
}

export function getEmailSubject(emailType: string, data: EmailData) {
  switch (emailType) {
    case "welcome":
      return `Welcome to Tech Trailblazer Academy, ${data.studentName}`;
    case "payment_confirmation":
      if (data.paymentType === "Fully Paid") {
        return `Payment Confirmed - Full Tuition Received (${normalizeCourseName(data.courseName)})`;
      }
      return `Payment Confirmed - ${data.paymentType} (${normalizeCourseName(data.courseName)})`;
    case "group_redirection": {
      const { cleanCourseName } = getGroupInfoForCourse(data.courseName);
      return `Join Your ${cleanCourseName || "Course"} WhatsApp Group`;
    }
    default:
      return "Tech Trailblazer Academy Update";
  }
}

export const emailTemplates = {
  welcome: (data: EmailData): string =>
    (() => {
      const awardMailDate = String(data.scholarshipDecisionDate || data.scholarshipDate || "4th December, 2025");
      const classStartDate = String(data.startDate || KICKOFF_DATE);
      const whatsappLink = String(data.communityWhatsappLink || data.groupLink || "https://chat.whatsapp.com/Bi5XuFToVdjBPRvIawWz5W");

      return baseShell({
        title: "Welcome to Tech Trailblazer Academy",
        preheader: `${data.studentName}, congratulations. Your application has been received and your scholarship process has started.`,
        body: `
          <p style="margin:0 0 12px 0;font-size:16px;line-height:1.7;color:#111827;">Hey ${data.studentName},</p>
          <p style="margin:0 0 20px 0;font-size:16px;line-height:1.8;color:#111827;"><strong>Congratulations - you did it. 🎉</strong></p>

          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            Your application for the Tech Trailblazer Academy Scholarship Bootcamp has been successfully received, and we are thrilled to have you on this journey.
          </p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            While we review your application, your decision today to begin your journey in <strong>${normalizeCourseName(data.courseName) || "your selected track"}</strong> is a bold step toward a better future. ${courseCareerHint(data.courseName)}
          </p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            Thousands of Africans across multiple countries have taken this same step and gone on to build thriving careers in tech. Now, your next chapter begins.
          </p>

          <p style="margin:0 0 10px 0;font-size:15px;line-height:1.9;color:#111827;"><strong>Let us show you what is possible:</strong></p>
          <ul style="margin:0 0 18px 0;padding-left:20px;color:#111827;font-size:15px;line-height:1.9;">
            <li style="margin-bottom:8px;"><strong>Toluwani</strong> built a real-time intelligent payment platform during the scholarship program.</li>
            <li style="margin-bottom:8px;"><strong>Chidera</strong> transitioned into AI and started building practical disease prediction systems.</li>
            <li style="margin-bottom:8px;"><strong>Amarachi</strong> landed a full-stack developer role after earning her certification.</li>
            <li style="margin-bottom:8px;"><strong>Oluwaseun</strong> built Goldex, a crypto and fiat converter, as a bootcamp project.</li>
            <li style="margin-bottom:0;"><strong>Adebayo</strong> passed ISC2 cybersecurity certification within two months of joining the program.</li>
          </ul>

          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            These are not just stories. They are proof that with the right support, right training, and right mindset, transformation is possible.
          </p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            Our tracks include Data Analytics, Frontend Development, Business Analysis, Product Design (UI/UX), Mobile App Development, Backend Development, Product Management, Ethical Hacking, Cybersecurity, Virtual Assistance, Cloud Computing, Technical Writing, Digital Marketing, Web3, Artificial Intelligence, and Data Science.
          </p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            At Tech Trailblazer Academy, we do not just teach. We transform, and we believe access to quality tech education and resources should be available to everyone regardless of financial background.
          </p>

          <p style="margin:0 0 10px 0;font-size:16px;line-height:1.8;color:#111827;"><strong>${data.studentName}, what happens next?</strong></p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            Over the next few days, we will share details about your scholarship process, eligibility, important milestones, and how to maximize your chances. For now, relax and get ready - your journey has started.
          </p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            After the Scholarship Award mail is sent, you must confirm your status if selected within the acceptance window to stay enrolled in the scholarship cohort.
          </p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">
            Classes are scheduled to commence on <strong>${classStartDate}</strong>. Get ready for an immersive, hands-on experience designed to transform your career.
          </p>
          <p style="margin:0 0 20px 0;font-size:15px;line-height:1.9;color:#111827;">
            Please note that selection is competitive, and final acceptance depends on available sponsorship slots and review outcomes.
          </p>

          <p style="margin:0 0 10px 0;font-size:14px;line-height:1.9;color:#111827;">
            <strong>NB:</strong> To join our community for mentorship sessions and scholarship updates, use the WhatsApp link below before spaces fill up.
          </p>
          <div style="text-align:center;margin:0 0 18px 0;">
            <a href="${whatsappLink}" style="display:block;margin:0 auto 10px auto;max-width:440px;background:#25D366;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:.2px;text-transform:uppercase;">
              <span style="display:inline-flex;align-items:center;justify-content:center;gap:8px;">
                <svg width="17" height="17" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" style="display:inline-block;vertical-align:middle;">
                  <path d="M16.02 3.2C8.95 3.2 3.2 8.94 3.2 16.01c0 2.23.58 4.42 1.69 6.35L3.1 28.8l6.62-1.74a12.8 12.8 0 0 0 6.3 1.62h.01c7.06 0 12.8-5.74 12.8-12.81A12.8 12.8 0 0 0 16.02 3.2Zm0 23.36h-.01a10.52 10.52 0 0 1-5.36-1.48l-.39-.23-3.93 1.03 1.05-3.84-.25-.4a10.52 10.52 0 0 1-1.61-5.63c0-5.82 4.69-10.56 10.5-10.56 2.81 0 5.45 1.09 7.43 3.08a10.46 10.46 0 0 1 3.08 7.45c0 5.82-4.73 10.56-10.51 10.56Zm5.77-7.87c-.32-.16-1.9-.94-2.2-1.04-.3-.1-.51-.16-.73.16-.22.32-.84 1.04-1.03 1.25-.19.22-.38.24-.7.08-.32-.16-1.37-.5-2.61-1.61-.97-.86-1.62-1.93-1.81-2.25-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.56.16-.19.22-.32.32-.54.1-.22.05-.4-.03-.56-.08-.16-.73-1.76-1-2.42-.27-.64-.54-.55-.73-.56-.19-.01-.41-.01-.63-.01s-.56.08-.85.4c-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.15 3.08 1.31 3.29.16.22 2.25 3.44 5.45 4.82.76.33 1.36.53 1.82.68.77.24 1.47.2 2.02.12.62-.09 1.9-.78 2.17-1.54.27-.75.27-1.4.19-1.54-.08-.14-.29-.22-.6-.37Z"/>
                </svg>
                <span>Click Here To Join The WhatsApp Scholarship Community</span>
              </span>
            </a>
          </div>

          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.9;color:#111827;">Wishing you the very best on this journey.</p>
          <p style="margin:0;font-size:15px;line-height:1.9;color:#111827;">
            Warm regards,<br>
            Programs Team<br>
            Tech Trailblazer Academy
          </p>
        `,
      });
    })(),
  payment_confirmation: (data: EmailData): string => {
    const paymentType = data.paymentType || "Fully Paid";
    const messageByType: Record<string, string> = {
      "Fully Paid":
        "Fantastic commitment. Your full tuition has been received and your enrollment is now fully secured.",
      "1st Installment":
        "Great start. We have received your first installment and your onboarding remains active.",
      "2nd Installment":
        "Excellent follow-through. Your second installment has been received and your payment update is now complete.",
    };

    return baseShell({
      title: "Payment Confirmation",
      preheader: `${paymentType} payment confirmed for ${data.studentName}.`,
      body: `
        <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#111827;">Hi ${data.studentName},</p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;">This is to confirm that we have received your payment for <strong>${normalizeCourseName(data.courseName) || "your selected course"}</strong>.</p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;">${messageByType[paymentType] || messageByType["Fully Paid"]}</p>
        <div style="margin:20px 0;padding:18px;border:1px solid #d1fae5;border-radius:10px;background:#ecfdf5;">
          <p style="margin:0 0 8px 0;font-size:15px;color:#065f46;"><strong>Payment Type:</strong> ${paymentType}</p>
          <p style="margin:0 0 8px 0;font-size:15px;color:#065f46;"><strong>Amount Received:</strong> N${Number(data.amountPaid || 0).toLocaleString()}</p>
          <p style="margin:0;font-size:15px;color:#065f46;"><strong>Date:</strong> ${data.paymentDate || new Date().toLocaleDateString("en-GB")}</p>
        </div>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#374151;">Thank you for your trust. We look forward to seeing you in class on ${KICKOFF_DATE}.</p>
      `,
    });
  },
  group_redirection: (data: EmailData): string => {
    const { cleanCourseName, groupInfo } = getGroupInfoForCourse(data.courseName);
    return baseShell({
      title: "Join Your Course Community",
      preheader: `Join your ${cleanCourseName || "course"} WhatsApp group before classes start.`,
      body: `
        <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#111827;">Hi ${data.studentName},</p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;">
          Your learning community is ready. Based on your selected course, you should join <strong>${groupInfo.name}</strong> to get important updates and pre-class support.
        </p>
        <div style="margin:20px 0;padding:18px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;">
          <p style="margin:0 0 8px 0;font-size:15px;color:#111827;"><strong>Course:</strong> ${cleanCourseName || "Selected Track"}</p>
          <p style="margin:0 0 8px 0;font-size:15px;color:#111827;"><strong>Group:</strong> ${groupInfo.name}</p>
          <p style="margin:0;font-size:15px;color:#111827;"><strong>Kickoff Date:</strong> ${KICKOFF_DATE}</p>
        </div>
        <div style="text-align:center;margin:26px 0;">
          <a href="${groupInfo.link}" style="background:#16a34a;color:#fff;text-decoration:none;padding:13px 24px;border-radius:8px;font-size:15px;font-weight:700;display:inline-block;">
            Join WhatsApp Group
          </a>
        </div>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#374151;">
          Please join now so you do not miss orientation updates, first-week instructions, and live communication from the team.
        </p>
      `,
    });
  },
};
