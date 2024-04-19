import { type ClassValue, clsx } from "clsx"
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortContent(datesA: string, datesB: string) {
  const aDates = datesA.split(" - ") as string[];
  let aDate = aDates.length > 1 ? aDates[1] : aDates[0];
  const bDates = datesB.split(" - ") as string[];
  let bDate = bDates.length > 1 ? bDates[1] : bDates[0];

  if (aDate === "Present") {
    aDate = moment().format('MMMM YYYY');
  }

  if (bDate === "Present") {
    bDate = moment().format('MMMM YYYY');
  }

  const diff = moment(bDate, 'MMMM YYYY').diff(moment(aDate, 'MMM YYYY'));
  if (diff === 0) {
    if (aDates.length > 1 && bDates.length > 1) {
      return moment(bDates[0], 'MMMM YYYY').diff(moment(aDates[0], 'MMM YYYY'));
    }
    return moment(bDate, 'MMMM YYYY').diff(moment(aDates[0], 'MMM YYYY'));
  }

  return diff;
}