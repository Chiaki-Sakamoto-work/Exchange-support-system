import type { departments } from '@prisma/client';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectInlineFooter,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/Select';

type DepartmentOption = Pick<departments, 'id' | 'name'>;

type ProfileDepartmentSectionProps = {
  departmentId: number | null | undefined;
  departmentOptions: DepartmentOption[];
  isAddingDepartment: boolean;
  isOpen: boolean;
  newDepartmentName: string;
  onAddDepartment: () => Promise<void>;
  onNewDepartmentNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
};

export const ProfileDepartmentSection = ({
  departmentId,
  departmentOptions,
  isAddingDepartment,
  isOpen,
  newDepartmentName,
  onAddDepartment,
  onNewDepartmentNameChange,
  onOpenChange,
  onValueChange,
}: ProfileDepartmentSectionProps) => {
  return (
    <Card className='min-h-0! shadow-none!'>
      <CardContent>
        <CardDescription className='flex items-center text-sm gap-2'>
          <Building2 className='w-4 h-4' /> 部署
        </CardDescription>
        <div className='w-full py-2'>
          <Select
            inline
            value={departmentId ? String(departmentId) : 'none'}
            inlineOpen={isOpen}
            onInlineOpenChange={onOpenChange}
            onValueChange={onValueChange}
          >
            <SelectTrigger className='w-full bg-muted text-foreground border'>
              {departmentId
                ? (departmentOptions.find((dept) => dept.id === departmentId)
                    ?.name ?? '部署を選択してください')
                : '所属なし'}
            </SelectTrigger>
            <SelectContent
              inlineMaxHeightClassName='max-h-40'
              className='text-muted-foreground'
            >
              <SelectItem value='none'>所属なし</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </SelectItem>
              ))}
              <SelectInlineFooter>
                <div className='flex items-center gap-2'>
                  <Input
                    value={newDepartmentName}
                    onChange={(event) =>
                      onNewDepartmentNameChange(event.target.value)
                    }
                    placeholder='新しい部署を追加'
                    className='h-9 flex-1'
                  />
                  <Button
                    type='button'
                    size='sm'
                    onClick={() => void onAddDepartment()}
                    disabled={!newDepartmentName.trim() || isAddingDepartment}
                    className='shrink-0'
                  >
                    追加
                  </Button>
                </div>
              </SelectInlineFooter>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
