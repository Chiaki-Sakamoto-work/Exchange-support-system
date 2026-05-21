export async function register() {
    // サーバーサイドでのみ実行
    if (process.env.NEXT_RUNTIME == 'nodejs') {
        const { initAutoDeleteJob } = await import('@/lib/cron');
        initAutoDeleteJob();
        console.log('[Instrumentation] 終了した予定の自動削除ジョブが登録されました。');
    }
}