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
