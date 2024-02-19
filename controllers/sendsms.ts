const accountSid = "AC7de789a746918ab8c90399949988036c";
const authToken = "79c5c178b8d568aeca3f37aa68c2c928";
const client = require("twilio")(accountSid, authToken);
const sendSMS = async (content: string, to: string) => {
  let msgOptions = {
    from: "+15169734137",
    to: `${to}`,
    body: content
  }
  try {
    const message = await client.messages.create(msgOptions);
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

export default sendSMS;
