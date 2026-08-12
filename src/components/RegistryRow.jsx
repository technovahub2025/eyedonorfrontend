import './RegistryRow.css';

function RegistryRow({
  initials,
  name,
  email,
  phone,
  date,
  onSelect,
  onDelete,
  actionLoading = false,
  selected = false,
}) {
  const hasDeleteAction = typeof onDelete === 'function';

  return (
    <tr
      className={`registry-row ${selected ? 'registry-row--selected' : ''}`}
      onClick={() => onSelect?.()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.();
        }
      }}
      tabIndex={0}
      aria-selected={selected}
    >
      <td className="registry-row__cell registry-row__cell--name">
        <div className="registry-row__identity">
          <div className="registry-row__avatar registry-row__avatar--active">
            {initials}
          </div>
          <span className="registry-row__name">{name}</span>
        </div>
      </td>
      <td className="registry-row__cell">{email}</td>
      <td className="registry-row__cell">{phone}</td>
      <td className="registry-row__cell">{date}</td>
      <td className="registry-row__cell registry-row__cell--actions">
        {hasDeleteAction ? (
          <div className="registry-row__actions">
            <button
              className="registry-row__menu material-symbols-outlined"
              type="button"
              aria-label={`Delete ${name}`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              disabled={actionLoading}
            >
              more_vert
            </button>
          </div>
        ) : null}
      </td>
    </tr>
  );
}

export default RegistryRow;
