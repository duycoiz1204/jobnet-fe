import { useTranslations } from 'next-intl';
import { TableCell, TableRow } from '../ui/table';

export default function EmptyTableRow(): React.ReactElement {
  const t = useTranslations();

  return (
    <TableRow>
      <TableCell className="pl-4 text-lg text-center" colSpan={5}>
        {t('emptyTableRow.text')}
      </TableCell>
    </TableRow>
  );
}
