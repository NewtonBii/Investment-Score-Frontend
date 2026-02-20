export interface ParseResult<T = Record<string, string>> {
  data: T[];
  errors: string[];
  headers: string[];
}

export async function parseCSV<T = Record<string, string>>(
file: File)
: Promise<ParseResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string || '';
        const lines = text.split(/\r\n|\r|\n/).filter((l) => l.trim() !== '');

        if (lines.length === 0) {
          resolve({ data: [], errors: ['File is empty'], headers: [] });
          return;
        }

        const headers = parseCSVLine(lines[0]);
        const data: T[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);

          if (values.length !== headers.length) {
            errors.push(
              `Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`
            );
            continue;
          }

          const obj: Record<string, string> = {};
          headers.forEach((h, j) => {
            obj[h.trim()] = values[j]?.trim() ?? '';
          });
          data.push(obj as T);
        }

        resolve({ data, errors, headers });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}