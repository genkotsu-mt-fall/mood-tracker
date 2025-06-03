import { PrivacySetting } from '../type/privacy-setting.type';

export class PostEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,

    /**
     * 気分を表すキーワード（例: "happy", "sad" など）※未入力可
     */
    public readonly mood: string | null,

    /**
     * 気分の強さ（1〜10 などの数値スコア）※未入力可
     */
    public readonly intensity: number | null,

    /**
     * 投稿本文（ユーザーが入力したテキスト）
     */
    public readonly body: string,

    /**
     * 気分に対応する絵文字（例: 😊）※未入力可
     */
    public readonly emoji: string | null,

    /**
     * 使用された投稿テンプレートのID ※テンプレート未使用も可
     */
    public readonly templateId: string | null,

    /**
     * 公開設定情報（フォロワー限定・ブロックリストなど）を
     * JSON形式で保持 ※省略可
     */
    public readonly privacyJson: PrivacySetting | null,

    /**
     * 緊急性のある投稿（自傷の可能性など）かどうか
     */
    public readonly crisisFlag: boolean,

    /**
     * 投稿の作成日時
     */
    public readonly createdAt: Date,

    /**
     * 投稿更新日時
     */
    public readonly updatedAt: Date,
  ) {}
}
