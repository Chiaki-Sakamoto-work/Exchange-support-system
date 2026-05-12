import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/Avatar';
import { Badge } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/Card';
import { Input } from '@shared/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/Tabs';
import { Bold, Italic, Plus, Underline } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { AspectRatio } from '@/components/ui/AspectRatio';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Toggle } from '@/components/ui/Toggle';

export default function TestPage() {
  return (
    <div className='p-10 space-y-10'>
      <h1 className='text-3xl font-bold border-b pb-4'>UI Component Gallery</h1>

      {/* 1-1. Buttons */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>1-1. Buttons</h2>
        <div className='flex flex-wrap gap-4 items-center'>
          <Button variant='default'>Default</Button>
          <Button variant='accent'>Accent</Button>
          <Button variant='destructive'>Destructive</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='link'>Link</Button>
        </div>
      </section>

      {/* 1.5. Button Sizes */}
      <section className='space-y-6'>
        <h2 className='text-xl font-semibold'>
          1.5. Button Sizes (ボタンサイズ)
        </h2>

        {/* 일반 텍스트 버튼 사이즈 */}
        <div className='space-y-3'>
          <h3 className='text-sm text-muted-foreground'>
            テキストボタン (Text Buttons)
          </h3>
          <div className='flex flex-wrap items-end gap-4'>
            <Button size='xs'>xs</Button>
            <Button size='sm'>Size sm</Button>
            <Button size='default'>Size default</Button>
            <Button size='lg'>Size lg</Button>
          </div>
        </div>

        {/* 아이콘 전용 버튼 사이즈 */}
        <div className='space-y-3'>
          <h3 className='text-sm text-muted-foreground'>
            アイコンボタン (Icon Buttons)
          </h3>
          <div className='flex flex-wrap items-end gap-4'>
            {/* 아이콘 버튼은 모양을 잘 보기 위해 보통 outline이나 ghost 변형과 자주 씁니다 */}
            <Button variant='default' size='icon-xs'>
              <Plus />
            </Button>
            <Button variant='secondary' size='icon-sm'>
              <Plus />
            </Button>
            <Button variant='accent' size='icon'>
              <Plus />
            </Button>
            <Button variant='destructive' size='icon-lg'>
              <Plus />
            </Button>
          </div>
        </div>
      </section>

      {/* 1-2. Badges */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>1-2. Badges</h2>
        <div className='flex flex-wrap gap-4 items-center'>
          <Badge>New</Badge>
          <Badge variant='secondary'>Update</Badge>
          <Badge variant='outline'>Draft</Badge>
        </div>
      </section>

      {/* 2. Inputs & Forms */}
      <section className='space-y-4 max-w-sm'>
        <h2 className='text-xl font-semibold'>2. Inputs</h2>
        <div className='grid gap-2'>
          <Input type='text' placeholder='Input user name' />
          <Input type='email' placeholder='email@example.com' />
        </div>
      </section>

      {/* 3. Cards & Avatar */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>3. Cards & Avatar</h2>
        <div className='flex gap-6'>
          <Card className='w-[350px]'>
            <CardHeader className='flex flex-row items-center gap-4'>
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Shadcn UI</CardTitle>
                <p className='text-sm text-muted-foreground'>@shadcn</p>
              </div>
            </CardHeader>
            <CardContent>カードUIです</CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Tabs */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>4. Tabs</h2>
        <Tabs defaultValue='account' className='w-[400px]'>
          <TabsList>
            <TabsTrigger value='account'>Account</TabsTrigger>
            <TabsTrigger value='password'>Password</TabsTrigger>
          </TabsList>
          <TabsContent value='account' className='p-4 border rounded-md'>
            Tab1です
          </TabsContent>
          <TabsContent value='password' className='p-4 border rounded-md'>
            Tab2です
          </TabsContent>
        </Tabs>
      </section>

      {/* 5. Dialog */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>
          5. Dialog (モーダルダイアログ)
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline'>ダイアログを開く</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>プロフィールの編集</DialogTitle>
              <DialogDescription>
                ここでプロフィールの詳細を変更できます。完了したら保存をクリックしてください。
              </DialogDescription>
            </DialogHeader>
            <div className='py-4 text-sm text-muted-foreground'>
              ここにフォームなどのコンテンツが入ります。
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* 6. AlertDialog */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>
          6. AlertDialog (警告ダイアログ)
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>データを削除</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。データはサーバーから完全に削除されます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction>削除する</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* 7. AspectRatio */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>
          7. AspectRatio (アスペクト比 16:9)
        </h2>
        <div className='w-[400px]'>
          <AspectRatio
            ratio={16 / 9}
            className='bg-muted rounded-md overflow-hidden'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
              alt='Sample landscape'
              className='object-cover w-full h-full'
            />
          </AspectRatio>
          <p className='text-sm text-muted-foreground mt-2'>
            画像が常に16:9の比率を維持します。
          </p>
        </div>
      </section>

      {/* 8. Toggle */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>8. Toggle (トグルボタン)</h2>
        <div className='flex gap-2'>
          {/* 기본 토글 */}
          <Toggle aria-label='Toggle bold'>
            <Bold className='h-4 w-4' />
          </Toggle>

          {/* 테두리가 있는 변형 */}
          <Toggle variant='outline' aria-label='Toggle italic'>
            <Italic className='h-4 w-4' />
          </Toggle>

          {/* 배경색이 들어가는 토글 */}
          <Toggle
            className='data-[state=on]:bg-blue-100'
            aria-label='Toggle underline'
          >
            <Underline className='h-4 w-4' />
          </Toggle>
        </div>
        <p className='text-sm text-muted-foreground'>
          クリックするとON/OFFの状態が切り替わります。
        </p>
      </section>
    </div>
  );
}
