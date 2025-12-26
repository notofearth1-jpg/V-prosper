import React from "react";
import ZoomMeetingJoin from "./ZoomMeetingJoin";
import { ZOOM_MEETING_ROLE } from "../../utils/AppEnumerations";

const ZoomTrainer = () => {
  return <ZoomMeetingJoin role={ZOOM_MEETING_ROLE.Trainer} />;
};

export default ZoomTrainer;
