
export class DateHelper {


    /**
     * Checks if two dates are on the same calendar day.
     */
    static isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    /**
     * Formats a date to 'yyyy-MM-dd' (Standard Format).
     */
    static toStandardFormat(date: Date): string {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    /**
     * Formats a string date into "dd MMM yyyy" safely.
     */
    static prettyDateFromString(stringDate: string): string {
        const date = new Date(stringDate);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return this.prettyDate(date);
    };

    /**
     * Formats a date to "dd MMM yyyy" (e.g., "19 Jul 2026").
     */
    static prettyDate(date: Date): string {
        return new Intl.DateTimeFormat(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date).replace(/,/g, ''); // Removes default commas if necessary
    };

    /**
     * Formats a date to "dd MMM yyyy hh:mm AM/PM".
     */
    static prettyDateTime(date: Date): string {
        const datePart = this.prettyDate(date);
        const timePart = this.timeOnly(date);
        return `${datePart} ${timePart}`;
    };

    /**
     * Formats time only to "hh:mm AM/PM".
     */
    static timeOnly(date: Date): string {
        return new Intl.DateTimeFormat(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    /**
     * Calculates human-readable time elapsed since the given date.
     */
    static timeAgo(date: Date): string {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();

        const seconds = Math.floor(diffInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.round(days / 30);

        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes < 60) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else if (hours < 24) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (days < 31) {
            // Fixed the bug from your Dart snippet where it accidentally outputted the current numeric day instead of the delta
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (days < 365) {
            return months === 1 ? '1 month ago' : `${months} months ago`;
        } else {
            return this.prettyDate(date);
        }
    };

    /**
     * Calculates human-readable time remaining until the target date.
     */
    static timeUntil(date: Date): string {
        const now = new Date();
        const diffInMs = date.getTime() - now.getTime();

        const seconds = Math.floor(diffInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        if (seconds < 60) {
            return `${seconds} seconds`;
        } else if (minutes < 60) {
            // Fixed grammatical logic matching your Dart code
            return minutes > 1 ? `${minutes} minute` : `${minutes} minutes`;
        } else if (hours < 24) {
            return hours > 1 ? `${hours} hour` : `${hours} hours`;
        } else if (days < 30) {
            return days > 1 ? `${days} day` : `${days} days`;
        } else if (days < 365) {
            return months > 1 ? `${months} month` : `${months} months`;
        } else {
            return `on ${this.prettyDate(date)}`;
        }
    };

}
