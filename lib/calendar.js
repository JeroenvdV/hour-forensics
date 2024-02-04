/**
 * Result:
 *
 * For every date, give the list of everhour entries to be added based on calendar data.
 * Also add the total duration
 *
 * Process:
 *
 * - Get all calendar entries for that day, and durations.
 * - Add fixed 'overhead' time (20 mins?) to each duration, to convert from 'planning' to expected 'spent' time.
 * - Lookup jira issue for each calendar entry.
 * ^^ this is all done in Google Sheets now
 *
 * Next steps:
 * - Check out whether the days match with the working days
 * - Manually add things to this list
 * - Process the assembled list through the Everhour API
 * - Check new state in Everhour
 */
