const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const verificationToken = uuid();

  const user = await new User({email, displayName, verificationToken});
  await user.setPassword(password);

  await user.save()
    .then(async (user) => {
      await sendMail({
        template: 'confirmation',
        locals: {verificationToken},
        to: user.email,
        subject: 'Confirmation email',
      })
    }).then((item) => {
      ctx.body = {
        status: 'ok'
      }
    }).catch((err) => {
      if (!err.errors) throw err;

      ctx.status = 400;
      ctx.body = {
        errors: {}
      };

      for (const key in err.errors) {
        ctx.body.errors[key] = err.errors[key].message;
      }
    });

  return next();
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  const user = await User.findOne({verificationToken});

  if (!user) {
    ctx.status = 400;
    ctx.body = {
      error: 'Ссылка подтверждения недействительна или устарела',
    };

    return next();
  }

  await user.set('verificationToken', undefined);
  await user.save().then(async (user) => {
    await ctx.login(user);
    ctx.body = {
      token: verificationToken,
    }
  });

  return next();
};
