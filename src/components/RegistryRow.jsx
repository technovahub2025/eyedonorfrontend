import './RegistryRow.css';

function RegistryRow({
  initials,
  name,
  age,
  gender,
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
      <td className="registry-row__cell">{age}</td>
      <td className="registry-row__cell">{gender}</td>
    </tr>
  );
}

export default RegistryRow;
