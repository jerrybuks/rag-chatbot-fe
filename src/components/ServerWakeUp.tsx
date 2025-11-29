import './ServerWakeUp.css'

function ServerWakeUp() {
  return (
    <div className="server-wakeup-banner">
      <div className="server-wakeup-content">
        <div className="server-wakeup-left">
          <div className="server-wakeup-spinner">
            <div className="spinner"></div>
          </div>
          <div className="server-wakeup-text">
            <span className="server-wakeup-title">Server is waking up</span>
            <span className="server-wakeup-subtitle">Please wait a minute or two while our server starts up</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServerWakeUp

