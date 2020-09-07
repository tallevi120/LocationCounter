import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { MyDate } from './my-date';
import {
  qGetAllSsensors,
  qGetSensorById,
  qGetAllSensorsEvent,
  qGetAllSensorsEventById,
  qUpdateLocationByID,
  qGetAllSensorsEvent1,
} from './sensor-queries';

dotenv.config();

const user: String | undefined = process.env.DB_USER;
const password: String | undefined = process.env.DB_PASS;

const connectionString =
  'postgres://' + user + ':' + password + '@localhost:5432';
const databaseName = 'location_counter';

const pool = new Pool({
  connectionString: connectionString + '/' + databaseName,
});

export async function getAllSsensorsDb() {
  try {
    return (await pool.query(qGetAllSsensors)).rows;
  } catch (err) {
    throw err;
  }
}

export async function getSensorByIdDb(id: string) {
  try {
    return (await pool.query(qGetSensorById, [id])).rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllSensorsEventDb1() {
  try {
    return (
      await pool.query(qGetAllSensorsEvent1)
    ).rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllSensorsEventDb(date: MyDate, sensorId: number) {
  try {
    return (
      await pool.query(qGetAllSensorsEvent, [date.from, date.to, sensorId])
    ).rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getAllSensorsEventByIdDb(date: MyDate, sensorId: number) {
  try {
    return (
      await pool.query(qGetAllSensorsEventById, [date.from, date.to, sensorId])
    ).rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateLocationDb(locationId: number, sensorId: number) {
  try {
    await pool.query(qUpdateLocationByID, [locationId, sensorId]);
    return getSensorByIdDb(sensorId.toString());
  } catch (err) {
    console.log(err);
    throw err;
  }
}
