const nodemailer = require("nodemailer");

const usermailer = async (email, name, type) => {
  let subject, contactTemplate;

  // Define email content based on type
  if (type === "welcome") {
    subject = "Welcome to FUOYE Hostel Management";
    contactTemplate = `
      <div>
        <div>
          <h2 style="color:#2036ea;">Welcome to FUOYE Hostel Management</h2>
        </div>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
        </ul>
        <div>
          <h2 style="color:#2036ea;">Message:</h2>
          <p>
            Dear ${name},<br><br>
            Welcome to the FUOYE Hostel Management System! We’re excited to have you on board and thrilled that you’ve chosen to stay with us...
            <br><br>
            Best regards,<br>
            The FUOYE Hostel Management Team
          </p>
        </div>
        <p style="color:#2036ea;"><i>The FUOYE Hostel Management Team.</i></p>
      </div>
    `;
  } else if (type === "outstandingLoan") {
    subject = "Outstanding Loan Notification";
    contactTemplate = `
      <div>
        <div>
          <h2 style="color:#2036ea;">Outstanding Loan Notification</h2>
        </div>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
        </ul>
        <div>
          <h2 style="color:#2036ea;">Message:</h2>
          <p>
            Dear ${name},<br><br>
            You have an outstanding loan with us...
            <br><br>
            Best regards,<br>
            The Joy Loan Team
          </p>
        </div>
        <p style="color:#2036ea;"><i>The Joy Loan Team.</i></p>
      </div>`;
  } else if (type === "welcomeAdmin") {
    subject = "Welcome to the Joy Loan Admin Team!";
    contactTemplate = `
      <div>
        <div>
          <h2 style="color:#2036ea;">Welcome to the Joy Loan Admin Team!</h2>
        </div>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
        </ul>
        <div>
          <h2 style="color:#2036ea;">Message:</h2>
          <p>
            Dear ${name},<br><br>
            We're excited to welcome you to the Joy Loan Admin Team!...
            <br><br>
            Best regards,<br>
            The Joy Loan Team
          </p>
        </div>
        <p style="color:#2036ea;"><i>The Joy Loan Team.</i></p>
      </div>`;
  } else if (type === "legalAction") {
    subject = "Important: Potential Legal Action";
    contactTemplate = `
      <div>
        <div>
          <h2 style="color:#2036ea;">Important: Potential Legal Action</h2>
        </div>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
        </ul>
        <div>
          <h2 style="color:#2036ea;">Message:</h2>
          <p>
            Dear ${name},<br><br>
            We may have to take legal action if payment is not received within the next [specified time frame]...
            <br><br>
            Best regards,<br>
            The Joy Loan Team
          </p>
        </div>
        <p style="color:#2036ea;"><i>The Joy Loan Team.</i></p>
      </div>`;
  } else if (type === "newAdmin") {
    // New email template for notifying a new admin
    subject = "Welcome to FUOYE Hostel Admin Team!";
    contactTemplate = `
      <div>
        <div>
          <h2 style="color:#2036ea;">Welcome to the FUOYE Hostel Admin Team!</h2>
        </div>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
        </ul>
        <div>
          <h2 style="color:#2036ea;">Message:</h2>
          <p>
            Dear ${name},<br><br>
            Congratulations! You have been added as an administrator to the FUOYE Hostel Management System. 
            We're thrilled to have you on the admin team. You now have access to manage hostels, monitor operations, and ensure the best experience for our users.
            <br><br>
            Best regards,<br>
            The FUOYE Hostel Management Team
          </p>
        </div>
        <p style="color:#2036ea;"><i>The FUOYE Hostel Management Team.</i></p>
      </div>`;
  } else {
    throw new Error("Invalid email type");
  }

  // Create transporter for sending email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.maileremail,
      pass: process.env.mailerpassword,
    },
  });

  const mailOptions = {
    from: process.env.maileremail,
    to: email,
    subject: subject,
    text: "Notification from FUOYE Hostel Management",
    html: contactTemplate,
  };

  try {
    // Use the correct method `sendMail` to send emails
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { usermailer };

// Example usage
// usermailer('admin@example.com', 'Jane Doe', 'newAdmin');
