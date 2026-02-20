export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  validCount: number;
  invalidCount: number;
}

// CDR Validation
export function validateCDR(data: any[]): ValidationResult {
  const errors: ValidationError[] = [];
  const requiredFields = [
  'phone_number',
  'call_type',
  'duration_seconds',
  'timestamp',
  'network_type',
  'call_direction'];

  const invalidRows = new Set<number>();

  data.forEach((row, index) => {
    const rowNum = index + 2;

    requiredFields.forEach((field) => {
      if (
      row[field] === undefined ||
      row[field] === null ||
      String(row[field]).trim() === '')
      {
        errors.push({
          row: rowNum,
          field,
          message: 'Missing required field',
          value: row[field]
        });
        invalidRows.add(rowNum);
      }
    });

    if (row.duration_seconds !== undefined && row.duration_seconds !== '') {
      const dur = Number(row.duration_seconds);
      if (isNaN(dur) || dur < 0) {
        errors.push({
          row: rowNum,
          field: 'duration_seconds',
          message: 'Must be a non-negative number',
          value: row.duration_seconds
        });
        invalidRows.add(rowNum);
      }
    }

    if (row.timestamp && isNaN(Date.parse(String(row.timestamp)))) {
      errors.push({
        row: rowNum,
        field: 'timestamp',
        message: 'Invalid date/time format',
        value: row.timestamp
      });
      invalidRows.add(rowNum);
    }

    if (
    row.call_type &&
    !['voice', 'sms', 'data'].includes(String(row.call_type).toLowerCase()))
    {
      errors.push({
        row: rowNum,
        field: 'call_type',
        message: 'Must be voice, sms, or data',
        value: row.call_type
      });
      invalidRows.add(rowNum);
    }

    if (
    row.network_type &&
    !['2g', '3g', '4g', '5g', 'lte'].includes(
      String(row.network_type).toLowerCase()
    ))
    {
      errors.push({
        row: rowNum,
        field: 'network_type',
        message: 'Must be 2G, 3G, 4G, 5G, or LTE',
        value: row.network_type
      });
      invalidRows.add(rowNum);
    }

    if (
    row.call_direction &&
    !['incoming', 'outgoing', 'missed'].includes(
      String(row.call_direction).toLowerCase()
    ))
    {
      errors.push({
        row: rowNum,
        field: 'call_direction',
        message: 'Must be incoming, outgoing, or missed',
        value: row.call_direction
      });
      invalidRows.add(rowNum);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validCount: data.length - invalidRows.size,
    invalidCount: invalidRows.size
  };
}

// Transaction Validation
export function validateTransactions(data: any[]): ValidationResult {
  const errors: ValidationError[] = [];
  const requiredFields = [
  'transaction_id',
  'amount',
  'transaction_date',
  'transaction_type',
  'merchant_category',
  'status'];

  const invalidRows = new Set<number>();

  data.forEach((row, index) => {
    const rowNum = index + 2;

    requiredFields.forEach((field) => {
      if (
      row[field] === undefined ||
      row[field] === null ||
      String(row[field]).trim() === '')
      {
        errors.push({
          row: rowNum,
          field,
          message: 'Missing required field',
          value: row[field]
        });
        invalidRows.add(rowNum);
      }
    });

    if (row.amount !== undefined && row.amount !== '') {
      const amt = Number(row.amount);
      if (isNaN(amt)) {
        errors.push({
          row: rowNum,
          field: 'amount',
          message: 'Must be a valid number',
          value: row.amount
        });
        invalidRows.add(rowNum);
      }
    }

    if (
    row.transaction_date &&
    isNaN(Date.parse(String(row.transaction_date))))
    {
      errors.push({
        row: rowNum,
        field: 'transaction_date',
        message: 'Invalid date format',
        value: row.transaction_date
      });
      invalidRows.add(rowNum);
    }

    const validTypes = ['credit', 'debit', 'transfer', 'payment', 'withdrawal'];
    if (
    row.transaction_type &&
    !validTypes.includes(String(row.transaction_type).toLowerCase()))
    {
      errors.push({
        row: rowNum,
        field: 'transaction_type',
        message: `Must be one of: ${validTypes.join(', ')}`,
        value: row.transaction_type
      });
      invalidRows.add(rowNum);
    }

    const validStatuses = ['completed', 'pending', 'failed', 'reversed'];
    if (
    row.status &&
    !validStatuses.includes(String(row.status).toLowerCase()))
    {
      errors.push({
        row: rowNum,
        field: 'status',
        message: `Must be one of: ${validStatuses.join(', ')}`,
        value: row.status
      });
      invalidRows.add(rowNum);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validCount: data.length - invalidRows.size,
    invalidCount: invalidRows.size
  };
}