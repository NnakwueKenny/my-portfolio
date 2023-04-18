/**
 * Return an integer of how many years experience you have,
 * compares the date you started your career to the current date
 */
import { differenceInYears } from "./differenceInYears";

const careerStartDate = "2019-01-06";

export const yearsInIndustry = differenceInYears(new Date(careerStartDate), new Date());