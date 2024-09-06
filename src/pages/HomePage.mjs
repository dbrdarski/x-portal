import { state, computed } from "../reactive.mjs"

export default HtmlPage => {
  // const [passkey, setPasskey] = state("")
  // const maskedPasskey = computed(
  //   passkey => passkey.join("").replaceAll(/.{1}/gi, "•"),
  //   [passkey]
  // )
  // const style = computed(passkey => `--content: "${passkey.join("") || "_"}"`, [passkey])

  // const handlePasskey = (event) => {
  //   const { target: { value, selectionStart }, data } = event
  //   const p = [...passkey()]
  //   console.log(data, value, selectionStart, event)
  //   data
  //     ? p.splice(selectionStart - 1, value.length > p.length ? 0 : p.length - value.length + 1, data)
  //     : p.splice(selectionStart, p.length - value.length)
  //   setPasskey(p)
  //   // event.target.value = value.replaceAll(/.{1}/gi, "•")
  //   event.target.setSelectionRange(selectionStart, selectionStart)
  // }

  return (
    <HtmlPage>
      <div class="login-screen">
        <label class="passkey-label">Enter your passkey:</label>
        { false }
        <>
          <br />
          <>
            <br />
            <input
              class="passkey-input"
              type="text"
              autocomplete="off"
              // value={maskedPasskey}
              // oninput={handlePasskey}
              // oncut={e => (e.preventDefault()) }
              // oncopy={e => (e.preventDefault()) }
              // onpaste={e => (e.preventDefault()) }
              // onkeypress={(e) => {
              //   if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
              //     e.preventDefault()
              //     return false
              //   }
              // }}
            />
          </>
        </>
        <br />
        <>
          <br />
          <button
            class="passkey-submit-button"
            onclick={() => alert("Pero")}
          >Go Man, Go!
          </button>
            <div class="passkey-preview"
              // style={style}
            />
        </>
      </div>
    </HtmlPage>
  )
}
