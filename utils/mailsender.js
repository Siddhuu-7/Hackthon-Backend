const nodemailer = require("nodemailer");

const sendEmail = async (to, registrationData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Csibodyevents@gmail.com",   
        pass: "hsykfkyjhkpzboca",          
      },
    });

    // Extract data from the registrationData object
    const {
      teamName,
      teamLeadName,
      teamMembers = [], // Array of member names
      registrationFee = 500,
      eventName = "Quiz Rooms Event",
      eventDate,
      eventTime,
      eventVenue
    } = registrationData;

    const totalMembers = teamMembers.length + 1; // +1 for team lead
    const totalAmount = totalMembers * registrationFee;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation - ${eventName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f2027, #1d2a38, #203a43); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">🎉 Registration Successful!</h1>
                            <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Welcome to ${eventName}</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px;">
                            <p style="margin: 0; color: #212529; font-size: 16px; line-height: 1.6;">
                                Hi <strong>${teamLeadName}</strong>,
                            </p>
                            <p style="margin: 15px 0 0 0; color: #495057; font-size: 15px; line-height: 1.6;">
                                Thank you for registering your team <strong style="color: #d97706;">${teamName}</strong> for ${eventName}! 
                                We're excited to have you participate.
                            </p>
                        </td>
                    </tr>

                    <!-- Team Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="color: #d97706; margin: 0 0 20px 0; font-size: 24px; border-left: 4px solid #d97706; padding-left: 15px;">Team Details</h2>
                            <table cellpadding="10" cellspacing="0" border="0" width="100%" style="background-color: #e3f2fd; border-radius: 8px; border: 1px solid #90caf9;">
                                <tr>
                                    <td style="color: #1565c0; font-size: 14px; font-weight: 600;">Team Name:</td>
                                    <td align="right" style="color: #0d47a1; font-size: 14px; font-weight: bold;">${teamName}</td>
                                </tr>
                                <tr>
                                    <td style="color: #1565c0; font-size: 14px; font-weight: 600;">Team Lead:</td>
                                    <td align="right" style="color: #0d47a1; font-size: 14px; font-weight: bold;">${teamLeadName}</td>
                                </tr>
                                <tr>
                                    <td style="color: #1565c0; font-size: 14px; font-weight: 600;">Total Members:</td>
                                    <td align="right" style="color: #0d47a1; font-size: 14px; font-weight: bold;">${totalMembers}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Team Members List -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="color: #d97706; margin: 0 0 20px 0; font-size: 24px; border-left: 4px solid #d97706; padding-left: 15px;">Team Members</h2>
                            
                            <!-- Team Lead -->
                            <table cellpadding="12" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 8px; margin-bottom: 15px; border: 1px solid #64b5f6;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; color: #1565c0; font-weight: 600; font-size: 15px;">Team Lead</p>
                                        <p style="margin: 5px 0 0 0; color: #0d47a1; font-size: 16px; font-weight: bold;">${teamLeadName}</p>
                                    </td>
                                    <td align="right">
                                        <p style="margin: 0; color: #1565c0; font-size: 14px;">Registration Fee</p>
                                        <p style="margin: 5px 0 0 0; color: #0d47a1; font-size: 20px; font-weight: bold;">₹${registrationFee}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Team Members -->
                            ${teamMembers.length > 0 ? `
                            <table cellpadding="12" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #f3e5f5, #e1bee7); border-radius: 8px; margin-bottom: 15px; border: 1px solid #ba68c8;">
                                <tr>
                                    <td colspan="2">
                                        <p style="margin: 0 0 10px 0; color: #7b1fa2; font-weight: 600; font-size: 15px;">Team Members</p>
                                    </td>
                                </tr>
                                ${teamMembers.map((member, index) => `
                                <tr>
                                    <td style="padding: 8px 12px;">
                                        <p style="margin: 0; color: #4a148c; font-size: 14px;">${index + 1}. ${member}</p>
                                    </td>
                                    <td align="right" style="padding: 8px 12px;">
                                        <p style="margin: 0; color: #4a148c; font-size: 14px; font-weight: bold;">₹${registrationFee}</p>
                                    </td>
                                </tr>
                                `).join('')}
                            </table>
                            ` : ''}

                            <!-- Total Amount -->
                            <table cellpadding="20" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #0f2027, #1d2a38, #203a43); border-radius: 8px; border: 3px solid #d97706;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; color: #e0e0e0; font-size: 16px;">Total Amount Paid</p>
                                        <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.8;">${totalMembers} members × ₹${registrationFee} each</p>
                                    </td>
                                    <td align="right">
                                        <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold;">₹${totalAmount.toLocaleString('en-IN')}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Event Information -->
                    ${eventDate || eventTime || eventVenue ? `
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="color: #d97706; margin: 0 0 20px 0; font-size: 24px; border-left: 4px solid #d97706; padding-left: 15px;">Event Details</h2>
                            <table cellpadding="10" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
                                ${eventDate ? `
                                <tr>
                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600;">📅 Date:</td>
                                    <td align="right" style="color: #212529; font-size: 14px; font-weight: bold;">${eventDate}</td>
                                </tr>
                                ` : ''}
                                ${eventTime ? `
                                <tr>
                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600;">⏰ Time:</td>
                                    <td align="right" style="color: #212529; font-size: 14px; font-weight: bold;">${eventTime}</td>
                                </tr>
                                ` : ''}
                                ${eventVenue ? `
                                <tr>
                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600;">📍 Venue:</td>
                                    <td align="right" style="color: #212529; font-size: 14px; font-weight: bold;">${eventVenue}</td>
                                </tr>
                                ` : ''}
                            </table>
                        </td>
                    </tr>
                    ` : ''}

                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 10px 0; color: #856404; font-weight: bold; font-size: 16px;">📌 Important Information</p>
                                        <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.6;">
                                            <li>Please save this email for your records</li>
                                            <li>Bring a printed or digital copy of this confirmation on event day</li>
                                            <li>Registration fees are non-refundable</li>
                                            <li>Further event details will be shared closer to the date</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contact Support -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 10px 0; color: #2e7d32; font-weight: bold; font-size: 16px;">Need Help?</p>
                                        <p style="margin: 0; color: #2e7d32; font-size: 14px; line-height: 1.6;">
                                            If you have any questions or concerns regarding your registration, please contact us at:<br>
                                            <strong>Email:</strong> Csibodyevents@gmail.com<br>
                                            <strong>Phone:</strong> +91 83411 61719
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 2px solid #dee2e6;">
                            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                                Thank you for registering! We look forward to seeing your team at the event.
                            </p>
                            <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                © ${new Date().getFullYear()}Udbhav-2k26. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0 0; color: #adb5bd; font-size: 12px;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    const mailOptions = {
      from: "Udbhav-2k26 <Csibodyevents@gmail.com>",
      to,
      subject: `Registration Confirmation - ${eventName}`,
      html, 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Email error:", err);
    return { success: false, error: err.message };
  }
};







module.exports = sendEmail;