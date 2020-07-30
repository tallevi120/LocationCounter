import { takeLatest, call, select, put } from "redux-saga/effects";
import { ATTACH_LOCATION } from "./constants";
import { loadSensorLocation, loadSensors } from "../Sensors/actions";

function* attachLocationSaga() {
  try {
    const {
      selectedLocation: { id },
    } = yield select((state) => state.locationList.toJS());
    const {
      selected: { sensor_id },
    } = yield select((state) => state.sensorsList.toJS());
    yield call(updateLocation, sensor_id, id);
    yield put(loadSensors());
    yield put(loadSensorLocation(id));
  } catch (errors) {
    //TODO
  }
}

function* locationAttachRootSaga() {
  yield takeLatest(ATTACH_LOCATION, attachLocationSaga);
}

export default [locationAttachRootSaga];

function updateLocation(sensor_id, location_id) {
  const data = [
    {
      sensor_id: sensor_id,
      location: location_id,
    },
  ];

  let requestOptions = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  };
  return fetch(`http://localhost:5000/sensor/UpdateLocation`, requestOptions);
}
