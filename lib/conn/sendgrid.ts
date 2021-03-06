import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_KEY);
export { sgMail };

export async function sendAuthMail(email: string, code: number, expiration) {
  console.log("email and code", email, code);

  const msg = {
    to: email,
    from: "maximorossini2016@gmail.com",
    subject: "Authorization",
    text: "text",
    html: `<div><h3>
        Your code is : ${code} it expires at : ${expiration}
    </h3>
    </div>`,
  };
  /*  const send = sgMail.send(msg).then(
    () => {},
    (error) => {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
  console.log("send : ", send); */
  try {
    const send = await sgMail.send(msg);
    if (send) {
      console.log("send : ", send);
      console.log("Email sent");
      return true;
    }
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response);
    }
  }
}
