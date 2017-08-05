module.exports = exports = function (tap, cps_traceback, test_utils) ::
  tap.test @ 'Not-supported basic', t => ::
    const frames = cps_traceback.capture().toFrames()
    t.deepEqual @ test_utils.asFrameKeys(frames)
      , @: head:[], tail: []


  tap.test @ 'Not-supported async with error', async t => ::
    try ::
      await t
      throw new Error @ 'a test error'

    catch err ::
      const frames = cps_traceback.error(err).toFrames()
      t.deepEqual @ test_utils.asFrameKeys(frames)
        , @: head:[], tail: @[] "Error: a test error"

