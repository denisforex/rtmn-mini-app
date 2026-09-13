import { readStoredArray, writeStoredArray } from "./storage";

const key = "rtmn-analytics-events";
const limit = 100;

export function trackEvent(name, properties = {}) {
  const event = { name, properties, occurredAt: new Date().toISOString() };
  const events = [...readStoredArray(key), event].slice(-limit);
  writeStoredArray(key, events);
  return event;
}

export function readAnalyticsEvents() {
  return readStoredArray(key);
}
