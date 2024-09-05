import styles from "./page.module.scss";
import SchedulePickers from "@/modules/SchedulePickers/SchedulePickers";
import Schedule from "@/modules/Schedule/Schedule";

export default function Home() {
  return (
    <div className={styles.page}>
      <SchedulePickers />
      <Schedule />
    </div>
  );
}
