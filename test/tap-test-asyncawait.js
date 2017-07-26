module.exports = exports = function (tap, cps_traceback, test_utils) ::

  tap.test @ 'Async-await promise chain', async t => ::
    ::
      const frames = cps_traceback.capture().toFrames()
      t.deepEqual @ test_utils.asFrameKeys(frames)
        , @: head:[], tail: @[] 'CPS[1]::PROMISE'

    await aaa()

    ::
      const frames = cps_traceback.capture().toFrames()
      t.deepEqual @ test_utils.asFrameKeys(frames)
        , @: head: []
           , tail: @[]
              "CPS[3]::PROMISE",
              "CPS[2]::PROMISE",
              "CPS[1]::PROMISE",

    return

    async function aaa() :: await ''; await bbb()
    async function bbb() :: await ''; await ccc()
    async function ccc() :: await ''; await ddd()
    async function ddd() :: await ''; await eee()
    async function eee() :: await ''; await fff()
    async function fff() :: await ''; await ggg()
    async function ggg() :: await ''; await hhh()
    async function hhh() :: await ''; await iii()
    async function iii() :: await ''; await jjj()
    async function jjj() :: await ''; await kkk()
    async function kkk() :: await ''; await lll()
    async function lll() :: await ''; await zzz()

    async function zzz() ::
      if 1 ::
        await 'zzz 1'
        await 'zzz 2'
        await 'zzz 3'
        await 'zzz 4'
        await 'zzz 5'
        await 'zzz 6'

      ::
        const frames = cps_traceback.capture().toFrames()
        t.deepEqual @ test_utils.asFrameKeys(frames), @{}
            head: @[]
                "CPS[10]::PROMISE",
                "CPS[9]::PROMISE",
                "CPS[8]::PROMISE",
                "CPS[7]::PROMISE",
                "CPS[6]::PROMISE",
                "CPS[5]::PROMISE",
                "CPS[4]::PROMISE",
                "CPS[3]::PROMISE",
                "CPS[2]::PROMISE",
                "CPS[1]::PROMISE",
           , tail: @[]
                "CPS[37]::PROMISE",
                "CPS[36]::PROMISE",
                "CPS[35]::PROMISE",
                "CPS[34]::PROMISE",
                "CPS[33]::PROMISE",
                "CPS[32]::PROMISE",
                "CPS[31]::PROMISE",
                "CPS[30]::PROMISE",
                "CPS[29]::PROMISE",
                "CPS[28]::PROMISE",
                "CPS[27]::PROMISE",
