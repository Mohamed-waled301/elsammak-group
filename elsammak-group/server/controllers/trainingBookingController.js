const TrainingBooking = require('../models/TrainingBooking');
const { sendTrainingBookingConfirmation } = require('../utils/sendEmail');
const {
  COURSE_LABELS,
  ATTENDANCE_LABELS,
  getProgram,
} = require('../config/trainingPrograms');

function parseBody(body) {
  const name = String(body?.name || '').trim();
  const email = String(body?.email || '')
    .trim()
    .toLowerCase();
  const phone = String(body?.phone || '').trim();
  const course = String(body?.course || '').trim();
  const attendanceMode = String(body?.attendanceMode || '').trim();
  const bookingDate = String(body?.bookingDate || '').trim();
  const governorate = String(body?.governorate || '').trim();
  const city = String(body?.city || '').trim();

  if (!name) return { error: 'Name is required.' };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'A valid email is required.' };
  }
  if (!course) return { error: 'Please select a program.' };
  if (!attendanceMode || !['remote', 'physical'].includes(attendanceMode)) {
    return { error: 'Please select an attendance mode.' };
  }
  if (!bookingDate) return { error: 'Please choose a booking date.' };

  const program = getProgram(course);
  if (!program) return { error: 'Invalid training program.' };
  if (attendanceMode === 'remote' && !program.allowRemote) {
    return { error: 'Remote attendance is not available for this program.' };
  }
  if (attendanceMode === 'physical' && !program.allowPhysical) {
    return { error: 'In-person attendance is not available for this program.' };
  }

  return { name, email, phone, course, attendanceMode, bookingDate, governorate, city };
}

/**
 * POST /api/training/booking
 */
async function postTrainingBooking(req, res, next) {
  try {
    const parsed = parseBody(req.body);
    if (parsed.error) {
      return res.status(400).json({ success: false, message: parsed.error });
    }

    await TrainingBooking.create({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      course: parsed.course,
      attendanceMode: parsed.attendanceMode,
      bookingDate: parsed.bookingDate,
      governorate: parsed.governorate,
      city: parsed.city,
    });

    const labels = COURSE_LABELS[parsed.course] || { en: parsed.course, ar: parsed.course };
    const modeLabels = ATTENDANCE_LABELS[parsed.attendanceMode] || {
      en: parsed.attendanceMode,
      ar: parsed.attendanceMode,
    };

    const emailResult = await sendTrainingBookingConfirmation({
      to: parsed.email,
      name: parsed.name,
      courseLabelEn: labels.en,
      courseLabelAr: labels.ar,
      attendanceLabelEn: modeLabels.en,
      attendanceLabelAr: modeLabels.ar,
      bookingDate: parsed.bookingDate,
      phone: parsed.phone,
      governorate: parsed.governorate,
      city: parsed.city,
    });

    return res.status(201).json({
      success: true,
      message: 'Your training seat request was received.',
      emailSent: emailResult.sent,
      ...(emailResult.sent === false && emailResult.error
        ? { emailWarning: 'Confirmation email could not be sent. We will still process your request.' }
        : {}),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { postTrainingBooking };
