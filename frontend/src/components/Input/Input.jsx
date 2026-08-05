import styles from "./input.module.css";

export default function input({ className = "", type, ...props }) {
  return (
   
      <input type={type} className={`${styles.input} ${className}`} {...props } />
 
  )
}
