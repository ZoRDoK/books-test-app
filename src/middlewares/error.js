module.exports.error = () => async (ctx, next) => {
  try {
    await next(ctx)
  } catch (err) {
    console.error(err)
    ctx.status = err.statusCode || err.status || 400

    ctx.body = {
      error: 'Something goes wrong, check README.md'
    }
  }
}
