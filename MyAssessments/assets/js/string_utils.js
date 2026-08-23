        // -----------------------------------------------------------------
        // Normalize surname

        export function normalizeItalianSurname(input) 
        {
          if (!input) return "";

          const particles = [
            "di", "de", "del", "della", "dei", "degli",
            "da", "la", "lo", "li", "le"
          ];

          let cleaned = input
            .trim()
            .replace(/[^\p{L}\s'.-]/gu, "") // allow accents, apostrophes, dash
            .replace(/\s+/g, " ")
            .toLowerCase();

          let parts = cleaned.split(" ");

          return parts
            .map((part, index) => {
              // Handle apostrophes (d'amico → D'Amico)
              if (part.includes("'")) {
                return part
                  .split("'")
                  .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                  .join("'");
              }

              // Middle particles lowercase
              if (index > 0 && particles.includes(part)) {
                return part;
              }

              // Normal capitalization
              return part.charAt(0).toUpperCase() + part.slice(1);
            })
            .join(" ");
        }
          
        // -----------------------------------------------------------------
        // Normalize name

        export function normalizeItalianName(input) 
        {
          if (!input) return "";

          return input
            .trim()
            .replace(/[^\p{L}\s'-]/gu, "") // allow accented letters, apostrophe, hyphen
            .replace(/\s+/g, " ")
            .toLowerCase()
            .split(/[\s-]/) // split by space or hyphen
            .map(part => {
              if (part.includes("'")) {
                // Handle apostrophe names: d'angelo → D'Angelo
                return part
                  .split("'")
                  .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                  .join("'");
              }
              return part.charAt(0).toUpperCase() + part.slice(1);
            })
            .join(input.includes("-") ? "-" : " ");
        }

        // -----------------------------------------------------------------
        // Compute age
        
        export function calculateAge(dateString) {
          const today = new Date();
          const birth = new Date(dateString);

          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();

          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
          }

          return age;
        }

        // -----------------------------------------------------------------
        // nome abbreviato

        export function formatName(surname, name) {
                        if (!surname || !name) return 'Invalid input';
                        const cleanSurname = surname.trim();
                        const initial = name.trim().charAt(0).toUpperCase();
                        return `${cleanSurname} ${initial}.`;
                      };

      // -----------------------------------------------------------------
      // converte la data in formato italiano

      export function convertToItalianFormat(dateString) {
                      const [year, month, day] = dateString.split("-");
                      return `${day}/${month}/${year}`;
                  }

      // -----------------------------------------------------------------
      // converte data con tempo in data ISO

      export function extractDate(isoString) {
                      const [date] = isoString.split("T");
                      return date;
                  }

      // -----------------------------------------------------------------
      // calcola anni e mesi trascorsi in formato ISO

    export function calculateAgeWithMonths(birthDateString, isReverse = false) {
          // parsing formato ISO: YYYY-MM-DD o DD/MM/YYYY (o DD-MM-YYYY / YYYY/MM/DD se reverse)
          const parts = birthDateString.includes("-") ? birthDateString.split("-") : birthDateString.split("/");
          if (parts.length !== 3) return null;

          let year, month, day;
          if (isReverse) {
              // Assuming reverse order like DD-MM-YYYY or DD/MM/YYYY when parts[0] is day
              day = parseInt(parts[0], 10);
              month = parseInt(parts[1], 10) - 1;
              year = parseInt(parts[2], 10);
          } else {
              // Standard ISO order: YYYY-MM-DD
              year = parseInt(parts[0], 10);
              month = parseInt(parts[1], 10) - 1;
              day = parseInt(parts[2], 10);
          }

          const birthDate = new Date(year, month, day);
          const today = new Date();
          let ageYears = today.getFullYear() - birthDate.getFullYear();
          let ageMonths = today.getMonth() - birthDate.getMonth();
          let ageDays = today.getDate() - birthDate.getDate();

          // If current day is less than birth day, borrow days from the previous month
          if (ageDays < 0) {
              ageMonths--;
              // Get the number of days in the previous month relative to today
              const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
              ageDays += previousMonth.getDate();
          }

          // If current month is less than birth month, borrow months from the previous year
          if (ageMonths < 0) {
              ageYears--;
              ageMonths += 12;
          }

          return { years: ageYears, months: ageMonths, days: ageDays };
    }

    // Computes the absolute number of calendar days between two dates.
    export function getDaysBetween(date1, date2) {
        // 1. Normalize input to Local Time strings (replaces '-' with '/' for JS engine)
        const d1 = typeof date1 === 'string' ? new Date(date1.replace(/-/g, '/')) : new Date(date1);
        const d2 = typeof date2 === 'string' ? new Date(date2.replace(/-/g, '/')) : new Date(date2);
        // 2. Zero out hours, minutes, seconds, and ms
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        // 3. Calculate difference in milliseconds
        const diffInMs = Math.abs(d2 - d1);
        // 4. Convert to days (1000ms * 60s * 60m * 24h)
        const msInDay = 24 * 60 * 60 * 1000;
        return Math.floor(diffInMs / msInDay);
    }

    // Gets days since a starting date
    export function getDaysSince(startDate) {
        // Replacing '-' with '/' forces JS to parse this as Local Time instead of UTC
        const normalizedDate = typeof startDate === 'string' ? startDate.replace(/-/g, '/') : startDate;
        const start = new Date(normalizedDate);
        const today = new Date();
        // Zero out the hours, minutes, seconds so we only compare the calendar days
        start.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffInMs = today-start;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        // We use Math.round or Math.floor now that times are zeroed
        return Math.floor(diffInDays);
    }

      // Calculates the difference by subtracting the current date from your custom target date.
      // If the target date is in the future, it returns a positive number.
      // If the target date is in the past, it returns a negative number.

      export function getDaysFromCurrent(customDateString) {
            // 1. Create date objects for both the current time and target time
            const today = new Date();
            const targetDate = new Date(customDateString);
            // 2. Clear out hours, minutes, seconds, and ms to get an accurate daily count
            today.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);
            // 3. Calculate difference in milliseconds
            const diffInMs = targetDate.getTime() - today.getTime();
            // 4. Convert milliseconds into whole days (1 day = 24h * 60m * 60s * 1000ms)
            const msInDay = 24 * 60 * 60 * 1000;
            const diffInDays = Math.round(diffInMs / msInDay);
            return diffInDays;
        }

        export function sanitizeFilename(str) {
            return str
                // Normalize accented characters (e.g., "à" becomes "a" + "`")
                .normalize("NFD")
                // Remove the accent marks
                .replace(/[\u0300-\u036f]/g, "")
                // Replace spaces and special characters with hyphens
                .replace(/[^a-zA-Z0-9-_]/g, "-")
                // Remove multiple consecutive hyphens
                .replace(/-+/g, "-")
                // Remove leading/trailing hyphens
                .replace(/^-+|-+$/g, "");
        }
