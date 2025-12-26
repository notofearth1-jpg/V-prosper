import React from "react";
import ZoomMeetingJoin from "./ZoomMeetingJoin";
import { ZOOM_MEETING_ROLE } from "../../utils/AppEnumerations";

const ZoomUser = () => {
  return <ZoomMeetingJoin role={ZOOM_MEETING_ROLE.User} />;
};

export default ZoomUser;
