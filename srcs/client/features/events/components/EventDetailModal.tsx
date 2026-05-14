'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    getEventDetail,
    deleteEventAction,
    cancelParticipationAction,
    joinEventAction
 } from "../actions/eventActions";

type Props = {
    roomId: number;       // クリックされた予定のID
    mode: 'upcoming' | 'joined' | 'explore';
    onClose: () => void;  // モーダルを閉じるための親からのスイッチ
    onSuccess: () => void;
};

export const EventDetailModal = ({ roomId, mode, onClose, onSuccess }: Props) => {
    // 取得した詳細データを保存
    const router = useRouter(); // リフレッシュ用の道具を準備
    const [isProcessing, setIsProcessing] = useState(false); // 通信中かどうかを判定する箱
    const [eventData, setEventData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 画面（モーダル）が開いた瞬間に、Step1で作った裏側の関数を呼び出す
    useEffect(() => {
        async function loadDetail() {
            const result = await getEventDetail(roomId);
            if (result.success) {
                setEventData(result.room);
            } else {
                setError(result.error || 'エラーが発生しました');
            }
            setIsLoading(false);
        }
        loadDetail();
    }, [roomId]);

    // ボタンが押された時の共通処理
    const handleAction = async (actionType: 'delete' | 'cancel' | 'join') => {
        setIsProcessing(true);
        let result;

        if (actionType === 'delete') result = await deleteEventAction(roomId);
        if (actionType === 'cancel') result = await cancelParticipationAction(roomId);
        if (actionType === 'join') result = await joinEventAction(roomId);

        if (result?.success) {
            alert('処理が完了しました！');
            onSuccess();
            onClose();
        } else {
            alert(result?.error || 'エラーが発生しました');
        }

        setIsProcessing(false);
    };

    return (
        // ① 背景の黒い半透明シート（ここをクリックすると onClose が発動して閉じる）
        <div 
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
        >
        {/* ② メインの白いカード（ここをクリックしても閉じないようにする魔法！） */}
        <div 
            className="bg-white dark:bg-zinc-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
        >

            {/* 状態に応じた画面の出し分け */}
            {isLoading ? (
            <div className="py-20 text-center text-zinc-500">読み込み中...</div>
            ) : error ? (
            <div className="py-20 text-center text-red-500">{error}</div>
            ) : (
            // ③ 無事にデータが取れた場合の表示内容
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">{eventData.title}</h2>
                
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p>📍 場所: {eventData.location_name || '未定'}</p>
                <p>👥 人数: {eventData.user_rooms?.length || 0} / {eventData.capacity_limit}名</p>
                <p>🏷 タグ: {eventData.description || 'なし'}</p>
                </div>

                {/* 参加者一覧エリア */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <h3 className="font-bold mb-3">参加者</h3>
                <div className="space-y-2">
                    {eventData.user_rooms?.map((ur: any) => (
                    <div key={ur.user_id} className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        👤
                        </div>
                        <span>{ur.profiles?.username || '名無しさん'}</span>
                    </div>
                    ))}
                </div>
                </div>

                {/* ※ ここに後で「参加する」「削除する」などのボタンを追加します */}
                <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                
                {/* パターン1：開催予定（主催者）から開いた場合 */}
                {mode === 'upcoming' && (
                    <>
                    <button className="w-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black font-bold py-3 rounded-xl transition active:scale-95">
                        予定を編集する
                    </button>
                    <button
                      onClick={() => handleAction('delete')}
                      disabled={isProcessing}
                      className="w-full bg-red-100 dark:bg-red-950/30 text-red-600 font-bold py-3 rounded-xl transition active:scale-95 disabled:opacity-50"
                    >
                        この予定を削除する
                    </button>
                    </>
                )}

                {/* パターン2：参加予定から開いた場合 */}
                {mode === 'joined' && (
                    <button
                      onClick={() => handleAction('cancel')}
                      disabled={isProcessing}
                      className="w-full bg-red-100 dark:bg-red-950/30 text-red-600 font-bold py-3 rounded-xl transition active:scale-95 disabled:opacity-50"
                    >
                    参加をキャンセルする
                    </button>
                )}

                {/* パターン3：参加タブ（新しい予定を探す画面）から開いた場合 */}
                {mode === 'explore' && (
                    <button
                      onClick={() => handleAction('join')}
                      disabled={isProcessing}
                      className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition active:scale-95 disabled:opacity-50"
                    >
                    この予定に参加する
                    </button>
                )}

                </div>
            </div>
            )}
        </div>
        </div>
    );
};
