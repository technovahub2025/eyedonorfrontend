import logo from '../asset/logo.png';
import './BrandMark.css';

function BrandMark({ title = 'VisionGift', subtitle = '', className = '' }) {
  return (
    <div className={`brand-mark ${className}`.trim()}>
      <img className="brand-mark__logo" src={logo} alt="" aria-hidden="true" />
      <div className="brand-mark__text">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </div>
  );
}

export default BrandMark;
