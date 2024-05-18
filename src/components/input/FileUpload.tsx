import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface FileUploadProps {
  subtitle?: string;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onModalClose: () => void;
}

export default function FileUpload({
  subtitle = 'JPG, GIF hoặc PNG. Kích thước tối đa 800K',
  onFileSelect,
  onFileUpload,
  onModalClose,
}: FileUploadProps): JSX.Element {
  const t = useTranslations();

  return (
    <div className="space-y-5">
      <Input
        type="file"
        className="outline-emerald-500"
        onChange={onFileSelect}
      />
      <div className="text-sm text-slate-500">{subtitle}</div>

      <div className="flex justify-end gap-4">
        <Button color="emerald" onClick={onFileUpload}>
          {t('fileUpload.button.upload')}
        </Button>
        <Button color="red" onClick={onModalClose}>
          {t('fileUpload.button.cancel')}
        </Button>
      </div>
    </div>
  );
}
