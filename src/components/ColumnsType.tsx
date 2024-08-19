export class DataField {
  field: string[];

  constructor(field: string[]) {
    this.field = field;
  }

  getValue(data: object | string): string {
    let dataTemp: any = data;

    for (let i = 0; i < this.field.length; i++) {
      dataTemp = dataTemp[this.field[i]]
    }
    if (dataTemp === 0) return '0';
    return (dataTemp as string) || 'No data';
  }

  getNameField(): string {
    return this.field[this.field.length - 1];
  }
}

export default interface ColumnsType<T> {
  title: string;
  dataIndex: DataField;
  width: number;
  sort?: boolean;
  filter?: { text: string; value: string }[];
  filterKey: string;
  render?: (record: T) => React.ReactElement | null;
  truncate?: number;
  align?: string;
}
