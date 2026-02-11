export type WakaTimeStatsRequestRange = 'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year' | 'all_time';

/**
 * Base statistics item with time breakdown
 */
type BaseStatItem = {
  /** Name of the item */
  name: string;
  /** Total coding activity as seconds */
  total_seconds: number;
  /** Percent of time spent on this item */
  percent: number;
  /** Total coding activity in digital clock format */
  digital: string;
  /** Total coding activity in human readable format */
  text: string;
  /** Hours portion of coding activity */
  hours: number;
  /** Minutes portion of coding activity */
  minutes: number;
};

/**
 * Extended statistics item with seconds precision
 */
type ExtendedStatItem = BaseStatItem & {
  /** Seconds portion of coding activity */
  seconds: number;
};

/**
 * Category statistics (e.g., Coding or Debugging)
 */
type CategoryStat = BaseStatItem & {
  /** Name of category, for example: Coding or Debugging */
  name: string;
};

/**
 * Project statistics
 */
type ProjectStat = BaseStatItem & {
  /** Project name */
  name: string;
};

/**
 * Language statistics
 */
type LanguageStat = ExtendedStatItem & {
  /** Language name */
  name: string;
};

/**
 * Editor statistics
 */
type EditorStat = ExtendedStatItem & {
  /** Editor name */
  name: string;
};

/**
 * Operating system statistics
 */
type OperatingSystemStat = ExtendedStatItem & {
  /** OS name */
  name: string;
};

/**
 * Dependency statistics
 */
type DependencyStat = ExtendedStatItem & {
  /** Dependency name */
  name: string;
};

/**
 * Machine statistics
 */
type MachineStat = ExtendedStatItem & {
  /** Machine hostname and IP address */
  name: string;
  /** Unique ID of this machine */
  machine_name_id: string;
};

/**
 * Best day statistics
 */
type BestDay = {
  /** Day with most coding time logged as Date string in YEAR-MONTH-DAY format */
  date: string;
  /** Total coding activity for this day in human readable format */
  text: string;
  /** Number of seconds of coding activity, including other language, for this day */
  total_seconds: number;
};

/**
 * Wakatime user statistics data
 */
type WakaTimeStatsData = {
  /** Total coding activity, excluding "Other" language, as seconds for the given range of time */
  total_seconds: number;
  /** Total coding activity as seconds for the given range of time */
  total_seconds_including_other_language: number;
  /** Total coding activity, excluding "Other" language, as human readable string */
  human_readable_total: string;
  /** Total coding activity as human readable string */
  human_readable_total_including_other_language: string;
  /** Average coding activity per day as seconds for the given range of time, excluding Other language */
  daily_average: number;
  /** Average coding activity per day as seconds for the given range of time */
  daily_average_including_other_language: number;
  /** Daily average as human readable string, excluding Other language */
  human_readable_daily_average: string;
  /** Daily average as human readable string */
  human_readable_daily_average_including_other_language: string;
  /** Number of lines added by GenAI */
  ai_additions: number;
  /** Number of lines removed by GenAI */
  ai_deletions: number;
  /** Number of lines added by old-school typing */
  human_additions: number;
  /** Number of lines removed by old-school typing */
  human_deletions: number;
  /** Category statistics */
  categories?: CategoryStat[];
  /** Project statistics */
  projects?: ProjectStat[];
  /** Language statistics */
  languages?: LanguageStat[];
  /** Editor statistics */
  editors?: EditorStat[];
  /** Operating system statistics */
  operating_systems?: OperatingSystemStat[];
  /** Dependency statistics */
  dependencies?: DependencyStat[];
  /** Machine statistics */
  machines?: MachineStat[];
  /** Best day statistics */
  best_day: BestDay;
  /** Time range of these stats */
  range: string;
  /** Time range as human readable string */
  human_readable_range: string;
  /** Number of days in this range with no coding time logged */
  holidays: number;
  /** Number of days in this range */
  days_including_holidays: number;
  /** Number of days in this range excluding days with no coding time logged */
  days_minus_holidays: number;
  /** Status of these stats in the cache */
  status: string;
  /** Percent these stats have finished updating in the background */
  percent_calculated: number;
  /** True if these stats are being updated in the background */
  is_already_updating: boolean;
  /** True if this user's coding activity is publicly visible */
  is_coding_activity_visible: boolean;
  /** True if this user's language stats are publicly visible */
  is_language_usage_visible: boolean;
  /** True if this user's editor stats are publicly visible */
  is_editor_usage_visible: boolean;
  /** True if this user's category stats are publicly visible */
  is_category_usage_visible: boolean;
  /** True if this user's operating system stats are publicly visible */
  is_os_usage_visible: boolean;
  /** True if these stats got stuck while processing and will be recalculated in the background */
  is_stuck: boolean;
  /** True if these stats include the current day; normally false except range "all_time" */
  is_including_today: boolean;
  /** True if these stats are up to date; when false, stats are missing or from an old time range and will be refreshed soon */
  is_up_to_date: boolean;
  /** Start of this time range as ISO 8601 UTC datetime */
  start: string;
  /** End of this time range as ISO 8601 UTC datetime */
  end: string;
  /** Timezone used in Olson Country/Region format */
  timezone: string;
  /** Value of the user's keystroke timeout setting in minutes */
  timeout: number;
  /** Status of the user's writes_only setting */
  writes_only: boolean;
  /** Unique ID of this user */
  user_id: string;
  /** Public username for this user */
  username: string;
  /** Time when these stats were created in ISO 8601 format */
  created_at: string;
  /** Time when these stats were last updated in ISO 8601 format */
  modified_at: string;
};

/**
 * Wakatime user stats API response
 */
export type WakaTimeStatsResponse = {
  data: WakaTimeStatsData;
};
