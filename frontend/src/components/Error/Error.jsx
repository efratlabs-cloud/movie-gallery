import style from './Error.module.css';

export default function Error({ message }) {
  return (
    <div className={style.error}>
      <p>{message}</p>
    </div>
  );
}