import './ReviewRow.css';

function ReviewRow({ icon, label, value, onEdit }) {
  return (
    <div className="review-row">
      <div className="review-row__content">
        <div className="review-row__icon">
          <span className="material-symbols-outlined" aria-hidden="true">
            {icon}
          </span>
        </div>

        <div className="review-row__text">
          <p className="review-row__label">{label}</p>
          <p className="review-row__value">{value}</p>
        </div>
      </div>

      <button className="review-row__edit" type="button" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

export default ReviewRow;
