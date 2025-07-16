import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon, Clock } from "lucide-react";
import { DeliveryTimelineEvent } from "../types";

interface TimelineAccordionProps {
  events: DeliveryTimelineEvent[];
}

export default function TimelineAccordion({ events }: TimelineAccordionProps) {
  if (!events?.length) {
    return (
      <div className="p-3 text-center text-sm text-gray-500">
        No timeline events yet
      </div>
    );
  }

  const current = events[events.length - 1];
  const history = events.slice(0, -1).reverse();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Disclosure>
        {({ open }) => (
          <div>
            <Disclosure.Button className="w-full flex items-center justify-between p-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-sm">
                  {current.status.replace(/_/g, " ")}
                </span>
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </Disclosure.Button>

            <Disclosure.Panel className="border-t border-gray-200 p-3 space-y-2">
              {history.map((ev) => (
                <div
                  key={ev.id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span className="capitalize">
                    {ev.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-gray-500">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
}
