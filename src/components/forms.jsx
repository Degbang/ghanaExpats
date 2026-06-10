export function SearchToolbar({ action, placeholder, filters = [], submitLabel = "Search" }) {
  return (
    <form action={action} className="search-toolbar">
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="q">Search</label>
          <input id="q" name="q" type="text" placeholder={placeholder} />
        </div>
        {filters.map((filter) => (
          <div key={filter.name} className={filter.full ? "field full" : "field"}>
            <label htmlFor={filter.name}>{filter.label}</label>
            {filter.type === "select" ? (
              <select id={filter.name} name={filter.name} defaultValue="">
                <option value="">{filter.emptyLabel || "All"}</option>
                {filter.options.map((option) => (
                  <option key={option.value || option} value={option.value || option}>
                    {option.label || option}
                  </option>
                ))}
              </select>
            ) : (
              <input id={filter.name} name={filter.name} type={filter.type || "text"} placeholder={filter.placeholder || ""} />
            )}
          </div>
        ))}
      </div>
      <div className="search-toolbar-actions">
        <button className="button primary-button" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export function StatusNotice({ title, body, tone = "default" }) {
  if (!title) return null;
  return (
    <div className={`callout-box ${tone === "alert" ? "tone-red" : ""}`}>
      <h3>{title}</h3>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

export function HumanCheckField() {
  return (
    <>
      <div className="field" style={{ display: "none" }}>
        <label htmlFor="website_confirmation">Website confirmation</label>
        <input id="website_confirmation" name="website_confirmation" type="text" autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor="human_check">Human check</label>
        <input id="human_check" name="human_check" type="text" placeholder="Type GHANA" required />
      </div>
    </>
  );
}
