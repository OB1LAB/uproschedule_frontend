"use client";
import styles from "./SchedulePickers.module.scss";
import { SelectPicker } from "rsuite";
import useScheduleStore from "@/modules/Schedule/useScheduleStore";
import moment from "moment-timezone";
import { groups } from "@/consts";
const SchedulePickers = () => {
  const schedule = useScheduleStore((store) => store.schedule);
  const [selectedGroup, setSelectedGroup] = useScheduleStore((store) => [
    store.selectedGroup,
    store.setSelectedGroup,
  ]);
  const [selectedWeek, setSelectedWeek] = useScheduleStore((store) => [
    store.selectedWeek,
    store.setSelectedWeek,
  ]);
  return (
    <div className={styles.pickers}>
      <SelectPicker
        className={styles.picker}
        cleanable={false}
        searchable={false}
        data={groups.map((item) => {
          return {
            label: `${item}Б`,
            value: item,
          };
        })}
        value={selectedGroup}
        onChange={(value) => {
          if (!Object.keys(schedule[value]).includes(selectedWeek)) {
            setSelectedWeek(
              (moment().diff(moment("2024-09-02"), "weeks") + 1).toString(),
            );
          }
          setSelectedGroup(value);
        }}
      />
      <SelectPicker
        className={styles.picker}
        cleanable={false}
        searchable={false}
        data={Object.keys(schedule[selectedGroup]).map((item) => {
          const monday = moment("2024-09-02")
            .add(item - 1, "weeks")
            .startOf("isoWeek");
          return {
            label: `${item} (${monday.format("DD-MM-YYYY")})`,
            value: item,
          };
        })}
        value={selectedWeek}
        onChange={setSelectedWeek}
      />
    </div>
  );
};

export default SchedulePickers;
