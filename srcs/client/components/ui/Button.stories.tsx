import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button', // Storybookのサイドバーに表示される名前
  component: Button,
  tags: ['autodocs'], // 自動でドキュメント（Props一覧）を作成
  argTypes: {
    // 画面上で選択肢として表示するための設定
    variant: {
      control: 'select',
      options: ['default', 'accent', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'xl', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * 基本的なボタン
 */
export const Default: Story = {
  args: {
    children: 'デフォルトボタン',
    variant: 'default',
    size: 'default',
  },
};

/**
 * マイページなどで使うアクセントボタン
 */
export const Accent: Story = {
  args: {
    children: 'プロフィールを編集',
    variant: 'accent',
    size: 'lg',
  },
};

/**
 * アイコン専用ボタン（丸型）
 */
export const Icon: Story = {
  args: {
    children: '＋',
    variant: 'secondary',
    size: 'icon',
  },
};

/**
 * 破壊的なアクション（削除など）
 */
export const Destructive: Story = {
  args: {
    children: 'ログアウト',
    variant: 'destructive',
    size: 'default',
  },
};
