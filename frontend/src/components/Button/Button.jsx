import styles from "./Button.module.css";

export default function Button({btnDescription, ...props}) {
  return (
    <button className={styles.button} {...props}>
      {btnDescription}
    </button>
  )
}
