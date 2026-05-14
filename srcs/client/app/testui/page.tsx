// app/test/page.tsx
'use client'; // 状態管理（useState等）やイベントリスナー（onClick等）を使用するため、クライアントコンポーネントとして宣言

import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/Avatar';
import { Badge } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/Card';
import { Input } from '@shared/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/Tabs';
import { Mail, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIconAction,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import {
  Dialog,
  DialogAction,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIconAction,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import {
  RadioCard,
  RadioCardDescription,
  RadioCardHeader,
  RadioCardTitle,
} from '@/components/ui/RadioCard';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Stepper } from '@/components/ui/Stepper';

export default function TestPage() {
  // Stepperコンポーネント用の状態管理
  const [quantity, setQuantity] = useState(1);

  return (
    <div className='p-10 space-y-10'>
      <h1 className='text-3xl font-bold border-b pb-4'>UI Component Gallery</h1>

      {/* =========================================
          1-1. Buttons (ボタンのバリエーション)
          ========================================= */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>1-1. Buttons</h2>
        <div className='flex flex-wrap gap-4 items-center'>
          {/* variantプロパティで用途に応じた色やスタイルを指定します */}
          <Button variant='default'>Default</Button>
          <Button variant='accent'>Accent</Button>
          <Button variant='destructive'>Destructive</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='link'>Link</Button>
        </div>
      </section>

      {/* =========================================
          1.5. Button Sizes (ボタンのサイズ展開)
          ========================================= */}
      <section className='space-y-6'>
        <h2 className='text-xl font-semibold'>
          1.5. Button Sizes (ボタンサイズ)
        </h2>

        <div className='space-y-3'>
          <h3 className='text-sm text-muted-foreground'>
            テキストボタン (Text Buttons)
          </h3>
          <div className='flex flex-wrap items-end gap-4'>
            {/* sizeプロパティでボタンの大きさを制御します */}
            <Button size='xs'>xs</Button>
            <Button size='sm'>Size sm</Button>
            <Button size='default'>Size default</Button>
            <Button size='lg'>Size lg</Button>
            <Button size='xl'>Size xl</Button>
          </div>
        </div>

        <div className='space-y-3'>
          <h3 className='text-sm text-muted-foreground'>
            アイコンボタン (Icon Buttons)
          </h3>
          <div className='flex flex-wrap items-end gap-4'>
            {/* アイコンのみを配置する場合は 'icon' 系サイズを使用します。
              自動的に正円（または正方形ベースの角丸）になります。
            */}
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

      {/* =========================================
          1-2. Badges (バッジ・タグ)
          ========================================= */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>1-2. Badges</h2>
        <div className='flex flex-wrap gap-4 items-center'>
          {/* テキストのみのシンプルなバッジ */}
          <Badge variant='secondary' size='sm'>
            ワイワイ
          </Badge>
          <Badge variant='accent' size='xs'>
            新
          </Badge>
          <Badge variant='destructive' size='default'>
            牛乳
          </Badge>
          {/* バッジの中にAvatar（画像）や他のBadgeを入れ子にして複雑なレイアウトも可能です */}
          <Badge variant='secondary' size='lg'>
            <Avatar size='sm'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            坂本
            <Badge variant='accent' size='xs'>
              新
            </Badge>
          </Badge>
        </div>
      </section>

      {/* =========================================
          2. Inputs & Forms (入力フォーム)
          ========================================= */}
      <section className='space-y-4 max-w-sm'>
        <h2 className='text-xl font-semibold'>2. Inputs</h2>
        <div className='grid gap-4'>
          {/* LabelとInputを紐付ける基本パターン */}
          <div className='group grid w-full items-center gap-1.5'>
            {/* htmlFor と id を一致させることで、ラベルクリック時に入力欄にフォーカスが移動します */}
            <Label htmlFor='username'>User Name</Label>
            <Input type='text' id='username' placeholder='Input user name' />
          </div>
          {/* アイコン付きの入力欄のパターン */}
          <div>
            <Input
              type='email'
              placeholder='Email Address'
              icon={<Mail className='h-5 w-5' />} // 左側にメールアイコンを配置
            />
          </div>
        </div>
      </section>

      {/* =========================================
          3. Cards & Avatar (カードとアバター)
          ========================================= */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>3-1. Cards & Avatar</h2>

        {/* フル機能のカード (Avatar, タイトル, 説明, アクションボタン付き) */}
        <div className='flex gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center gap-4'>
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>チーム打ち上げ</CardTitle>
                <CardDescription>焼き鳥みやび</CardDescription>
              </div>
              {/* CardActionに入れると自動的に右端に配置されます */}
              <CardAction>
                <Button variant='ghost' size='icon'>
                  <MoreHorizontal className='h-5 w-5' />
                  <span className='sr-only'>더 보기</span>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>カードUIです</CardContent>
          </Card>
        </div>

        {/* サイズ違いのカード */}
        <div className='flex gap-6'>
          <Card size='sm'>
            <CardContent>カードUIです</CardContent>
          </Card>
        </div>
        <div className='flex gap-6'>
          <Card size='xs'>
            <CardContent>村田</CardContent>
          </Card>
        </div>
      </section>

      {/* カードのバリアント (スタイル) 違い */}
      <section className='space-y-4'>
        <div className='flex gap-6'>
          <Card variant='default' size='default'>
            <CardContent>村田</CardContent>
          </Card>
        </div>
        <div className='flex gap-6'>
          {/* shadow-none をつけると影が消えてフラットなデザインになります */}
          <Card variant='default shadow-none' size='default'>
            <CardContent>村田</CardContent>
          </Card>
        </div>
        <div className='flex gap-6'>
          <Card variant='destructive' size='default'>
            <CardContent>村田</CardContent>
          </Card>
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>3-2. Avatar</h2>
        {/* 画像あり（画像が読み込めない場合はFallbackが表示されます） */}
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {/* 画像なし（初期状態から文字・色を設定） */}
        <Avatar size='sm'>
          <AvatarFallback className='bg-primary text-primary-foreground'>
            姫
          </AvatarFallback>
        </Avatar>
        {/* 円形のアバター */}
        <Avatar size='lg' variant='rounded-full'>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </section>

      {/* =========================================
          4. Tabs (タブ切り替え)
          ========================================= */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>4. Tabs</h2>
        <Tabs
          defaultValue='account'
          className='flex flex-col w-[632px] h-[540px]'
        >
          {/* タブのメニュー部分 */}
          <TabsList className='w-full h-[48px] shrink-0'>
            <TabsTrigger value='account'>Account</TabsTrigger>
            <TabsTrigger value='password'>Password</TabsTrigger>
          </TabsList>

          {/* タブのコンテンツ部分 (gridで重ねて配置し、アニメーションで切り替えます) */}
          <div className='flex-1 grid grid-cols-1 grid-rows-1 mt-2'>
            <TabsContent
              value='account'
              className='col-start-1 row-start-1 p-4 border rounded-md bg-white'
            >
              Tab1です。
            </TabsContent>

            <TabsContent
              value='password'
              className='col-start-1 row-start-1 p-4 border rounded-md bg-white'
            >
              Tab2です。
            </TabsContent>
          </div>
        </Tabs>
      </section>

      {/* =========================================
          5. Dialog (汎用モーダルダイアログ)
          ========================================= */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>
          5. Dialog (モーダルダイアログ)
        </h2>
        {/* 基本的な短いコンテンツのダイアログ */}
        <Dialog>
          {/* asChild をつけることで、Buttonがトリガーとしてそのまま機能します */}
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

      {/* スクロール可能な長文コンテンツのダイアログ */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>
          5-2. Dialog (長文スクロール対応)
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='destructive'>利用規約を確認</Button>
          </DialogTrigger>
          {/* max-h-[80vh] で画面の80%の高さを上限に設定します */}
          <DialogContent showCloseButton={false} className='max-h-[80vh]'>
            <DialogHeader>
              <DialogTitle>本当に削除しますか？</DialogTitle>
              <DialogDescription>
                以下の利用規約と注意事項を最後まで読み、同意した上で削除を実行してください。
              </DialogDescription>
              {/* カスタムの右上のアイコンボタン */}
              <DialogIconAction>
                <MoreHorizontal className='h-5 w-5' />
              </DialogIconAction>
            </DialogHeader>

            {/* DialogBody を使うと、コンテンツが溢れた場合に内部だけがスクロール可能になります */}
            <DialogBody className='space-y-4'>
              <div className='rounded-lg bg-muted p-4 leading-relaxed'>
                <h3 className='font-bold mb-2 text-red-600'>
                  ⚠️ データ削除に関する重要事項
                </h3>
                {Array.from({ length: 15 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: UI 테스트용 정적 더미 데이터이므로 인덱스 사용 허용
                  <p key={i} className='mb-4 text-muted-foreground'>
                    {i + 1}.
                    この操作を実行すると、関連するすべてのメタデータ、ログファイル、およびバックアップデータがシステムから完全に削除されます。
                    一度削除されたデータは、いかなる技術的手段を用いても復元することはできません。
                    このプロセスには時間がかかる場合があり、途中で中断することは不可能です。
                  </p>
                ))}
                <p className='font-bold text-destructive'>
                  【スクロール終点】ここまで表示されればスクロール成功です。
                </p>
              </div>
            </DialogBody>

            {/* フッターはスクロールしても常に固定表示されます */}
            <DialogFooter showCloseButton={true}>
              <DialogAction variant='accent'>
                確認しました。削除する
              </DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* =========================================
          6. AlertDialog (警告・確認特化ダイアログ)
          ========================================= */}
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
              <AlertDialogIconAction>
                <MoreHorizontal className='h-5 w-5' />
              </AlertDialogIconAction>
            </AlertDialogHeader>
            <AlertDialogBody>
              <div className='rounded-lg bg-muted p-4 leading-relaxed'>
                <h3 className='font-bold mb-2 text-red-600'>
                  ⚠️ データ削除に関する重要事項
                </h3>
                {Array.from({ length: 15 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: UI 테스트용 정적 더미 데이터이므로 인덱스 사용 허용
                  <p key={i} className='mb-4 text-muted-foreground'>
                    {i + 1}.
                    この操作を実行すると、関連するすべてのメタデータ、ログファイル、およびバックアップデータがシステムから完全に削除されます。
                    一度削除されたデータは、いかなる技術的手段を用いても復元することはできません。
                  </p>
                ))}
                <p className='font-bold text-destructive'>
                  【スクロール終点】ここまで表示されればスクロール成功です。
                </p>
              </div>
              {/* ダイアログ内に他のコンポーネント（カードなど）を埋め込むことも可能です */}
              <Card
                className='!w-[334px] !h-[76px] mt-4'
                variant='secondary shadow-none'
              >
                <CardHeader>
                  <Avatar variant='rounded-full'>
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>チーム打ち上げ</CardTitle>
                    <CardDescription>焼き鳥みやび</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </AlertDialogBody>
            {/* AlertDialogFooter はキャンセルと実行のアクションを並べるのに最適化されています */}
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction variant='accent'>削除する</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* =========================================
          9. Radio Select (カード型のラジオボタン選択)
          ========================================= */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>9. Radio Select (カード選択)</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='default'>お店を選択</Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false} className='max-h-[80vh]'>
            <DialogHeader>
              <DialogTitle>お店の選択</DialogTitle>
              <DialogDescription>
                打ち上げの会場となるお店を選んでください。
              </DialogDescription>
            </DialogHeader>

            <DialogBody className='space-y-4'>
              <div className='rounded-2xl bg-muted p-4 leading-relaxed'>
                <form>
                  <div className='mb-4 text-sm font-medium text-muted-foreground'>
                    お店を選ぶ (任意)
                  </div>
                  {/* RadioGroupで全体を囲み、RadioCardで個別の選択肢を作ります */}
                  <RadioGroup defaultValue='shop-1'>
                    <RadioCard value='shop-1'>
                      <RadioCardHeader>
                        <RadioCardTitle>居酒屋たぬき</RadioCardTitle>
                        <RadioCardDescription>
                          渋谷・和食・¥¥
                        </RadioCardDescription>
                      </RadioCardHeader>
                    </RadioCard>

                    <RadioCard value='shop-2'>
                      <RadioCardHeader>
                        <RadioCardTitle>焼き鳥みやび</RadioCardTitle>
                        <RadioCardDescription>
                          新宿・焼き鳥・¥¥
                        </RadioCardDescription>
                      </RadioCardHeader>
                    </RadioCard>

                    <RadioCard value='shop-3'>
                      <RadioCardHeader>
                        <RadioCardTitle>焼き鳥みやび (2号店)</RadioCardTitle>
                        <RadioCardDescription>
                          新宿・焼き鳥・¥¥
                        </RadioCardDescription>
                      </RadioCardHeader>
                    </RadioCard>
                  </RadioGroup>
                </form>
              </div>
            </DialogBody>

            <DialogFooter showCloseButton={true}>
              <DialogAction variant='accent'>決定する</DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* =========================================
          10. Stepper (数量選択)
          ========================================= */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>10. Stepper (数量選択)</h2>
        <div className='flex flex-col gap-4 items-start'>
          {/* valueとonChangeを渡すことで、外部のstate（ここではquantity）と連動します。
            サイズ(size)を指定して見た目の大きさを変えられます。
          */}
          <Stepper
            size='sm'
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={10}
          />
          <Stepper
            size='default'
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={10}
          />
          <Stepper
            size='lg'
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={10}
          />
        </div>
      </section>
    </div>
  );
}
