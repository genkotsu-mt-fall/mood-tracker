import { PrivacySetting } from '../type/privacy-setting.type';

export class PostEntity {
  readonly id: string;
  readonly userId: string;

  readonly author?: { id: string; name?: string };

  /**
   * 投稿本文（ユーザーが入力したテキスト）
   */
  readonly body: string;

  /**
   * 投稿の作成日時
   */
  readonly createdAt: Date;

  /**
   * 投稿更新日時
   */
  readonly updatedAt: Date;

  /**
   * 緊急性のある投稿（自傷の可能性など）かどうか
   */
  readonly crisisFlag: boolean;

  /**
   * 気分を表すキーワード（例: "happy"; "sad" など）※未入力可
   */
  readonly mood?: string;

  /**
   * 気分の強さ（1〜10 などの数値スコア）※未入力可
   */
  readonly intensity?: number;

  /**
   * 気分に対応する絵文字（例: 😊）※未入力可
   */
  readonly emoji?: string;

  /**
   * 使用された投稿テンプレートのID ※テンプレート未使用も可
   */
  readonly templateId?: string;

  /**
   * 公開設定情報（フォロワー限定・ブロックリストなど）を
   * JSON形式で保持 ※省略可
   */
  readonly privacyJson?: PrivacySetting;
  constructor(params: {
    id: string;
    userId: string;
    author?: { id: string; name?: string };
    body: string;
    createdAt: Date;
    updatedAt: Date;
    crisisFlag: boolean;
    mood?: string;
    intensity?: number;
    emoji?: string;
    templateId?: string;
    privacyJson?: PrivacySetting;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.author = params.author;
    this.body = params.body;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.crisisFlag = params.crisisFlag;
    this.mood = params.mood;
    this.intensity = params.intensity;
    this.emoji = params.emoji;
    this.templateId = params.templateId;
    this.privacyJson = params.privacyJson;
  }
}
