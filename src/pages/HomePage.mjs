export default HtmlPage => (
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
      </>
    </div>
  </HtmlPage>
)
