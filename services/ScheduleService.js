import $api from "@/services/http";

export default class ScheduleService {
  static get() {
    return $api.get("/schedule");
  }
}
