const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find().limit(20);
  const result  = messages.map((msg) => {
    return {
      date: msg.date,
      text: msg.text,
      id: msg._id.toString(),
      user: msg.user
    }
  });

  ctx.body = {
    messages: [result[0]],
  };

  return next();
};
