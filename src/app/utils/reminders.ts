/**
 * Dependency-free calendar (.ics) export and browser notification helpers.
 * Used by the Appointment Copilot, Support Reminders and Profile screens so
 * the "calendar sync" / "notifications" features do something real offline,
 * without any backend.
 */

import { isNative } from "./platform";
import { saveTextFile } from "./saveFile";

const pad = (n: number) => String(n).padStart(2, "0");

function icsStampUTC(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function icsDateOnly(d: Date): string {
  // Use UTC getters: date-only inputs (yyyy-mm-dd) parse as UTC midnight, so
  // local getters would shift the day for negative-UTC-offset users.
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

function escapeICS(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export interface CalendarEvent {
  title: string;
  description?: string;
  start: Date;
  allDay?: boolean;
  durationMinutes?: number;
  /** e.g. "FREQ=WEEKLY" or "FREQ=DAILY" */
  rrule?: string;
}

export function buildICS(events: CalendarEvent[]): string {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DadGlass//Pregnancy App//EN",
    "CALSCALE:GREGORIAN",
  ];
  events.forEach((ev, i) => {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:dadglass-${now.getTime()}-${i}@dadglass.app`);
    lines.push(`DTSTAMP:${icsStampUTC(now)}`);
    if (ev.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${icsDateOnly(ev.start)}`);
    } else {
      lines.push(`DTSTART:${icsStampUTC(ev.start)}`);
      const end = new Date(ev.start.getTime() + (ev.durationMinutes ?? 30) * 60000);
      lines.push(`DTEND:${icsStampUTC(end)}`);
    }
    if (ev.rrule) lines.push(`RRULE:${ev.rrule}`);
    lines.push(`SUMMARY:${escapeICS(ev.title)}`);
    if (ev.description) lines.push(`DESCRIPTION:${escapeICS(ev.description)}`);
    lines.push("END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(filename: string, events: CalendarEvent[]) {
  const name = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  void saveTextFile(name, buildICS(events), "text/calendar;charset=utf-8");
}

/** Parse a free-text or ISO date; returns a valid Date or null. */
export function parseDateLoose(value: string): Date | null {
  if (!value || !value.trim()) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export type NotificationOutcome = "granted" | "denied" | "unsupported";

/**
 * Request permission and show a confirmation notification.
 *
 * Native (Capacitor) uses real OS local notifications — the web Notification API
 * does not exist inside WKWebView/Android WebView, so on native we must go
 * through the plugin or nothing happens at all.
 */
export async function enableNotifications(title: string, body: string): Promise<NotificationOutcome> {
  if (isNative()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display === "prompt" || perm.display === "prompt-with-rationale") {
        perm = await LocalNotifications.requestPermissions();
      }
      if (perm.display !== "granted") return "denied";
      /*
       * Deliver immediately — no `schedule` block.
       *
       * Scheduling even three seconds out routes the notification through
       * AlarmManager, and from Android 12 that needs SCHEDULE_EXACT_ALARM,
       * which this app does not hold (it is a restricted permission meant for
       * alarm clocks and calendars, and asking for it would invite a Play
       * policy review we do not need). The call then failed, the catch below
       * swallowed it, and the button appeared to do nothing.
       *
       * Without a schedule the plugin posts straight to the notification
       * manager, which needs no alarm permission at all.
       */
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now() % 100000,
          title,
          body,
        }],
      });
      return "granted";
    } catch {
      return "unsupported";
    }
  }

  if (typeof Notification === "undefined") return "unsupported";
  let permission = Notification.permission;
  if (permission === "default") {
    try {
      permission = await Notification.requestPermission();
    } catch {
      return "denied";
    }
  }
  if (permission === "granted") {
    try {
      new Notification(title, { body });
    } catch {
      /* some browsers require a service worker registration to show; ignore */
    }
    return "granted";
  }
  return "denied";
}

/**
 * Schedule a real device notification for a supportive reminder (native only).
 * Returns the number scheduled; 0 on web, where we rely on the calendar export.
 */
export async function scheduleNativeReminders(
  items: Array<{ id: string; title: string; body: string }>,
  when: Date,
  repeat: "daily" | "weekly" | "none",
): Promise<number> {
  if (!isNative() || items.length === 0) return 0;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    let perm = await LocalNotifications.checkPermissions();
    if (perm.display === "prompt" || perm.display === "prompt-with-rationale") {
      perm = await LocalNotifications.requestPermissions();
    }
    if (perm.display !== "granted") return 0;

    await LocalNotifications.schedule({
      notifications: items.map((item, i) => ({
        // Stable-ish numeric id per reminder slot so re-scheduling replaces.
        id: 1000 + i,
        title: item.title,
        body: item.body,
        schedule: {
          at: when,
          ...(repeat === "daily" ? { every: "day" as const } : {}),
          ...(repeat === "weekly" ? { every: "week" as const } : {}),
        },
      })),
    });
    return items.length;
  } catch {
    return 0;
  }
}

/** Cancel every reminder this app scheduled (native only). */
export async function cancelNativeReminders(): Promise<void> {
  if (!isNative()) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch {
    /* nothing scheduled / plugin unavailable */
  }
}
