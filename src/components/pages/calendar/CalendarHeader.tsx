import React from "react";
import { Button } from "../../ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const CalendarHeader = ({ currentDate, setCurrentDate, onAddEvent }) => {
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg sm:text-2xl font-semibold">
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button onClick={onAddEvent}>
        <Plus className="h-4 w-4 mr-2" />
        Add Event
      </Button>
    </div>
  );
};

export default CalendarHeader;
