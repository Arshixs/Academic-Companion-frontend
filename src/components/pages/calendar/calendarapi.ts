import { AxiosResponse } from "axios";
import { api } from "./calendar.ts";

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export const calendarService = {
  getMonthEvents: async (
    year: number,
    month: number
  ): Promise<CalendarEvent[]> => {
    const response: AxiosResponse<CalendarEvent[]> = await api.get(
      `events/month_events/?year=${year}&month=${month}`
    );
    return response.data;
  },

  createEvent: async (
    event: Omit<CalendarEvent, "id" | "created_at" | "updated_at">
  ): Promise<CalendarEvent> => {
    const response: AxiosResponse<CalendarEvent> = await api.post(
      "events/",
      event
    );
    return response.data;
  },

  updateEvent: async (
    id: number,
    event: Partial<CalendarEvent>
  ): Promise<CalendarEvent> => {
    const response: AxiosResponse<CalendarEvent> = await api.patch(
      `events/${id}/`,
      event
    );
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`events/${id}/`);
  },
};
