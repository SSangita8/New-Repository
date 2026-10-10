import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }

  return data;
}

function formatDate(value) {
  if (!value) return "Timestamp unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Timestamp unavailable"
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function eventDetail(event) {
  const payload = event.payload || {};
  const details = Object.entries(payload)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" · ");

  return details || "No additional event details";
}

function App() {
  const [containerId, setContainerId] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [record, setRecord] = useState(null);
  const [recentIds, setRecentIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadContainer(id, preserveNotice = false) {
    const normalizedId = id.trim();
    if (!normalizedId) {
      setError("Enter a container ID to search the ledger.");
      return;
    }

    setBusy(true);
    setError("");
    if (!preserveNotice) setNotice("");
    try {
      const data = await request(
        `/api/queries/container/${encodeURIComponent(normalizedId)}`,
      );
      setRecord(data);
      setLookupId(normalizedId);
      setRecentIds((ids) =>
        [normalizedId, ...ids.filter((id) => id !== normalizedId)].slice(0, 5),
      );
    } catch (requestError) {
      setRecord(null);
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function createContainer(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const created = await request("/api/commands/container", {
        method: "POST",
        body: JSON.stringify({
          containerId: containerId.trim(),
          origin: origin.trim(),
          destination: destination.trim(),
        }),
      });
      setContainerId("");
      setOrigin("");
      setDestination("");
      setNotice(created.message || "Container added to the audit ledger.");
      await loadContainer(created.event.aggregateId, true);
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
    }
  }

  const state = record?.state;
  const events = record?.events || [];
  const latestEvent = events[events.length - 1];

  return (
    <div className="app-shell">
      <aside className="rail" aria-label="Primary navigation">
        <a
          className="brand-mark"
          href="#overview"
          aria-label="Audit Trail home"
        >
          AT
        </a>
        <div className="rail-divider" />
        <a
          className="rail-item active"
          href="#overview"
          aria-label="Overview"
          title="Overview"
        >
          <span className="rail-glyph">⌂</span>
        </a>
        <a
          className="rail-item"
          href="#event-history"
          aria-label="Event history"
          title="Event history"
        >
          <span className="rail-glyph">≋</span>
        </a>
        <div className="rail-bottom">
          <span className="online-dot" /> API
        </div>
      </aside>

      <main className="workspace" id="overview">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Operations</span>
            <span className="crumb-slash">/</span>
            <strong>Audit trail</strong>
          </div>
          <div className="system-state">
            <span className="online-dot" /> <span>Ledger service</span>
            <span className="state-label">READY</span>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">
                CONTAINER OPERATIONS <span>·</span> EVENT SOURCING
              </p>
              <h1>Audit trail</h1>
              <p className="heading-copy">
                Trace a container’s recorded journey, one event at a time.
              </p>
            </div>
            <div className="date-stamp">
              <span className="stamp-label">WORKSPACE</span>
              <strong>LIVE LEDGER</strong>
            </div>
          </section>

          <section className="metrics" aria-label="Selected container summary">
            <article className="metric-cell">
              <span className="metric-label">CONTAINER</span>
              <strong className="metric-value mono">
                {state?.containerId || "—"}
              </strong>
              <span className="metric-foot">
                {state ? "Selected record" : "No record selected"}
              </span>
            </article>
            <article className="metric-cell">
              <span className="metric-label">CURRENT STATUS</span>
              <strong
                className={`metric-value status-value ${state?.status ? "status-" + state.status.toLowerCase() : ""}`}
              >
                {state?.status || "Awaiting lookup"}
              </strong>
              <span className="metric-foot">Reconstructed from events</span>
            </article>
            <article className="metric-cell">
              <span className="metric-label">RECORDED EVENTS</span>
              <strong className="metric-value">
                {record ? events.length.toString().padStart(2, "0") : "—"}
              </strong>
              <span className="metric-foot">Ordered by version</span>
            </article>
            <article className="metric-cell last-metric">
              <span className="metric-label">LAST ACTIVITY</span>
              <strong className="metric-value last-activity">
                {latestEvent ? formatDate(latestEvent.timestamp) : "—"}
              </strong>
              <span className="metric-foot">
                {latestEvent
                  ? `Version ${latestEvent.version}`
                  : "No activity to show"}
              </span>
            </article>
          </section>

          <section className="lookup-bar" aria-label="Find a container">
            <div className="lookup-intro">
              <span className="section-index">01</span>
              <div>
                <h2>Find a container</h2>
                <p>Load its current state and full event history.</p>
              </div>
            </div>
            <form
              className="lookup-form"
              onSubmit={(event) => {
                event.preventDefault();
                loadContainer(lookupId);
              }}
            >
              <label className="sr-only" htmlFor="lookup-id">
                Container ID
              </label>
              <input
                id="lookup-id"
                value={lookupId}
                onChange={(event) => setLookupId(event.target.value)}
                placeholder="Enter container ID"
              />
              <button
                className="button button-dark"
                type="submit"
                disabled={busy}
              >
                {busy ? "Loading…" : "Search ledger"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </form>
          </section>

          {error && (
            <div className="feedback feedback-error" role="alert">
              {error}
            </div>
          )}
          {notice && !error && (
            <div className="feedback feedback-success" role="status">
              {notice}
            </div>
          )}

          <div className="content-grid">
            <section className="history-panel" id="event-history">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">IMMUTABLE RECORD</p>
                  <h2>Event history</h2>
                </div>
                <span className="event-count">
                  {record ? `${events.length} EVENTS` : "NO SELECTION"}
                </span>
              </div>

              {events.length > 0 ? (
                <ol className="event-list">
                  {events.map((event, index) => (
                    <li
                      className="event-row"
                      key={`${event.aggregateId}-${event.version}`}
                    >
                      <div className="event-track">
                        <span
                          className={`event-node ${index === events.length - 1 ? "current-node" : ""}`}
                        />
                        {index < events.length - 1 && (
                          <span className="event-line" />
                        )}
                      </div>
                      <div className="event-body">
                        <div className="event-topline">
                          <span className="event-type">
                            {event.eventType.replaceAll("_", " ")}
                          </span>
                          <span className="event-version">
                            V{event.version}
                          </span>
                        </div>
                        <p className="event-detail">{eventDetail(event)}</p>
                        <time className="event-time" dateTime={event.timestamp}>
                          {formatDate(event.timestamp)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="empty-history">
                  <span className="empty-mark">+</span>
                  <strong>
                    {record
                      ? "No events recorded"
                      : "Your event stream starts here"}
                  </strong>
                  <p>
                    {record
                      ? "This container has no events to display."
                      : "Search for a container or create one to inspect its audit history."}
                  </p>
                </div>
              )}
              <div className="panel-foot">
                <span>EVENT STORE</span>
                <span className="foot-dot" />{" "}
                <span>
                  {record
                    ? `AGGREGATE ${state?.containerId || ""}`
                    : "WAITING FOR AGGREGATE"}
                </span>
              </div>
            </section>

            <aside className="side-column">
              <section className="state-panel">
                <div className="panel-heading compact-heading">
                  <div>
                    <p className="eyebrow">RECONSTRUCTED VIEW</p>
                    <h2>Current state</h2>
                  </div>
                  <span className="state-indicator" />
                </div>
                {state ? (
                  <dl className="state-list">
                    <div>
                      <dt>Container ID</dt>
                      <dd className="mono">{state.containerId || "—"}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{state.status || "—"}</dd>
                    </div>
                    <div>
                      <dt>Last known location</dt>
                      <dd>{state.location || "—"}</dd>
                    </div>
                    <div>
                      <dt>Ship</dt>
                      <dd>{state.shipName || "—"}</dd>
                    </div>
                    <div>
                      <dt>Temperature</dt>
                      <dd>
                        {state.temperature == null
                          ? "—"
                          : `${state.temperature}°`}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="state-empty">
                    Select a container to reconstruct its latest known state.
                  </p>
                )}
              </section>

              <section className="create-panel">
                <div className="panel-heading compact-heading">
                  <div>
                    <p className="eyebrow">NEW AGGREGATE</p>
                    <h2>Register container</h2>
                  </div>
                  <span className="section-index">02</span>
                </div>
                <form className="create-form" onSubmit={createContainer}>
                  <label htmlFor="container-id">Container ID</label>
                  <input
                    id="container-id"
                    value={containerId}
                    onChange={(event) => setContainerId(event.target.value)}
                    placeholder="e.g. CTNR-2048"
                    required
                  />
                  <div className="form-split">
                    <div>
                      <label htmlFor="origin">Origin</label>
                      <input
                        id="origin"
                        value={origin}
                        onChange={(event) => setOrigin(event.target.value)}
                        placeholder="Port of origin"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="destination">Destination</label>
                      <input
                        id="destination"
                        value={destination}
                        onChange={(event) => setDestination(event.target.value)}
                        placeholder="Destination"
                        required
                      />
                    </div>
                  </div>
                  <button
                    className="button button-accent"
                    type="submit"
                    disabled={busy}
                  >
                    Create record <span aria-hidden="true">+</span>
                  </button>
                </form>
                <p className="create-note">
                  <span>i</span> Creates the first immutable event for this
                  container.
                </p>
              </section>

              {recentIds.length > 0 && (
                <section className="recent-panel">
                  <div className="recent-heading">
                    <h2>Recent lookups</h2>
                    <span>{recentIds.length}</span>
                  </div>
                  <ul>
                    {recentIds.map((id) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => loadContainer(id)}
                          disabled={busy}
                        >
                          <span className="recent-record-icon">↳</span>
                          <span className="mono">{id}</span>
                          <span className="recent-arrow">→</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>
          </div>

          <footer className="page-footer">
            <span>
              AUDIT TRAIL <span className="footer-slash">/</span> EVENT LOG
            </span>
            <span>STATE IS REBUILT FROM THE EVENT STORE</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
