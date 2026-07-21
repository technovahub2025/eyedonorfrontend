import './RegistryRow.css';

function RegistryRow({
  initials,
  name,
  email,
  phone,
  date,
  status,
  statusTone,
  onAccept,
  onDecline,
  onDelete,
  actionLoading = false,
}) {
  return (
    <tr className="registry-row">
      <td className="registry-row__cell registry-row__cell--name">
        <div className="registry-row__identity">
          <div className={`registry-row__avatar registry-row__avatar--${statusTone}`}>
            {initials}
          </div>
          <span className="registry-row__name">{name}</span>
        </div>
      </td>
      <td className="registry-row__cell">{email}</td>
      <td className="registry-row__cell">{phone}</td>
      <td className="registry-row__cell">{date}</td>
      <td className="registry-row__cell">
        <span className={`registry-row__status registry-row__status--${statusTone}`}>
          <span className={`registry-row__dot registry-row__dot--${statusTone}`} aria-hidden="true" />
          {status}
        </span>
      </td>
      <td className="registry-row__cell registry-row__cell--actions">
        <div className="registry-row__actions">
          <button
            className="registry-row__action"
            type="button"
            onClick={onAccept}
            disabled={actionLoading}
          >
            Accept
          </button>
          <button
            className="registry-row__action"
            type="button"
            onClick={onDecline}
            disabled={actionLoading}
          >
            Decline
          </button>
          <button
            className="registry-row__menu material-symbols-outlined"
            type="button"
            aria-label={`Delete ${name}`}
            onClick={onDelete}
            disabled={actionLoading}
          >
            more_vert
          </button>
        </div>
      </td>
    </tr>
  );
}

export default RegistryRow;
